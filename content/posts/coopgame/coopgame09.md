---
title: CoopGame09 - 进阶AI
subtitle:
date: 2022-10-25T20:48:00+08:00
lastmod: 2024-05-28T20:47:00+08:00
slug: coopgame09
draft: false
summary: "UE5 进阶 AI：行为树、EQS 场景查询、AI 感知视觉、友军判断和低血逃跑。"
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

这是虚幻教程系列 - CoopGame的第9篇,进阶AI.
内容
- 人形敌人，远程武器
- AI行为树
- 使用EQS系统帮助AI掩护或寻找攻击点
- AI的视觉
- 挑战：AI低血量自动逃跑和回复
等

<!--more-->

# 综合使用黑板，行为树，环境查询
## 使用行为树让AI朝一个点前进
1. 创建AdvancedAI文件夹放高级AI相关文件，创建`BP_AdavncedAI`蓝图类，继承`SCharacter` C++类。
2. 设置`BP_AdvancedAI`蓝图类的类默认值
	![Untitled.webp](https://s3.zmingu.com/images/2025/04/74881874.webp)
3. 设置网格体
	![Untitled 1.webp](https://s3.zmingu.com/images/2025/04/1908485606.webp)
4. 创建黑板`BB_AdvancedAI`，新建向量类型变量`TragetDestination`，Object类型变量`TargetActor`，其基类为Actor。
5. 创建行为树`BT_AdvancedAI`，点击根，绑定黑板`BB_AdvancedAI`，并编写
	![Untitled 2.webp](https://s3.zmingu.com/images/2025/04/2086820514.webp)

6. 编写`BP_AdavncedAI`蓝图类，该蓝图让AI一直运行行为树上的逻辑，既一直朝向黑板键`TragetDestination`移动，我们手动给这个黑板键设置了初始向量`0.0.0`，既一直朝原点走去
	![Untitled 3.webp](https://s3.zmingu.com/images/2025/04/2712797007.webp)

## 使用EQS决定AI的位置
1. 新建环境查询`EQS_FindMoveTo`，在根下添加`Point:Donut`(环)，设置如图，意思是在AI周围生成32个点，通过后续的测试给每个点评分，评分最高的点就是AI要去的点
		![Untitled 4.webp](https://s3.zmingu.com/images/2025/04/479555483.webp)
	2. 添加三个测试
		1. 距离测试：离AI自己越近的分数越高，权重为2
			![Untitled 5.webp](https://s3.zmingu.com/images/2025/04/1060427154.webp)
		2. 追踪测试2：给点打分，从每个候选点向所有玩家发射一条射线（Trace）。如果射线**没有被障碍物（如墙壁）阻挡**，意味着这个点可以“看到”玩家，那么这个点就会获得一个固定的分数。
			![Untitled 6.webp](https://s3.zmingu.com/images/2025/04/513181502.webp)
		3. 追踪测试：看不到玩家的点都是无效的，从候选点向玩家发射射线，如果射线**命中了障碍物**（`hit`），说明视线被遮挡，那么这个候选点就会被**直接丢弃**，不再参与后续的评分
			![Untitled 7.webp](https://s3.zmingu.com/images/2025/04/2841113045.webp)
## 使用装饰器限定条件
1. 新建装饰器`Decorator_DistanceTo`，继承`BTDecorator_BlueprintBase` BT装饰器蓝图基础。
	1. 重载`PerformConditionCheckAI` 执行条件检查AI函数，新建黑板键选择器结构变量`BlackboardKey`和浮点变量`Distance`，两个变量都设置为可编辑实例，编写蓝图。装饰器在行为树中的作用是作为一种**条件判断**，它决定了其所在的节点或分支是否能够被执行。
		![Untitled 8.webp](https://s3.zmingu.com/images/2025/04/235642522.webp)
		- `Blackboard Key` 是一个可配置的变量，你在行为树里使用这个装饰器时，需要指定它去读取哪个键（比如一个名为 "TargetActor" 的键，里面存着玩家角色）。

## 更改AI朝目标Actor运动
1. 修改之前蓝图类`BP_AdvancedAI`中朝一个点运动的逻辑，改为向目标Actor移动
	![Untitled 9.webp](https://s3.zmingu.com/images/2025/04/130005956.webp)

2. 新建蓝图类`EnvQueryContext_TargetActor`，继承`EnvQueryContext_Blueprintbase`，重载`ProvideSingleActor` 提供单个Actor。
	![Untitled 10.webp](https://s3.zmingu.com/images/2025/04/547637111.webp)
## 完善行为树
1. 修改行为树`BT_AdvancedAI`,添加修饰器，意思是AI和`TargetActor`之间的距离是否大于2000？，是才放行，让AI向着`TargetActor`移动。
	![Untitled 11.webp](https://s3.zmingu.com/images/2025/04/3314165679.webp)
	![Untitled 12.webp](https://s3.zmingu.com/images/2025/04/10471367.webp)
	![Untitled 13.webp](https://s3.zmingu.com/images/2025/04/3291336692.webp)
2. 修改环境查询，具体向玩家0，既在角色蓝图中设置的玩家0移动。（后面肯定不能让所有AI都朝着玩家0移动，这是单机游戏才能使用的做法，后面会用AI感知系统来感知AI身边的玩家角色。将其设置为TargetActor
	![Untitled 14.webp](https://s3.zmingu.com/images/2025/04/384877233.webp)

## AI感知和行为树服务
1. 修改蓝图类`BP_AdvancedAI`，将之前`获取玩家Pawn`然后设置为黑板的`TargetActor`的步骤删除，改为下面在服务里用视觉组件，让AI看到谁就找谁，而不是我们手动指定Actor。
2. 添加AI感知组件(AIPerception)，并设置添加感官配置AI视力配置，添加检测中立方和友方
	![Untitled 15.webp](https://s3.zmingu.com/images/2025/04/626869092.webp)
3. 创建服务蓝图`Service_SelectTargetActor` ，继承`BTService_BlueprintBase`类，编写蓝图。重写函数`Event Receive Tick Al`，注意新建的黑板键选择器变量设置为可编辑实例。
	![Untitled 16.webp](https://s3.zmingu.com/images/2025/04/1460793369.webp)
4. 修改行为树BT_AdvancedAI，为选择器添加服务，让服务去设置目标Actor，并在下方再套一个选择器，只有当黑板键TargetActor已经设置才放行，不然就等待
	![Untitled 17.webp](https://s3.zmingu.com/images/2025/04/3210282192.webp)

## 多人游戏的情况
1. 实现多人游戏情况下，AI找的是离自己最近的玩家
2. 新建环境查询`EQS_FindNearesPlayer`，根拉出`Actor of class`，选择我们的`玩家蓝图类`，取消勾选`仅生成半径中的Actor`，最终设置成找到周围最近的玩家角色
	![Untitled 18.webp](https://s3.zmingu.com/images/2025/04/1759068862.webp)
	![Untitled 19.webp](https://s3.zmingu.com/images/2025/04/1770570823.webp)

3. 修改行为树，设置黑板条件中的观察期终止，终止低优先级。意思Blackboard Based Condition条件为假，既没有看到玩家的时候，是走右边的查询最近的玩家并移动过去，但在移动的过程中看到玩家了，此时条件为真，会终止比他优先级低的节点，既是`Blackboard Based Condition`右边的会终止。
	![Untitled 20.webp](https://s3.zmingu.com/images/2025/04/2554683651.webp)

	![Untitled 21.webp](https://s3.zmingu.com/images/2025/04/3399697090.webp)

## 进击的AI
1. 修改角色代码开始停止开火函数添加声明，让蓝图可调用
 {{< details summary="在`SCharacter.h`声明开火停火函数" >}}
```cpp
public:
    UFUNCTION(BlueprintCallable,Category="Player")
	void StartFire();

	UFUNCTION(BlueprintCallable,Category="Player")
	void StopFire();
```
{{< /details >}}

2. 新建任务蓝图`Task_AttackTarget`，继承`BTTask_BlueprintBase`任务蓝图基础，并编写
	![Untitled 22.webp](https://s3.zmingu.com/images/2025/04/1725961010.webp)

3. 修改行为树BT_AdvancedAI
	![Untitled 23.webp](https://s3.zmingu.com/images/2025/04/2308418734.webp)

4. 修改AI的攻击伤害。
 {{< details summary="在`SWeapon.h`声明子弹散射角度变量" >}}
```cpp
/* 子弹散射角度 */
UPROPERTY(EditDefaultsOnly, Category = "Weapon", meta = (ClampMin=0.0f))
float BulletSpread;
```
{{< /details >}}
{{< details summary="在`SWeapon.cpp`设置散射角，以及散射逻辑" >}}
```cpp
ASWeapon::ASWeapon()
{
//...
	BulletSpread = 2.0f;
}

void ASWeapon::Fire()
{
//...
	if (MyOwner)
	{
        //...
		// 子弹散射角，以射线为中心的锥形随机向量
		float HalfRad = FMath::DegreesToRadians(BulletSpread);  
		FVector ShotDirection = EyeRotator.Vector();  
		ShotDirection = FMath::VRandCone(ShotDirection, HalfRad, HalfRad);  
		FVector TraceEnd = EyeLocation + (ShotDirection * 10000);
        }
}
```
{{< /details >}}

5. 把`BP_SWeapon`复制到`AdvancedAI`目录，更名为`BP_Rifle_AI`,修改类默认值：减小攻击伤害，增大散射角。将`BP_AdvancedAI`蓝图类的类默认值的武器修改为修改后的枪。

6. 随机生成两种AI敌人，修改`BP_CoopGameGameMode`蓝图类。


![Untitled 24.webp](https://s3.zmingu.com/images/2025/04/2795234477.webp)

### 别开枪，是友军。
1. 人形AI不打友军
{{< details summary="在`SHealthComponent.h`声明`队伍编号`变量, `判断是否友军`的方法">}}
```cpp
    //队伍编号
	UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category = "HealthComponent")
	uint8 TeamNum;

    //判断两个Actor是否为友军
    UFUNCTION(BlueprintCallable, BlueprintPure, Category = "HealthComponent")
	static bool IsFriendly(AActor* ActorA, AActor* ActorB);
```
{{< /details >}}
{{< details summary="在`SHealthComponent.cpp`中实现">}}
```cpp
USHealthComponent::USHealthComponent()
{
    //默认队伍编号为255
	TeamNum = 255;
}

void USHealthComponent::HandleTakeAnyDamage(AActor* DamagedActor, float Damage, const class UDamageType* DamageType, class AController* InstigatedBy,
	AActor* DamageCauser)
{
	if (Damage <= 0.0f || bIsDead)
	{
		return;
	}

	//在伤害发生时进行一个友军判断
	if (DamageCauser != DamagedActor && IsFriendly(DamagedActor, DamageCauser))
	{
		return;
	}
}

bool USHealthComponent::IsFriendly(AActor* ActorA, AActor* ActorB)
{
	if (ActorA == nullptr || ActorB == nullptr)
	{
		return true;
	}

	USHealthComponent* HealthCompA = Cast<USHealthComponent>(ActorA->GetComponentByClass(USHealthComponent::StaticClass()));
	USHealthComponent* HealthCompB = Cast<USHealthComponent>(ActorB->GetComponentByClass(USHealthComponent::StaticClass()));

	//没有健康值的物体也算友军，不伤害
	if (HealthCompA == nullptr || HealthCompB == nullptr)
	{
		return true;
	}

	//返回两个Actor的队伍编号是否相等
	return HealthCompA->TeamNum == HealthCompB->TeamNum;
}
```
{{< /details >}}

- 调整`人形AI`的相机，修改`BP_AdvancedAI`蓝图类中的弹簧臂，使相机在人物眼睛位置。
修改玩家`BP_SCharacter`中的生命值组件中的队伍编号为`0`，这样就和其他`人形AI`的`255`区分开了。

2. 实时更新选择离自己最近的目标攻击
	1. 修改`Service_SelectTargetActor`
![Untitled 25.webp](https://s3.zmingu.com/images/2025/04/2343105834.webp)

3. 优化球形AI寻路，并让球形AI不伤害友军。
{{< details summary="在`STracerBot.h`声明`刷新路径`的方法">}}
```cpp
protected:
	FTimerHandle TimerHandle_RefreshPath;
	void RefreshPath();
```
{{< /details >}}
{{< details summary="在`STracerBot.cpp`中优化寻路逻辑">}}
```cpp
//调试用
static int32 DebugTrackerBotDrawing = 0;
FAutoConsoleVariableRef CVARDebugTrackerBotDrawing(
	TEXT("COOP.DebugTrackerBot"),
	DebugTrackerBotDrawing,
	TEXT("Draw Debug Lines for TrackerBot"),
	ECVF_Cheat);

ASTrackerBot::ASTrackerBot()
{
    //修改伤害和范围
	ExplosionDamage = 60;
	ExplosionRadius = 350;
}

FVector ASTrackerBot::GetNextPathPoint()
{
	AActor* BestTarget = nullptr;
	float NearestTargetDistance = FLT_MAX;
	//使用Pawn迭代器，拿到每一个Pawn的生命值组件，比较他们的队伍编号，找到生命值大于0的非友军，设置离自己最近的敌人的距离。
	for (FConstPawnIterator It = GetWorld()->GetPawnIterator(); It; ++It)
	{
		APawn* TestPawn = It->Get();
		if (TestPawn == nullptr || USHealthComponent::IsFriendly(TestPawn, this))
		{
			continue;
		}

		USHealthComponent* TestPawnHealthComp = Cast<USHealthComponent>(TestPawn->GetComponentByClass(USHealthComponent::StaticClass()));
		if (TestPawnHealthComp && TestPawnHealthComp->GetHealth() > 0.0f)
		{
			float Distance = (TestPawn->GetActorLocation() - GetActorLocation()).Size();

			if (Distance < NearestTargetDistance)
			{
				BestTarget = TestPawn;
				NearestTargetDistance = Distance;
			}
		}
	}

	if (BestTarget)
	{
		UNavigationPath* NavPath = UNavigationSystemV1::FindPathToActorSynchronously(this, GetActorLocation(), BestTarget);

		GetWorldTimerManager().ClearTimer(TimerHandle_RefreshPath);
		GetWorldTimerManager().SetTimer(TimerHandle_RefreshPath, this, &ASTrackerBot::RefreshPath , 5.0f, false);

		if (NavPath && NavPath->PathPoints.Num() > 1)
		{
			// 返回下一个点
			return NavPath->PathPoints[1];
		}
	}

	// 寻路失败
	return GetActorLocation();
}

void ASTrackerBot::RefreshPath()
{
	NextPathPoint = GetNextPathPoint();
}
```
{{< /details >}}


### 挑战：狡猾AI

#### 实现人形AI血量降低到40时，逃跑并回血
1. 修改AI行为树，使用一个装饰器检查血量，一个查询用来查找逃离地点，一个任务用来回血
	![Untitled 26.webp](https://s3.zmingu.com/images/2025/04/3994684514.webp)

2. 新建检查血量的装饰器`Decorator_CheckBelowHealth`，继承装饰器基类，重载`PerformConditionCheckAI`执行条件检查AI函数，新建血量阈值`LowHealthTreshold`设为公开。
	![Untitled 27.webp](https://s3.zmingu.com/images/2025/04/2276080751.webp)

3. 新建查询逃离点的环境查询`EQS_FindCover`
	1. 1.生成环
	![Untitled 28.webp](https://s3.zmingu.com/images/2025/04/2716724566.webp)

4. 测试1，找建筑物高于100的掩体，来躲开玩家。
	![image.webp](https://s3.zmingu.com/images/2025/04/2324172546.webp)

5. 测试2，找距离玩家至少300的距离最远的点。
	![Untitled 30.webp](https://s3.zmingu.com/images/2025/04/2486354688.webp)

6. 测试3，找直线距离最近的点，不要绕道的。
	![Untitled 31.webp](https://s3.zmingu.com/images/2025/04/337783950.webp)

7. 新建回血的任务`Task_HealSelf`，记得变量公开
	![Untitled 32.webp](https://s3.zmingu.com/images/2025/04/2077330155.webp)