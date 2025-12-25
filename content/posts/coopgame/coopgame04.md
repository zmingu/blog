---
title: CoopGame04 - 伤与挂
subtitle:
date: 2022-10-04T17:43:00+08:00
lastmod: 2024-05-26T15:22:00+08:00
slug: coopgame04
draft: false
summary: "UE5 生命系统：自定义生命组件、动态多播委托、死亡动画和爆炸油桶。"
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

这是虚幻教程系列 - CoopGame的第4篇,伤与挂.
内容
- 实现的功能
	- Actor对伤害做出反应，管理玩家的死亡
	- 挑战：制作会爆炸的汽油桶
- 知识点：
	- 自定义组件
	- 自定义事件
	- 死亡动画
	- 使用材质

<!--more-->

## 生命组件
### 创建生命组件
1. 创建继承`ActorComponent`的C++类`SHealthComponent`。目录为`\CoopGame\Public\Component`

### 生命组件的使用
1. 删除Tick函数相关`TickComponent`代码，声明和构造函数中的初始化，初始化组件用于处理伤害事件。
 {{< details summary="在`SHealthComponent.h`声明`当前生命值`, `默认最大生命值`变量, 声明`处理受伤的函数`" >}}
```cpp
//当前生命值
UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category="HealthComponent")
float Health;
//默认最大生命值
UPROPERTY(EditDefaultsOnly, BlueprintReadWrite, Category="HealthComponent")
float DefaultHealth;
//受任何伤害的函数，这个函数是自己声明的，用于受伤事件的回调函数，所以参数参考OnTakeAnyDamage.AddDynamic的委托
UFUNCTION()
void HandleTakeAnyDamage(AActor* DamagedActor, float Damage, const class UDamageType* DamageType,class AController* InstigatedBy, AActor* DamageCauser);

```
{{< /details >}}
2. 用虚幻自带的委托绑定受伤的时候应该触发的函数，就是我们声明的`HandleTakeAnyDamage`回调函数，该函数处理受伤相关逻辑。
 {{< details summary="在`SHealthComponent.cpp`中初始化`默认最大生命值`变量, 绑定受伤的回调函数" >}}
```cpp
USHealthComponent::USHealthComponent()
{
	//初始化默认最大生命值
	DefaultHealth =100;
}

void USHealthComponent::BeginPlay()
{
	Super::BeginPlay();
	AActor* MyOwner = GetOwner();
	//用虚幻自带的委托OnTakeAnyDamage绑定HandleTakeAnyDamage函数
	//当拥有者受到伤害时会自动调用HandleTakeAnyDamage函数
	if (MyOwner) MyOwner->OnTakeAnyDamage.AddDynamic(this,&USHealthComponent::HandleTakeAnyDamage);
	//当前生命值等于默认最大生命值100
	Health = DefaultHealth;

}

void USHealthComponent::HandleTakeAnyDamage(AActor* DamagedActor, float Damage, const UDamageType* DamageType,
	AController* InstigatedBy, AActor* DamageCauser)
{
	if (Damage <= 0)return;
	//限定受伤后的生命值在0-默认最大生命值之间，包括这两个数
	Health = FMath::Clamp(Health-Damage,0.0f,DefaultHealth);
	//打印受伤后的生命值
	UE_LOG(LogTemp,Log,TEXT("被打的人说：我还剩:%s点血哦"),*FString::SanitizeFloat(Health));
}
```
{{< /details >}}

3. 将生命组件添加到角色身上，进行测试
	1. 在`BP_SCharacter`左上角添加组件，搜索`SHealth`，添加。测试如图
