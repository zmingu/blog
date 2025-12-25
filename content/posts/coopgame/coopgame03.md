---
title: CoopGame03-武器2
subtitle:
date: 2022-10-03T19:29:00+08:00
lastmod: 2024-05-26T15:20:00+08:00
slug: coopgame03
draft: false
summary: "UE5 武器进阶：开镜瞄准、物理表面材质、不同击中特效、头部暴击和连发射击。"
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

这是虚幻教程系列 - CoopGame的第3篇,实现开镜狙击等.
内容
- `开镜狙击`
- 优化武器开火代码
- 武器开火时反作用力照成的`摄像机抖动`
- 设置对多表面类型的支持，比如在击中`木质表面`，`金属表面`或`玩家`时产生不同的效果。
- 优化开火时播放特效的代码
- 鼠标左键长按连续开火

<!--more-->

## 实现狙击开镜功能

1. 添加操作映射`Zoom`如图
![Untitled.webp](https://s3.zmingu.com/images/2025/04/3092031770.webp)
2. 在角色类中添加开镜相关逻辑
{{< details summary="在`SCharacter.h`声明`开镜后的视角大小`, `当前开镜状态`, `默认视角大小`, `开始和结束开镜函数`" >}}
```cpp
//开镜后的视角大小
UPROPERTY(EditDefaultsOnly,Category="Player")
float ZoomedFOV;

//是否开镜
bool bWantsToZoom;

//默认视角大小
float DefaultFOV;

//开始开镜函数
void BeginZoom();
//结束开镜函数
void EndZoom();

```
{{< /details >}}
{{< details summary="在`SCharacter.cpp`初始化两个视场角, 绑定开镜输入, 在`Tick()`处理开镜逻辑" >}}
```cpp

/*在ASCharacter()构造函数中设置开镜后的视场角*/
ZoomedFOV = 65;

/*在BeginPlay()函数中设置默认视场角*/
//默认视角等于相机组件的视场
DefaultFOV = CameraComp->FieldOfView;

/*在Tick()函数中判断是否开镜并处理开镜逻辑*/
//不断判断是否开镜，是则设置当前视场为开镜后的视场，否者默认。
float CurrentFOV = bWantsToZoom?ZoomedFOV:DefaultFOV;
CameraComp->SetFieldOfView(CurrentFOV);

/*在SetupPlayerInputComponent()函数中绑定鼠标右键按下和松开要调用的函数*/
PlayerInputComponent->BindAction("Zoom",IE_Pressed,this,&ASCharacter::BeginZoom);
PlayerInputComponent->BindAction("Zoom",IE_Released,this,&ASCharacter::EndZoom);

/*定义开镜和结束开镜函数*/
void ASCharacter::BeginZoom()
{
	bWantsToZoom = true;
}

void ASCharacter::EndZoom()
{
	bWantsToZoom = false;
}

```
{{< /details >}}

3. 使用插值优化开镜平滑效果
{{< details summary="在`SCharacter.h`声明`视场平滑速度`" >}}
```cpp
//视场平滑速度
UPROPERTY(EditDefaultsOnly,Category="Player")
float ZoomInterpSpeed;
```
{{< /details >}}
{{< details summary="在`SCharacter.cpp`中初始化视场平滑速度, 在`Tick()`函数中进行视场角切换的插值" >}}
```c
/*在ASCharacter()构造函数中初始化视场平滑速度*/
//设置默认插值速度
ZoomInterpSpeed = 20;

/*在Tick()函数中修改设置开镜后的视场角为插值后的视场角NewFOV*/
//不断判断是否开镜，是则设置当前视场为开镜后的视场，否者默认。
float CurrentFOV = bWantsToZoom ? ZoomedFOV : DefaultFOV;
//使用数学函数插值浮点从当前值到目标值，既默认视角到目标视角过度。
float NewFOV = FMath::FInterpTo(DefaultFOV, CurrentFOV, DeltaTime, ZoomInterpSpeed);
CameraComp->SetFieldOfView(NewFOV);

```
{{< /details >}}
## 优化武器开火代码

1. 之前角色开火是在角色蓝图中使用自带的鼠标左键事件,调用`CurrentWeapon`武器类引用的`Fire()`函数进行开火. 现在我们需要删除这些蓝图,改成在C++中通过输入中的操作映射来开火
    
    ![24.webp](https://s3.zmingu.com/images/2025/04/2641731211.webp)
    

2. 添加`ToFire`操作映射
	![25.webp](https://s3.zmingu.com/images/2025/04/3156435048.webp)
        
3. 在角色类`SCharacter`中编写开火函数`ToFire();`

{{< details summary="在角色类`SCharacter.h`中声明开火函数" >}}
```cpp
//角色开火函数
void ToFire();
```
{{< /details >}}
{{< details summary="在角色类`SCharacter.cpp`中将按键映射绑定开火函数, 定义`ToFire()`函数" >}}
```cpp
/*在SetupPlayerInputComponent()函数中绑定鼠标左键按下的开火函数*/
PlayerInputComponent->BindAction("ToFire",IE_Pressed,this,&ASCharacter::ToFire);

/*定义开火函数ToFire()*/
void ASCharacter::ToFire()
{
	//调用武器类的开火函数
	if (CurrentWeapon) CurrentWeapon->Fire();
}
```
{{< /details >}}
4. 运行测试是否能正常开火.
## 实现开火后镜头震动功能

1. 在武器类`SWeapon`中实现镜头抖动
{{< details summary="在`SWeapon.h`中声明镜头抖动类" >}}
```c
protected:
	//镜头震动类
	UPROPERTY(EditDefaultsOnly,Category="Weapon")
	TSubclassOf<class UCameraShakeBase> FireCamShake;
```
{{< /details >}}
{{< details summary="在`SWeapon.cpp`的开火函数中实现" >}}

```cpp
/*在Fire()开火函数的if(WeaponOwner)判断后面添加震动代码*/
//拿到武器的拥有者转成Pawn类型,再拿到控制器,需要确保拥有者是Pawn类型
APawn* OwnerPawn = Cast<APawn>(GetOwner());
if (OwnerPawn)
{
	APlayerController* PlayerController = Cast<APlayerController>(OwnerPawn->GetController());
	//该方法过时
	// if (PlayerController) PlayerController->ClientPlayCameraShake(FireCamShake);
	//拿到玩家控制器播放相机抖动
	if (PlayerController) PlayerController->ClientStartCameraShake(FireCamShake);
}
```
{{< /details >}}

1. 创建继承`MatineeCameraShake`相机震动类的蓝图类,命名为`CamShake_RifleFire`,
    1. 设置相机震动类`MatineeCameraShake`的属性
    
    ![Untitled 1.webp](https://s3.zmingu.com/images/2025/04/2424843351.webp)
    
1. 在武器蓝图类`BP_SWeapon`的类默认值中设置`FireCamShake`的属性值为`CamShake_RifleFire`。
## 实现不同物体不同击中效果
### 添加`PhysicsCore`依赖
{{< details summary="在`CoopGame.Build.cs`文件中添加`PhysicsCore`依赖。" >}}
```cpp
/*CoopGamePlus.Build.cs*/
PrivateDependencyModuleNames.AddRange(new string[] { "PhysicsCore" });
```
{{< /details >}}
### 添加两个物理表面类型
1. 在`项目设置-物理-物理表面`中添加两个物理表面`FleshDefault`,`FleshVulnerable`

![Untitled 2.webp](https://s3.zmingu.com/images/2025/04/3627360195.webp)
     
2. 在项目头文件中定义两个表面对应类型(注意定义的结尾没有分号)
{{< details summary="`CoopGame.h`" >}}
```cpp
#define SURFACE_FLESHDEFAULT      SurfaceType1
#define SURFACE_FLESHVULNERABLE   SurfaceType2
```
{{< /details >}}

### 设置物理材质给角色

1. 新建`Corn`文件夹,右键创建两个物理材质继承`PhysicalMaterial`类。分别命名为`FleshDefault`,`FleshVulnerable`
    
    ![Untitled 3.webp](https://s3.zmingu.com/images/2025/04/3735931296.webp)
    

1. 给`Corn`文件夹下的两个物理材质`FleshDefault`,`FleshVulnerable`分别设置对应的表面类型`FleshDefault`和`FleshVulnerable`
    
    ![Untitled 5.png](https://s3.zmingu.com/images/2025/04/2722211258.png)
    
2. 设置人物骨骼物理资产`SK_Mannequin_PhysicsAsset` , 设置除了头部之外的形体物理材质重载为`FleshDefault`，头部物理重载设置为`FleshVulnerable`
    ![Untitled 6.webp](https://s3.zmingu.com/images/2025/04/1824500243.webp)
        

### 修改武器类的特效逻辑
1. 在武器C++类`SWeapon`中修改击中特效为两个不同的特效。
{{< details summary="在`SWeapon.h`中声明两种击中特效" >}}
```cpp
// 删除之前的击中特效
// UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category = "Weapon")
// UParticleSystem* ImpactEffect;

//击中特效——击中东西的默认特效
UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category = "Weapon")
UParticleSystem* DefaultImpactEffect;

//击中特效——击中人的飙血特效
UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category = "Weapon")
UParticleSystem* FleshImpactEffect;

```
{{< /details >}}
{{< details summary="在`SWeapon.cpp`中修改之前的击中特效逻辑" >}}
```cpp
/*引入物理材质类,以及需要项目.h文件中的自定义物理类型,前面已经定义*/
#include "PhysicalMaterials/PhysicalMaterial.h"
#include "CoopGame/CoopGame.h"

/*修改之前Fire()函数中的逻辑*/
/*在QueryParams.bTraceComplex = true;下面设置查询参数返回物理材质*/
QueryParams.bReturnPhysicalMaterial = true;//是否返回击中的物理材质


/*下面逻辑放在if (bHit) 判断里面, 意思达到东西才开始获取表面材质等逻辑*/
//获取击中的物体的物理表面材质类型
EPhysicalSurface HitSurfaceType = UPhysicalMaterial::DetermineSurfaceType(Hit.PhysMaterial.Get());
//根据表面材质选择后最终要使用的粒子特效
//表面是SURFACE_FLESHVULNERABLE就飙血,这里是刚刚我们设置的角色的头
UParticleSystem* SelectedEffect = nullptr;
switch (HitSurfaceType)
{
case SURFACE_FLESHDEFAULT:
case SURFACE_FLESHVULNERABLE:
	SelectedEffect = FleshImpactEffect;
	break;
default:
	SelectedEffect = DefaultImpactEffect;
	break;
}

// if (ImpactEffect)
// {
// 	//在生成特效在某个位置,参数为（生成的世界，粒子特效，世界位置，世界旋转）——SpawnEmitterAtLocation有三个重载。
// 	UGameplayStatics::SpawnEmitterAtLocation(GetWorld(), ImpactEffect, Hit.ImpactPoint,
// 	                                         Hit.ImpactPoint.Rotation());
// }

if (SelectedEffect)
{
	//枪口位置
	FVector MuzzleLocation = SKMeshComp->GetSocketLocation(MuzzleSocketName);
	//受击方向
	FVector ShotDirection = Hit.ImpactPoint - MuzzleLocation;
	//归一化矢量
	ShotDirection.Normalize();
	//位置处生成击中特效
	UGameplayStatics::SpawnEmitterAtLocation(GetWorld(), SelectedEffect, Hit.ImpactPoint, ShotDirection.Rotation());
}
```
{{< /details >}}
    
7. 在武器蓝图`BP_SWeapon`中设置两个特效变量的类默认值。

![Untitled 4.webp](https://s3.zmingu.com/images/2025/04/2321230059.webp)




### 设置武器开火的自定义碰撞通道
1. 添加自定义通道 , 创建检测通道`Weapon`,默认响应为阻挡。
![Untitled 7.webp](https://s3.zmingu.com/images/2025/04/981524546.webp)
        
2. 项目类头文件中定义第一个追踪通道为`COLLISION_WEAPON`
{{< details summary="`CoopGame.h`" >}}
```cpp
/*定义COLLISION_WEAPON追踪通道*/
#define COLLISION_WEAPON ECC_GameTraceChannel1
```
{{< /details >}}

3. 武器类`SWeapon`开火函数`Fire()`中使用自己的碰撞通道`COLLISION_WEAPON`
{{< details summary="`SWeapon.cpp`" >}}
```cpp
//判断是否弹道射线打到东西，单射线查询通道（打击结果，射线开始位置，射线结束位置，碰撞通道，查询参数）
bool bHit = GetWorld()->LineTraceSingleByChannel(Hit, EyeLocation, TraceEnd, COLLISION_WEAPON, QueryParams);
```
{{< /details >}}
4. 角色类`SCharacter`中设置胶囊体的碰撞通道忽略`COLLISION_WEAPON`，因为要让子弹打到网格体才能有不同的特效，而不能打到胶囊体.
{{< details summary="`SCharacter.cpp`" >}}
```cpp
/*引入项目.h头文件,才能拿到自定义碰撞,以及引入胶囊体组件*/
#include "CoopGame/CoopGame.h"
#include "Components/CapsuleComponent.h"

/*在ASCharacter()构造函数中设置胶囊体忽略武器碰撞通道*/
  //角色胶囊体忽略武器碰撞
	GetCapsuleComponent()->SetCollisionResponseToChannel(COLLISION_WEAPON,ECR_Ignore);

```
{{< /details >}}

5. 然后确保角色蓝图`BP_SCharacter`中胶囊体的碰撞通道忽略了`Weapon`。将碰撞预设设置为自定义`Custom`并设置Weapon通道为忽略
    ![4.gif](https://s3.zmingu.com/images/2025/04/2019689045.gif)
    

## 优化开火特效代码

1. 将播放特效的逻辑整理在函数中
{{< details summary="在`Sweapon.h`中声明播放两种特效的函数`PlayFireEffects`,`PlayImpactEffects`" >}}
```cpp
//声明两个特效播放函数。
void PlayFireEffects(FVector TraceEnd);//枪口和弹道特效
void PlayImpactEffects(FHitResult Hit);//受击特效
```
{{< /details >}}
{{< details summary="在`Sweapon.cpp`中整理代码" >}}
```cpp
/*移动Fire()函数中的代码到新的两个函数*/
void ASWeapon::Fire()
		//......其他代码
		if (bHit)
		{
			UGameplayStatics::ApplyPointDamage(Hit.GetActor(), 20, EyeRotator.Vector(), Hit,WeaponOwner->GetInstigatorController(), this, DamageType);
			 PlayImpactEffects(Hit);//播放受击特效
		}
		PlayFireEffects(TraceEnd);	//播放弹道特效和枪口
	}
}

/*播放枪口特效和弹道特效*/
void ASWeapon::PlayFireEffects(FVector TraceEnd)
{
	//开火枪口特效。
	if (MuzzleEffect)
	{
		//播放附加到指定组件并跟随指定组件的指定效果(粒子特效，要依附的组件，生成的命名点)。
		UGameplayStatics::SpawnEmitterAttached(MuzzleEffect, SKMeshComp, MuzzleSocketName);
	}

	//弹道特效。这里没有搞懂
	if (TracerEffect)
	{
		//获得枪口插槽位置。
		FVector MuzzleSocketLocation = SKMeshComp->GetSocketLocation(MuzzleSocketName);
		//枪口生成特效并拿到特效实例。
		UParticleSystemComponent* TracerComp = UGameplayStatics::SpawnEmitterAtLocation(
			GetWorld(), TracerEffect, MuzzleSocketLocation);
		if (TracerComp)
		{
			//在此粒子组件上设置命名矢量实例参数。
			TracerComp->SetVectorParameter(TracerTargetName, TraceEnd);
		}
	}

	/*相机抖动*/
	APawn* MyOwner = Cast<APawn>(GetOwner());
	if (MyOwner)
	{
		APlayerController* PlayerController = Cast<APlayerController>(MyOwner->GetController());
		//该方法过时
		// if (PlayerController) PlayerController->ClientPlayCameraShake(FireCamShake);..................
		//拿到玩家控制器播放相机抖动
		if (PlayerController) PlayerController->ClientStartCameraShake(FireCamShake);
	}
}

/*播放受击特效*/
void ASWeapon::PlayImpactEffects(FHitResult Hit)
{
	//获取击中的物体的物理表面材质类型
	EPhysicalSurface HitSurfaceType = UPhysicalMaterial::DetermineSurfaceType(Hit.PhysMaterial.Get());
	//根据表面材质选择后最终要使用的例子特效
	UParticleSystem* SelectedEffect = nullptr;
	//根据物理表面设置要使用的特效
	switch (HitSurfaceType)
	{
	case SURFACE_FLESHDEFAULT:
	case SURFACE_FLESHVULNERABLE:
		SelectedEffect = FleshImpactEffect;
		break;
	default:
		SelectedEffect = DefaultImpactEffect;
		break;
	}
	if (SelectedEffect)
	{
		//枪口位置
		FVector MuzzleLocation = SKMeshComp->GetSocketLocation(MuzzleSocketName);
		//受击方向
		FVector ShotDirection = Hit.ImpactPoint - MuzzleLocation;
		//归一化矢量
		ShotDirection.Normalize();
		//位置处生成击中特效
		UGameplayStatics::SpawnEmitterAtLocation(GetWorld(), SelectedEffect, Hit.ImpactPoint, ShotDirection.Rotation());
	}
}
```
{{< /details >}}
## 实现击中头部伤害暴击
1. 涉及到不同伤害值 , 说明我们在应用伤害时不能再是固定的值20了 , 我们需要添加一个基础伤害变量。
{{< details summary="在`SWeapon.h`中声明基础伤害值变量" >}}
```cpp
//基础伤害值
UPROPERTY(EditDefaultsOnly,Category="Weapon")
float BaseDamage;
```
{{< /details >}}
{{< details summary="在`SWeapon.cpp`中处理打到头部伤害翻倍的逻辑" >}}
```cpp
    /*在ASWeapon()构造函数中初始化基础伤害值*/
    ASWeapon::ASWeapon()
    {
        //...其他代码
    	//基础伤害值。
    	BaseDamage = 20;
    }
    
    void ASWeapon::Fire()
    {
    	AActor* WeaponOwner = GetOwner();
    	if (WeaponOwner)
    	{
            //...其他代码
    		//如果射线打到东西
    		if (bHit)
    		{
    			float ActualDamage = BaseDamage;
    			//在应用点状伤害前判断打到的物理表面是不是头部，是则伤害翻4倍。
    			if (UPhysicalMaterial::DetermineSurfaceType(Hit.PhysMaterial.Get()) == SURFACE_FLESHVULNERABLE)
    			{
    				ActualDamage *= 4.0f;
    			}
    			//应用点状伤害为处理后的伤害值ActualDamage(被伤害的Actor，要应用的基础伤害，受击方向，描述命中的碰撞或跟踪结果，照成伤害的控制器（例如射击武器的玩家的控制器）,实际造成伤害的Actor,伤害类型)
    			UGameplayStatics::ApplyPointDamage(Hit.GetActor(), ActualDamage, EyeRotator.Vector(), Hit,WeaponOwner->GetInstigatorController(), this, DamageType);
    			//播放受击特效
    			 PlayImpactEffects(Hit);
    		}
    		//...
    
    	}
    }
    
    ```
{{< /details >}}

2. 在角色蓝图`BP_SCharacter`上绘制伤害调试球和调试字符 , 用于可视化显示不同伤害值是否生效。
![Untitled 8.webp](https://s3.zmingu.com/images/2025/04/3246639373.webp)

## 实现长按鼠标连发开火
1. 修改`SWeapon`的开火逻辑
{{< details summary="在`SWeapon.h`中声明`开火频率` ,  `时间间隔句柄 `, `上次开火的时间` , `两枪之间的间隔`" >}}
```cpp
/*连发开火*/
//连发间隔时间句柄
FTimerHandle TimerHandle_TimeBetweenShots;
//上次开火时间
float LastFireTime;
//开火频率——每分钟多少枪
UPROPERTY(EditDefaultsOnly, Category="Weapon")
float RateOfFire;
//两枪之前的时间——分钟
float TimeBetweenShots;
//开始和停止开火函数
void StartFire();
void StopFire();
```
{{< /details >}}
{{< details summary="在`SWeapon.cpp`中处理开火逻辑" >}}
```cpp
ASWeapon::ASWeapon()
{
	PrimaryActorTick.bCanEverTick = true;
    //...
	//每分钟开600枪
	RateOfFire = 600;
}

void ASWeapon::BeginPlay()
{
	Super::BeginPlay();
	//两枪之间最小时间0.1
	TimeBetweenShots = 60 / RateOfFire;
}

void ASWeapon::StartFire()
{
	float FirstDelay = FMath::Max(0.0f, LastFireTime + TimeBetweenShots - GetWorld()->TimeSeconds);  
	GetWorldTimerManager().SetTimer(TimerHandle_TimeBetweenShots, this, &ASWeapon::Fire, TimeBetweenShots, true,FirstDelay);
}

void ASWeapon::StopFire()
{
	//清除连续开火的时间句柄
	GetWorldTimerManager().ClearTimer(TimerHandle_TimeBetweenShots);
}

```
{{< /details >}}
{{< admonition info >}}
- 当玩家按下开火键时，`StartFire()` 函数被调用。
- 函数首先计算出距离下一次合法开火还需要多久 (`FirstDelay`)。这个机制防止了玩家通过快速、反复地调用 `StartFire` (例如，通过鼠标宏) 来绕过武器的射速限制，实现超速射击。
-  然后，函数设置一个**循环定时器**。
    - 这个定时器会先等待 `FirstDelay` 秒。
    - 等待结束后，它会**第一次**调用 `ASWeapon::Fire` 函数，完成一次射击。
    - 之后，它会**每隔 `TimeBetweenShots` 秒**就自动再次调用 `ASWeapon::Fire` 函数，从而实现持续、稳定的自动射击。
-  这个定时器会一直运行下去，直到有其他代码（比如在玩家松开开火键时调用的 `StopFire` 函数中）通过 `TimerHandle_TimeBetweenShots` 这个句柄把它清除掉（通常使用 `GetWorldTimerManager().ClearTimer(...)`）。
{{< /admonition >}}

2. 修改角色类`SCharacter`射击逻辑
{{< details summary="在`SCharacter.h`中声明开枪和停止开枪函数" >}}
```cpp
//角色去开枪函数
void ToFire();
//角色停止开枪函数
void StopFire();
```
{{< /details >}}

{{< details summary="在`SCharacter.cpp`中重新绑定开火停火按键映射" >}}
```c
void ASCharacter::SetupPlayerInputComponent(UInputComponent* PlayerInputComponent)
{
	Super::SetupPlayerInputComponent(PlayerInputComponent);
	//...
	PlayerInputComponent->BindAction("ToFire",IE_Pressed,this,&ASCharacter::ToFire);
	PlayerInputComponent->BindAction("ToFire",IE_Released,this,&ASCharacter::StopFire);
}

void ASCharacter::ToFire()
{
	//调用武器的开火函数
	if (CurrentWeapon) CurrentWeapon->StartFire();
}

void ASCharacter::StopFire()
{
	if (CurrentWeapon) CurrentWeapon->StopFire();
}
```
{{< /details >}}

## 最终测试效果

![Video_2025-09-02_2336212.gif](https://s3.zmingu.com/images/2025/09/02/Video_2025-09-02_2336212.webp)
