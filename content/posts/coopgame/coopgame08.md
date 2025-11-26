---
title: CoopGame08-游戏模式
subtitle:
date: 2022-10-20T19:31:00+08:00
lastmod: 2024-05-28T19:30:00+08:00
slug: coopgame08
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

这是虚幻教程系列 - CoopGame的第8篇,游戏模式.
内容
- 用GameMode生成回合制的敌人
- 击杀奖励
- 处理游戏状态，例GameOver
- 玩家重生
- 搭建场景
等
<!--more-->

## 初见EQS（场景查询系统）
1. ~~开启功能(各引擎版本不同)：编辑->编辑器偏好设置->通用->实验性功能->AI->Environment Query System~~
2. 开启依赖插件-Environment Query Editor(4.27版本默认开启)
3. 在内容根文件夹下创建`AdvancedAI`文件夹，在其新建蓝图类`EnvQueryContext_BotSpawns`继承`EnvQueryContext_BlueprintBase`环境查询情景蓝图基础。
	1. 重载`ProvideActorSet`函数，获取所有目标点Actor（位置在左上角函数项停留，出现重载和添加函数）
		![Untitled.webp](https://s3.zmingu.com/images/2025/04/3950210086.webp)
4. 新建蓝图类`EnvQueryContext_AllPlayers`继承`EnvQueryContext_BlueprintBase`。
	1. 重载`ProvideActorSet`函数，获得所有角色类Actor
		![Untitled 1.webp](https://s3.zmingu.com/images/2025/04/486278838.webp)

5. 创建环境查询`EQS_FindSpawnLocation`（右键-人工智能-环境查询）
	1. 从根拉出`Points:Grid`设置如图
		![Untitled 2.webp](https://s3.zmingu.com/images/2025/04/2265405206.webp)
	2. 右键添加测试Distance
		![Untitled 3.webp](https://s3.zmingu.com/images/2025/04/1419153599.webp)
6. 编写`BP_CoopGameGameMode`蓝图
	![Untitled 4.webp](https://s3.zmingu.com/images/2025/04/3846290785.webp)
7. 上面是的过程是让环境查询系统查找距离各个玩家200米之内的目标点，从该点生成追踪球敌人。可以在场景中放几个目标点测试

## 增加回合机制
1. 创建C++类`SGameMode`类继承`GameModeBase`类并编写逻辑。
 {{< details summary="在`SGameMode.h`声明`生成AI球数量`, `关卡数`，`关卡之间的间隔时间`变量，以及其他函数" >}}
```cpp
public:  
    ASGameMode();//构造函数
    
    virtual void StartPlay() override;//重写GameModeBase的游戏开始函数
    
    void PrepareForNextWave();//准备下一个关卡
    
protected:  
    FTimerHandle TimerHandle_BotSpawner;//生成AI数量  
    int32 NrOfBotsToSpawn;  
  
    int32 WaveCount;   //关卡数  
    UPROPERTY(EditDefaultsOnly, Category=GameMode)//关卡之间的间隔时间  
    float TimeBetweenWaves;  
      
    UFUNCTION(BlueprintImplementableEvent, Category=GameMode)//生成新的机器人函数，蓝图实现  
    void SpawnNewBot();  
      
    void SpawnBotTimerElapsed();//生成机器人时间结束  
  
    void StartWave();//开始关卡  
  
    void EndWave();    //结束关卡
```
{{< /details >}}
{{< details summary="在`SGameMode.cpp`中实现逻辑" >}}
```cpp
#include "SGameMode.h"  
  
ASGameMode::ASGameMode()  
{  
    TimeBetweenWaves = 2;//关卡之间的间隔时间  
}  
  
void ASGameMode::StartPlay()  
{  
    Super::StartPlay();  
      
    PrepareForNextWave();//准备下一个关卡  
}  
  
void ASGameMode::StartWave()  
{  
    WaveCount++;//关卡数+1  
    NrOfBotsToSpawn = 2 * WaveCount;//生成AI的数量=2*关卡数  
    GetWorldTimerManager().SetTimer(TimerHandle_BotSpawner,this,&ASGameMode::SpawnBotTimerElapsed,1,true,0);//用定时器每秒生成一个AI  
}  
  
void ASGameMode::EndWave()  
{  
    GetWorldTimerManager().ClearTimer(TimerHandle_BotSpawner);  
    PrepareForNextWave();  
}  
  
void ASGameMode::SpawnBotTimerElapsed()  
{  
    SpawnNewBot();//调用蓝图实现的生成AI函数  
    NrOfBotsToSpawn--;//待生成的AI数量-1  
          
if (NrOfBotsToSpawn <= 0)//如果待生成的AI数量小于等于0就结束关卡  
    {  
       EndWave();  
    }  
}  
  
void ASGameMode::PrepareForNextWave()  
{  
    FTimerHandle TimerHandle_NextWaveStart;  
    GetWorldTimerManager().SetTimer(TimerHandle_NextWaveStart, this, &ASGameMode::StartWave, TimeBetweenWaves, false);//用定时器在TimeBetweenWaves秒后开始下一个关卡  
}
```
{{< /details >}}
2. 修改`BP_CoopGameGameMode`蓝图类的父类为`SGameMode`，将`BeginPlay`节点换为`SpawnNewBot`，
3. 运行结果:生成当前关卡的AI后继续生成后续关卡的AI，会一直生成。
## 完善回合机制
1. 将关卡切换逻辑放到GameMode中。
{{< details summary="将`SHealthComponent.h`中的生命值改为Get方法获得，不直接向外暴露" >}}
```cpp
protected:
	UPROPERTY(ReplicatedUsing=OnRep_Health,BlueprintReadOnly,Category="HealthComponent")
	float Health;
public:
	float GetHealth() const;//用来获取Health生命值，Health生命值为protected较合理。
	
//cpp中编写
float USHealthComponent::GetHealth() const
{
	return Health;
}
```
{{< /details >}}
{{< details summary="在`SGameMode.h`中添加关卡状态检测函数，以及管理下一关卡开启事件的时间句柄" >}}
```cpp
protected:
	FTimerHandle TimerHandle_NextWaveStart;//管理下一关开启时间
	void CheckWaveState();
public:
	virtual void Tick(float DeltaSeconds) override;
```
{{< /details >}}
{{< details summary="在`SGameMode.cpp`中添加关卡管理逻辑" >}}
```cpp
ASGameMode::ASGameMode()
{
//...
	//修改Tick机制
	PrimaryActorTick.bCanEverTick = true;
	PrimaryActorTick.TickInterval = 1;
}

void ASGameMode::Tick(float DeltaSeconds)
{
	Super::Tick(DeltaSeconds);
	CheckWaveState();//检查关卡状态
}

void ASGameMode::CheckWaveState()
{
	//是否在准备下一关卡，如果是，说明敌人已经消灭光了
	bool bIsPreparingForWave = GetWorldTimerManager().IsTimerActive(TimerHandle_NextWaveStart);

	//如果是在准备下一关卡，或者还在生成AI，就不需要检测关卡状态了
	if (bIsPreparingForWave||NrOfBotsToSpawn>0)return;

	//创建布尔变量标记是否有存活的AI
	bool bIsAnyBotAlive = false;

	//用Pawn迭代器获取所有Pawn，当然也包括玩家Character
	for (FConstPawnIterator It = GetWorld()->GetPawnIterator();It;++It)
	{
		APawn* Pawn = It->Get();

		//判断Pawn是否空，和此Pawn是否被玩家控制，被玩家控制的是玩家角色。是要排除的
		if (Pawn == nullptr || Pawn->IsPlayerControlled()) continue;

		//尝试拿到AIPawn里的生命值组件，判断生命值是否大于0，大于则活着，只要一个活着就为true
		USHealthComponent* HealthComp = Cast<USHealthComponent>(Pawn->GetComponentByClass(USHealthComponent::StaticClass()));
		if (HealthComp && HealthComp->GetHealth() > 0)
		{
			bIsAnyBotAlive = true;
			break;
		}
	}

	//如果没有活着的了就准备下一关卡
	if (!bIsAnyBotAlive) PrepareForNextWave();
}

void ASGameMode::EndWave()
{
	GetWorldTimerManager().ClearTimer(TimerHandle_BotSpawner);

	//PrepareForNextWave();不需要在这准备关卡，而是等到判断所有AI死了再准备
}

void ASGameMode::PrepareForNextWave()
{
	//FTimerHandle TimerHandle_NextWaveStart;注释提到头文件，已经在.h中声明
	GetWorldTimerManager().SetTimer(TimerHandle_NextWaveStart, this, &ASGameMode::StartWave, TimeBetweenWaves, false);
}
```
{{< /details >}}
2. 最后确认BP_TestGameMode蓝图类中的Tick间隔是否为Cpp中设置的1秒，同时删除场景中其他测试的角色，只留出生点，运行结果：在当前关卡的AI都死亡后才生成下一关卡的AI。

## 实现GameOver状态
1. 在`SGameMode`中实现游戏状态检测。
{{< details summary="在`SGameMode.h`中添加检查玩家存活和游戏结束的逻辑" >}}
```cpp
protected:
	void CheckAnyPlayerAlive(); //检查玩家存活
	
	void GameOver();//游戏结束
```
{{< /details >}}
{{< details summary="在`SGameMode.cpp`中实现逻辑" >}}
```cpp
void ASGameMode::Tick(float DeltaSeconds)
{
	Super::Tick(DeltaSeconds);
	CheckWaveState();
	CheckAnyPlayerAlive();
}

void ASGameMode::CheckAnyPlayerAlive()
{
	//如果玩家存活，这个for是一直被Tick调用，一直检测
	//使用玩家控制器迭代器获取所有玩家控制器，再又控制器获得玩家Pawn，判断Pawn中的健康组件中的生命值判断玩家是否存活
	for (FConstPlayerControllerIterator It_PC = GetWorld()->GetPlayerControllerIterator(); It_PC; ++It_PC)
	{
		APlayerController* PC = It_PC->Get();
		APawn* Pawn = PC->GetPawn();
		if (PC && Pawn)
		{
			USHealthComponent* HealthComp = Cast<USHealthComponent>(
				Pawn->GetComponentByClass(USHealthComponent::StaticClass()));
			//ensure判空提供更多信息
			if (ensure(HealthComp) && HealthComp->GetHealth() > 0)return;
		}
	}
	GameOver();
}

void ASGameMode::GameOver()
{
	EndWave();//会结束一个TimerHandle_BotSpawner
	UE_LOG(LogTemp,Log,TEXT("游戏结束，玩家死了"));
}
```
{{< /details >}}
2. 运行结果：当玩家死后，日志打印游戏结束。
> 

## 同步游戏状态
1. 使用`GameState`类来同步游戏状态，创建`SGameState`类，继承`GameStateBase`类的C++类。
 {{< details summary="在`SGameState.h`声明枚举来表示当前游戏状态，当状态值改变的时候做网络同步" >}}
```cpp
UENUM(BlueprintType)
enum class EWaveState:uint8
{
	//等待开始
	WaitingToStart,
	//开始生成AI
	WaveInProgress,
	//AI生成完毕，等待通关
	WaitingToComplete,
	//通关
	WaveComplete,
	//游戏失败
	GameOver,
};

UCLASS()
class MULTIPLESHOOT_CFGO_API ASGameState : public AGameStateBase
{
	GENERATED_BODY()
protected:
	//网络同步游戏状态,当前状态改变时会调用这个函数。
	UFUNCTION()
	void OnRep_WaveState(EWaveState OldState);

	//状态改变
	UFUNCTION(BlueprintImplementableEvent, Category=GameState)
	void WaveStatedChanged(EWaveState NewState, EWaveState OldState);

	//当前状态
	UPROPERTY(BlueprintReadOnly, ReplicatedUsing=OnRep_WaveState, Category=GameState)
	EWaveState WaveState;
	
public:  
    virtual void GetLifetimeReplicatedProps(TArray<FLifetimeProperty>& OutLifetimeProps) const override;  
      
    void SetWaveState(EWaveState NewState);//用来设置新的游戏状态
	
};
```
{{< /details >}}
{{< details summary="在`SGameState.cpp`编写同步逻辑" >}}
```cpp
void ASGameState::OnRep_WaveState(EWaveState OldState)
{
	WaveStatedChanged(WaveState,OldState);
}

void ASGameState::SetWaveState(EWaveState NewState)
{
	if (HasAuthority())
	{
		EWaveState OldState = WaveState;

		WaveState = NewState;
		// Call on server
		OnRep_WaveState(OldState);
	}
}

void ASGameState::GetLifetimeReplicatedProps(TArray<FLifetimeProperty>& OutLifetimeProps) const
{
	Super::GetLifetimeReplicatedProps(OutLifetimeProps);
    //属性同步条件
	DOREPLIFETIME(ASGameState,WaveState);
}
```
{{< /details >}}

2. 在`GameMode`中修改`GameState`中的状态，使其同步。
 {{< details summary="在`SGameMode.h`中添加修改游戏状态的函数" >}}
```cpp
public:
	//用来设置新的游戏状态
	void SetWaveState(EWaveState NewState);
```
{{< /details >}}
 {{< details summary="在`SGameMode.cpp`中添加改变状态的逻辑" >}}
```cpp
ASGameMode::ASGameMode()
{
//...
	//更换GM的游戏状态
	GameStateClass = ASGameState::StaticClass();
}

void ASGameMode::PrepareForNextWave()
{
//...
	//进入等待开始状态
	SetWaveState(EWaveState::WaitingToStart);
}

void ASGameMode::StartWave()
{
//...
	//进入生成AI状态
	SetWaveState(EWaveState::WaveInProgress);
}

void ASGameMode::EndWave()
{
//...
	//进入生成完毕,等待游戏完成状态，下一步要么AI死光，要么角色死光。在Tike中检查。
	SetWaveState(EWaveState::WaitingToComplete);
}

void ASGameMode::CheckWaveState()
{
//...
	for (FConstPawnIterator It = GetWorld()->GetPawnIterator(); It; ++It)
	{
		//...
	}

	if (!bIsAnyBotAlive)
	{
        //...
		//进入关卡完毕状态，
		SetWaveState(EWaveState::WaveComplete);
	}
}

void ASGameMode::GameOver()
{
//...
	//进入游戏结束状态
	SetWaveState(EWaveState::GameOver);
}

void ASGameMode::SetWaveState(EWaveState NewState)
{
	ASGameState* GS = GetGameState<ASGameState>();
	if (ensureAlways(GS))
	{
		GS->SetWaveState(NewState);
	}
}
```
{{< /details >}}

3. 创建`BP_GameState`蓝图类，继承`SGameState` C++类，编写打印状态的蓝图。
	![Untitled 5.webp](https://s3.zmingu.com/images/2025/04/3284273851.webp)

4. 修改`BP_TestGameMode`中的游戏状态类为`BP_GameState`
5. 可以选择设置AI掉下平台就摧毁。
	![Untitled 6.webp](https://s3.zmingu.com/images/2025/04/3431792502.webp)

6. 运行结果：左上角正确显示游戏状态

##  同步玩家状态
1. 使用`PlayerState`类，创建C++类`SPlayerState` ，继承`PlayerState` 类，编写添加分数的函数AddScore。
  {{< details summary="在`SPlayerState.h`声明添加分数的函数，并在cpp中实现" >}}
```cpp
UFUNCTION(BlueprintCallable,Category="PlayerState")
void AddScore(float ScoreDelta);

void ASPlayerState::AddScore(float ScoreDelta)
{
	float Score = GetScore();
	Score += ScoreDelta;
	SetScore(Score);
}
```
{{< /details >}}
2. 在`SGameMode`中新建委托`FOnActorKilled`用于广播玩家状态
 {{< details summary="在`SGameMode.h`声明`当前生命值`, `默认最大生命值`变量, 声明`处理受伤的函数`" >}}
```cpp
//添加三参数的委托（死者，造成伤害者，控制器）
DECLARE_DYNAMIC_MULTICAST_DELEGATE_ThreeParams(FOnActorKilled,AActor*,VictimActor,AActor*,KillerActor,AController*,KillerController);
class MULTIPLESHOOT_CFGO_API ASGameMode : public AGameModeBase
{
	GENERATED_BODY()
//...
public:
	UPROPERTY(BlueprintAssignable,Category="GameMode")
	FOnActorKilled OnActorKilled;
}
```
{{< /details >}}

 {{< details summary="在`SGameMode.cpp`中更换默认玩家状态" >}}
```cpp
ASGameMode::ASGameMode()
{
//...
	//更换GM的玩家状态
	PlayerStateClass = ASPlayerState::StaticClass();
}
```
{{< /details >}}

3. 修改`SHealthComponent`类，添加该单位是否死亡的变量。并调用GM中的委托，广播出去该单位死了
 {{< details summary="在`SHealthComponent.h`声明`是否死亡`" >}}
```cpp
//声明是否死亡变量
bool bIsDead;


//cpp中处理
USHealthComponent::USHealthComponent()
{
//...
	bIsDead = false;
}

void USHealthComponent::HandleTakeAnyDamage(AActor* DamagedActor, float Damage, const UDamageType* DamageType,AController* InstigatedBy, AActor* DamageCauser)
{
	//if (Damage <= 0)return;
	if (Damage <= 0 || bIsDead)return;
	//...
	bIsDead = Health <= 0;
	if (bIsDead)
	{
		ASGameMode* GM = Cast<ASGameMode>(GetWorld()->GetAuthGameMode());
		if (GM)
		{
			GM->OnActorKilled.Broadcast(GetOwner(),DamageCauser,InstigatedBy);
		}
	}
}
```
{{< /details >}}

4. 编写`BP_CoopGameGameMode`蓝图类，首先确保GM中的玩家状态类为SPlayerState
	![Untitled 7.webp](https://s3.zmingu.com/images/2025/04/2239747974.webp)

##  玩家重生机制
1. 玩家复活是在准备下一个关卡之后复活，修改SGameMode类
 {{< details summary="在`SGameMode.h`声明`重生玩家`函数，并在cpp中实现功能" >}}
```cpp
public:
    void RestartPlayers();
    

//cpp中实现
void ASGameMode::PrepareForNextWave()
{
//...
	RestartPlayers();
}

void ASGameMode::RestartPlayers()
{
	for (FConstPlayerControllerIterator It_PC = GetWorld()->GetPlayerControllerIterator(); It_PC; ++It_PC)
	{
		APlayerController* PC = It_PC->Get();
        //这里要角色死后调用了Destroy()函数才能进去。
		if (PC && PC->GetPawn() == nullptr)
		{
			RestartPlayer(PC);
		}
	}
}
```
{{< /details >}}
2. 运行结果：在玩家没有全部死亡，并且通关后，会复活已经死亡的角色


3. 快速搭建简单场景工具BSP-Tools
	略