![test.gif](https://s3.zmingu.com/images/2025/09/16/test.webp)


## 动态多播委托
- 定义六个参数的自定义事件宏，也就是动态多播委托，定义生命值改变的自定义事件。并在角色受伤后调用多播，意思是组件受伤后，告诉所有绑定了`OnHealthChanged`的地方，让他们执行相应的回调。注意这里`OnHealthChanged`我们还没有绑定任何回调函数，后面会在蓝图绑定。
 {{< details summary="在`SHealthComponent.h`声明动态多播委托,名为`FOnHealthChangedSignature`，多播对象名为`OnHealthChanged`" >}}
```c
/*  
 *DYNAMIC：可以在蓝图里被序列化后定义和绑定操作。  
 *MULTICAST：可实现一个事件类型多函数广播（事件类型必须声明为蓝图类型）  
 *XXXParams：（使用DYNAMIC时）参数个数，宏定义参数里一个参数类型对应一个参数名字。  
 *动态多播委托，主要是可用于蓝图的委托绑定.可以作为变量给蓝图绑定调用,委托这块建议单独学习。  
 */  
//声明一个动态多播委托类型，名字叫FOnHealthChangedSignature,有6个参数  
DECLARE_DYNAMIC_MULTICAST_DELEGATE_SixParams(FOnHealthChangedSignature, USHealthComponent*, OwningHealthComp, float,  
                                   Health, float, HealthDelta, const class UDamageType*, DamageType,  
                                   class AController*, InstigatedBy, AActor*, DamageCauser);

class COOPGAMEPLUS_API USHealthComponent : public UActorComponent
{
	GENERATED_BODY()
    //...
	//声明动态多播对象，自定义事件——生命值改变事件(BlueprintAssignable仅能用于Multicast委托)
	UPROPERTY(BlueprintAssignable,Category="Events")
	FOnHealthChangedSignature OnHealthChanged;
};
```
{{< /details >}}
 {{< details summary="在`SHealthComponent.cpp`的`HandleTakeAnyDamage`中进行广播" >}}
```c
void USHealthComponent::HandleTakeAnyDamage(AActor* DamagedActor, float Damage, const UDamageType* DamageType,AController* InstigatedBy, AActor* DamageCauser)
{
    //... 
	//执行多播调用
	OnHealthChanged.Broadcast(this,Health,Damage,DamageType,InstigatedBy,DamageCauser);
}
```
{{< /details >}}
## 角色死亡动画
1. 给角色类`SCharacter`添加上生命值组件，将之前测试用的生命组件删除，我们需要改成在角色C++父类中添加组件
 {{< details summary="在`SCharacter.h`声明`生命组件`, `角色是否死亡`变量，以及`生命更新函数`" >}}
```cpp
//添加刚刚创建的生命组件  
UPROPERTY(VisibleAnywhere,BlueprintReadOnly,Category="Components")  
class USHealthComponent* HealthComp;  
  
//生命值更新函数，为了和生命组件中的生命值更新委托对象OnHealthChanged区别开来，我想重命名为OnCharacterHealthChanged
UFUNCTION()  
void OnCharacterHealthChanged(class USHealthComponent* OwningHealthComp,float Health,float HealthDelta, const class UDamageType* DamageType, class AController* InstigatedBy, AActor* DamageCauser );  
  
//角色是否死亡
UPROPERTY(BlueprintReadOnly, Category = "Player")  
bool bDied;
```
{{< /details >}}
 {{< details summary="在`SCharacter.cpp`中`初始化生命组件`，`绑定之前的委托`到角色的生命值改变函数，定义角色的生命值改变函数中的逻辑" >}}
```cpp
//导入生命组件头文件，Pawn的移动组件
#include "Component/SHealthComponent.h"
#include "GameFramework/PawnMovementComponent.h"

//在构造函数ASCharacter()中初始化生命组件
//创建生命值组件
HealthComp = CreateDefaultSubobject<USHealthComponent>(TEXT("HealthComp"));

//在BeginPlay()函数中绑定委托OnHealthChanged的回调函数
//拿到生命组件中的委托对象OnHealthChanged，绑定回调函数为
HealthComp->OnHealthChanged.AddDynamic(this,&ASCharacter::OnCharacterHealthChanged);

//定义受伤后生命改变的逻辑
void ASCharacter::OnCharacterHealthChanged(class USHealthComponent* OwningHealthComp, float Health, float HealthDelta,  
    const class UDamageType* DamageType, class AController* InstigatedBy, AActor* DamageCauser)  
{  
    if (Health<=0 && !bDied){  
       //当生命值小于0，并且当前状态不是死亡时，设置为死亡状态  
       bDied = true;  
       //运动组件停止运动  
       GetMovementComponent()->StopMovementImmediately();  
       //移除胶囊体所有碰撞  
       GetCapsuleComponent()->SetCollisionEnabled(ECollisionEnabled::NoCollision);  
       //这后面就是播放死亡动画了  
    }  
}
```
{{< /details >}}

2. 设置角色的动画蓝图`UE4ASP_HeroTPP_AnimBlueprint`,在动画更新事件中拿到角色类中的`bDied`并提升为变量，以便动画蓝图判断角色是否死亡。
	![CoopGame04-伤与挂1.webp](https://s3.zmingu.com/images/2025/04/842035851.webp)

3. 在动画图标中添加混合姿势，根据角色死亡的布尔值来混合死亡动画，死亡动画序列记得关闭循环
![CoopGame04-伤与挂2.webp](https://s3.zmingu.com/images/2025/04/3509117036.webp)


## 创建战争机器风格的生命指示材质和控件
略
## 挑战：会爆炸的汽油桶
略