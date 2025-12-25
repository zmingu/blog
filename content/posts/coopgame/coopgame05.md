---
title: CoopGame05 - 游戏网络
subtitle:
date: 2022-10-05T19:42:00+08:00
lastmod: 2024-05-26T15:24:00+08:00
slug: coopgame05
draft: false
summary: "UE5 多人联机：服务器武器生成、RPC 远程调用、属性复制和死亡同步。"
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

这是虚幻教程系列 - CoopGame的第5篇,网络游戏.
内容
- 变成网络游戏
- 从服务器发枪
- 使客户端的角色能开枪
- 从服务器开枪

<!--more-->

## 变成网络游戏

1. 创建继承`CoopGameGameModeBase`C++类的蓝图类`BP_GameMode`、
2. 在世界场景设置指定游戏模式重载为`BP_GameMode`，指定默认Pawn为自己的角色蓝图类`BP_SCharacter`。
3. 修改游戏的启动模式，网络模式：`以聆听服务器运行`，玩家数量：`2`
	![image.png](https://s3.zmingu.com/images/2025/09/17/20250917151106378.webp)

## 从服务器发枪
#### 仅服务器角色生成武器
1. 让服务器角色才能生成武器，判断运行该代码的角色是否为权威角色，运行结果为左边Server端的角色有武器，右边Chient端的角色无武器。
 {{< details summary="在`ASCharacter.cpp`中添加判断条件，如果是`本地角色的权限是服务器`，才生成武器" >}}
```c
//在BeginPlay()中添加武器生成的条件
if (GetLocalRole() == ROLE_Authority)//武器只在服务器生成  
{  
    FActorSpawnParameters SpawnParameters;//生成参数  
    SpawnParameters.SpawnCollisionHandlingOverride = ESpawnActorCollisionHandlingMethod::AlwaysSpawn;//总是生成  
    CurrentWeapon = GetWorld()->SpawnActor<ASWeapon>(StartWeaponClass, FVector::ZeroVector, FRotator::ZeroRotator,  
    SpawnParameters);//生成武器Actor并拿到实例  
    if (CurrentWeapon)  
    {  
       CurrentWeapon->SetOwner(this);//设置Actor拥有者为当前角色  
       CurrentWeapon->AttachToComponent(GetMesh(), FAttachmentTransformRules::SnapToTargetNotIncludingScale,  
       WeaponAttachSocketName);//将生成的Actor实例附到网格体组件的骨骼插槽名上  
    }  
}
```
{{< /details >}}
![image1.png](https://s3.zmingu.com/images/2025/09/17/20250917154618666.webp)

#### 复制武器给客户端角色
2. 使`Server`端角色的武器复制给`Client`端角色，运行结果为Server端和Chient端的角色都有武器。
{{< details summary="在`SWeapon.cpp`的构造函数中设置，该Actor可复制，并勾选`BP_SWeapon`类默认值中的复制" >}}
```c
//在ASWeapon()中添加武器可复制
SetReplicates(true);
```
{{< /details >}}
{{< details summary="注意`BP_SWeapon`蓝图类中的`复制属性`是否勾选上" >}}
![image.png](https://s3.zmingu.com/images/2025/09/17/20250917160130528.webp)
{{< /details >}}
![image.png](https://s3.zmingu.com/images/2025/09/17/20250917155811826.webp)

#### 使客户端的角色能开枪
1. 目前，只有服务器端控制的角色能开枪，客户端控制的角色不能开枪。
	- 客户端不能开枪的原因：鼠标左键按下调用`StartFire()`函数，松开调用`StopFire()`函数，但此时两个函数都必须满足`CurrentWeapon`这个变量存在，而这个变量是在上面限制武器只在`Server`端生成的地方赋值的，所以客户端中的角色`CurrentWeapon`变量为空，客户端无法调用武器的`Fire()`函数。
2. 现在要做的是使两端都能开枪。
{{< details summary="在`SCheracter.h`的`CurrentWeapon`变量添加宏参数`Replicated`用于复制，并声明待重写网络同步函数" >}}
```cpp
//当前武器类  
UPROPERTY(BlueprintReadOnly, Replicated, Category = "Player")  
class ASWeapon* CurrentWeapon;

//重写同步函数
virtual void GetLifetimeReplicatedProps( TArray< class FLifetimeProperty > & OutLifetimeProps ) const override;
```
{{< /details >}}
{{< details summary="在`SCheracter.cpp`中重写网络同步函数，添加需要同步的变量和同步条件" >}}
```cpp
#include "Net/UnrealNetwork.h"
void ASCharacter::GetLifetimeReplicatedProps(TArray<FLifetimeProperty>& OutLifetimeProps) const
{
	Super::GetLifetimeReplicatedProps(OutLifetimeProps);
	DOREPLIFETIME(ASCharacter,CurrentWeapon);//同步条件
}
```
{{< /details >}}

1. 运行结果为Server端和Chient端的角色都可以开枪，但是两边窗口都看不到对方开枪的特效。
## 从服务器开枪

### 客户端角色开枪后，让服务端角色也开枪
1. 让Clinet端的角色不仅在本地开枪，也让Server端上对应的那个角色开枪。
{{< details summary="在`SWeapon.h`中声明专门用于让服务端开火的函数`ServerFire()`,注意要使用的宏" >}}
```cpp
//服务器开火函数,三个宏分别表示这是一个服务器函数，可靠的RPC，有验证功能
UFUNCTION(Server,Reliable,WithValidation)  
void ServerFire();
```
{{< /details >}}
{{< details summary="在`SWeapon.cpp`中实现`ServerFire()`函数，添加触发逻辑" >}}
```cpp

void ASWeapon::ServerFire_Implementation()  
{  
    //服务器端调用开火函数  
    Fire();  
}  
  
bool ASWeapon::ServerFire_Validate()  
{  
    //这里可以添加一些验证代码，比如检查弹药数量等，这里直接验证通过  
    return true;  
}

// 在Fire()函数后面加上判断，如果是客户端角色开枪，则去让客户端对应的那个个存在于服务端的角色去开枪的函数
if (GetLocalRole()<ROLE_Authority)ServerFire();

```
{{< /details >}}

2. 原理：客户端角色调用`Fire()`函数的时候，会再去调用`ServerFire()`，这个函数会在服务端的角色上运行，让服务端对应的哪个角色也去调用`Fire()`函数。
3. 运行结果：客户端的角色开枪时在两端窗口都能看到，但是服务端角色开枪，客户端还看不到。

### 服务端角色开枪后，同步特效给客户端

1. 同步开枪特效的属性，让服务器下发，因为之前整理的特效代码和教程不一致，这里以我自己整理的为准。
 {{< details summary="在`SWeapon.h`声明一个用于同步的结构体`FHitScanTrace`，包含击中结果信息和弹道终点" >}}
```cpp
//创建一个包含击中信息的结构体，物理表面和弹道终点
USTRUCT()
struct FHitScanTrace
{
	GENERATED_BODY()
	
	UPROPERTY()
	FHitResult Hit;
	
	UPROPERTY()
	FVector_NetQuantize TraceTo;
}

//声明结构体变量和绑定调用时复制的方法，作用：当服务器中的结构体中的变量改变时，就让客户端中的角色调用OnRep_HitScanTrace()函数
UPROPERTY(ReplicatedUsing=OnRep_HitScanTrace)
FHitScanTrace HitScanTrace;

UFUNCTION()
void OnRep_HitScanTrace();

//重写同步函数
virtual void GetLifetimeReplicatedProps( TArray< class FLifetimeProperty > & OutLifetimeProps ) const override;

```
{{< /details >}}
 {{< details summary="在`SWeapon.cpp`中设置网络参数，在合适的地方赋值结构体变量，变量改变后需要调用的逻辑，以及同步函数中的同步条件处理" >}}
```cpp

//在构造函数ASWeapon()中添加
//网络参数，改善延迟
NetUpdateFrequency = 66;
MinNetUpdateFrequency = 33;


void ASWeapon::Fire()
{
    //...
	AActor* WeaponOwner = GetOwner();
	if (WeaponOwner)
	{
        //...
        //如果是服务端上的角色，就把弹道终点和打击信息赋值到结构体。
    	if (GetLocalRole() == ROLE_Authority)
    		{
    			HitScanTrace.TraceTo = TraceEnd;
    			HitScanTrace.Hit = Hit;
    		}
    }
}

void ASWeapon::OnRep_HitScanTrace()
{
	//当结构体的值改变时，播放特效复制到客户端中的角色
	PlayFireEffects(HitScanTrace.TraceTo);
	PlayImpactEffects(HitScanTrace.Hit);
}

#include "Net/UnrealNetwork.h"
//同步函数
void ASWeapon::GetLifetimeReplicatedProps(TArray<FLifetimeProperty>& OutLifetimeProps) const
{
	Super::GetLifetimeReplicatedProps(OutLifetimeProps);
	DOREPLIFETIME_CONDITION(ASWeapon,HitScanTrace,COND_SkipOwner);//结构体的同步条件:跳过拥有者（既服务端角色自己）
}

```
{{< /details >}}

1. 运行结果：Server端的角色开枪时击中特效在两端端窗口都能看到。
## 死亡同步
1. 想要同步死亡动画，有几个变量是需要同步的
	1. 生命组件中的生命值变量`Health`（生命组件也要）
	2. 同时也要修改只有服务端上的角色才能造成伤害，客户端只是视觉展示
	3. 角色身上的是否死亡变量`bDied`

 {{< details summary="在`SHealthComponent.h`中，给Health变量添加复制的宏，并重写复制函数添加复制条件，同时给受伤绑定回调添加条件，只有服务器角色才绑定伤害回调" >}}
```cpp
UPROPERTY(Replicated,BlueprintReadOnly,Category="HealthComponent")
float Health;

//重写同步函数
virtual void GetLifetimeReplicatedProps( TArray< class FLifetimeProperty > & OutLifetimeProps ) const override;
```
{{< /details >}}
{{< details summary="在`SHealthComponent.cpp`中开启组件的网络复制功能，并添加变量复制条件，同时给受伤绑定回调添加条件，并添加只有服务器角色才绑定伤害回调的条件" >}}
```cpp
USHealthComponent::USHealthComponent()
{
	SetIsReplicated(true);
}

void USHealthComponent::BeginPlay()
{
	Super::BeginPlay();
    //只有服务器上的角色才能绑定伤害事件
	if (GetOwnerRole() == ROLE_Authority)  
	{  
	    //获取组件的拥有者  
	    AActor* MyOwner = GetOwner();  
	    //当Actor收到伤害时会自动调用OnTakeAnyDamage函数绑定的HandleTakeAnyDamage函数  
	    if (MyOwner) MyOwner->OnTakeAnyDamage.AddDynamic(this,&USHealthComponent::HandleTakeAnyDamage);  
	}
}

#include "Net/UnrealNetwork.h"
//重写同步函数，设置同步条件
void USHealthComponent::GetLifetimeReplicatedProps(TArray<FLifetimeProperty>& OutLifetimeProps) const
{
	Super::GetLifetimeReplicatedProps(OutLifetimeProps);
	DOREPLIFETIME(USHealthComponent,Health);//Health属性同步条件
}
```
{{< /details >}}
 {{< details summary="在`SCharacter.h`中将`bDied`变量添加复制宏`Replicated`并在`SCharacter.cpp`中添加复制条件" >}}
```cpp
//在SCharacter.h中添加复制宏
UPROPERTY(Replicated,EditDefaultsOnly, BlueprintReadOnly, Category="Player")
bool bDied;

//在SCharacter.cpp中的GetLifetimeReplicatedProps函数添加同步条件
DOREPLIFETIME(ASCharacter,bDied);//同步条件
```
{{< /details >}}
2. 运行结果为两边的死亡动画已经同步。

## 挑战：爆炸油桶的网络同步
1.修改必要的同步属性和视觉效果。`运行结果：两端油桶爆炸和移动已同步`。
> SExplosiveBarrel.h
```
    UPROPERTY(ReplicatedUsing = OnRep_Exploded)
	bool bExploded;

	UFUNCTION()
	void Onrep_Exploded();

	virtual void GetLifetimeReplicatedProps( TArray< class FLifetimeProperty > & OutLifetimeProps ) const override;

```
> SExplosiveBarrel.cpp
```
ASExplosiveBarrel::ASExplosiveBarrel()
{
//...
	SetReplicates(true);
	SetReplicateMovement(true);
//...
}

void ASExplosiveBarrel::OnHealthChanged(USHealthComponent* OwningHealthComp, float Health, float HealthDelta,
	const UDamageType* DamageType, AController* InstigatedBy, AActor* DamageCauser)
{
	if (bExploded)return;
	if (Health<=0)
	{
		bExploded = true;
		MeshComp->AddImpulse(ExplosionImpulse * FVector::UpVector,NAME_None,true);//添加向上的力，通过组件自己的同步属性同步
        //UGameplayStatics::SpawnEmitterAtLocation(GetWorld(),ExplosionEffect,GetActorLocation());//生成爆炸特效
	  //MeshComp->SetMaterial(0,ExplodedMaterial);//改变爆炸后的材质

		OnRep_Exploded();//将生成爆炸特效和修改材质放入同步函数并调用。
		RadialForceComp->FireImpulse();//半径力发射，如果是物体，可以通过勾选物体自己的移动同步属性来同步
	}
}

void ASExplosiveBarrel::OnRep_Exploded()
{
	UGameplayStatics::SpawnEmitterAtLocation(GetWorld(),ExplosionEffect,GetActorLocation());//生成爆炸特效
	MeshComp->SetMaterial(0,ExplodedMaterial);//改变爆炸后的材质
}

void ASExplosiveBarrel::GetLifetimeReplicatedProps(TArray<FLifetimeProperty>& OutLifetimeProps) const
{
	Super::GetLifetimeReplicatedProps(OutLifetimeProps);
	DOREPLIFETIME(ASExplosiveBarrel,bExploded);
}

```