---
title: CoopGame07-增强道具
subtitle:
date: 2022-10-18T14:47:00+08:00
lastmod: 2024-05-27T15:28:00+08:00
slug: coopgame07
draft: false
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

这是虚幻教程系列 - CoopGame的第7篇,增强道具.
内容
- 创建道具底座
- 创建道具基类
- 等等
<!--more-->

## 创建底座和道具基类
1. 导入`Powerups`文件夹
2. 创建继承`Actor`C++类`SPickUpActor`，相当于道具的底座
{{< details summary="在`SPickupActor.h`声明`球形组件`, `贴花组件`变量, 重载`重叠函数`，并在cpp中初始化组件，定义重叠函数，删除Tick相关函数" >}}
```cpp
//球形组件
UPROPERTY(VisibleAnywhere,Category="Components")
class USphereComponent *SphereComp;
//贴花组件
UPROPERTY(VisibleAnywhere,Category="Components")
class UDecalComponent *DecalComp;
//重载重叠函数
virtual void NotifyActorBeginOverlap(AActor* OtherActor) override;

//CPP的构造函数ASPickUpActor()中初始化
#include "Components/DecalComponent.h"  
#include "Components/SphereComponent.h"
SphereComp = CreateDefaultSubobject<USphereComponent>(TEXT("SphereComp"));
SphereComp->SetSphereRadius(75);
RootComponent = SphereComp;

DecalComp = CreateDefaultSubobject<UDecalComponent>(TEXT("DeaclComp"));
DecalComp->SetRelativeRotation(FRotator(90,0,0));
DecalComp->DecalSize=FVector(64,75,75);
DecalComp->SetupAttachment(RootComponent);

//重写函数
void ASPickUpActor::NotifyActorBeginOverlap(AActor* OtherActor)
{
	Super::NotifyActorBeginOverlap(OtherActor);
}
```
{{< /details >}}
3. 创建继承`Actor`C++类的`SPowerUpActor`，实际作用的道具。
 {{< details summary="在`SPowerUpActor.h`声明`道具作用间隔`, `道具作用次数`变量, 声明`道具激活`等函数" >}}
```cpp
//道具起作用的间隔，类似每隔多少秒加多少血
UPROPERTY(EditDefaultsOnly, Category="Powerups")
float PowerUpInterval;
//道具起作用的总次数
UPROPERTY(EditDefaultsOnly, Category="Powerups")
int32 TotalNrOfTicks;

FTimerHandle TimerHandle_PowerUpTicks;
//道具已经起作用的次数
int32 TickProcessed;
//道具起作用函数
UFUNCTION()
void OnTickPowerUp();
//激活道具
void ActivatePowerUp();

UFUNCTION(BlueprintImplementableEvent, Category="Powerups")
void OnActivated();

UFUNCTION(BlueprintImplementableEvent, Category="Powerups")
void OnPowerUpTicked();

UFUNCTION(BlueprintImplementableEvent, Category="Powerups")
void OnExpired();

```
{{< /details >}}
 {{< details summary="在`SPowerUpActor.cpp`中编写相关逻辑" >}}
```cpp
ASPowerUpActor::ASPowerUpActor()
{
	PrimaryActorTick.bCanEverTick = true;
	//道具作用间隔
	PowerUpInterval = 0.f;
	//作用总次数
	TotalNrOfTicks = 0;
}

void ASPowerUpActor::ActivatePowerUp()
{
    //激活道具
	OnActivated();
	//如果道具是有间隔的道具，则需要使用定时器，比如：10秒内加100滴血的道具
	if (PowerUpInterval > 0)
	{
		//设置定时器每PowerUpInterval时间间隔调用一次OnTickPowerUp()（时间句柄变量，调用对象，调用函数，调用间隔，是否循环，延迟）
		GetWorldTimerManager().SetTimer(TimerHandle_PowerUpTicks, this, &ASPowerUpActor::OnTickPowerUp, PowerUpInterval,true, 0.f);
	}
	else
	{
		//如果是不需要作用时间的道具则让道具直接起作用，比如加速道具只加一次速
		OnTickPowerUp();
	}
}

void ASPowerUpActor::OnTickPowerUp()
{
	//道具已经起作用的次数：每起作用一次就自增一次
	TickProcessed++;

	OnPowerUpTicked();
	//如果道具作用次数达到总次数，就使道具失效，同时清除定时器
	if (TickProcessed >= TotalNrOfTicks)
	{
		//使道具失效函数
		OnExpired();
		//清除定时器
		GetWorldTimerManager().ClearTimer(TimerHandle_PowerUpTicks);
	}
}
```
{{< /details >}}
4. 修改`SPickUpActor`类，给道具底座加上道具
 {{< details summary="在`SPickUpActor.h`声明变量`道具类`,`道具类实例`,`道具生成冷却时间`, `道具生成时间句柄`变量, 声明`生成道具`函数" >}}
