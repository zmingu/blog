---
title: CoopGame02 - 武器1
subtitle:
date: 2022-10-02T15:01:00+08:00
lastmod: 2024-05-26T15:17:00+08:00
slug: coopgame02
draft: false
summary: "UE5 武器系统实现：射线检测、伤害应用、枪口特效、弹道特效和准星 UI。"
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

这是虚幻教程系列 - CoopGame的第2篇,创建武器.

内容
- 导入武器相关资产
- 创建并附加武器到角色身上

<!--more-->
## 导入武器相关资产

1. 下载[源文件](https://wwql.lanzout.com/b030ouw2ud),密码:zmingu
2. 导入CoopGame\Content\Weapons文件夹到项目`Content`目录

## 创建并附加武器到角色身上

### 创建武器类

1. 创建武器C++类`SWeapon`,继承自`Actor`,并初始化武器的骨骼网格体。
{{< details summary="在 `SWeapon.h` 中声明武器的骨骼网格体组件" >}}
```cpp
//武器的骨骼网格体
UPROPERTY(VisibleAnywhere,BlueprintReadOnly,Category="Weapon")
class USkeletalMeshComponent* SKMeshComp;
```
{{< /details >}}
{{< details summary="在 `SWeapon.cpp` 中的构造函数中初始化武器的骨骼网格体组件" >}}
```c++
ASWeapon::ASWeapon()
{
	SKMeshComp = CreateDefaultSubobject<USkeletalMeshComponent>(TEXT("SKMeshComp"));
	RootComponent = SKMeshComp;
}
```
{{< /details >}}
2. 创建继承`SWeapon`武器类的蓝图类`BP_SWeapon`，并选择设置武器的骨骼网格体`SK_Rifle.`
    ![8.webp](https://s3.zmingu.com/images/2025/04/2678712662.webp)
### 为角色生成武器
1. 在角色骨骼的`hand_r`右键添加名为`WeaponSocket`武器的骨骼插槽。
    ![9.webp](https://s3.zmingu.com/images/2025/04/471341764.webp)
2. 在`SCharacter`编写代码将武器生成到玩家手上的名为`WeaponSocket`的插槽上。
{{< details summary="在 `SCharacter.h` 中声明需要添加到角色身上的武器类和插槽名" >}}
```cpp
//当前武器类
UPROPERTY(BlueprintReadOnly)
class ASWeapon* CurrentWeapon;

//需要生成并添加给角色的武器类
UPROPERTY(EditDefaultsOnly, Category = "Player")
TSubclassOf<ASWeapon> StartWeaponClass;

//用来放武器的插槽名
UPROPERTY(VisibleDefaultsOnly, Category = "Player")
FName WeaponAttachSocketName;

```
{{< /details >}}
{{< details summary="在 `SCharacter.cpp` 中生成武器并附加到角色身上" >}}
```c
/*引入武器类*/
#include "SWeapon.h"

/*在ASCharacter()构造函数中添加*/
//玩家骨骼上的武器插槽名
WeaponAttachSocketName = "WeaponSocket";

/*在BeginPlay()函数中添加*/
/*
* 生成默认的武器。
*/
//设置生成参数。
FActorSpawnParameters SpawnParams;
SpawnParams.SpawnCollisionHandlingOverride = ESpawnActorCollisionHandlingMethod::AlwaysSpawn;
//生成当前武器。
CurrentWeapon = GetWorld()->SpawnActor<ASWeapon>(StartWeaponClass, FVector::ZeroVector, FRotator::ZeroRotator, SpawnParams);
if (CurrentWeapon)
{
	//如果当前武器已经有了，设置武器拥有者为当前玩家，将武器依附到武器插槽。
	CurrentWeapon->SetOwner(this);
	CurrentWeapon->AttachToComponent(GetMesh(), FAttachmentTransformRules::SnapToTargetNotIncludingScale, WeaponAttachSocketName);
}
```
{{< /details >}}

3. 在角色蓝图类中设置默认值，将要生成的武器类`StartWeaponClass`的类默认值设为`BP_SWeapon`

### 调整武器位置
1. 在人物骨骼的武器骨骼插槽`WeaponSocket`右键添加预览资产`SK_Rifle`，在右侧选择预览动画选`Idle_Rifle_Hip`
    ![10.webp](https://s3.zmingu.com/images/2025/04/3797461835.webp)
2. 调整插槽位置使武器位置正确 , 可直接使用如图参数。
    ![Untitled.webp](https://s3.zmingu.com/images/2025/04/2850349067.webp)
## 让武器能够开火
1. 在武器类`SWeapon`中编写开火函数
{{< details summary="在`SWeapon.h`中声明开火函数" >}}
```cpp
//开火函数
UFUNCTION(BlueprintCallable,Category="Weapon")
void Fire();
```
{{< /details >}}
{{< details summary="在`SWeapon.cpp`中定义开火函数" >}}
```cpp
/*引入绘制调试射线助手类*/
include "DrawDebugHelpers.h"

/*定义Fire()函数*/
void ASWeapon::Fire()
{
	AActor* WeaponOwner= GetOwner();
	if (WeaponOwner)
	{
		/*
		 * 弹道的起点和终点
		 */
		FVector EyeLocation;
		FRotator EyeRotator;
		//弹道起点 = 玩家摄像头位置
		Cast<APawn>(WeaponOwner)->GetActorEyesViewPoint(EyeLocation,EyeRotator);
		//弹道终点 = 起点位置 + （方向 * 距离）
		FVector TraceEnd = EyeLocation + (EyeRotator.Vector() * 1000);

		/*
		 *打击和碰撞
		 */
		//打击结果（里面能存储射线打击到的一些信息）
		FHitResult Hit;
		//查询参数
		FCollisionQueryParams QueryParams;
		//查询参数设置忽略武器自身和拥有武器的玩家
		QueryParams.AddIgnoredActor(this);
		QueryParams.AddIgnoredActor(WeaponOwner);
		//查询参数启用复合追踪
		QueryParams.bTraceComplex = true;
		//判断是否弹道射线打到东西，单射线查询通道（打击结果，射线开始位置，射线结束位置，碰撞通道，查询参数）
		bool bHit = GetWorld()->LineTraceSingleByChannel(Hit,EyeLocation,TraceEnd,ECC_Visibility,QueryParams);
		//如果射线打到东西
		if (bHit)
		{
			//处理击中事件,待编写
		}
		//把射线检测绘制出来
		DrawDebugLine(GetWorld(),EyeLocation,TraceEnd,FColor::Red,false,1,0,1);
	}
}
```
{{< /details >}}

2. 在角色蓝图`BP_SCharacter`使用鼠标左键事件调用武器的开火函数，此时开火可见从玩家身上摄像机发出的射线。(右键搜索`CurrentWeapon`变量,从该变量调用Fire()函数)
    
    ![Untitled 1.webp](https://s3.zmingu.com/images/2025/04/2903587173.webp)
    
    ![Untitled 2.webp](https://s3.zmingu.com/images/2025/04/3500546283.webp)
    

## 使开火产生伤害
1. 在武器类中添加伤害类型变量
- 伤害类型介绍:
        ![12.webp](https://s3.zmingu.com/images/2025/04/2252723866.webp)
{{< details summary="在`SWeapon.h`中声明伤害类型" >}}
```cpp
//伤害类型
UPROPERTY(EditDefaultsOnly,BlueprintReadOnly,Category="Weapon")
TSubclassOf<UDamageType> DamageType;
```
{{< /details >}}
{{< details summary="在`SWeapon.cpp`的开火函数中应用伤害" >}}
```cpp
//导入库函数头文件
#include "Kismet/GameplayStatics.h"


/*补充射线击中需要处理的事件*/

//如果射线打到东西
if (bHit)
{
	//应用点状伤害(被伤害的Actor，要应用的基础伤害，受击方向，描述命中的碰撞或跟踪结果，照成伤害的控制器（例如射击武器的玩家的控制器）,实际造成伤害的Actor,伤害类型)
	UGameplayStatics::ApplyPointDamage(Hit.GetActor(),20,EyeRotator.Vector(),Hit,WeaponOwner->GetInstigatorController(),this,DamageType);
}
```
{{< /details >}}



2. 调一下角色身上的弹簧臂的位置，参数如图，让待会更好观察并测试代码结果.
    
    ![13.webp](https://s3.zmingu.com/images/2025/04/44456933.webp)
    
3. 在角色蓝图类`BP_SCharacter`，添加`事件点状伤害`并绘制调试球体，将网格体碰撞预设设置为`BlockAll`
![Untitled 3.webp](https://s3.zmingu.com/images/2025/04/256035278.webp)
4. 拖入一个`BP_SCharacter`到场景中, 用于测试, 如果没问题能看到如图射击到人会产生调试球 , 说明我们已经打出伤害了. 
![Untitled 4.webp](https://s3.zmingu.com/images/2025/04/1211107367.webp)
    

## 添加武器开火特效

### 枪口特效和击中特效

1. 导入之前项目下载的武器特效资产 , 目录为`WeaponEffects`,并编写`SWeapon`武器类。
{{< details summary="在`SWeapon.h`中声明枪口的插槽名，枪口发生的特效，击中物体的特效" >}}
```cpp
//枪骨骼上的枪口骨骼名
UPROPERTY(VisibleDefaultsOnly,BlueprintReadOnly,Category="Weapon")
FName MuzzleSocketName;

//枪口特效
UPROPERTY(EditDefaultsOnly,BlueprintReadOnly,Category="Weapon")
class UParticleSystem* MuzzleEffect;

//击中特效
UPROPERTY(EditDefaultsOnly,BlueprintReadOnly,Category="Weapon")
class UParticleSystem* ImpactEffect;
```
{{< /details >}}
{{< details summary="在`SWeapon.cpp`定义枪口插槽名，以及在`Fire()`中处理生成特效逻辑" >}}
```cpp
/*引入特效相关头文件*/
#include "Kismet/GameplayStatics.h"

/*ASWeapon()构造函数设置枪口骨骼的插槽名*/
MuzzleSocketName = "MuzzleSocket";

/*Fire()函数的if(WeaponOwner)判断最末尾添加*/
if (MuzzleEffect)
{
	//生成特效并附加到组件上的某个骨骼上,参数为(粒子特效，要依附的组件，生成的命名点)
	UGameplayStatics::SpawnEmitterAttached(MuzzleEffect,SKMeshComp,MuzzleSocketName);
}
if (ImpactEffect)
{
	//在生成特效在某个位置,参数为（生成的世界，粒子特效，世界位置，世界旋转）——SpawnEmitterAtLocation有三个重载。
	UGameplayStatics::SpawnEmitterAtLocation(GetWorld(),ImpactEffect,Hit.ImpactPoint,Hit.ImpactPoint.Rotation());
}
```
{{< /details >}}
    
2. `BP_SWeapon`蓝图类设置特效的默认值如下，并测试。

![Untitled 5.png](https://s3.zmingu.com/images/2025/04/803783482.png)
    
3. 攻击地板,可以看到已经有了枪口特效和击中特效,其中我们会发现奇怪的问题,射线检测是从角色上发射出来的,这明显是不对,需要修改成从摄像机(也就是我们作为玩家看的方向)发射,在后面编写弹道特效的同时会进行修改.
    
    ![14.webp](https://s3.zmingu.com/images/2025/04/623242040.webp)
    

### 弹道特效

1. 先修改下弹道特效粒子`P_SmokeTrail`的参数名为`Target`(光束粒子发射器)
    
    ![Untitled 6.webp](https://s3.zmingu.com/images/2025/04/2595830085.webp)
    
2. 为武器类添加弹道特效
{{< details summary="在`SWeapon.h`中声明弹道特效和弹道特效的追踪目标名" >}}
```c
//弹道特效
UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category = "Weapon")
UParticleSystem* TracerEffect;

//弹道特效参数名
UPROPERTY(VisibleDefaultsOnly, BlueprintReadOnly, Category = "Weapon")
FName TracerTargetName;
```
{{< /details >}}
{{< details summary="在`SWeapon.cpp`中的构造函数中定义弹道特效追踪目标名, 添加生成弹道特效逻辑" >}}
```cpp
/*引入粒子组件*/
#include "Particles/ParticleSystemComponent.h"

/*ASWeapon()构造函数设置枪口骨骼的插槽名*/
TracerTargetName= "Target";

/*Fire()函数的if(WeaponOwner)判断中添加*/
//获得枪口插槽位置。
FVector MuzzleSocketLocation = SKMeshComp->GetSocketLocation(MuzzleSocketName);
//枪口生成特效并拿到特效组件实例。
UParticleSystemComponent* TracerComp = UGameplayStatics::SpawnEmitterAtLocation(GetWorld(),TracerEffect,MuzzleSocketLocation);
if (TracerComp)
{
	//在此粒子组件上设置命名矢量实例参数。
	TracerComp->SetVectorParameter(TracerTargetName,TraceEnd);
}
```
{{< /details >}}
    
3. 为武器`BP_SWeapon`蓝图类设置上弹道特效默认值.

    ![15.webp](https://s3.zmingu.com/images/2025/04/1080116685.webp)
4. 改变一下射线发射的初始位置.
    -  可以看到我们调用的`GetActorEyesViewPoint()`获取的位置是在角色上方加上`BaseEyeHeight`的值的位置,我们要修改成玩家摄像机位置.
        
        ![16.webp](https://s3.zmingu.com/images/2025/04/3956670081.webp)
	- 这是父类APawn的函数:
        ![17.webp](https://s3.zmingu.com/images/2025/04/1402917149.webp)
        
        ![18.webp](https://s3.zmingu.com/images/2025/04/1753670404.webp)
        
5. 在角色类`SCharacter`中重写`GetPawnViewLocation()`函数
{{< details summary="在`SCharacter.h`中声明要重写的函数" >}}
```cpp
    virtual FVector GetPawnViewLocation() const override;	
```
{{< /details >}}
{{< details summary="在`ASCharacter.cpp`重写函数, 让其返回相机组件的位置, 测试完成功后注释掉之前的debug射线" >}}
```cpp
FVector ASCharacter::GetPawnViewLocation() const
{
	if (CameraComp) return CameraComp->GetComponentLocation();
	return Super::GetPawnViewLocation();
}

/*找到Fire()中的debug射线, 使待会观察弹道特效更明显*/
//DrawDebugLine(GetWorld(), EyeLocation, TraceEnd, FColor::Red, false, 1, 0, 1);
```
{{< /details >}}

## 添加武器准星

1. 新建`UI`目录,新建控件蓝图,命名`WBP_Crosshair`.
2. 拖入`image`图片控件,锚点设置为中心,其他设置如下.
    
    ![19.webp](https://s3.zmingu.com/images/2025/04/3330148733.webp)
    
3. 在角色蓝图`BP_SCharacter`中的`BeginPlayer`事件编写逻辑,将控件添加到视口
    
    ![20.webp](https://s3.zmingu.com/images/2025/04/4136462719.webp)
    

## 该篇运行效果

![gif2.gif](https://s3.zmingu.com/images/2025/04/4134385007.gif)

## 挑战：制作榴弹发射器

1. 创建继承`SWeapon`的C++类`SProjectileWeapon,`重写`Fire()`函数
{{< details summary="将`SWeapon.h`的Fire()函数修改为虚函数" >}}
```cpp
UFUNCTION(BlueprintCallable,Category="Weapon")
virtual void Fire();
```
{{< /details >}}
{{< details summary="在`SProjectileWeapon.h`类中声明重写`Fire()`函数, 声明生成的子弹类" >}}
```cpp
protected:
virtual void Fire() override;

UPROPERTY(EditDefaultsOnly,Category="ProjectileWeapon")
TSubclassOf<AActor> ProjectileClass;//生成的子弹类
```
{{< /details >}}
{{< details summary="在`SProjectileWeapon.cpp`的`Fire()`中重写生成榴弹的逻辑" >}}
```cpp
void ASProjectileWeapon::Fire()
{
	Super::Fire();

	AActor* WeaponOwner = GetOwner();
	if (WeaponOwner)
	{
		FVector EyeLocation;
		FRotator EyeRotator;
		WeaponOwner->GetActorEyesViewPoint(EyeLocation, EyeRotator);

		//获取枪口位置
		FVector MuzzleLocation = SKMeshComp->GetSocketLocation(MuzzleSocketName);

		//生成参数
		FActorSpawnParameters SpawnParams;
		SpawnParams.SpawnCollisionHandlingOverride = ESpawnActorCollisionHandlingMethod::AlwaysSpawn;

		if (ProjectileClass)
		{
			GetWorld()->SpawnActor<AActor>(ProjectileClass, MuzzleLocation, EyeRotator, SpawnParams);
		}
	}
}
```
{{< /details >}}
    
2. 创建蓝图类`BP_GrenadeLauncher`,继承`SProjectileWeapon`类,设置该蓝图类的网格体为`Launcher`
3. 并将该骨骼网格体`Launcher`的骨骼`Launcher_Skeleton`的插槽名`MuzzleFlashSocket`改为`MuzzleSocket`
4. 创建子弹类蓝图`BP_GrenadeProjectile`继承`Actor`类,并添加发射物移动组件`ProjectileMovement`,设置初始和最大速度为`2000`,勾选`应反弹`
    - 添加组件`球体`,并作为`根组件`,缩放为`0.25`,勾选`模拟物理`
    - 在`BeginPlay`事件中编写特效和伤害代码

{{< admonition tip >}}
可以直接复制下面的蓝图 , 然后粘贴到你的编辑器哦
{{< /admonition >}}

{{< blueprintue id="180j1hrp" >}}
![21.webp](https://s3.zmingu.com/images/2025/04/541221376.webp)
        
2. 设置`BP_GrenadeLauncher`的类默认值`Projectile Class`发射物类为`BP_GrenadeProjectile`
    
    ![22.webp](https://s3.zmingu.com/images/2025/04/2746572688.webp)
    
2. 在`BP_SCharacter`角色类中的类默认值中设置要生成的武器类`Starter Weapon Class`从之前的步枪改成改为榴弹发射器类`BP_GrenadeLauncher`
    
    ![23.webp](https://s3.zmingu.com/images/2025/04/2480930834.webp)
    
3. 测试结果
    ![gif3.gif](https://s3.zmingu.com/images/2025/04/1136829697.gif)