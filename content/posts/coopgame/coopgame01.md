---
title: CoopGame01-创建玩家
subtitle:
date: 2022-10-01T15:18:00+08:00
lastmod: 2024-05-25T15:18:00+08:00
slug: coopgame01
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
featuredImage: /images/cover_coopgame.webp
---

这是虚幻教程系列 - CoopGame的第1篇,创建玩家.

内容
- 创建项目
- 添加角色
- 创建角色类
- 添加角色移动功能
- 添加角色视角转动功能
- 添加角色下蹲和跳跃功能
- 为角色添加摄像机和弹簧臂

<!--more-->

{{< admonition abstract >}}
介绍:
B站UP主[技术宅阿棍儿](https://space.bilibili.com/92060300)的转述教程视频 , 据其制作的笔记和包含自己的理解 .

原教程链接:[CoopGame](https://www.udemy.com/share/1002AcBUIbcldaQXo=/)(课程已停止注册)

需要准备的资产:[项目源文件(蓝奏云)](https://wwql.lanzout.com/b030ouw2ud),密码:zmingu

UE版本:4.27.2

VS版本:2022
{{< /admonition >}}



### 创建项目
1. 新建 游戏-> 空白 ->C++项目, 取消初学者内容包,设置项目名:CoopGame.
    ![1-tuya.webp](https://s3.zmingu.com/images/2025/04/1434560755.webp)
### 添加角色

### 创建角色类
1. 左上角菜单栏 -> 文件 -> 新建C++类
2. 创建继承`Character`类的`SCharacter`玩家角色类,设置为`public`.
    ![2.webp](https://s3.zmingu.com/images/2025/04/86534015.webp)
### 添加角色移动功能
1. 添加移动函数.
{{< details summary="在 SCharacter.h 中声明移动函数" >}}
```cpp
public:
    void MoveForward(float Value);
    void MoveRight(float Value);
```
{{< /details >}}
{{< details summary="在 SCharacter.cpp 中定义移动函数" >}}
```cpp
void ASCharacter::MoveForward(float Value)  
{  
    //添加移动输入，参数1：移动方向，参数2：移动值  
    //这里的GetActorForwardVector()是获取角色的前方向量  
    AddMovementInput(GetActorForwardVector(),Value);  
}  
  
void ASCharacter::MoveRight(float Value)  
{  
    //添加移动输入，参数1：移动方向，参数2：移动值  
    //这里的GetActorRightVector()是获取角色的右方向量  
    AddMovementInput(GetActorRightVector(),Value);  
}
```
{{< /details >}}
2. 配置输入映射
	- 项目设置→引擎→输入,添加轴映射`MoveForward`,`MoveRight`如图
	![3.webp](https://s3.zmingu.com/images/2025/04/2719785457.webp)
    - 自问自答:为什么S键和A键的的缩放需要设置为-1?
3. 将移动的按键映射和移动函数绑定起来
{{< details summary="在 `SCharacter.cpp` 中的 `SetupPlayerInputComponent` 函数中进行绑定" >}}
```cpp
//该函数用于将玩家的输入绑定到角色的功能上  
void ASCharacter::SetupPlayerInputComponent(UInputComponent* PlayerInputComponent) 
{  
    Super::SetupPlayerInputComponent(PlayerInputComponent);  
    //绑定轴输入,参数1：轴名称，参数2：绑定的函数  
    //这里的轴名称"MoveForward"和"MoveRight"就是我们刚刚在项目设置中进行配置的
    PlayerInputComponent->BindAxis("MoveForward",this,&ASCharacter::MoveForward);  
    PlayerInputComponent->BindAxis("MoveRight",this,&ASCharacter::MoveRight);  
}
```
{{< /details >}}
### 添加角色视角转动功能
1. 添加轴映射`LookUp`,`Turn`如图：
![4.png](https://s3.zmingu.com/images/2025/04/1694610037.png)
    - 自问自答:为什么鼠标Y的缩放要设置为-1?
2. 将视角转动的按键映射和视角转动的函数绑定起来
{{< details summary="在 `SCharacter.cpp` 中的 `SetupPlayerInputComponent` 函数中进行绑定" >}}
```cpp
//该函数用于将玩家的输入绑定到角色的功能上  
PlayerInputComponent->BindAxis("LookUp",this,&ASCharacter::AddControllerPitchInput);  
PlayerInputComponent->BindAxis("Turn",this,&ASCharacter::AddControllerYawInput);
```
{{< /details >}}

{{< admonition info >}}
上面绑定的`AddControllerPitchInput`和`AddControllerYawInput`是父类`ACharacter`类中用于控制视角的函数，作用是添加`俯仰`和`偏航`输入，从而实现视角的上下和左右移动。
{{< /admonition >}}

### 添加角色下蹲和跳跃功能

1. 添加操作映射跳跃和下蹲`Crouch`,`Jump`如图

![5.webp](https://s3.zmingu.com/images/2025/04/2654428813.webp)
2. 添加下蹲和结束下蹲函数

{{< details summary="在 SCharacter.h 中声明`下蹲`和`结束下蹲(起身)`函数" >}}
```cpp
    //下蹲和结束下蹲函数
    void BeginCrouch();
    void EndCrouch();
```
{{< /details >}}
{{< details summary="在 SCharacter.cpp 中实现`下蹲`和`结束下蹲(起身)`函数" >}}
```cpp
    void ASCharacter::BeginCrouch()
    {
    	Crouch();
    }
    
    void ASCharacter::EndCrouch()
    {
    	UnCrouch();
    }
```
{{< /details >}}

3. 绑定下蹲和跳跃函数
{{< details summary="在 SCharacter.cpp 中的`SetupPlayerInputComponent` 函数中绑定`下蹲`，`结束下蹲(起身)`，`跳跃函数`，`结束跳跃`函数" >}}
```cpp
    //
    PlayerInputComponent->BindAction("Crouch",IE_Pressed,this,&ASCharacter::BeginCrouch);
    PlayerInputComponent->BindAction("Crouch",IE_Released,this,&ASCharacter::EndCrouch);
    PlayerInputComponent->BindAction("Jump",IE_Pressed,this,&ASCharacter::Jump);
    PlayerInputComponent->BindAction("Jump",IE_Released,this,&ASCharacter::StopJumping);
```
{{< /details >}}

{{< admonition info >}}
`Crouch()`,`UnCrouch()`,`Jump()`,`StopJumping`是父类`ACharacter`类中的函数。这里的`IE_Pressed`和`IE_Released`是输入事件的枚举值，分别表示按下和释放按键时触发的事件
{{< /admonition >}}

### 为角色添加摄像机和弹簧臂

1. 创建摄像机和弹簧臂组件并初始化

{{< details summary="在 `SCharacter.h` 中声明`相机组件(UCameraComponent)`和`弹簧臂组件(USpringArmComponent)`" >}}
```cpp
UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Components")
class UCameraComponent* CameraComp;

UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Components")
class USpringArmComponent* SpringArmComp;
```
{{< /details >}}

{{< details summary="在 `SCharacter.cpp` 的构造函数`ASCharacter()`中初始化这两个组件" >}}
```cpp
/*添加摄像机和弹簧臂组件引用*/
#include "Camera/CameraComponent.h"
#include "GameFramework/SpringArmComponent.h"

ASCharacter::ASCharacter()  
{  
    PrimaryActorTick.bCanEverTick = true;  
    //创建一个默认子对象，命名为SpringArmComp，类型为USpringArmComponent  
    SpringArmComp = CreateDefaultSubobject<USpringArmComponent>(TEXT("SpringArmComp"));  
  
    //使用角色的控制旋转来调整弹簧臂的方向，也就是让弹簧臂跟随角色的视角旋转  
    SpringArmComp->bUsePawnControlRotation = true;  
  
    //将弹簧臂组件附加到角色的根组件上，这样弹簧臂就会跟随角色的位置和旋转  
    SpringArmComp->SetupAttachment(RootComponent);  
  
    //创建一个默认子对象，命名为CameraComp，类型为UCameraComponent  
    CameraComp = CreateDefaultSubobject<UCameraComponent>(TEXT("CameraComp"));  
  
    //将摄像机组件附加到弹簧臂组件上，这样摄像机就会跟随弹簧臂的位置和旋转  
    CameraComp->SetupAttachment(SpringArmComp);  
}
```
{{< /details >}}



## 设置角色动画

1. 导入虚幻商城免费资源动画初学者内容包`Animation Starter Pack`,添加到我们的工程

    ![6.webp](https://s3.zmingu.com/images/2025/04/3033250057.webp)

2. 创建继承自`SCharacter`C++类的蓝图类`BP_SCharacter`，位置放在`Blueprints`中

3. 设置`网格体CharacterMesh0`的骨骼网格体为默认小白人`SK_Mannequin`,设置`位置Z`为-90,`旋转Z`为-90，设置`动画蓝图`为`UE4ASP_HeroTPP_AnimBlueprint`
![2025-09-02_142014.png](https://s3.zmingu.com/images/2025/09/02/2025-09-02_142014.webp)


4. 修改`UE4ASP_HeroTPP_AnimBlueprint`动画蓝图的事件图表如下,实现蹲和跳跃的动画被角色类中的函数驱动。

{{< admonition tip >}}
可以直接复制下面的蓝图 , 然后粘贴到你的编辑器哦
{{< /admonition >}}

{{< blueprintue id="73kk5ps7" >}}

![hm757v7fae.webp](https://s3.zmingu.com/images/2024/01/hm757v7fae.webp)

# 效果测试

1. 创建蓝图类`BP_CoopGameGameMode`,继承`CoopGameGameModeBaseC`++类
2. 在场景设置中设置GameMode为`BP_CoopGameGameMode`,设置其中的默认Pawn类为`BP_SCharacter`
    
   ![9.webp](https://s3.zmingu.com/images/2025/04/1662574323.webp)
    
3. 运行查看结果
    
   ![10.gif](https://s3.zmingu.com/images/2025/04/1381511067.gif)