```cpp
UPROPERTY(EditDefaultsOnly, Category="PickUpActor")
TSubclassOf<class ASPowerUpActor> PowerUpClass;//实际起作用的道具类

class ASPowerUpActor* PowerUpInstance;//实际起作用的道具实例

UPROPERTY(EditInstanceOnly, Category="PickUpActor")
float CooldownDuration;//道具生成冷却时间

FTimerHandle TimerHandle_RespawnTimer;//生成道具时间句柄

void ResPawn();//生成道具函数
```
{{< /details >}}
 {{< details summary="在`SPickUpActor.cpp`中生成道具" >}}
```cpp
#include "SPowerUpActor.h"
void ASPickUpActor::BeginPlay()
{
	Super::BeginPlay();
	ResPawn();//刚开始时生成道具
}


void ASPickUpActor::ResPawn()
{
	if (PowerUpClass == nullptr)//如果没有实际起作用的道具类则打印错误日志并返回
	{
		UE_LOG(LogTemp,Warning,TEXT("PowerUpClass is null in %s"),*GetName());
		return;
	}
	FActorSpawnParameters SpawnParameters;//生成Actor的生成参数
	SpawnParameters.SpawnCollisionHandlingOverride = ESpawnActorCollisionHandlingMethod::AlwaysSpawn;//设置参数设置Actor总是生成
	PowerUpInstance = GetWorld()->SpawnActor<ASPowerUpActor>(PowerUpClass,GetTransform(),SpawnParameters);//生成道具实例Actor<生成类型>(类，位置，生成参数)
}

void ASPickUpActor::NotifyActorBeginOverlap(AActor* OtherActor)
{
	Super::NotifyActorBeginOverlap(OtherActor);
	
	if (PowerUpInstance)//如果生成的道具实例存在，则让道具起作用，然后将道具实例置空，并设置定时器生成下一个道具
	{
		PowerUpInstance->ActivatePowerUp();
		PowerUpInstance = nullptr;
		GetWorldTimerManager().SetTimer(TimerHandle_RespawnTimer,this,&ASPickUpActor::ResPawn,CooldownDuration);//设置生成道具的定时器，每隔CooldownDuration时间调用一次ResPawn()生成道具的函数。
	}
}
```
{{< /details >}}
## 制作底座贴花材质
1. 创建`M_PowerupDecal`的蓝图如图
	![Untitled.webp](https://s3.zmingu.com/images/2025/04/267672789.webp)
## 制作加速道具
1. 创建继承`PowerUpActor`类的蓝图类`BP_PowerUpBase`放于新建的`Powerups`文件夹。
2. 手动添加`静态网格体组件`，并关闭静态网格体的碰撞预设，设置为`NoCollision`。
3. 创建继承`BP_PowerUpBase`蓝图类的`Powerup_SuperSpeed`蓝图类，用作加速道具
4. 指定`SpeedIcon`静态网格体，
5. 蓝图编写如图
	![Untitled 1.webp](https://s3.zmingu.com/images/2025/04/1662832376.webp)
6. 制作加速道具的材质`M_Powerup`和材质实例`MI_PowerupSpeed`,`M_Powerup`如图1，材质实例如图2
	![Untitled 2.webp](https://s3.zmingu.com/images/2025/04/3296673808.webp)
	![Untitled 3.webp](https://s3.zmingu.com/images/2025/04/4191769756.webp)
7. 制作光源函数材质`M_PowerupLightFunction`并使用，关闭影子
	![Untitled 4.webp](https://s3.zmingu.com/images/2025/04/1957124844.webp)
8. 为道具蓝图添加`点光源组件`，并设置光照函数为`M_PowerupLightFunction`，关闭阴影，设置光照颜色为蓝色，同时指定静态网格体和材质
	![Untitled 5.webp](https://s3.zmingu.com/images/2025/04/4072384041.webp)
	![Untitled 6.webp](https://s3.zmingu.com/images/2025/04/1744693946.webp)

## 制作加血道具
1. 给健康组件`SHealthComponent`添加回血函数`Heal()`
 {{< details summary="在`SHealthComponent.h`声明`回血函数`，并在cpp中编写逻辑" >}}
```cpp
UFUNCTION(BlueprintCallable,Category="HealthComponent")
void Heal(float HealAmount);

// 编写逻辑
void USHealthComponent::Heal(float HealAmount)
{
	//如果加血值为0，或者已经挂了，就返回
	if (HealAmount<=0 || Health<=0)
	{
		return;
	}
	//加血后的生命值限制在0到默认值100之间
	Health = FMath::Clamp(Health+HealAmount,0.0f,DefaultHealth);
	//打印生命值改变。
	UE_LOG(LogTemp,Log,TEXT("Health Changed: %s (+%s)"),FString::SanitizeFloat(Health));
	//广播伤害值为负数则为加血
	OnHealthChanged.Broadcast(this,Health,-HealAmount,nullptr,nullptr,nullptr);
}
```
{{< /details >}}
2. 创建继承`BP_PowerUpBase`蓝图类的`Powerup_HealthRegen`蓝图类
3. 手动添加并选择静态网格体`HealthIcon`，添加浮点型变量`HealAmount`，设置默认值为`20`。
4. 编写蓝图逻辑
	![Untitled 7.webp](https://s3.zmingu.com/images/2025/04/670202423.webp)
5. 给加血道具和加速道具设置好材质实例（材质中颜色转换为参数Color），也给加血道具加上灯光，设置好颜色。
6. 将道具蓝图类`Powerup_HealthRegen`和`Powerup_SuperSpeed`的静态网格体位置Z设置为`50`，并给它们都添加上`旋转移动组件`，实现自转效果。
## 给底座添加道具
 {{< details summary="在`SPickUpActor.h`声明`作用道具类`" >}}
```cpp
//实际起作用的道具类,可以在场景实例中设置需要生成的道具类，比如加血的或加速的
UPROPERTY(EditInstanceOnly,Category="PickUpActor")
TSubclassOf<class ASPowerUpActor> PowerUpClass;
```
{{< /details >}}

## 联机化
1. 给底座类添加联机逻辑
 {{< details summary="在`SPickUpActor.cpp`中修改逻辑" >}}
```cpp
ASPickUpActor::ASPickUpActor()
{
//...
	SetReplicates(true);
}

void ASPickUpActor::BeginPlay()
{
	Super::BeginPlay();
	//只在服务端生成道具
	if (GetLocalRole() == ROLE_Authority)
	{
		//刚开始时生成道具
		ResPawn();
	}
}

void ASPickUpActor::NotifyActorBeginOverlap(AActor* OtherActor)
{
	Super::NotifyActorBeginOverlap(OtherActor);
	//如果生成的道具实例存在，则让道具起作用，然后将道具实例置空，并设置定时器生成下一个道具
	//同时需要判断碰到的是不是角色，并且只在服务端激活道具
	ASCharacter* Character = Cast<ASCharacter>(OtherActor);
	if (Character && PowerUpInstance && GetLocalRole()==ROLE_Authority)
	{
		PowerUpInstance->ActivatePowerUp();
		PowerUpInstance = nullptr;
		//设置生成道具的定时器，每隔CooldownDuration时间调用一次ResPawn()生成道具的函数。
		GetWorldTimerManager().SetTimer(TimerHandle_RespawnTimer, this, &ASPickUpActor::ResPawn, CooldownDuration);
	}
}
```
{{< /details >}}
2. 给道具类设置复制
 {{< details summary="在`SPowerUpActor.h`中声明一个是否激活的布尔值，`并设置该布尔值改变的时候调用复制函数OnRep_PowerActive`" >}}
```cpp
//同步激活状态
UPROPERTY(ReplicatedUsing=OnRep_PowerActive)
bool bIsPowerActive;

UFUNCTION()
void OnRep_PowerActive();

//蓝图可实现事件，去蓝图实现
UFUNCTION(BlueprintImplementableEvent, Category = "Powerups")
void OnPowerUpStateChanged(bool bNewIsActive);

virtual void GetLifetimeReplicatedProps(TArray<class FLifetimeProperty>& OutLifetimeProps) const override;

```
{{< /details >}}
 {{< details summary="在`SPowerUpActor.cpp`实现相关逻辑" >}}
```cpp
ASPowerUpActor::ASPowerUpActor()
{
//...
//设置网络复制
SetReplicates(true);//设置网络复制  
bIsPowerActive = false;//设置道具初始状态为未激活
}

void ASPowerUpActor::OnTickPowerUp()
{
//...
	if (TickProcessed>=TotalNrOfTicks)//作用次数达到总次数
	{
    	//...
        //道具失效后设置激活状态为否，调用同步函数。
		bIsPowerActive = false;
		OnRep_PowerActive();
		GetWorldTimerManager().ClearTimer(TimerHandle_PowerUpTicks);//清除时间句柄
	}
}

void ASPowerUpActor::ActivatePowerUp()
{
    //激活道具
	OnActivated();
    //设置激活状态为否，调用同步函数。
	bIsPowerActive = true;
	OnRep_PowerActive();
//...
}

void ASPowerUpActor::OnRep_PowerActive()
{
	OnPowerUpStateChanged(bIsPowerActive);//该函数后面在蓝图实现
}

void ASPowerUpActor::GetLifetimeReplicatedProps(TArray<FLifetimeProperty>& OutLifetimeProps) const
{
	Super::GetLifetimeReplicatedProps(OutLifetimeProps);
	DOREPLIFETIME(ASPowerUpActor,bIsPowerActive);
}

```
{{< /details >}}

3. 修改道具蓝图基类`BP_PowerUpBase`,在这里实现道具模型的显示隐藏
	![Untitled 8.webp](https://s3.zmingu.com/images/2025/04/550199133.webp)

4. 修改道具蓝图类加血道具`Powerup_HealthRegen`，删除子类控制道具模型显示隐藏的逻辑`OnActived`事件，只保留道具具体逻辑
	![Untitled 9.webp](https://s3.zmingu.com/images/2025/04/191750907.webp)

5. 修改蓝图类`Powerup_HealthRegen`，将加血逻辑变成群体加血
	![Untitled 10.webp](https://s3.zmingu.com/images/2025/04/1115792544.webp)

6. 实现联机的单人加速(需要指定道具作用的对象，获取玩家Pawn只能获取到玩家0，思路是在玩家重叠道具的时候传那个`OtherActor`)
 {{< details summary="在`SPowerUpActor.h`修改道具激活的函数，添加一个参数用来传递激活的对象，同步修改cpp中的函数参数" >}}
```cpp
//激活道具
// void ActivatePowerUp();
//指定道具作用目标ActiveFor
void ActivatePowerUp(AActor* ActiveFor);

// UFUNCTION(BlueprintImplementableEvent,Category="Powerups")
// void OnActivated();

UFUNCTION(BlueprintImplementableEvent,Category="Powerups")
void OnActivated(AActor* ActiveFor);
```
{{< /details >}}
 {{< details summary="在`SPickUpActor.cpp`底座类修改，传递碰撞到道具的Actor类给道具类激活" >}}
```cpp
void ASPickUpActor::NotifyActorBeginOverlap(AActor* OtherActor)
{
	Super::NotifyActorBeginOverlap(OtherActor);
//...
	if (Character && PowerUpInstance && GetLocalRole()==ROLE_Authority)
	{
        ////这里传入碰到道具的玩家为激活对象
        PowerUpInstance->ActivatePowerUp(OtherActor);//道具起作用
//...
	}
}
```
{{< /details >}}
7. 最终修改蓝图类`PowerUp_SuperSpeed`实现功能
	![Untitled 11.webp](https://s3.zmingu.com/images/2025/04/2911732073.webp)