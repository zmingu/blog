---
title: CoopGame06-AI基础
subtitle:
date: 2022-10-10T14:46:00+08:00
lastmod: 2024-05-27T15:26:00+08:00
slug: coopgame06
draft: false
summary: "UE5 AI 基础：导航网格、追踪球 AI、自爆伤害、群体 Buff 和网络同步。"
keywords:
  - 虚幻引擎教程
  - UEC++教程
  - UE多人联机教程
weight: 0
tags:
  - 虚幻引擎
categories:
  - 虚幻引擎教程
toc: true
collections:
  - Unreal Engine Tutorial CoopGame
---

这是虚幻教程系列 - CoopGame的第6篇,AI基础.
内容
- AI导航
- 创建AI球
- 等等

<!--more-->

## AI导航
### 创建AI球
1. 资源准备:
	1. 导入最新工程的`TrackerBot`文件夹。工程地址：[GitHub - zmingu/CoopGame: 教学项目CoopGame](https://github.com/zmingu/CoopGame)
2. 创建C++类,继承`Pawn`类的AI角色球`STrackerBot`的，放在`AI`文件夹下。
 {{< details summary="在`STrackerBot.h`声明`静态网格体组件`, 并在`STrackerBot.cpp`的构造函数中初始化并设置为不影响导航" >}}
```cpp
UPROPERTY(VisibleAnywhere,BlueprintReadOnly,Category="Components")
class UStaticMeshComponent* StaticMeshComp;

//构造函数中初始化静态网格体，并设置自己不影响导航
StaticMeshComp = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("StaticMeshComp"));
RootComponent = StaticMeshComp;
StaticMeshComp->SetCanEverAffectNavigation(false);//组件自身不影响导航网格

```
{{< /details >}}
3. 在`Blueprints`文件夹下创建继承`STrackerBot`C++类的`BP_TrackerBot`蓝图类。
	1. 给蓝图类设置静态网格体：复制默认的`球体网格体Sphere`到新建文件夹`TrackerBot`中，重命名为`SM_TrackerBot`，打开静态网格体设置其`编译设置`，构建比例为`0.2`。给蓝图设置上该静态网格体 

		![image.png](https://s3.zmingu.com/images/2025/09/18/20250918201231563.webp)
		![image.png](https://s3.zmingu.com/images/2025/09/18/20250918201502750.webp)
	2. 创建材质`M_TrackerBot`,先给个白色基础颜色，并设置网格体`SM_TrackerBot`的材质为这个。
		![image.png](https://s3.zmingu.com/images/2025/09/18/20250918201856812.webp)

	3. 放大场地，摆放一些简单的阻挡物，做一个简单的场景，拖入`BP_TrackerBot`.
	4. 在放置Actor窗口，选择体积，选择`导航网格体边界体积`拖入场景内，并调节大小覆盖场景，按`p`可显示导航面积。
		![image.png](https://s3.zmingu.com/images/2025/09/18/20250918203440481.webp)

	5. `Build.cs`文件中添加导航系统`NavigationSystem`
		```cpp
		PublicDependencyModuleNames.AddRange(new string[] { "Core", "CoreUObject", "Engine", "InputCore","PhysicsCore","NavigationSystem" });
		```

### AI球找路径点
 {{< details summary="在`STrackerBot.h`声明`寻点函数`, 并在`STrackerBot.cpp`中利用`FindPathToActorSynchronously`函数实现功能" >}}
```cpp
//声明寻路径点函数
FVector GetNextPathPoint();


//实现寻路径点函数
#include "NavigationPath.h"  
#include "NavigationSystem.h"  
#include "Kismet/GameplayStatics.h"
FVector ASTrackerBot::GetNextPathPoint()
{
	//拿到0号玩家对象
	APawn* PlayerPawn = UGameplayStatics::GetPlayerPawn(this, 0);
	//立即找到下一个路径（上下文，路径开始点，目标Actor）
	UNavigationPath* NavPath = UNavigationSystemV1::FindPathToActorSynchronously(this,GetActorLocation(),PlayerPawn);
	//如果路径点数量大于1返回下一个位置点
	if (NavPath->PathPoints.Num()>1)
	{
		return NavPath->PathPoints[1];
	}
	//否则返回初始位置
	return GetActorLocation();
}
```
{{< /details >}}
### 朝路径点推动AI球
 {{< details summary="在`STrackerBot.h`声明变量`力的大小`,`是否改变速度`，`到达判定距离`，`下一个点的向量` " >}}
```cpp
//添加力的大小
UPROPERTY(EditDefaultsOnly,Category="TrackerBot")
float MovementForce;
//是否使用改变速度
UPROPERTY(EditDefaultsOnly,Category="TrackerBot")
bool bUseVelocityChange;
//距离目标多少时判定为到达
UPROPERTY(EditDefaultsOnly,Category="TrackerBot")
float RequiredDistanceToTarget;
//下一个点的变量
UPROPERTY()
FVector NextPathPoint;
```
{{< /details >}}
{{< details summary="在`STrackerBot.cpp`中初始化上面的变量，在Tick函数中编写推动AI球的逻辑" >}}
```cpp
#include "Kismet/GameplayStatics.h"

ASTrackerBot::ASTrackerBot()
{
//...
	//设置AI球网格体启用物理模拟
	StaticMeshComp->SetSimulatePhysics(true);
	//启用力改变速度
	bUseVelocityChange = true;
	//作用力大小
	MovementForce = 200;
	//判定到达目标的距离
	RequiredDistanceToTarget = 100;
//...
}

void ASTrackerBot::BeginPlay()
{
	Super::BeginPlay();
	//获取到下一个导航点并赋值
	NextPathPoint = GetNextPathPoint();
}

void ASTrackerBot::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);

	//获得两点向量差的大小，既是距离下一个点的距离
	float DistanceToTarget = (GetActorLocation() - NextPathPoint).Size();

	//距离下一个点的距离小于阈值100则继续获取下一个点，如果还没到则推进。
	if (DistanceToTarget <= RequiredDistanceToTarget)
	{
		NextPathPoint = GetNextPathPoint();
		DrawDebugSphere(GetWorld(), NextPathPoint, 20, 12, FColor::Yellow, 0.0f, 0, 1.0f);
	}
	else
	{
		//获得从AI球指向下一个点的向量。
		FVector ForceDirection = NextPathPoint - GetActorLocation();
		//获取方向，不受大小的影响。
		ForceDirection.Normalize();
		//方向向量 * 力 = 有方向的力，用来推动小球。
		ForceDirection *= MovementForce;
		//添加推力使小球朝目标滚动。同时改变小球的速度。
		StaticMeshComp->AddForce(ForceDirection, NAME_None, bUseVelocityChange);
        //画出AI球的运动方向
		DrawDebugDirectionalArrow(GetWorld(), GetActorLocation(), GetActorLocation() + ForceDirection, 32, FColor::Red,
								  false, 0.0f,
								  0, 1.0f);
	}
    ////画出下一个目标点位置
    DrawDebugSphere(GetWorld(), NextPathPoint, 20, 12, FColor::Yellow, false, 0.0f, 1.0f);
}

```
{{< /details >}}

## AI球自爆造成伤害
### 添加造成伤害支持
1. 先确保角色的碰撞为Pawn，忽略Visiblity和Weapon，AI球的碰撞为Pawn重叠。 
 {{< details summary="在`STrackerBot.h`中声明生命组件（看来生命组件是通用的），受伤回调函数" >}}
```cpp
UPROPERTY(VisibleAnywhere,BlueprintReadOnly,Category="Conmponents")
class USHealthComponent* HealthComp;

//受伤回调函数
UFUNCTION()
void HandleTakeDamage(class USHealthComponent* OwningHealthComp,float Health,float HealthDelta,const class UDamageType* DamageType, class AController*InstigatedBy, AActor* DamageCauser);
```
{{< /details >}}
{{< details summary="在`STrackerBot.cpp`中初始化生命组件，绑定受伤回调函数，" >}}
```cpp
#include "Component/SHealthComponent.h"
ASTrackerBot::ASTrackerBot()
{
//...
	HealthComp = CreateDefaultSubobject<USHealthComponent>(TEXT("HealthComp"));
	HealthComp->OnHealthChanged.AddDynamic(this,&ASTrackerBot::HandleTakeDamage);
//...
}

void ASTrackerBot::HandleTakeDamage(USHealthComponent* OwningHealthComp, float Health, float HealthDelta,
	const UDamageType* DamageType, AController* InstigatedBy, AActor* DamageCauser)
{
	UE_LOG(LogTemp,Log,TEXT("Health %s of %s"),*FString::SanitizeFloat(Health),*GetName);
}
```
{{< /details >}}

### 受伤闪烁，死亡爆炸
1. 修改`M_TrackerBot`材质，配合动态修改材质参数实现受伤闪烁
![Untitled.webp](https://s3.zmingu.com/images/2025/04/4200054173.webp)
 {{< details summary="在`STrackerBot.h`中声明`材质实例`,并在`STrackerBot.cpp`的`HandleTakeDamage()`函数中通过修改材质中的参数来达到受伤闪烁的效果" >}}
```cpp
//声明材质实例  
UMaterialInstanceDynamic* MatInstance;

// 闪烁逻辑
void ASTrackerBot::HandleTakeDamage(USHealthComponent* OwningHealthComp, float Health, float HealthDelta,
	const UDamageType* DamageType, AController* InstigatedBy, AActor* DamageCauser)
{
	if (MatInstance ==nullptr)
	{
                //拿到材质实例
		MatInstance = StaticMeshComp->CreateAndSetMaterialInstanceDynamicFromMaterial(0,StaticMeshComp->GetMaterial(0));
	}
	if (MatInstance)
	{
                //受伤时，通过改变材质中的参数，这时这个参数几乎等于输入Timer，所以会亮一下。
		MatInstance->SetScalarParameterValue("LastTimeDamageTaken",GetWorld()->TimeSeconds);
	}

	UE_LOG(LogTemp,Log,TEXT("Health %s of %s"),*FString::SanitizeFloat(Health),*GetName());
}



```
{{< /details >}}

2. 添加自毁函数，添加爆炸特效等，记得给`BP_TrackerBot`蓝图类的类默认值指定爆炸特效。
{{< details summary="在`STrackerBot.h`中声明变量`是否爆炸`，`爆炸范围`，`爆炸伤害`，`爆炸特效`，`自毁函数`" >}}
```cpp
void SelfDestruct();//自毁函数，需要生成爆炸特效，造成范围伤害。

UPROPERTY(EditDefaultsOnly,Category="TrackerBot")
class UParticleSystem* ExplosionEffect;//爆炸特效

bool bExploded;//是否爆炸

UPROPERTY(EditDefaultsOnly,Category="TrackerBot")
float ExplosionRadius;//爆炸范围

UPROPERTY(EditDefaultsOnly,Category="TrackerBot")
float ExplosionDamage;//爆炸伤害
```
{{< /details >}}
 {{< details summary="在`STrackerBot.cpp`中初始化变量，添加自毁判断，添加自毁逻辑" >}}
```cpp
ASTrackerBot::ASTrackerBot()
{
//...
	ExplosionRadius = 200;
	ExplosionDamage = 100;
//...
}

void ASTrackerBot::HandleTakeDamage(USHealthComponent* OwningHealthComp, float Health, float HealthDelta,
	const UDamageType* DamageType, AController* InstigatedBy, AActor* DamageCauser)
{
//...
	if (Health <= 0)
	{
		SelfDestruct();
	}
//...
}

void ASTrackerBot::SelfDestruct()
{
	//如果爆炸过直接返回
	if (bExploded) return;
	//设置爆炸
	bExploded = true;
	//播放爆炸特效
	UGameplayStatics::SpawnEmitterAtLocation(GetWorld(), ExplosionEffect, GetActorLocation());
	//添加忽略的Actor，自身
	TArray<AActor*> IgnoredActors;
	IgnoredActors.Add(this);
	//造成范围伤害ApplyRadialDamage(上下文，原点的基础伤害，原点位置，伤害半径，伤害类型类，要忽略的Actor列表，造成伤害的人，负责造成伤害的控制器，伤害是否根据原点缩放)
	UGameplayStatics::ApplyRadialDamage(this, ExplosionDamage, GetActorLocation(), ExplosionRadius, nullptr,
	                                    IgnoredActors, this, GetInstigatorController(), true);
	DrawDebugSphere(GetWorld(), GetActorLocation(), ExplosionRadius, 12, FColor::Green, false, 2.0f, 0, 1.0f);
	//设置这个Actor的寿命。当寿命结束就会销毁。
	//SetLifeSpan(1.0f);
	
	//销毁Actor  
	Destroy();
}
```
{{< /details >}}

### 倒计时自爆，以及音效
 {{< details summary="在`STrackerBot.h`声明`是否开始自残`，`自残时间句柄`,`自残函数`, `球形组件`用于检测重叠，以及重叠事件。" >}}
```cpp
//是否开始伤害自己  
bool bStartSelfDestruction;  
//时间句柄  
FTimerHandle TimerHandle_SelfDamage;  
//伤害自己的函数  
void DamageSelf();  
//球形组件,用来判断和玩家重叠  
UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category="Components")  
class USphereComponent* SphereComp;  
//重叠事件  
virtual void NotifyActorBeginOverlap(AActor* OtherActor) override;
```
{{< /details >}}
 {{< details summary="在`STrackerBot.cpp`中初始化球体组件的碰撞，定义自残函数，重叠事件逻辑" >}}
```cpp
#include "Components/SphereComponent.h"
ASTrackerBot::ASTrackerBot()
{
//...
	SphereComp = CreateDefaultSubobject<USphereComponent>(TEXT("SphereComp"));
	//设置半径
	SphereComp->SetSphereRadius(200);
	//设置碰撞类型为只查询
	SphereComp->SetCollisionEnabled(ECollisionEnabled::QueryOnly);
	//设置所有碰撞通道为忽略
	SphereComp->SetCollisionResponseToChannels(ECR_Ignore);
	//只开启和Pawn类型的重叠
	SphereComp->SetCollisionResponseToChannel(ECC_Pawn,ECR_Overlap);
	SphereComp->SetupAttachment(StaticMeshComp);
}

void ASTrackerBot::DamageSelf()
{
    //对自己造成20点伤害,ApplyDamage(被伤害的Actor，基础伤害，造成伤害的控制器，造成伤害的Actor，描述造成伤害的类)
	UGameplayStatics::ApplyDamage(this,20,GetInstigatorController(),this,nullptr);
}

#include "SCharacter.h"
void ASTrackerBot::NotifyActorBeginOverlap(AActor* OtherActor)
{
	Super::NotifyActorBeginOverlap(OtherActor);
	if (!bStartSelfDestruction)
	{
		ASCharacter* MyCharacter = Cast<ASCharacter>(OtherActor);
		//如果碰到的是玩家，就用定时器每0.5秒伤害自己一次，一次20滴血
		if (MyCharacter)
		{
			//SetTimer(时间句柄，调用者，调用的方法，调用间隔，是否循环，离第一次调用的延迟)
			GetWorldTimerManager().SetTimer(TimerHandle_SelfDamage,this,&ASTrackerBot::DamageSelf,0.5f,true,0.0f);
			//设置为开始自爆
			bStartSelfDestruction = true;
		}
	}
}

```
{{< /details >}}

- AI球的音效。(滚动，警告，爆炸）,记得在蓝图类选择音效。
{{< details summary="在`STrackerBot.h`声明`倒计时自爆音效`，`爆炸音效`。并在`STrackerBot.cpp`中合适地方播放" >}}
```cpp
//倒计时自爆音效
UPROPERTY(EditDefaultsOnly,Category="TrackerBot")
class USoundBase *SelfDestructSound;
//爆炸音效
UPROPERTY(EditDefaultsOnly,Category="TrackerBot")
class USoundBase* ExplodeSound;


//STrackerBot.cpp
void ASTrackerBot::NotifyActorBeginOverlap(AActor* OtherActor)
{
	Super::NotifyActorBeginOverlap(OtherActor);
	if (!bStartSelfDestruction)
	{
	//...
		if (MyCharacter)
		{
		//...
	    //播放倒计时自毁音效  
		UGameplayStatics::SpawnSoundAtLocation(this, SelfDestructSound, GetActorLocation());
		}

	}
}

void ASTrackerBot::SelfDestruct()
{
//...
	//SetLifeSpan(0.1f);
	UGameplayStatics::SpawnSoundAtLocation(this,ExplodeSound,GetActorLocation());//播放爆炸音效
	Destroy();
}

```
{{< /details >}}
### 设置声音衰减
1. 两种设置方法
	1. 直接在声音Cue上设置，如图：
		![Untitled.webp](https://s3.zmingu.com/images/2025/04/243146778.webp)

	2. 创建声音衰减文件，如图：
		![Untitled 1.webp](https://s3.zmingu.com/images/2025/04/3818445189.webp)

### 滚动的声音随速度变化
1. 给蓝图类`BP_TrackerBot`添加音频组件`AudioComp`，为其设置滚动音效`ball_roll_03_loop_Cue`。
2. 在`Tick事件`中根据速度设置音量乘数
	![Untitled 2.webp](https://s3.zmingu.com/images/2025/04/1568030411.webp)
## AI球支持网络联机
### 仅服务端执行寻路逻辑
 {{< details summary="在`TrackerBot.cpp`中给寻路逻辑套上网络权限判断" >}}
```cpp
void ASTrackerBot::BeginPlay()
{
	Super::BeginPlay();
    //只在服务端执行寻路逻辑
	if (GetLocalRole() == ROLE_Authority)
	{
	    NextPathPoint = GetNextPathPoint(); //获取到下一个导航点
	}

}

void ASTrackerBot::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);
    //只在服务端执行寻路逻辑，且AI球没爆炸
	if (GetLocalRole() == ROLE_Authority && !bExploded )
	{
	    //...
	}
}
```
{{< /details >}}
### 修改生命值网络复制方式
1. 之前我们使用的是直接给变量添加`Replicated`宏，只是将该变量复制给客户端，如果需要更多自定义，需要使用`ReplicatedUsing`宏，这个宏我们之前也用过，每当该变量改变时，回去调用一个函数。
 {{< details summary="在`SHealthComponent.h`中生命值变量修改宏为`ReplicatedUsing`，并声明调用的函数`OnRep_Health`,并让该函数去广播改变后的生命值" >}}
```cpp
UPROPERTY(ReplicatedUsing=OnRep_Health,BlueprintReadOnly,Category="HealthComponent")
float Health;

UFUNCTION()
void OnRep_Health(float OldHealth);
thComponent.cpp
void USHealthComponent::OnRep_Health(float OldHealth)  
{  
    //执行多播，让绑定了这个事件的地方进行回调
    float Damage = Health - OldHealth;  
    OnCompHealthChanged.Broadcast(this,Health,Damage,nullptr,nullptr,nullptr);  
}
```
{{< /details >}}

### 仅服务端自爆和造成伤害
 {{< details summary="在`STrackerBot.cpp`中添加应用伤害和自爆定时器的网络权限判断" >}}
```cpp
void ASTrackerBot::SelfDestruct()
{
	//...
    //静态网格体设置可见性和关闭碰撞
	StaticMeshComp->SetVisibility(false, true);
	StaticMeshComp->SetCollisionEnabled(ECollisionEnabled::NoCollision);
	//AI球造成范围伤害也在服务端上做
	if (GetLocalRole() == ROLE_Authority)
	{
	//添加忽略的Actor，自身
		TArray<AActor*> IgnoredActors;
		IgnoredActors.Add(this);
		//造成范围伤害ApplyRadialDamage(上下文，原点的基础伤害，原点位置，伤害半径，伤害类型类，要忽略的Actor列表，造成伤害的人，负责造成伤害的控制器，伤害是否根据原点缩放)
		UGameplayStatics::ApplyRadialDamage(this, ExplosionDamage, GetActorLocation(), ExplosionRadius, nullptr,
		                                    IgnoredActors, this, GetInstigatorController(), true);
		DrawDebugSphere(GetWorld(), GetActorLocation(), ExplosionRadius, 11, FColor::Green, false, 2.0f, 0, 1.0f);
		//设置这个Actor的寿命。当寿命结束就会销毁。
		SetLifeSpan(1.0f);
	}
	//播放特效音效
}

void ASTrackerBot::NotifyActorBeginOverlap(AActor* OtherActor)
{
	Super::NotifyActorBeginOverlap(OtherActor);
	//如果没有开始倒计时自爆，且没有爆炸
	if (!bStartSelfDestruction && !bExploded)
	{
        //...
		//如果碰到的是玩家，就用定时器每0.5秒伤害自己一次，一次20滴血
		if (MyCharacter)
		{
            //设置自爆的定时器也要在服务器上
			if (GetLocalRole() == ROLE_Authority)
			{
				//SetTimer(时间句柄，调用者，调用的方法，调用间隔，是否循环，离第一次调用的延迟)
				GetWorldTimerManager().SetTimer(TimerHandle_SelfDamage, this, &ASTrackerBot::DamageSelf, 0.5f, true, 0.0f);
			}
            //...
		}
	}
}
```
{{< /details >}}

### 3.运行结果：两端的角色都能被AI球炸死，特效音效正常。
## 挑战：AI群体Buff
### 1.AI球附近有多个同类时，闪烁并增加伤害。
 {{< details summary="在`STrackerBot.h`声明`伤害等级`, `检测同类函数`" >}}
```cpp
//检测附近同类的函数
UFUNCTION()
void OnCheckNearbyBots();
//伤害等级
int32 PowerLevel;
```
{{< /details >}}
 {{< details summary="在`STrackerBot.cpp`中添加群体buff逻辑" >}}
```cpp
void ASTrackerBot::BeginPlay()
{
	Super::BeginPlay();
	//只有在服务端上的AI球才寻路
	if (GetLocalRole() == ROLE_Authority)
	{
		//获取到下一个导航点并赋值
		NextPathPoint = GetNextPathPoint();
		//设置每秒调用检测附近AI球同类的OnCheckNearbyBots函数
		FTimerHandle TimerHandle;
		GetWorldTimerManager().SetTimer(TimerHandle, this, &ASTrackerBot::OnCheckNearbyBots, 1.0f, true);
	}
}

void ASTrackerBot::SelfDestruct()
{
//...
	if (GetLocalRole() == ROLE_Authority)
	{
	//...
		//照成的伤害翻倍取决于附近的同类数量
		float Damage = ExplosionDamage + (ExplosionDamage * PowerLevel);
		//造成范围伤害ApplyRadialDamage(上下文，原点的基础伤害，原点位置，伤害半径，伤害类型类，要忽略的Actor列表，造成伤害的人，负责造成伤害的控制器，伤害是否根据原点缩放)
		UGameplayStatics::ApplyRadialDamage(this, Damage, GetActorLocation(), ExplosionRadius, nullptr,IgnoredActors, this, GetInstigatorController(), true);
		DrawDebugSphere(GetWorld(), GetActorLocation(), ExplosionRadius, 11, FColor::Green, false, 2.0f, 0, 1.0f);
    //...
	}
//...
}

FVector ASTrackerBot::GetNextPathPoint()
{
	//拿到0号玩家对象
	APawn* PlayerPawn = UGameplayStatics::GetPlayerPawn(this, 0);
	//拿到0号玩家才继续寻路
	if (PlayerPawn)
	{
		//立即找到下一个路径（上下文，路径开始点，目标Actor）
		UNavigationPath* NavPath = UNavigationSystemV1::FindPathToActorSynchronously(this, GetActorLocation(), PlayerPawn);
		//如果路径点数量大于1返回下一个位置点，且路径存在
		if (NavPath && NavPath->PathPoints.Num() > 1)
		{
			return NavPath->PathPoints[1];
		}
	}
//否则返回初始位置
		return GetActorLocation();
}

void ASTrackerBot::OnCheckNearbyBots()
{
	//声明碰撞球，用于检测球体内有多少AI同类。
	FCollisionShape CollisionShape;
	//设置碰撞球半径。
	CollisionShape.SetSphere(600);
	//重叠结果的数组，用来存放所有重叠到的东西
	TArray<FOverlapResult> OverlapResults;
	//碰撞对象查询参数
	FCollisionObjectQueryParams QueryParams;
	//添加需要查询的两种碰撞通道类型
	QueryParams.AddObjectTypesToQuery(ECC_PhysicsBody);
	QueryParams.AddObjectTypesToQuery(ECC_Pawn);
	//按对象类型的重叠检测，将检测到的东西放进OverlapResults数组中
	GetWorld()->OverlapMultiByObjectType(OverlapResults, GetActorLocation(), FQuat::Identity, QueryParams,
	                                     CollisionShape);
	//画出用于检测的碰撞球
	DrawDebugSphere(GetWorld(), GetActorLocation(), CollisionShape.GetSphereRadius(), 12, FColor::Blue, false, 1.0f);
	//声明其他同类AI球的数量
	int32 NrOfBots = 0;
	//遍历所有重叠检测到的东西，如果是同类就把同类数量+1
	for (FOverlapResult Result : OverlapResults)
	{
		ASTrackerBot* Bot = Cast<ASTrackerBot>(Result.GetActor());
		//重叠检测到的是AI球，且不是自己，就计数
		if (Bot && Bot != this)
		{
			NrOfBots++;
		}
	}
	//定义常量最大伤害等级
	const int32 MaxPowerLevel = 4;
	//限制伤害等级范围0-4
	PowerLevel = FMath::Clamp(NrOfBots, 0, MaxPowerLevel);
	if (MatInst == nullptr)
	{
		//拿到AI球的材质实例
		MatInst = StaticMeshComp->
			CreateAndSetMaterialInstanceDynamicFromMaterial(0, StaticMeshComp->GetMaterial(0));
	}
	if (MatInst)
	{
		//通过设置参数来改变材质闪烁，更详细的材质介绍请看视频
		float Alpha = PowerLevel / (float)MaxPowerLevel;
		MatInst->SetScalarParameterValue("PowerLevelAlpha", Alpha);
	}
	//打印伤害等级
	DrawDebugString(GetWorld(), FVector(), FString::FromInt(PowerLevel), this, FColor::White, 1.0f, true);
}

```
{{< /details >}}
### 材质修改，参数`PowerLevelAlpha`控制材质闪烁
蓝图如图：

![Untitled 3.webp](https://s3.zmingu.com/images/2025/04/447297055.webp)