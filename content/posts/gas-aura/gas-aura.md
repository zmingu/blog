---
title: "GAS-Aura 课程笔记"
subtitle:
date: 2025-04-12T21:08:00+08:00
lastmod: 2025-07-28T13:50:41+08:00
slug: gas-aura-01
draft: false
keywords:
  - 虚幻引擎教程
  - UEC++教程
  - UE多人联机教程
  - UE-GAS教程
weight: 0
tags:
  - 虚幻引擎教程
categories:
  - 虚幻引擎
toc: true
collections:
  - Unreal Engine Tutorial GAS-Aura
---

> 原课程：[点击查看](https://www.udemy.com/course/unreal-engine-5-gas-top-down-rpg/?couponCode=JUST4U02223)

>课程资源：[点击查看](https://github.com/DruidMech/GameplayAbilitySystem_Aura)

适用对象：
> 
> - 有一定`UE5`基础，希望深入掌握GAS（`Gameplay Ability System`）的开发者
> - 对动作`RPG/ARPG`开发感兴趣，需构建复杂技能、属性和战斗系统的游戏开发者
> - 需要了解`多人联机同步机制`和`高效数据管理`的进阶学习者

# 一、Introduction（简介）

## 1.核心内容模块

- **基础架构：**学习Ability System Component（ASC）、AttributeSet（属性集）、Gameplay Effects（技能效果）的核心原理，涵盖属性访问器、效果叠加策略（如持续效果、周期效果）  。

- **实战应用：**通过近战连击系统、伤害计算模块，掌握如何利用GAS实现动态技能组合与状态标签管理（如连击跳转标签、技能冷却标签） 。

- **角色与战斗系统：**从基础角色类构建到动画蓝图设计，覆盖增强输入（Enhanced Input）、敌人高亮交互、武器碰撞检测等实战技术

- **属性与伤害体系：**通过数据表（Data Table）初始化角色属性，结合曲线表（Curve Table）实现可扩展的伤害计算逻辑，支持攻击力、防御力、生命值等动态调整
- **UI与数据交互：**使用Widget Controller架构动态更新血条/蓝条，通过属性广播和回调机制实现UI与游戏逻辑的解耦 。
    
    
- **多人游戏支持：**探讨GAS在多人模式下的复制策略（Replication Mode），解决同步延迟和预测问题

- **案例驱动**：从零构建完整的Top Down RPG项目，涵盖角色控制器、敌人AI、技能特效（如高亮材质、粒子系统）、关卡设计等模块

- **工具链整合**：结合Quixel Megascans资源库与虚幻商城素材，提升开发效率

# 二、Project Creation（项目创建）

## 2.项目设置

1. 打开带有资产的项目文件`Aura.uproject`。
2. 编辑→编辑器偏好设置→通用→源代码→设置使用[image.webp](https://s3.zmingu.com/images/2025/04/1381232071.webp)的代码编辑器为`Rider`
3. 编辑→编辑器偏好设置→通用→实时代码编写→`关闭`实时代码编写
4. 编辑→编辑器偏好设置→通用→关闭`Automatically Compile Newly Added C++Classes`（自动编译添加C++文件）
5. 编辑→编辑器偏好设置→通用→外观→设置`Asset Editor Open Location`（资产编辑器打开位置）为Main Window（主窗口）
6. 编辑→插件→开启插件`Rider Integration`（Rider集成）
7. 编辑→项目设置→项目→描述→设置或清空`Copyright Notice`（著作权信息，在Cpp文件首行生成）

## 3.设置版本控制（可选）

1. GItHub创建新仓库GameplayAbilitySystem_Aura。
2. 在项目根目录创建.gitignore忽略文件。
    
    ```xml
    Binaries
    DerivedDataCache
    Intermediate
    Saved
    Build
    
    .vscode
    .vs
    *.VC.db
    *.opensdf
    *.opendb
    *.sdf
    *.s1n
    *.Suo
    *.xcodeproj
    *.xcworkspace
    ```
    
3. 添加提交项目文件到版本仓库（视频中使用Git命令），建议可以用GitHubDesktop，SourceTree等Git可视化软件进行版本控制，或者使用SVN，Perforce等其他方案进行版本控制。
    
    ```cpp
    echo "GameplayAbilitySystem_Aura" >> README.md
    git init   //初始化后可以用
    git status //查看状态
    git add .  //add文件
    git status //查看状态
    git log    //查看log
    git add README.md
    git commit -m "first commit"
    git branch -M main
    git remote add origin https://github.com/DruidMech/GameplayAbilitySystem_Aura.git //换成自己的仓库
    git push -u origin main
    ```
    

## 4.创建角色基类

1. 创建`C++`角色基类，继承`Character`，名为`AuraCharacterBase`，权限为`Public`，文件夹位置为`Character`
2. 自动打开`Rider`，编辑器弹出是否接管Git版本控制，作者选不在提示。（可自行抉择）
3. 用VS打开`项目文件.sln`，解决方案提示需要安装一些东西，点安装。
4. 作者说有大量调试运行可以学到，要去引擎安装Debug模式。
5. `Rider`设置`Debug模式`运行编辑器，VS中也可以运行。
6. 删除`项目.sln文件`，提交版本控制。

## 5.玩家和敌人角色

1. 编写刚创建的`AuraCharacterBase.h`
    1. 在类名上一行添加`UCLASS(Abstract)`，防止该类被直接拖入关卡中。
    2. 删除`Tick`函数和`SetupPlayeInputComponent`函数（因为敌人的AI控制器不需要设置输入，我们这个Base基类同时是玩家和敌人的基类）。
    3. 删除不需要的注释。
2. 编写刚创建的`AuraCharacterBase.cpp`
    1. 构造函数中编写`PrimaryActorTick.bCanEverTick = false;`（关闭Tick）
    2. ~~将`AuraCharacterBase`放到`Character`目录下，并修改cpp的include（之前创建的时候做了可不做）~~
3. 创建`AuraCharacter`类，继承`AuraCharacterBase`类，其他设置不特别说明都是Public，路径Character，创建后提示需要编译先取消
4. 创建`AuraEnemy`类，继承`AuraCharacterBase`类
- 小结
    - 涉及代码比较少，不列出具体代码
    - 此时有4个C++角色类，给出他们的继承关系
        - AuraCharacterBase
            - AuraCharacter
                - AuraEnemy

## 6.角色动画蓝图

1. 为角色基类`AuraCharacterBase`添加武器骨骼
    1. `AuraCharacterBase.h`添加`TObjectPtr`骨骼网格体组件
        
        ```cpp
        UPROPERTY(EditAnywhere,Category="Combat")
        TObjectPtr<USkeletalMeshComponent> Weapon;//不需要加*，因为我们知道是一个指针
        ```
        
    2. `AuraCharacterBase.cpp`的构造函数编写
        
        ```cpp
        Weapon = CreateDefaultSubobject<USkeletalMeshComponent>("Weapon");//<>里是返回类型，参数是FName，不需要TEXT()宏，而FString需要该宏，因为需要
        Weapon->SetupAttachment(InParent:GetMesh(), FName("WeaponHandSocket"));//附加到骨骼网格体的插槽上
        Weapon->SetCollisionEnabled( NewType:ECollisionEnabled::NoCollision);
        ```
        
2. 创建`Blueprint/Character/Aura`文件夹，创建`BP_AuraCharacter`蓝图类继承`AuraCharacter`类，并设置角色的网格体，设置位置和旋转的Z轴为`-90`。

## 7.动画蓝图

1. 在`Blueprint/Character/Aura`文件夹中，创建动画蓝图`ABP_Aura`，添加状态机`Main States`，连接默认插槽`DefaultSlot`用于播放蒙太奇。
2. `Main States`添加状态机`IdleWalkRun`，状态内部添加混合空间`IdleWalkRun`。
3. 复写蓝图初始化动画事件`Event Blueprint Initialize Animation`，用尝试获得Pawn拥有者`Try Get Pawn Owner`节点拿到并转换成`BP_AuraCharacter`，提升为变量`BP_Aure_Character`，拿到移动组件提升为变量`CharacterMovement`。
4. 覆写蓝图更新动画事件`Event Blueprint Update Animation`（如果更复杂的动画蓝图可以覆写蓝图线程安全更新动画），有效获取`BP_Aura_Character`，在移动组件变量中获取速度`Velocity`，获得向量长度`XYVector Length XY`（角色横向移动的速度），提升为变量`GroundSpeed`，用`GroundSpeed`驱动之前的混合空间`IdleWalkRun`
5. 在角色蓝图`BP_AuraCharacter`中为骨骼网格体设置动画蓝图`ABP_Aura`
6. 给敌人设置动画蓝图（敌人有很多种骨骼网格图，需要考虑到通用性）
    1. 在Character目录下创建`ABP_Enemy`，创建时选择模板
    2. 添加`Main States`状态机，连接`DeaultSlot`插槽 
    3. 状态机添加状态`IdleWalkRun`，连接混合空间播放器`Blendspace Player`
    4. 用相同方式从敌人类中拿到水平速度驱动动画。
    5. 在Blueprint/Character/Goblin_Spear文件夹下创建动画蓝图，继承`ABP_Enemy`，网格体选`SKM_Goblin_Spear` ，命名为`ABP_Goblin_Spear`
    6. 在资产覆盖窗口`Asset Override`，找到那个混合空间播放器，设置长矛的那个混合空间。
    7. 为`BP_Goblin_Spear`设置动画蓝图
    8. 同样的方法，创建哥布林弹弓`Goblin_Slingshot，蓝图，动画蓝图等`

## 8.增强输入

1. 创建`Input/InputActions`文件夹，创建`IA_Move`，创建`ICM_AuraContext`，设置WSAD移动。   
    1. 移动是二维动作前后左右，所以值类型为`Axis2D`
    2. 三维空间中，角色的向前通常视为X轴，但是移动操作是两回事，ws是y轴，ad是x轴
    3. 对于左右AD，D为正，A为负，所以A需要添加修改器`Negate`否定X轴，只否定X轴，其他不需要。
    4. 对于前后WS，W为正，S为负， 但是WS因为是修改Y轴，即使是W也要添加修改器`Swizzle Input Axis Values`，将Y轴优先级提前`YXZ`，不然默认是修改X轴，S则添加上面两个修改器`Swizzle Input Axis Values`和`Negate`。
2. 创建玩家控制器Cpp类，/Player目录，`AuraPlayerController`

## 9.玩家控制器

1. .h添加`构造函数`（Public），`BeginPlay`函数（Protected） ，增强输入上下文（private，需要在`Build.cs`添加`EnhanceInput`模块）
2. 设置复制
3. 增强输入子系统添加操作映射上下文
4. 设置鼠标显示和光标样式默认
5. 设置输入模式为Game和UI，并设置一些属性，窗口锁定，捕获时不隐藏光标

## 10.移动输入

1. 覆盖`SetupInputConponent()`函数（protected）
2. 拿到增强输入组件，然后绑定`ActionMove`和回调函数`Move`
3. 在回调函数中编写移动逻辑
    
    ```cpp
    // Learn by Zmingu
    
    #pragma once
    
    #include "CoreMinimal.h"
    #include "GameFramework/PlayerController.h"
    #include "AuraPlayerController.generated.h"
    
    class UInputAction;
    class UInputMappingContext;
    struct FInputActionValue;
    /**
     * 
     */
    UCLASS()
    class AURA_API AAuraPlayerController : public APlayerController
    {
    	GENERATED_BODY()
    public:
        AAuraPlayerController();
    protected:
    	virtual void BeginPlay() override;
    	virtual void SetupInputComponent() override;
    private:
    	UPROPERTY(EditAnywhere,Category="Input")
    	TObjectPtr<UInputMappingContext> AuraContext;
    
    	UPROPERTY(EditAnywhere,Category="Input")
    	TObjectPtr<UInputAction> MoveAction;
    	
        //这里的参数是一个结构体,这是为什么是引用呢，因为结构体是值类型，如果不加引用，那么在函数内部对结构体的修改是不会影响到外部的
    	//如果加了引用，那么在函数内部对结构体的修改会影响到外部的（存疑）
    	void Move(const struct FInputActionValue& InputActionValue);
    	
    };
    ```
    
    ```cpp
    // Learn by Zmingu
    
    #include "Player/AuraPlayerController.h"
    #include "EnhancedInputSubsystems.h"
    #include "EnhancedInputComponent.h"
    
    AAuraPlayerController::AAuraPlayerController()
    {
    	bReplicates = true;
    }
    
    void AAuraPlayerController::BeginPlay()
    {
    	Super::BeginPlay();
    
    	check(AuraContext);//检查上下文是否为空,为空则报错
    
    	UEnhancedInputLocalPlayerSubsystem* Subsystem = ULocalPlayer::GetSubsystem<UEnhancedInputLocalPlayerSubsystem>(GetLocalPlayer());
    	check(Subsystem);//检查子系统是否为空,为空则报错
    	Subsystem->AddMappingContext(AuraContext,0);//添加映射上下文,第二个参数是优先级
    
    	bShowMouseCursor = true;//显示鼠标
    	DefaultMouseCursor = EMouseCursor::Default;//设置鼠标样式为默认
    
        FInputModeGameAndUI InputModeData;//创建一个输入模式为游戏和UI
        InputModeData.SetLockMouseToViewportBehavior(EMouseLockMode::DoNotLock);//设置鼠标锁定模式为不锁定
    	InputModeData.SetHideCursorDuringCapture(false);//设置捕获时隐藏鼠标为false
    	SetInputMode(InputModeData);//设置输入模式
    }
    
    void AAuraPlayerController::SetupInputComponent()
    {
    	Super::SetupInputComponent();
    	
    	//用CastChecked转换为增强输入组件，这里的InputComponent是APlayerController的成员变量，是一个UInputComponent类型的指针，这里转换为UEnhancedInputComponent类型的指针
    	UEnhancedInputComponent* EnhancedInputComponent = CastChecked<UEnhancedInputComponent>(InputComponent);
    	EnhancedInputComponent->BindAction(MoveAction,ETriggerEvent::Triggered,this,&AAuraPlayerController::Move);//绑定移动函数
    }
    
    void AAuraPlayerController::Move(const FInputActionValue& InputActionValue)
    {
    	const FVector2D InputAxisVector = InputActionValue.Get<FVector2d>();//InputActionValue是一个结构体，这里调用Get方法获取一个FVector2d类型的值
    	//这个InputAxisVector是一个二维向量，表示输入的方向,比如(1,0)表示向右，(-1,0)表示向左，(0,1)表示向上，(0,-1)表示向下
    	//但是这个变量后面是作为移动量的大小来使用
    
    	const FRotator Rotation = GetControlRotation();//获取控制器的旋转
    	const FRotator YawRotation(0,Rotation.Yaw,0);//只保留Yaw轴的旋转,这里的Yaw轴是Z轴
    
    	const FVector ForwardVector = FRotationMatrix(YawRotation).GetUnitAxis(EAxis::X);//获取前向向量,这里的X轴是前向,这里的GetUnitAxis方法是获取单位轴
    	const FVector RightVector = FRotationMatrix(YawRotation).GetUnitAxis(EAxis::Y);//获取右向向量,这里的Y轴是右向
    
    	if (APawn* ControlledPawn = GetPawn<APawn>()) {
    		ControlledPawn->AddMovementInput(ForwardVector,InputAxisVector.Y);//添加前向移动，这里的InputAxisVector.Y是前向移动的大小
    		ControlledPawn->AddMovementInput(RightVector,InputAxisVector.X);//添加右向移动，这里的InputAxisVector.X是右向移动的大小
    	}
    }
    ```
    
4. 创建继承该cpp类的控制器蓝图，`BP_AuraPlayerController`，设置`IMC`和`IA`

## 11.游戏模式

1. 创建基于`GameModeBase`的cpp类：`AuraGameModeBase`，文件夹为/Public/Game
2. 创建父类为`AuraGameModeBase`的蓝图类：`BP_AuraGameMode`，文件夹为/Blueprint/Game
    1. 设置控制器`BP_AuraPlayerController`和角色类`BP_Aura`
3. 在`BP_Aura`的胶囊体下添加相机和弹簧臂，设置弹簧臂长度和俯视视角
    1. 不要勾选使用Pawn控制旋转，因为是俯视角游戏，希望相机固定视角，而不会跟着转
    2. 勾选`Enable Camera Lag` 相机滞后效果
    3. 现在运行游戏看到角色没用朝向移动方向，去修改一下
4. 在`AuraCharacter`类中设置
    
    ```cpp
    AAuraCharacter::AAuraCharacter()
    {
    	GetCharacterMovement()->bOrientRotationToMovement = true;//设置角色移动时是否朝向移动方向
    	GetCharacterMovement()->RotationRate = FRotator(0.0f, 540.0f, 0.0f);//设置角色旋转速度
    	GetCharacterMovement()->bConstrainToPlane = true;//设置角色是否限制在平面上移动
    	GetCharacterMovement()->bSnapToPlaneAtStart = true;//设置角色是否在开始时就限制在平面上移动
    
    	bUseControllerRotationPitch = false;//设置是否使用控制器旋转俯仰角,意思是控制器是否影响相机的俯仰角
    	bUseControllerRotationYaw = false;//设置是否使用控制器旋转偏航角,意思是控制器是否影响相机的偏航角
    	bUseControllerRotationRoll = false;//设置是否使用控制器旋转滚动角,意思是控制器是否影响相机的滚动角
    }
    ```
    
5. 现在角色会朝向移动方向，但是相机也跟着变了，需要在相机臂上取消勾选 Inherit Pich、Yaw、Roll
6. 现在有个问题，角色一停下来就开始摇头，我们去设置动画蓝图
    1. 添加一个状态`Idle`，动画设置为Idle并设置循环，将之前状态改为`Running`
    2. 添加一个布尔变量`ShouldMove`  在获取移动速度那里赋值，速度>3时可以移动，将这个布尔值作为两个状态改变的条件

## 12.敌人接口

1. 选择敌人的突出效果，玩家控制器下有查看鼠标光标下的事件
2. 多个不同敌人都需要突出，用接口实现多样性 ，当鼠标悬停在Actor上，查看是否实现了敌人接口类，如果实现了就调用该接口函数
3. 这样PC就不需要知道发生了什么，不同敌人类实现不同的高亮功能
4. 创建C++类，继承`UnrealInterface`类，名称为`EnemyInterface`，文件夹为`public/Interaction`
    1. 创建两个纯虚函数（意味着该类没用这个函数的定义，是抽象类）
        
        ```cpp
        public:
        	virtual void HighlightActor() = 0;
        	virtual void UnHighlightActor() = 0;
        ```
        
5. 在`AuraEnemy`头文件，include上面的接口并继承，重写两个纯虚函数。
    
    ```cpp
    void AAuraEnemy::Highlight()
    {
    }
    
    void AAuraEnemy::Unhighlight()
    {
    }
    ```
    

## 13.高亮敌人

1. `AuraPlayerController`重写`Tick()`函数，public访问符
2. 创建CursorTrace()函数，private访问符，在tick函数中调用，并实现该函数
    
    ```cpp
    void AAuraPlayerController::CursorTrace()
    {
    	FHitResult CursorHit;
    	GetHitResultUnderCursor(ECC_Visibility,false,CursorHit);// 获取鼠标下的碰撞,并存储到CursorHit中
    	if (!CursorHit.bBlockingHit) return;// 如果没有碰撞到物体，直接返回。bBlockingHit表示是否碰撞到物体
    	
    	// LastActor = ThisActor;//将ThisActor赋值给LastActor
    	// ThisActor = Cast<IEnemyInterface>(CursorHit.GetActor());//将碰撞到的物体转换为IEnemyInterface接口
    	// 用脚本接口代替，不需要强制转换
    	LastActor = ThisActor;
    	ThisActor = CursorHit.GetActor();
    
    	/*
    	 * 从光标发射射线追踪，有5种结果
    	 *  A.LastActor为空，ThisActor为空,既鼠标一直没有碰到敌人，这种情况下不需要做任何操作
    	 *  B.LastActor为空，ThisActor不为空，既鼠标第一次没有碰到敌人，然后碰到了敌人，这种情况下需要高亮当前碰到的敌人
    	 *  C.LastActor不为空，ThisActor为空,既鼠标第一次碰到敌人，然后没有碰到敌人，这种情况下需要取消高亮上一个碰到的敌人
    	 *  D.LastActor不为空，ThisActor不为空,但是这两个敌人不是同一个敌人，这种情况下需要取消高亮上一个碰到的敌人，然后高亮当前碰到的敌人
    	 *  E.LastActor不为空，ThisActor不为空,这两个敌人是同一个敌人，这种情况下不需要做任何操作
    	 */
    	if (LastActor == nullptr)
    	{
    		if (ThisActor != nullptr)
    		{
    			// 情况B
    			ThisActor->Highlight();
    		}
    		else
    		{
    			// 情况A,什么都不做
    		}
    	}
    	else // 上一个敌人是有效的
    	{
    		if (ThisActor == nullptr)
    		{
    			// 情况C
    			LastActor->Unhighlight();
    		}
    		else // 两者都是有效的
    		{
    			if (LastActor != ThisActor)
    			{
    				// 情况D
    				LastActor->Unhighlight();
    				ThisActor->Highlight();
    			}
    			else
    			{
    				// 情况E,什么都不做
    			}
    		}
    	}
    }
    ```
    
3. 在PC头文件创建两个指向接口的指针，分别代表当前敌人，和上一个敌人。这里有两种做法，使用第二种脚本接口更妥善，而不是原始指针
    
    ```cpp
    	//TScriptInterface 是 Unreal Engine 中一个封装了指向对象的智能指针，它能够让你更安全地处理接口类型的对象。它的主要目的是通过避免直接操作原始指针，减少潜在的内存泄漏问题，同时让接口可以在蓝图和C++之间互操作。
    	// IEnemyInterface* LastActor;
    	// IEnemyInterface* ThisActor;
    	// 用脚本接口代替原生函数,而不是直接使用原始指针，好处是可以避免内存泄漏
    	// TScriptInterface 是 Unreal Engine 中一个封装了指向对象的智能指针，它能够让你更安全地处理接口类型的对象。它的主要目的是通过避免直接操作原始指针，减少潜在的内存泄漏问题，同时让接口可以在蓝图和C++之间互操作。
    	TScriptInterface<IEnemyInterface> LastActor;
    	TScriptInterface<IEnemyInterface> ThisActor;
    ```
    
4. 在敌人类上，创建一个布尔值，用于标识是否被高亮，蓝图可读，默认值为false，并在高亮函数中设置为真，取消高亮设置为false
    
    ```cpp
    UPROPERTY(BlueprintReadOnly)
    	bool bIsHighlighted = false;
    	
    	
    void AAuraEnemy::Highlight()
    {
    	bIsHighlighted = true;
    }
    
    void AAuraEnemy::Unhighlight()
    {
    	bIsHighlighted = false;
    }
    ```
    
5. 在敌人蓝图tick函数判断该变量，并绘制调制球，确保敌人Mesh设置碰撞预设\为自定义，将可见性设置为阻止，控制台：show coll可显示碰撞
    
    ![1728264821931.webp](https://s3.zmingu.com/images/2025/04/2171815700.webp)
    

## 14.后期处理-高亮

1. 创建`BP_EnemyBase`蓝图类，继承`EnemyBase`类，将两个哥布林父类设置为它。
2. 拖入后期处理体积。设置无线范围，搜索`infinite`。添加后期处理材质，文件搜`PP_Highlight`
3. 进入项目设置，设置`custom depth Stencil Pass` 为`Enabled with Stencil`
4. 深度模板值为250的将会被突出显示
5. 选中敌人网格，custom depth 启用，并设置自定义深度模板值为250。需要调高亮线条粗度，调材质的1.6值
6. 在`AuraEnemy`敌人基类C++类中的高亮函数中设置启动和关闭网格体上的自定义深度
    1. 删除bHighLight布尔值
    2. 在`Aura.h`中设置全局常亮250
        
        ```cpp
        #define CUSTOM_DEPTH_RED 250
        ```
        
    3. 在两个函数设置启用高亮功能。
        
        ```cpp
        void AAuraEnemy::Highlight()
        {
        	GetMesh()->SetRenderCustomDepth(true);
        	GetMesh()->SetCustomDepthStencilValue(CUSTOM_DEPTH_RED);
        	Weapon->SetRenderCustomDepth(true);
        	Weapon->SetCustomDepthStencilValue(CUSTOM_DEPTH_RED);
        }
        
        void AAuraEnemy::Unhighlight()
        {
        	GetMesh()->SetRenderCustomDepth(false);
        	Weapon->SetRenderCustomDepth(false);
        }
        
        ```
        
    4. 在敌人C++基类，创建构造函数，设置碰撞预设的可见性为阻挡。
        
        ```cpp
        AAuraEnemy::AAuraEnemy()
        {
        	// 会自动将碰撞预设设置为自定义
        	GetMesh()->SetCollisionResponseToChannel(ECC_Visibility, ECR_Block);
        }
        ```
        

# 三、Intro to the Gameplay Ability System

## 15.游戏能力系统

1. 介绍属性，技能，增益，debuff
    
    ![1728268526491.webp](https://s3.zmingu.com/images/2025/04/1167760434.webp)
    
    ![1728271299897.webp](https://s3.zmingu.com/images/2025/04/1705893710.webp)
    

## 16.GAS主要部件

1. ASC，AS，GA，AT，GE，GC，Game Tag
    
    ![1728271955565.webp](https://s3.zmingu.com/images/2025/04/4273795316.webp)
    
2. ASC和AS的两种添加方法：添加到Pawn或者PlayerState
    1. 如果放在Pawn上，如果Pawn死了，ASC和AS就没了，重新生成角色那些数据是新的。
    2. 如果放在PlayerState上，就没有这个问题，可以切换Pawn。
    3. 本项目的添加方法：
        
        ![1728272282825.webp](https://s3.zmingu.com/images/2025/04/3539016850.webp)
        
    4. 所以接下来要创建一些PlayerState类，ASC类，AS类

## 17.玩家状态

1. 在Player文件夹下创建`AuraPlayerState`类，继承PlayerState C++类
2. 创建构造函数，设置更新频率为100，`NetupdateFrequency = 100.f;`
3. 创建BP_AuraPlayerState，继承`AuraPlayerState`
4. 在GM中设置PS

## 18.能力系统组件和属性集

1. 插件中启用GAS：`Gameplay Abilities`
2. 创建C++类，继承`AbilitySystemComponent`，名为`AuraAbilitySystemComponent`，目录为/public/AbilitySystem
3. 创建C++类，继承`AttributeSet`，名为`AuraAttributeSet`，目录为/public/AbilitySystem
4. 在`.Build.cs`文件添加需要的模块Private：`"GameplayAbilities","GameplayTags","GameplayTasks"`

## 19.多人游戏中的GAS

1. 介绍
    
    ![1728273653885.webp](https://s3.zmingu.com/images/2025/04/2089944761.webp)
    
    !![1728274366488.png](https://s3.zmingu.com/images/2025/04/3714868656.png)
    
2.   注意：每个客户端都有自己的HUD类，并且仅在该客户端上存在，所以专有服务器上没用HUD，监听服务器上的HUD是该本地玩家的HUD
3. 变量复制只在服务器向客户端复制。而客户端想到服务器就只有用RPC了

## 20.构建能力系统组件和属性集

1. `AuraCharacterBase`中创建T对象指针，ASC和AS。但是因为只在敌人角色中有这两个，而玩家角色需要放在PlayerState中，所以要到敌人中创建。
    
    ```cpp
    class UAbilitySystemComponent;
    class UAttributeSet;
    
    UPROPERTY()
    TObjectPtr<UAbilitySystemComponent> AbilitySystemComponent;
    UPROPERTY()
    TObjectPtr<UAttributeSet> AttributeSet;
    ```
    
    1. 继承`IAbilitySystemInterface`接口，该接口有个获取能力系统组件的纯虚函数`GetAbilitySystemComponent()`，我们实现并用来验证或获取能力系统组件
        
        ```cpp
        virtual UAbilitySystemComponent* GetAbilitySystemComponent() const override;
        	
        	
        	UAbilitySystemComponent* AAuraCharacterBase::GetAbilitySystemComponent() const
        {
        	return AbilitySystemComponent;
        }
        ```
        
    2. 创建获取属性集的函数`GetAttributeSet()`
        
        ```cpp
        UAttributeSet* GetAttributeSet() const{return AttributeSet;}
        ```
        
    3. 在`AuraEnemy`中将父类声明的两个指针变量赋值：创建ASC并设置为复制。创建AS。注意创建的是Aura开头的ASC和AS
        
        ```cpp
        AbilitySystemComponent = CreateDefaultSubobject<UAuraAbilitySystemComponent>(TEXT("AbilitySystemComponent"));
        	AbilitySystemComponent->SetIsReplicated(true);
        	AbilitySystemComponent->SetReplicationMode(EGameplayEffectReplicationMode::Minimal);//Minimal适用于AI控制的角色
        
        	AttributeSet = CreateDefaultSubobject<UAuraAttributeSet>(TEXT("AttributeSet"));
        ```
        
2. 在`AuraPlayerState`中声明这两个变量并创建，实现`IAbilitySystemInterface`接口的纯虚函数，和创建`GetAttributeSet()`函数.同上

## 21.复制模式

1. 设置`AuraPlayerState`和`EnemyBase`类上的ASC的复制模式。
    1. 经验而谈：玩家控制的设置为`Mixed`，AI控制的设置为`Minimal`
    
    ```cpp
    AbilitySystemComponent->SetReplicationMode(EGameplayEffectReplicationMode::Mixed);
    ```
    
2. GE的复制模式
    
    ![1728279578816.png](https://s3.zmingu.com/images/2025/04/2485250369.png)
    
3. GE是什么，是对玩家造成伤害或治疗类似的

## 22.初始化ASC的拥有者和代表着

1. 介绍
    
    ![1728280302501.webp](https://s3.zmingu.com/images/2025/04/4124079420.webp)
    
2. 什么时候调用呢
    1. 如图
    
    ![1728280701967.webp](https://s3.zmingu.com/images/2025/04/640607277.webp)
    
3. 在AuraCharacter中创建私有函数，用于初始化ASC拥有者和代表者，同时在玩家角色类中赋值ASC和AS指针。
    
    ```cpp
    oid AAuraCharacter::PossessedBy(AController* NewController)
    {
    	Super::PossessedBy(NewController);
    
    	// 在服务器中初始化AbilityActorInfo
    	InitAbilityActorInfo();
    }
    
    void AAuraCharacter::OnRep_PlayerState()
    {
    	Super::OnRep_PlayerState();
    
    	// 在客户端中初始化AbilityActorInfo
    	InitAbilityActorInfo();
    }
    
    void AAuraCharacter::InitAbilityActorInfo()
    {
    	AAuraPlayerState* AuraPlayerState = GetPlayerState<AAuraPlayerState>();
    	check(AuraPlayerState);
    	AuraPlayerState->GetAbilitySystemComponent()->InitAbilityActorInfo(AuraPlayerState,this);
    	AbilitySystemComponent = AuraPlayerState->GetAbilitySystemComponent();
    	AttributeSet = AuraPlayerState->GetAttributeSet();
    }
    ```
    
4. 注意一点：
    
    ![1728282707988.webp](https://s3.zmingu.com/images/2025/04/171766715.webp)
    
    对于混合复制模式：ASC的OwnerActor的所有者必须是控制者。
    
    对于Pawn，这在PossessedBy()中自动设置
    对于玩家状态，它的所有者自动设置为控制器。
    
    如果是其他，需要手动设置ASC的OwnerActor的所有者为控制器
    

# 四、Attributes

## 23.属性

1. 属性集AS可以有多个，但是该项目只使用一个。
2. 预测：相当于客户端不需要等到服务器确认更改，先自行更改，然后再通知服务器，服务器再判断是否有效，无效的话就让客户端回滚操作
    
    ![1728283997657.webp](https://s3.zmingu.com/images/2025/04/4180725439.webp)
    
    ![1728284151655.webp](https://s3.zmingu.com/images/2025/04/3231520399.webp)
    
    ![1728284221213.webp](https://s3.zmingu.com/images/2025/04/3084860468.webp)
    
3. 什么是属性值：由基础值和当前值构成，当前值代表临时值
    
    ![1728284461598.webp](https://s3.zmingu.com/images/2025/04/3144320204.webp)
    

## 24.生命和魔法

1. AuraAttributeSet类添加构造函数
    1. 添加生命属性
    
    ```cpp
    public:
    	UAuraAttributeSet();
    	//获取生命周期中需要复制的属性
    	virtual void GetLifetimeReplicatedProps(TArray<class FLifetimeProperty>& OutLifetimeProps) const override;
    	
    	//该变量的值发生变化时，调用OnRep_Health函数
    	UPROPERTY(BlueprintReadOnly,ReplicatedUsing = OnRep_Health,Category = "Vital Attributes")
    	FGameplayAttributeData Health;
    
    	UPROPERTY(BlueprintReadOnly,ReplicatedUsing = OnRep_MaxHealth,Category = "Vital Attributes")
    	FGameplayAttributeData MaxHealth;
    	
    	UFUNCTION()
    	void OnRep_Health(const FGameplayAttributeData& OldHealth) const;
    
    	UFUNCTION()
    	void OnRep_MaxHealth(const FGameplayAttributeData& OldMaxHealth) const;
    ```
    
    ```cpp
    void UAuraAttributeSet::GetLifetimeReplicatedProps(TArray<class FLifetimeProperty>& OutLifetimeProps) const
    {
    	Super::GetLifetimeReplicatedProps(OutLifetimeProps);
    
    	//Health属性的复制条件为：COND_None,意味着不需要复制条件，只要属性发生变化就会复制，REPNOTIFY_Always表示属性发生变化时总是会调用OnRep_Health函数
    	DOREPLIFETIME_CONDITION_NOTIFY(UAuraAttributeSet, Health, COND_None, REPNOTIFY_Always);
    	DOREPLIFETIME_CONDITION_NOTIFY(UAuraAttributeSet, MaxHealth, COND_None, REPNOTIFY_Always);	
    }
    
    void UAuraAttributeSet::OnRep_Health(const FGameplayAttributeData& OldHealth) const
    {
    	// 这是一个辅助宏，可以在RepNotify函数中使用，以处理客户端可能会预测性修改的属性。
    	// OldHealth是属性变化之前的值，Health是变化之后的值,旧值用于回滚。
    	GAMEPLAYATTRIBUTE_REPNOTIFY(UAuraAttributeSet, Health, OldHealth);
    }
    
    void UAuraAttributeSet::OnRep_MaxHealth(const FGameplayAttributeData& OldMaxHealth) const
    {
    	GAMEPLAYATTRIBUTE_REPNOTIFY(UAuraAttributeSet, MaxHealth, OldMaxHealth);
    }
    ```
    
    1. 上面添加属性的步骤是模板步骤，继续添加魔法和最大魔法属性

## 25.属性访问器

1. 将.cpp中引入的ASC，剪切到.h中，因为要使用属性访问器
2. AS源代码中到底属性访问器宏的定义
    
    ```cpp
    /**
     * 这定义了一组用于访问和初始化属性的辅助函数，以避免手动编写这些函数。
     * 它会为属性 Health 创建如下函数：
     *
     *	static FGameplayAttribute UMyHealthSet::GetHealthAttribute();
     *	FORCEINLINE float UMyHealthSet::GetHealth() const;
     *	FORCEINLINE void UMyHealthSet::SetHealth(float NewVal);
     *	FORCEINLINE void UMyHealthSet::InitHealth(float NewVal);
     *
     * 在你的游戏中使用这些函数时，你可以这样定义，并根据需要添加游戏特定的函数：
     * 
     *	#define ATTRIBUTE_ACCESSORS(ClassName, PropertyName) \
     *	GAMEPLAYATTRIBUTE_PROPERTY_GETTER(ClassName, PropertyName) \
     *	GAMEPLAYATTRIBUTE_VALUE_GETTER(PropertyName) \
     *	GAMEPLAYATTRIBUTE_VALUE_SETTER(PropertyName) \
     *	GAMEPLAYATTRIBUTE_VALUE_INITTER(PropertyName)
     * 
     *	ATTRIBUTE_ACCESSORS(UMyHealthSet, Health)
     */
    ```
    
3. 在`AuraAttributeSet`中定义该宏，并在构造函数中调用InitHealth函数设置默认值
4. 验证修改：showdebug abilitysystem
5. 重复上面做法，将剩下属性也设置

## 26.效果Actor

1. 创建继承`Actor`的C++类，`AuraEffectActor`，目录public/Actor
    1. 删除tick函数，设置tick为false；
    2. 创建私有变量，球体组件Sphere
        1. 构造函数中为Sphere创建对象，并附加到根组件
    3. 创建私有变量，静态网格组件Mesh
        1. 构造函数总为Mesh创建对象，并设置为根组件。
    4. 创建公共函数，重写OnOverlap重叠函数
    5. BeginPlay中设置Sphere组件重叠委托，绑定为OnOverlap函数
    6. 创建公共函数，重写EndOverlap结束重叠函数。
    7. BeginPlay中设置Sphere组件结束重叠委托，绑定到EndOverlap函数
    8. 编写代码实现改变属性
        1. **Tip:**如何快速创建委托的回调函数呢，在蓝图中我们可以快速创建，并帮我们把参数设置好了。但在C++中，我们直接去Sphere->`OnComponentBeginOverlap`.AddDynamic，委托里面复制声明的委托参数，然后删掉不需要的委托变量名和不需要的逗号。
    
    ```cpp
    // Learn by Zmingu
    
    #pragma once
    
    #include "CoreMinimal.h"
    #include "GameFramework/Actor.h"
    #include "AuraEffectActor.generated.h"
    
    class USphereComponent;
    
    UCLASS()
    class AURA_API AAuraEffectActor : public AActor
    {
    	GENERATED_BODY()
    	
    public:	
    	AAuraEffectActor();
    
    	UFUNCTION()
    	virtual void OnOverlap(UPrimitiveComponent* OverlappedComponent, AActor* OtherActor, UPrimitiveComponent* OtherComp, int32 OtherBodyIndex, bool bFromSweep, const FHitResult& SweepResult);
    	UFUNCTION()
    	virtual void EndOverlap(UPrimitiveComponent* OverlappedComponent, AActor* OtherActor, UPrimitiveComponent* OtherComp, int32 OtherBodyIndex);
    	
    protected:
    	virtual void BeginPlay() override;
    
    private:
    	UPROPERTY(VisibleAnywhere)
    	TObjectPtr<UStaticMeshComponent> Mesh;
    	
    	UPROPERTY(VisibleAnywhere)
    	TObjectPtr<USphereComponent> Sphere;
    };
    
    ```
    
    ```cpp
    // Learn by Zmingu
    
    #include "Actor/AuraEffectActor.h"
    
    #include "AbilitySystemComponent.h"
    #include "AbilitySystemInterface.h"
    #include "AbilitySystem/AuraAttributeSet.h"
    #include "Components/SphereComponent.h"
    
    // Sets default values
    AAuraEffectActor::AAuraEffectActor()
    {
    	PrimaryActorTick.bCanEverTick = false;
    
    	Mesh = CreateDefaultSubobject<UStaticMeshComponent>("Mesh");
    	SetRootComponent(Mesh);
    	Sphere = CreateDefaultSubobject<USphereComponent>("Sphere");
    	Sphere->SetupAttachment(RootComponent);
    }
    
    void AAuraEffectActor::OnOverlap(UPrimitiveComponent* OverlappedComponent, AActor* OtherActor,
    	UPrimitiveComponent* OtherComp, int32 OtherBodyIndex, bool bFromSweep, const FHitResult& SweepResult)
    {
    	//T0D0: Change this to apply a Gameplay Effect. For now, using const_cast as a hack!
    	// 如果重叠的Actor实现了IAbilitySystemInterface接口
    	if (IAbilitySystemInterface* AbilitySystemInterface = Cast<IAbilitySystemInterface>(OtherActor))
    	{
    		const UAuraAttributeSet* AuraAttributeSet = Cast<UAuraAttributeSet>(AbilitySystemInterface->GetAbilitySystemComponent()->GetAttributeSet(UAuraAttributeSet::StaticClass()));
    		UAuraAttributeSet* MutableAttributeSet = const_cast<UAuraAttributeSet*>(AuraAttributeSet);
    		MutableAttributeSet->SetHealth(AuraAttributeSet->GetHealth() + 10.f);
    		Destroy();
    	}
    }
    
    void AAuraEffectActor::EndOverlap(UPrimitiveComponent* OverlappedComponent, AActor* OtherActor,
    	UPrimitiveComponent* OtherComp, int32 OtherBodyIndex)
    {
    }
    
    void AAuraEffectActor::BeginPlay()
    {
    	Super::BeginPlay();
    
    	Sphere->OnComponentBeginOverlap.AddDynamic(this, &AAuraEffectActor::OnOverlap);
    	Sphere->OnComponentEndOverlap.AddDynamic(this,&AAuraEffectActor::EndOverlap);
    }
    
    ```
    

# 五、RPG Game Ul

## 27.游戏UI框架

1. MVC架构，用一个类来获取数据并广播给UI

![1728394613692.webp](https://s3.zmingu.com/images/2025/04/2962214043.webp)

![1728394755923.webp](https://s3.zmingu.com/images/2025/04/3996809702.webp)

![1728394724045.webp](https://s3.zmingu.com/images/2025/04/966644747.webp)

## 28.Aura用户控件和控件控制器

1. 创建C++类，继承UserWidget，文件夹Public/UI/Widget，名为`AuraUserWidget`
2. 创建C++类，继承UObject，文件夹Public/UI/WidgetController，名为`AuraWidgetController`
3. 控件知道控制器，但是控制器不知道有哪些控件
4. 在`AuraUserWidget`创建公共UObject变量`WidgetController`，并创建一个可以在蓝图设置该变量的函数`SetWidgetControllen`。再创建保护的蓝图实现的WidgetControllerSet函数，在`SetWidgetControllen`中调用。
    
    ```cpp
    void UAuraUserWidget::SetWidgetController(UObject* InWidgetController)
    {
    	WidgetController = InWidgetController;
    	WidgetControllerSet();
    }
    //这个方法的作用是给WidgetController赋值
    ```
    
5. 在`AuraWidgetController`中创建四个变量，因为控件控制器需要到处拿数据
    
    ```cpp
    class AURA_API UAuraWidgetController : public UObject
    {
    	GENERATED_BODY()
    
    protected:
    	UPROPERTY(BlueprintReadOnly, Category = "Widget Controller")
    	TObjectPtr<APlayerController> PlayerController;
    
    	UPROPERTY(BlueprintReadOnly, Category = "Widget Controller")
    	TObjectPtr<APlayerState> PlayerState;
    
    	UPROPERTY(BlueprintReadOnly,Category = "Widget Controller")
    	TObjectPtr<UAbilitySystemComponent> AbilitySystemComponent;
    
    	UPROPERTY(BlueprintReadOnly, Category = "Widget Controller")
    	TObjectPtr<UAttributeSet> AttributeSet;
    };
    ```
    

## 29.球形进度条

1. 我们需要创建一个球形进度条父类，他的大小可以被子类重写，如何做呢
    1. 在目录`/Blueprints/UI/ProgressBar`中创建控件，继承`AuraUserWidget`，命名为`WBP_GlobeProgressBar`
    2. 设置大小为所需，添加`SizeBox`设置为变量并命名`SizeBox_Root`，宽高250，
    3. 创建浮点变量`BoxWidth`，`BoxHeight`默认值`250`
    4. 在预构造中设置`SizeBox`的高度，宽度覆盖。并折叠成函数`UpdateBoxSize`
2. 添加覆层`Overlay_Root`
3. 添加图像`Image_Background`,设置为水平垂直填充，设置为变量
    1. 创建`BackgroundBrush`变量，类型为Slate Brush，默认值为`GlobeRing`
    2. 创建分类`GlobeProperties`，将自己创建的变量移入
    3. 预构造中给图 片设置Brush，折叠成函数`UpdateBackgroundBrush`
4. 添加进度条`ProgressBar_Globe`，设置填满，设置为变量，设置Fill Image为`MI_HealthGlobe`，设置Draw As为`Image`，设置 Fill Color and opacity为`白色`
    1. 设置Background Image为透明
    2. 设置Bar Fill Type为`Bottom to Top`
    3. 预构造函数中设置进度条的样式，背景图像的Tint颜色为透明。填充图像Fill Image提升为变量 `ProgressBarFilllmage`，折叠成函数`UpdateGlobelmage`
    4. 预构造中设置进度条的Padding：需要调用`Slot as Overlay Slot`再调用`Set Padding` 。提升变量`GlobePadding`设置为10，折叠成函数`UpdateGlobePadding`
5. 球形进度条快为空的时候，球体的玻璃材质效果
    1. 拖入图片`Image_Glass`，设置填充，设置为变量
    2. 创建`Image_Glass`画刷变量，默认值为`MI_EmptyGlobe`，为`Image_Glass`设置上画笔
    3. 为`Image_Glass`设置边距，使用之前的边距
    4. 设置`Image_Glass`的透明度为0.5
    5. 折叠成函数`UpdateGlassBrush`，和 `UpdateGlassPadding`

## 30.生命球

1. 创建继承`WBP_GlobeProgressBar`的控件`WBP_HealthGlobe`，点击显示继承的变量
    
    ![1728487408157.webp](https://s3.zmingu.com/images/2025/04/3098868450.webp)
    
2. 找到球的图片，换成生命值的图片。
3. 在`UI/Overlay`下创建继承`AuraUserWidget`的控件`WBP_Overlay`
    1. 画布面板耗费比较高，添加画布面板
    2. 添加`WBP_HealthGlobe`，设置锚点为底部中心。
    3. 添加到视口看看效果。
    4. 为了能方便设置生命球的大小和样式，可以把这些变量暴露出来
4. 同样方法设置魔法球UI，并添加到`WBP_Overlay`中

## 31.Aura HUD

1. 创建`C++`类，继承`HUD`，位置`UI/HUD`，命名为`AuraHUD`
2. 将`WBP_Overlap`添加到视口
    1. 创建公共`TObjectPtr`的`UAuraUserWidget`类的变量，`OverlayWidget`
    2. 创建私有`TSubclassOfUAuraUserWidget`类变量，`OverlayWidgetClass`
    3. 重写BeginPlay函数。
        
        ```cpp
        UUserWidget* Widget = CreateWidget<UUserWidget>( owningObject:GetWorld(), 0verlayWidgetclass);
        Widget->AddToViewport();
        ```
        
    4. 创建`BP_AuraHud`蓝图类，细节面板设置`Overlay Widget Class`类，设置GM的HUD为该蓝图类

## 32.Overlay 控件控制器

> 一个继承与`UObject`的类，用来控制小部件，这个类中需要拿到`PC,PS,ASC,AS`等属性，这些属性弄在一个结构体里面，外部调用`SetWidgetControllerParams`函数并传入结构体来把这些属性设置到这个类中。该类作为父类，`OverlayWidgetController`为该类的子类。
> 
1. 在`AuraWidgetController`中创建结构体`FWidgetControllerParams`
    1. 创建默认构造函数，创建带四个参数的构造函数初始化列表，
    2. 创建公共蓝图可调用函数`SetWidgetControllerParams`，传入结构体，并将结构体中的值设置给类中的变量
        
        ```cpp
        void UAuraWidgetController::SetWidgetControllerParams(FWidgetControllerParams WCParams)
        {
        	PlayerController = WCParams.PlayerController;
        	PlayerState = WCParams.PlayerState;
        	AbilitySystemComponent = WCParams.AbilitySystemComponent;
        	AttributeSet = WCParams.AttributeSet;
        }
        
        ```
        
        ```cpp
        class UAttributeSet;
        class UAbilitySystemComponent;
        /**
         * 
         */
        USTRUCT(BlueprintType)
        struct FWidgetControllerParams
        {
        	GENERATED_BODY()
        
        	//结构体中的构造函数都需要声明并定义，空的构造函数也需要定义
        	FWidgetControllerParams(){};
        	//这是一个构造函数，用于初始化结构体的成员变量，这里的初始化是将所有的成员变量都初始化为nullptr
        	FWidgetControllerParams(APlayerController* PC, APlayerState* PS, UAbilitySystemComponent* ASC, UAttributeSet* AS): PlayerController(PC), PlayerState(PS), AbilitySystemComponent(ASC), AttributeSet(AS) {}
        
        	UPROPERTY(EditAnywhere,BlueprintReadWrite)
        	TObjectPtr<APlayerController> PlayerController = nullptr;
        
        	UPROPERTY(EditAnywhere,BlueprintReadWrite)
        	TObjectPtr<APlayerState> PlayerState = nullptr;
        
        	UPROPERTY(BlueprintReadWrite,BlueprintReadWrite)
        	TObjectPtr<UAbilitySystemComponent> AbilitySystemComponent = nullptr;
        
        	UPROPERTY(BlueprintReadWrite,BlueprintReadWrite)
        	TObjectPtr<UAttributeSet> AttributeSet = nullptr;
        	
        };
        
        UCLASS()
        class AURA_API UAuraWidgetController : public UObject
        {
        	GENERATED_BODY()
        public:
        	//这个函数用于将传入的结构体的成员变量赋值给当前类的成员变量
        	UFUNCTION(BlueprintCallable)
        	void SetWidgetControllerParams(FWidgetControllerParams WCParams);
        protected:
        	UPROPERTY(BlueprintReadOnly, Category = "Widget Controller")
        	TObjectPtr<APlayerController> PlayerController;
        
        	UPROPERTY(BlueprintReadOnly, Category = "Widget Controller")
        	TObjectPtr<APlayerState> PlayerState;
        
        	UPROPERTY(BlueprintReadOnly,Category = "Widget Controller")
        	TObjectPtr<UAbilitySystemComponent> AbilitySystemComponent;
        
        	UPROPERTY(BlueprintReadOnly, Category = "Widget Controller")
        	TObjectPtr<UAttributeSet> AttributeSet;
        };
        
        ```
        
2. 创建基于`AuraWidgetController`的`OverlayWidgetController`类,暂时没有逻辑.
3. 在`AuraHUD`类中得到UI控制器类:
    1. 声明UI控制器类指针
        
        ```cpp
        	TObjectPtr<UOverlayWidgetController> OverlayWidgetController;
        	//非 UProperty 对象成员可能会在垃圾收集期间被销毁，导致指针过时
        ```
        
    2. 声明UI控制器类
        
        ```jsx
        UPROPERTY(EditAnywhere)
        	TSubclassOf<UOverlayWidgetController> OverlayWidgetControllerClass;
        ```
        
    3. 在AuraHUD类中创建`GetOverlayWidgetController`函数，传入参数为结构体`FWidgetControllerParam`，用于初始化UI控制器中的PC,PS,ASC和AS属性.
        
        ```cpp
        UOverlayWidgetController* AAuraHUD::GetOverlayWidgetController(const FWidgetControllerParams WCParams)
        {
        	if(OverlayWidgetController  == nullptr)
        	{
        		OverlayWidgetController = NewObject<UOverlayWidgetController>(this, OverlayWidgetControllerClass);
        		OverlayWidgetController->SetWidgetControllerParams(WCParams);
        		return OverlayWidgetController;
        	}
        	return OverlayWidgetController;
        }
        ```
        
    4. 删除`BeginPlayer`函数, 创建`InitOverLay`函数
        
        ```cpp
        void InitOverlay(APlayerController* PC, APlayerState* PS, UAbilitySystemComponent* ASC, UAttributeSet* AS); //初始化UI控制器和UI
        ```
        
        ```cpp
        void AAuraHUD::InitOverlay(APlayerController* PC, APlayerState* PS, UAbilitySystemComponent* ASC, UAttributeSet* AS)
        {
        	checkf(OverlayWidgetClass,TEXT("Overlay Widget class uninitialized, please fill out BP_AuraHuD"));
        	checkf(OverlayWidgetControllerClass,TEXT("Overlay Widget Controller class uninitialized, please fill out BP_AuraHUD"));
        	
        	UUserWidget* Widget = CreateWidget<UUserWidget>(GetWorld(), OverlayWidgetClass);//将创建的UI转换为UAuraUserWidget
        	OverlayWidget = Cast<UAuraUserWidget>(Widget);
        	
        	const FWidgetControllerParams WidgetControllerParams(PC,PS,ASC,AS);//创建一个结构体，用于传递给UI控制器
        	UOverlayWidgetController* WidgetController = GetOverlayWidgetController(WidgetControllerParams);//获取UI控制器
        	OverlayWidget->SetWidgetController(WidgetController);//为UI设置UI控制器
        	
        	Widget->AddToViewport();
        }
        
        ```
        
4. 什么时候调用`InitOverlay`函数呢, PC, PS, ASC, AS确保这些都初始化, 并确保服务端和客户端
    1. `AuraCharacter`中的`InitAbilityActorInfo`中设置, 要拿到HUD就要用玩家控制器
        
        ```cpp
        if (AAuraPlayerController* AuraPlayerController = Cast<AAuraPlayerController>(GetController()))
        	{
        		if (AAuraHUD* AuraHUD = Cast<AAuraHUD>(AuraPlayerController->GetHUD()))
        		{
        			AuraHUD->InitOverlay(AuraPlayerController,AuraPlayerState,AbilitySystemComponent,AttributeSet);
        		}
        	}
        ```
        
5. 小插曲: Aura玩家控制器中的check(Subsystem);也许需要考虑多人游戏

## 33.Broadcasting Initial Values

1. 在父类UI控制器`AuraWidgetController`中创建虚函数`BroadcastInitialValues()`用来广播初始值，并定义为空函数。
    
    ```cpp
    public:
    	virtual void BroadcastInitialValues();//用来广播初始值
    ```
    
    ```cpp
    void UAuraWidgetController::BroadcastInitialValues()
    {
    	//在父类中没有实现任何功能，所以这个函数是空的，需要在子类中实现
    }
    ```
    
2. 在子类UI控制器`OverlayWidgetController`中重写该函数，并创建两个动态多播委托，在`BroadcastInitialValues(`)函数中广播从AS中获得的生命值和最大生命值。接下来考虑在哪里绑定这两个委托。
    
    ```cpp
    public:
    	virtual void BroadcastInitialValues() override;
    
    	UPROPERTY(BlueprintAssignable,Category = "GAS|Attributes")
    	FOnHealthChangedSignature OnHealthChanged;
    
    	UPROPERTY(BlueprintAssignable,Category = "GAS|Attributes")
    	FOnMaxHealthChangedSignature OnMaxHealthChanged;
    
    ```
    
    ```cpp
    void UOverlayWidgetController::BroadcastInitialValues()
    {
    	UAuraAttributeSet* AuraAttributeSet = CastChecked<UAuraAttributeSet>(AttributeSet);
    
    	OnHealthChanged.Broadcast(AuraAttributeSet->GetHealth());
    	OnMaxHealthChanged.Broadcast(AuraAttributeSet->GetMaxHealth());
    }
    ```
    
3. 为生命值UI，法力值UI设置上UI控制器
    1. 在`WBP_Overlay`蓝图类中，为两个子UI生命球和法力值球设置UI控制器。
        
        ![image.webp](https://s3.zmingu.com/images/2025/04/1381232071.webp)
        
    2. 将`UOverlayWidgetController`类设置为蓝图可访问和蓝图类型，这是为了使生命值球UI中的UI控制器能够转换成`OverlayWidgetController`控制器，这样才能绑定到委托，但是我们希望能在蓝图中处理绑定的事件。
        
        ```cpp
        **UCLASS(BlueprintType, Blueprintable)**
        class AURA_API UOverlayWidgetController : public UAuraWidgetController
        {
        	......
        }
        ```
        
4. 我们干脆创建`/Blueprint/UI/WidgetController`文件夹，创建继承`OverlayWidgetController`的`BP_OverlayWidgetController`，并在`BP_HUD`中设置`OverlayWidgetControllerClass`为该蓝图类
5. 回到生命值球UI蓝图中，拿到父类为自己设置的UI控制器，转换成子控制器后同时绑定回调事件，拿到新的生命值和最大生命值
    
    ![[image 1.webp](https://s3.zmingu.com/images/2025/04/1105633700.webp)
    
6. 在生命值UI父类创建为进度条设置百分比的函数`Set Progress Bar Percent`
    
    !![image 2.png](https://s3.zmingu.com/images/2025/04/502397412.png)
    
7. 在生命值球UI中为生命值和最大生命值设置百分比
    
    ![image 3.webp](https://s3.zmingu.com/images/2025/04/1167587179.webp)
    
8. 运行游戏查看效果，控制台输入showdebug abilitysystem，查看数值是否正确
9. 优化蓝图
    
    ![image 4.webp](https://s3.zmingu.com/images/2025/04/24212048.webp)
    

## 34.Listening for Attribute Changes

1. 现在考虑属性变化的监听，GAS自带一个属性变化：AbilitySystemComponent->GetGameplayAttributeValueChangeDelegat
2. 在UI控制器父类创建绑定回调函数的函数，并生成空定义。
    
    ```cpp
    virtual void BindCallbacksToDependencies();//用来绑定回调函数到依赖项
    ```
    
3. 在子类UI控制器中实现该函数。
    1. 新建两个回调函数，该函数的参数需要特定，因为要被GAS中的xx绑定
    2. 在依赖函数中添加绑定
    3. 在绑定的回调函数中广播新的变化值
    4. 修改`AuraAttributeSet`类中的初始生命值为50，运行捡起生命药水查看效果
4. 任务
    
    绑定回调
    1.调用 BindCallbacksToDependencies()
    
    2.这应该在哪里调用?
    3.进行测试。捡起一个生命药水
    
5. 在HUD获取UI控制器的地方调用绑定回调的函数 BindCallbacksToDependencies
    
    ```cpp
    UOverlayWidgetController* AAuraHUD::GetOverlayWidgetController(const FWidgetControllerParams WCParams)
    {
    	if(OverlayWidgetController  == nullptr)
    	{
    		OverlayWidgetController = NewObject<UOverlayWidgetController>(this, OverlayWidgetControllerClass);
    		OverlayWidgetController->SetWidgetControllerParams(WCParams);
    		**OverlayWidgetController->BindCallbacksToDependencies();**
    		return OverlayWidgetController;
    	}
    	return OverlayWidgetController;
    }
    ```
    
6. 运行游戏，捡起药水查看UI变化
7. 控制台输入ShowDebug abilitysystem查看数值变化

## 35.Callbacks for Mana Changes

1. 任务
    1. 法力值变化的回调
    1.创建回调函数
    2.绑定回调程序
    3.更改效果Actor，使其从法力中扣除
    4.测试游戏。
2. 用生命值回顾下流程，GAS中的AS属性变化时，自带一个委托，用来绑定回调函数
    1. `AbilitySystemComponent->GetGameplayAttributeValueChangeDelegate(该AS属性)`从该属性中获得委托，`.AddUObject(this,&UOverlayWidgetController::HealthChanged)`，绑定`HealthChanged()`回调函数，`HealthChanged()`函数广播我们自己创建的委托`OnHealthChanged.Broadcast(Data.NewValue)`然后我们在UI中绑定我们创建的委托，所以每次AS属性变化时，我们的UI就能拿到变化后的值`NewValue`
3. 所以我们先创建两个回调函数，给GAS自带的委托绑定
    
    ```cpp
    void ManaChanged(const FOnAttributeChangeData& Data) const;
    void MaxManaChanged(const FOnAttributeChangeData& Data) const;
    	
    void UOverlayWidgetController::ManaChanged(const FOnAttributeChangeData& Data) const
    {
    	
    }
    
    void UOverlayWidgetController::MaxManaChanged(const FOnAttributeChangeData& Data) const
    {
    	
    }
    ```
    
4. 给GAS自带的委托绑定上回调函数
    
    ```cpp
    void UOverlayWidgetController::BindCallbacksToDependencies()
    {
    	UAuraAttributeSet* AuraAttributeSet = CastChecked<UAuraAttributeSet>(AttributeSet);
    
    	AbilitySystemComponent->GetGameplayAttributeValueChangeDelegate(AuraAttributeSet->GetHealthAttribute())
    	.AddUObject(this,&UOverlayWidgetController::HealthChanged);
    
    	AbilitySystemComponent->GetGameplayAttributeValueChangeDelegate(AuraAttributeSet->GetMaxHealthAttribute())
    	.AddUObject(this,&UOverlayWidgetController::MaxHealthChanged);
    
    	**AbilitySystemComponent->GetGameplayAttributeValueChangeDelegate(AuraAttributeSet->GetManaAttribute())
    	.AddUObject(this,&UOverlayWidgetController::ManaChanged);
    
    	AbilitySystemComponent->GetGameplayAttributeValueChangeDelegate(AuraAttributeSet->GetMaxManaAttribute())
    	.AddUObject(this,&UOverlayWidgetController::MaxManaChanged);**
    }
    ```
    
5. 然后自定义两个动态多播委托，用来把改变后的数据传递给UI
    
    ```cpp
    DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FOnManaChangedSignature,float,NewMana);
    DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FOnMaxManaChangedSignature,float,NewMana);
    
    public:
    	UPROPERTY(BlueprintAssignable,Category = "GAS|Attributes")
    	FOnManaChangedSignature OnManaChanged;
    
    	UPROPERTY(BlueprintAssignable,Category = "GAS|Attributes")
    	FOnMaxManaChangedSignature OnMaxManaChanged;
    	
    	
    void UOverlayWidgetController::ManaChanged(const FOnAttributeChangeData& Data) const
    {
    	OnManaChanged.Broadcast(Data.NewValue);
    }
    
    void UOverlayWidgetController::MaxManaChanged(const FOnAttributeChangeData& Data) const
    {
    	OnMaxHealthChanged.Broadcast(Data.NewValue);
    }
    ```
    
6. 现在AS属性改变的时候，会调用ManaChanged函数，该函数把AS改变后的属性值通过`OnManaChanged`委托广播出去了。接下来就是去UI中绑定这个委托。
7. 在去UI中绑定委托前，别忘了法力值的初始值的广播
    
    ```cpp
    void UOverlayWidgetController::BroadcastInitialValues()
    {
    	UAuraAttributeSet* AuraAttributeSet = CastChecked<UAuraAttributeSet>(AttributeSet);
    
    	OnHealthChanged.Broadcast(AuraAttributeSet->GetHealth());
    	OnMaxHealthChanged.Broadcast(AuraAttributeSet->GetMaxHealth());
    
    	**OnManaChanged.Broadcast(AuraAttributeSet->GetMana());
    	OnMaxManaChanged.Broadcast(AuraAttributeSet->GetMaxMana());**
    }
    ```
    
8. 我们将之前用到的血瓶改点参数用来测试法力值的改变是否生效
    1. 在AuraEffectActor类中，临时修改重叠事件中测试用的数据
        
        ```cpp
        void AAuraEffectActor::OnOverlap(UPrimitiveComponent* OverlappedComponent, AActor* OtherActor,
        	UPrimitiveComponent* OtherComp, int32 OtherBodyIndex, bool bFromSweep, const FHitResult& SweepResult)
        {
        	//T0D0: Change this to apply a Gameplay Effect. For now, using const_cast as a hack!
        	// 如果重叠的Actor实现了IAbilitySystemInterface接口
        	if (IAbilitySystemInterface* AbilitySystemInterface = Cast<IAbilitySystemInterface>(OtherActor))
        	{
        		const UAuraAttributeSet* AuraAttributeSet = Cast<UAuraAttributeSet>(AbilitySystemInterface->GetAbilitySystemComponent()->GetAttributeSet(UAuraAttributeSet::StaticClass()));
        		UAuraAttributeSet* MutableAttributeSet = const_cast<UAuraAttributeSet*>(AuraAttributeSet);
        		MutableAttributeSet->SetHealth(AuraAttributeSet->GetHealth() + 10.f);
        		MutableAttributeSet->SetMana(AuraAttributeSet->GetMana() - 25.f);
        		Destroy();
        	}
        }
        ```
        

## 36.Gameplay Effects

1. 开始涉及GE（游戏效果），GE用来改变AS（属性）和Tag（标签）
    
    ![image 5.webp](https://s3.zmingu.com/images/2025/04/521909512.webp)
    
2. GE只是数据，不涉及逻辑
3. GE没有子类，而是创建继承GE的蓝图类
4. GE通过修饰符`Modifiers`和执行`Executions`来调整属性
    1. `Modifiers`
        1. 修饰符包括`Add`，`Multiply`，`Divide`，`Override`（加减乘除覆盖）
        2. 修饰符操作值，这个值称为幅度`Magnitude`，对幅度进行减乘除后就是对属性修改的结果
        3. 幅度可以是很多种值，比如幅度计算类型`Magnitude Calculation Type`包括
            1. `Scalable Float`可伸缩的浮点值
            2. `Arrtibute Based`另一个属性的基础值（比如你打了我一拳，我扣的血的值是你的力量值）
            3. `Custom Calculation Class (MMC)`自定义计算类，专门拿一个类来计算
            4. Set by Caller
            5. 甚至可以用一个GE的等级表来修改属性，GE拥有等级（比如GE等级越高，扣的血越多）
    2. `Executions`
        1. 先空着，没看懂
5. GE生效方式之时间间隔有三种方式
    
    ![[image 6.webp](https://s3.zmingu.com/images/2025/04/525867450.webp)
    
    1. 生效一下就消失
    2. 生效一段时间后消失
    3. 生效后不消失（除非通过其他手段
6. GE可以叠加，通过Tag或给予能力
7. GE的规范

## 37.Effect Actor Improved

1. 之前的`AuraEffectActor`代码中对属性的修改是临时的，我们从这里开始修改
2. 删除网格体，重叠事件相关代码。
    
    ```cpp
    // Learn by Zmingu
    #pragma once
    
    #include "CoreMinimal.h"
    #include "GameFramework/Actor.h"
    #include "AuraEffectActor.generated.h"
    
    ~~class USphereComponent;~~
    
    UCLASS()
    class AURA_API AAuraEffectActor : public AActor
    {
    	GENERATED_BODY()
    	
    public:	
    	AAuraEffectActor();
    
    	~~UFUNCTION()
    	virtual void OnOverlap(UPrimitiveComponent* OverlappedComponent, AActor* OtherActor, UPrimitiveComponent* OtherComp, int32 OtherBodyIndex, bool bFromSweep, const FHitResult& SweepResult);
    	UFUNCTION()
    	virtual void EndOverlap(UPrimitiveComponent* OverlappedComponent, AActor* OtherActor, UPrimitiveComponent* OtherComp, int32 OtherBodyIndex);~~
    	
    protected:
    	virtual void BeginPlay() override;
    
    private:
    	~~UPROPERTY(VisibleAnywhere)
    	TObjectPtr<UStaticMeshComponent> Mesh;
    	
    	UPROPERTY(VisibleAnywhere)
    	TObjectPtr<USphereComponent> Sphere;~~
    };
    
    ```
    
    ```cpp
    // Learn by Zmingu
    
    #include "Actor/AuraEffectActor.h"
    
    ~~#include "AbilitySystemComponent.h"
    #include "AbilitySystemInterface.h"
    #include "AbilitySystem/AuraAttributeSet.h"
    #include "Components/SphereComponent.h"~~
    
    // Sets default values
    AAuraEffectActor::AAuraEffectActor()
    {
    	PrimaryActorTick.bCanEverTick = false;
    
    	~~Mesh = CreateDefaultSubobject<UStaticMeshComponent>("Mesh");
    	SetRootComponent(Mesh);
    	Sphere = CreateDefaultSubobject<USphereComponent>("Sphere");
    	Sphere->SetupAttachment(RootComponent);~~
    }
    
    ~~void AAuraEffectActor::OnOverlap(UPrimitiveComponent* OverlappedComponent, AActor* OtherActor,
    	UPrimitiveComponent* OtherComp, int32 OtherBodyIndex, bool bFromSweep, const FHitResult& SweepResult)
    {
    	//T0D0: Change this to apply a Gameplay Effect. For now, using const_cast as a hack!
    	// 如果重叠的Actor实现了IAbilitySystemInterface接口
    	if (IAbilitySystemInterface* AbilitySystemInterface = Cast<IAbilitySystemInterface>(OtherActor))
    	{
    		const UAuraAttributeSet* AuraAttributeSet = Cast<UAuraAttributeSet>(AbilitySystemInterface->GetAbilitySystemComponent()->GetAttributeSet(UAuraAttributeSet::StaticClass()));
    		UAuraAttributeSet* MutableAttributeSet = const_cast<UAuraAttributeSet*>(AuraAttributeSet);//临时强制修改const属性
    		MutableAttributeSet->SetHealth(AuraAttributeSet->GetHealth() + 10.f);
    		MutableAttributeSet->SetMana(AuraAttributeSet->GetMana() - 25.f);
    		Destroy();
    	}
    }
    
    void AAuraEffectActor::EndOverlap(UPrimitiveComponent* OverlappedComponent, AActor* OtherActor,
    	UPrimitiveComponent* OtherComp, int32 OtherBodyIndex)
    {
    }~~
    
    void AAuraEffectActor::BeginPlay()
    {
    	Super::BeginPlay();
    
    	~~Sphere->OnComponentBeginOverlap.AddDynamic(this, &AAuraEffectActor::OnOverlap);
    	Sphere->OnComponentEndOverlap.AddDynamic(this,&AAuraEffectActor::EndOverlap);~~
    }
    
    ```
    
3. C++类中创建场景组件设置为根组件
    
    ```cpp
    //.h
    
    //.cpp
    AAuraEffectActor::AAuraEffectActor()
    {
    	PrimaryActorTick.bCanEverTick = false;
    
    	SetRootComponent(CreateDefaultSubobject<USceneComponent>(TEXT("RootComponent")));
    }
    ```
    
4. 蓝图类中添加网格体，设置上生命药水SM_PotionBottle，网格体设置整体缩放为0.2，碰撞预设为无碰撞，
5. 添加球体碰撞，实现重叠事件（上面这些操作相当于把C++的逻辑弄到蓝图里，方便设计师操作一些蓝图
6. 在C++类中声明GE类变量和应用GE的函数
    1. 声明GE类变量和应用GE的函数
        
        ```cpp
        	protected:
        	UPROPERTY(EditAnywhere,Category = "Applied Effects")
        	TSubclassOf<UGameplayEffect> InstantGameplayEffectClass;
        
        	UFUNCTION(BlueprintCallable, Category = "Applied Effects")
        	void ApplyEffectToTarget(AActor* Target, TSubclassOf<UGameplayEffect> GameplayEffectClass);
        ```
        
    2. 应用GE的函数中，先要拿到目标的ASC组件，有两种方法，1是通过该Actor实现的接口获取，2是通**过GAS的全局蓝图函数库获取**
        
        ```cpp
         	~~//第二种的原理其实和第一种一样，做了个封装
        	IAbilitySystemInterface* ASCInterface = Cast<IAbilitySystemInterface>(Target);if(ASCInterface)
        	ASCInterface->GetAbilitySystemComponent();~~
        	UAbilitySystemBlueprintLibrary::GetAbilitySystemComponent(Target);
        ```
        
    3. ASC组件中有应用效果的一些方法，但使用这些方法前我们要去看下他需要的参数
        
        ![image 7.webp](https://s3.zmingu.com/images/2025/04/3494492183.webp)
        
        d.最终代码解析
        
        ```cpp
        void AAuraEffectActor::ApplyEffectToTarget(AActor* Target, TSubclassOf<UGameplayEffect> GameplayEffectClass)
        {
        	UAbilitySystemComponent* TargetASC = UAbilitySystemBlueprintLibrary::GetAbilitySystemComponent(Target);
        	if (TargetASC == nullptr) return;//如果目标没有ASC,直接返回
        
        	check(GameplayEffectClass);
        	// 1. 创建GE上下文
        	FGameplayEffectContextHandle GEContextHandle = TargetASC->MakeEffectContext();
        	// 2. 添加源对象（效果的施放者）
        	GEContextHandle.AddSourceObject(this);
        	// 3. 创建GE规格（Spec）
        	FGameplayEffectSpecHandle GESpecHandle = TargetASC->MakeOutgoingSpec(GameplayEffectClass,1.f,GEContextHandle);//创建GE规格（Spec）
        	// 4. 将GE应用到目标自己身上
        	TargetASC->ApplyGameplayEffectSpecToSelf(*GESpecHandle.Data.Get());
        }
        ```
        
7. `MakeEffectContext()`创建一个新的游戏效果上下文包含了效果产生时的相关信息，比如：
    - 效果的来源（Source）
    - 目标（Target）
    - 触发效果时的位置
    - 其他相关数据
    - 返回一个 `FGameplayEffectContextHandle`，这是一个智能指针包装器
- **`GEContextHandle.AddSourceObject(this);`**
    - `AddSourceObject` 设置效果的来源对象
    - `this` 指向当前的 `AuraEffectActor`
    - 这告诉系统这个效果是由谁产生的
    - 对于伤害追踪、效果可视化等很重要
- `TargetASC->**MakeOutgoingSpec(GameplayEffectClass, 1.f, GEContextHandle);**`
    - 创建一个`GameplayEffect`的具体实例（`Spec`）
    - 参数解析：
        - `GameplayEffectClass`: 要应用的效果类型
        - 1.f: 效果等级（Level），影响效果强度
        - `GEContextHandle`: 前面创建的上下文
    - 返回一个 `FGameplayEffectSpecHandle`（智能指针包装器）
    - `Spec`包含了效果的所有具体信息：
        - 效果类型
        - 等级
        - 修改器
        - 持续时间
        - 堆叠规则等
- **`TargetASC->ApplyGameplayEffectSpecToSelf(*GESpecHandle.Data.Get());`**
    - 将创建好的效果实际应用到目标身上
    - `GESpecHandle.Data.Get()` 获取原始指针
    - 解引用获取实际的 Spec
    - `ApplyGameplayEffectSpecToSelf` 将效果应用到拥有这个ASC的角色上
    - 这会触发：
        - 属性修改
        - 效果应用事件
        - 网络复制（如果需要）
        - 相关的游戏逻辑
1. 应用GE流程总结
    - 创建上下文（记录效果产生的环境信息）
    - 设置效果来源（谁产生的效果）
    - 创建效果规格（具体的效果实例）
    - 将效果应用到目标
    - 这是UE的GameplayAbility系统中标准的效果应用流程，确保了效果应用的可预测性、可复制性和可扩展性

## 38.Instant Gameplay Effects

1. 回到`BP_HealthPotion`蓝图类
2. 添加球体碰撞开始重叠事件，调用刚刚父类中写的应用GE到目标的函数
3. 新建GE类`GE_PotionHeal` 继承GE基类，放在`/Blueprints/Actor/Potion`目录下，把刚刚的生命药水蓝图也放进来
4. 设置GE类`GE_PotionHeal` 
    
    ![image 8.webp](https://s3.zmingu.com/images/2025/04/2498883566.webp)
    
5. 给药水蓝图设置GE类和调用
    1. 回到C++类`AAuraEffectActor`将`InstantGameplayEffectClass`变量设置为蓝图可读
    2. 将`ApplyEffectToTarget`函数的形参`Target`改为`TargetActor`，避免和蓝图中调用的函数的Target混淆
6. 在蓝图将`InstantGameplayEffectClass`类默认值设置为`GE_PotionHeal` 
7. 任务：制作魔法药水，略
    
    ![image 9.webp](https://s3.zmingu.com/images/2025/04/390172018.webp)
    

## 39.Duration Gameplay Effects

1. 在蓝图中实现应用GE（学习用，后面还是用之前的实现方法
    
    ![image 10.webp](https://s3.zmingu.com/images/2025/04/1980848465.webp)
    
2. 任务：做一个持续两秒增加最大生命值的水晶球
    
    ![image 11.webp](https://s3.zmingu.com/images/2025/04/2942270856.webp)
    
    1. `AAuraEffectActor`类中新声明一个用于有作用间隔的GE类变量
        
        ```cpp
        UPROPERTY(EditAnywhere,BlueprintReadOnly,Category = "Applied Effects")
        	TSubclassOf<UGameplayEffect> DurationGameplayEffectClass;
        ```
        
    2. 创建并设置`GE_CrystalHealth`
        
        ![image 12.webp](https://s3.zmingu.com/images/2025/04/3465380278.webp)
        
    3. 其他和之前设置的一样，略，最后测试

## 40.Periodic Gameplay Effects

1. 1
    
    ![image 13.webp](https://s3.zmingu.com/images/2025/04/3443114265.webp)
    
    ![image 14.webp](https://s3.zmingu.com/images/2025/04/1000407515.webp)
    
    ![image 15.webp](https://s3.zmingu.com/images/2025/04/390659230.webp)
    
2. 修改生命水晶，使其可以周期性缓慢增加生命值
    1. 这样设置意思每0.1秒增加1，增加2秒
        
        ![image 16.webp](https://s3.zmingu.com/images/2025/04/1947200719.webp)
        
3. 任务：创建持续增加法力值的法力水晶，略
    
    ![image 17.webp](https://s3.zmingu.com/images/2025/04/1703391335.webp)
    
    ![image 18.webp](https://s3.zmingu.com/images/2025/04/4192784714.webp)
    

## 41.Effect Stacking

1. 介绍堆叠
    1. 按来源堆叠
    
    ![image 19.webp](https://s3.zmingu.com/images/2025/04/1791639909.webp)
    
    1. 按目标堆叠
    
    ![image 20.webp](https://s3.zmingu.com/images/2025/04/3038750999.webp)
    
2. **`Stacking Type（堆叠类型）`**
    - **None - 不堆叠 -**
        1. **新效果会替换旧效果 - 重置持续时间**
    - **AggregateBySource - 按来源堆叠**
        - **同一个来源的效果会堆叠**
        - **不同来源的效果分别计算**
        - **例：玩家A的DOT和玩家B的DOT分别堆叠**
    - **3. AggregateByTarget - 按目标堆叠**
        - **不管来源是谁，效果都会堆叠**
        - **例：多个玩家的DOT效果会在目标身上合并堆叠**
3. `Stack Limit Count（堆叠数量限制）`
    - 设置最大可堆叠层数
    - 0 = 无限制
    - 正整数 = 最大堆叠层数
    - 达到限制后的行为`取决于其他堆叠策略`
4. `Stack Duration Refresh Policy（持续时间刷新策略）`
    1. `Refresh on Successful Applicatio`n - 成功应用时刷新
        - 新效果成功应用时刷新持续时间
        - 最常用的选项
    2. `Never Refresh` - 从不刷新
        - 持续时间保持不变
        - 适用于需要精确计时的效果
5. `Stack Period Reset Policy（周期重置策略）`
    1. `Reset on Successful Application` - 成功应用时重置
        - 当新效果应用时重置周期计时
        - 适用于周期性效果（如DOT）
    2. `Never Reset` - 从不重置
        - 保持原有周期
        - 适用于需要固定周期的效果
6. `Stack Expiration Policy（过期策略）`
    1. `ClearEntireStack - 清除整个堆叠`
        - 当一个效果过期时，移除所有堆叠层数
        - 适用于"全有或全无"的效果
    2. `RemoveSingleStackAndRefreshDuration - 移除单层并刷新持续时间`
        - 每次只移除一层堆叠
        - 刷新剩余堆叠的持续时间
        - 适用于需要逐层衰减的效果
- 按视频设置：
    
    !![image 21.png](https://s3.zmingu.com/images/2025/04/638030667.png)
    
- 按视频设置的结果

连续捡起3个的效果过程：

1. 捡起第一个：

```
- 效果成功应用
- 堆叠数：1
- 开始计时（假设持续时间为10秒）
```

1. 捡起第二个（比如2秒后）：

```
- 由于 Stack Limit Count = 1，不会增加新的堆叠
- 但因为 Duration Refresh = 成功应用时刷新，所以：
  - 持续时间重置为新的10秒
- 如果有周期性效果，也会重置周期计时
```

1. 捡起第三个（比如再过2秒）：

```
- 同第二个的效果
- 再次刷新持续时间为新的10秒
- 再次重置周期计时
```

总结效果：

1. 始终只会有一层效果（因为 Stack Limit Count = 1）
2. 每次捡起都会刷新持续时间
3. 不会叠加效果强度
4. 当持续时间结束时，效果完全消失

这种配置适用于：

- 不需要堆叠的增益/减益效果
- 希望可以刷新持续时间的效果
- 例如：速度提升、护盾效果等

## 42.Infinite Gameplay Effects

1. 将之前的水晶放到新的文件夹`Crystal`
2. 新建Area目录，新建`BP_FireArea`继承AuraE类
    1. 添加碰撞盒
    2. 添加奶瓜粒子，设置火特效
3. 在GEActor类中新建永久应用的GE变量类`InfiniteGameplayEffectClass`
    
    ```cpp
    UPROPERTY(EditAnywhere,BlueprintReadOnly,Category = "Applied Effects")
    	TSubclassOf<UGameplayEffect> InfiniteGameplayEffectClass;
    ```
    
4. 在工目录创建`GE_FireArea，`设置类型为无限`Infinite`，设置周期每秒扣五滴血
5. 按照之前方法实现碰到火应用GE
6. 来到`AuraEffectActor`类中
    1. 声明枚举变量特效应用配置`EEffectApplicationPolicy`，并声明三个三种GE类型的枚举变量并设置上默认值。
        
        ```cpp
        UENUM(BlueprintType)
        enum class EEffectApplicationPolicy//使用enum class的好处是可以避免命名冲突和类型安全
        {
        	ApplyOnOverlap,
        	ApplyOnEndOverlap,
        	DoNotApply
        };
        
        UPROPERTY(EditAnywhere,BlueprintReadOnly,Category = "Applied Effects")
        	EEffectApplicationPolicy InstantEffectApplicationPolicy = EEffectApplicationPolicy::DoNotApply;
        
        	UPROPERTY(EditAnywhere,BlueprintReadOnly,Category = "Applied Effects")
        	EEffectApplicationPolicy DurationEffectApplicationPolicy = EEffectApplicationPolicy::DoNotApply;
        
        	UPROPERTY(EditAnywhere,BlueprintReadOnly,Category = "Applied Effects")
        	EEffectApplicationPolicy InfiniteEffectApplicationPolicy = EEffectApplicationPolicy::DoNotApply;
        ```
        
    2. 新建枚举变量特效移除配置`EEffectRemovalPolicy`，并只需要创建`无限类型`的GE枚举变量（因为其他两种会自动移除，并设置上默认值。
        
        ```cpp
        UENUM(BlueprintType)
        enum class EEffectRemovalPolicy
        {
        	RemoveOnEndOverlap,
        	DoNotRemove
        };
        
        UPROPERTY(EditAnywhere,BlueprintReadOnly,Category = "Applied Effects")
        	EEffectRemovalPolicy InfiniteEffectRemovalPolicy = EEffectRemovalPolicy::RemoveOnEndOverlap;
        ```
        
    3. 创建布尔变量`bDestroyOnEffectRemoval`默认值为false
    4. 创建开始重叠和结束重叠函数 
    
    ```cpp
    UFUNCTION(BlueprintCallable)
    	void OnOverlap(AActor* TargetActor);
    	
    	UFUNCTION(BlueprintCallable)
    	void OnEndOverlap(AActor* TargetActor);
    ```
    

## 43.Instant and Duration Application Policy

1. 编写开始重叠和结束重叠时判断即时GE和持续GE应用的策略
    
    ```cpp
    void AAuraEffectActor::OnOverlap(AActor* TargetActor)
    {
    	InstantEffectApplicationPolicy == EEffectApplicationPolicy::ApplyOnOverlap ? ApplyEffectToTarget(TargetActor,InstantGameplayEffectClass) : nullptr;
    	DurationEffectApplicationPolicy == EEffectApplicationPolicy::ApplyOnOverlap ? ApplyEffectToTarget(TargetActor,DurationGameplayEffectClass) : nullptr;
    }
    
    void AAuraEffectActor::OnEnd0verlap(AActor* TargetActor)
    {
    	InstantEffectApplicationPolicy == EEffectApplicationPolicy::ApplyOnEndOverlap ? ApplyEffectToTarget(TargetActor,InstantGameplayEffectClass) : nullptr;
    	DurationEffectApplicationPolicy == EEffectApplicationPolicy::ApplyOnEndOverlap ? ApplyEffectToTarget(TargetActor,DurationGameplayEffectClass) : nullptr;
    }
    ```
    

## 44.Infinite Effect Application and Removal

1. `TargetASC->ApplyGameplayEffectSpecToSelf`这个函数会返回`GE句柄`
2. 当应用了无限的GE时，我们需要存起来，同时存储这个`GE`对应的`Actor`，使两者对应起来，方便在应用多个无限GE时能准确的移除
    1. 在`ApplyEffectToTarget`函数中拿到`ActiveEffectHandle`激活的GE句柄，这是由`TargetASC->ApplyGameplayEffectSpecToSelf(*GESpecHandle.Data.Get());`返回的
        
        ```cpp
        FActiveGameplayEffectHandle ActiveGEHandle = TargetASC->ApplyGameplayEffectSpecToSelf(*GESpecHandle.Data.Get());
        ```
        
    2. 然后判断该应用的`GE是不是无限的`，`是不是需要在结束重叠移除的`，是的话需要存起来
        
        ```cpp
        // 4. 将GE应用到目标自己身上
        	FActiveGameplayEffectHandle ActiveGEHandle = TargetASC->ApplyGameplayEffectSpecToSelf(*GESpecHandle.Data.Get());
        
        	bool bIsInfinite = GESpecHandle.Data.Get()->Def.Get()->DurationPolicy == EGameplayEffectDurationType::Infinite;
        
        	if (bIsInfinite && InfiniteEffectRemovalPolicy == EEffectRemovalPolicy::RemoveOnEndOverlap)
        	{
        	
        	}
        ```
        
    3. 创建能一一对应`激活的GE句柄`和`Actor里面的ASC`的Map
        
        ```cpp
        TMap<FActiveGameplayEffectHandle,UAbilitySystemComponent*> ActiveGameplayEffects;
        ```
        
    4. 存起激活的`激活的GE句柄`h和对应的ASC
        
        ```cpp
        	ActiveGameplayEffects.Add(ActiveGEHandle,TargetASC);
        ```
        
    5. 添加`应用无限GE`的两个策略，
        
        ```cpp
        void AAuraEffectActor::OnOverlap(AActor* TargetActor)
        {
        	if (InstantEffectApplicationPolicy == EEffectApplicationPolicy::ApplyOnOverlap)ApplyEffectToTarget(TargetActor,InstantGameplayEffectClass);
        	if (DurationEffectApplicationPolicy == EEffectApplicationPolicy::ApplyOnOverlap) ApplyEffectToTarget(TargetActor,DurationGameplayEffectClass);
        	if (InfiniteEffectApplicationPolicy == EEffectApplicationPolicy::ApplyOnOverlap) ApplyEffectToTarget(TargetActor,InfiniteGameplayEffectClass);
        }
        
        void AAuraEffectActor::OnEndOverlap(AActor* TargetActor)
        {
        	if (InstantEffectApplicationPolicy == EEffectApplicationPolicy::ApplyOnEndOverlap) ApplyEffectToTarget(TargetActor,InstantGameplayEffectClass);
        	if (DurationEffectApplicationPolicy == EEffectApplicationPolicy::ApplyOnEndOverlap)  ApplyEffectToTarget(TargetActor,DurationGameplayEffectClass);
        	if (InfiniteEffectApplicationPolicy == EEffectApplicationPolicy::ApplyOnEndOverlap) ApplyEffectToTarget(TargetActor,InfiniteGameplayEffectClass);
        	}
        ```
        
    6. 在结束重叠的地方判断键值对中的ASC是否等于当前Actor的ASC，是的话移除对应GE
        
        ```cpp
        void AAuraEffectActor::OnEndOverlap(AActor* TargetActor)
        {
        	InstantEffectApplicationPolicy == EEffectApplicationPolicy::ApplyOnEndOverlap ? ApplyEffectToTarget(TargetActor,InstantGameplayEffectClass) : nullptr;
        	DurationEffectApplicationPolicy == EEffectApplicationPolicy::ApplyOnEndOverlap ? ApplyEffectToTarget(TargetActor,DurationGameplayEffectClass) : nullptr;
        	InfiniteEffectApplicationPolicy == EEffectApplicationPolicy::ApplyOnEndOverlap ? ApplyEffectToTarget(TargetActor,InfiniteGameplayEffectClass) : nullptr;
        	if (InfiniteEffectRemovalPolicy == EEffectRemovalPolicy::RemoveOnEndOverlap)
        	{
        		UAbilitySystemComponent* TargetASC = UAbilitySystemBlueprintLibrary::GetAbilitySystemComponent(TargetActor);
        		for (auto HandlePair :ActiveGEHandles)
        		{
        			if (TargetASC == HandlePair.Value)
        			{
        				TargetASC->RemoveActiveGameplayEffect(HandlePair.Key);
        			}
        		}
        	}
        }
        ```
        
    7. 同时移除Maps里相应的键值对
        1. 创建临时数组存需要在Map中移除的`激活的GE句柄`
        2. 遍历移除
        
        ```cpp
        void AAuraEffectActor::OnEndOverlap(AActor* TargetActor)
        {
        	InstantEffectApplicationPolicy == EEffectApplicationPolicy::ApplyOnEndOverlap ? ApplyEffectToTarget(TargetActor,InstantGameplayEffectClass) : nullptr;
        	DurationEffectApplicationPolicy == EEffectApplicationPolicy::ApplyOnEndOverlap ? ApplyEffectToTarget(TargetActor,DurationGameplayEffectClass) : nullptr;
        	InfiniteEffectApplicationPolicy == EEffectApplicationPolicy::ApplyOnEndOverlap ? ApplyEffectToTarget(TargetActor,InfiniteGameplayEffectClass) : nullptr;
        	if (InfiniteEffectRemovalPolicy == EEffectRemovalPolicy::RemoveOnEndOverlap)
        	{
        		UAbilitySystemComponent* TargetASC = UAbilitySystemBlueprintLibrary::GetAbilitySystemComponent(TargetActor);
        		if (TargetASC == nullptr) return;
        
        		TArray<FActiveGameplayEffectHandle> ActiveGEHandlesToRemove;
        		for (auto HandlePair :ActiveGEHandles)
        		{
        			if (TargetASC == HandlePair.Value)
        			{
        				TargetASC->RemoveActiveGameplayEffect(HandlePair.Key);
        				
        				ActiveGEHandlesToRemove.Add(HandlePair.Key);//临时存储要删除的Handle
        			}
        		}
        		for (auto Handle : ActiveGEHandlesToRemove)
        		{
        			ActiveGEHandles.FindAndRemoveChecked(Handle);//这是安全的删除方式
        		}
        	}
        }
        ```
        
    8. 蓝图中设置并编写
        
        ![image 22.webp](https://s3.zmingu.com/images/2025/04/3055021150.webp)
        
    9. 设置GE
        
        ![image 23.webp](https://s3.zmingu.com/images/2025/04/3142118211.webp)
        
    10. 现在在多个重叠的火堆中，从其中一个出来，就会把所有都移除
    11. 一次只移除一个Stack的修改
        
        ```cpp
        TargetASC->RemoveActiveGameplayEffect(HandlePair.Key,1);
        ```
        

## 

## 

## 

## 

# 

### 6.Gameplay Effects

### 7.Gameplay Tags

### RPG Attributes

### Attribute Menu

### Gameplay Abilities

### Ability Tasks

### RPG Character Classes

### Damage

### Advanced Damage Techniques

### Enemy Al

### Enemy Melee Attacks

### Enemy Ranged Attacks

### Enemy Spell Attacks

### Enemy Finishing Touches

### Level Tweaks

### Cost and Cooldown

### Experience and Levelii

### Attribute Points

### Spell Menu

### Combat Tricks

### What a Shock

### Passive Spells

### Arcane Shards

### Fire Blast

### Saving Progress

### Checkpoints

### Map Entrance

### Course Conclusion