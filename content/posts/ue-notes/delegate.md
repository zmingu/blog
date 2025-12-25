---
title: 委托/代理-Delegate
subtitle:
date: 2023-04-08T22:58:00+08:00
lastmod: 2024-03-08T23:30:36+08:00
slug: delegate
draft: false
summary: "UE5 委托/代理机制详解：静态单播、静态多播、动态单播、动态多播四种类型的声明、绑定和执行。"
keywords:
  - Unreal Delegate
  - 虚幻引擎委托
  - 虚幻引擎代理
weight: 0
tags:
  - 虚幻引擎笔记
  - 委托/代理
categories:
  - 虚幻引擎
toc: true
collections:
  - ue-notes
---
[x-title]介绍[/x-title]
委托是一种观察者模式，也被称为代理，用于降低不同对象之间的耦合度，两个有关联的对象不对彼此的行为进行监听，而是通过委托来间接的建立联系，监听者将需要响应的函数绑定到委托对象上，使得委托在触发时调用所绑定的函数。
在虚幻引擎的实现中，委托本质上是通过宏定义实现的一个自定义的类，它是一个特殊的类，内部可以存储函数指针
，用以实现委托的执行，委托执行类似函数指针，但是更安全，因为支持编译期的类型检查，且委托更易于使用。

虚幻引擎中的委托按照绑定委托函数的个数分为单播和多播委托，又按照是否可暴漏给蓝图分为静态和动态委托，故可分为4种类型，在头文件 DelegateCombinations.h中提供了多种宏用于宏定义不同的委托，在该头文件中委托的参数数量最多支持到9个参数，但不意味着虚幻引擎的委托只能是9个参数，用于定义委托的宏，最终会进入到头文件 Delegate.h 中处理，查看该头文件源码可知委托定义时函数参数为可变类型，并没有限制为9个，不过9个参数也足够使用了。

[x-title]四种类型[/x-title]

## ① 静态单播
最常用的委托，只能绑定一个委托函数，绑定的委托函数可以有返回值，可接受不同数量的参数，委托实例必须绑定在其声明时所定义的同返回类型和参数列表的函数，静态委托执行前最好检查是否绑定，否则会导致程序崩溃，如果重复进行绑定，会覆盖上一次的绑定：
```cpp
// 单播委托：无参数，无返回值 
DECLARE_DELEGATE(DelegateName_1);
DelegateName_1 DelegateInst_1; 

// 单播委托：无参数，有返回值
DECLARE_DELEGATE_RetVal(int, DelegateName_2);
DelegateName_2 DelegateInst_2;
    
// 单播委托：有俩参数，无返回值
DECLARE_DELEGATE_TwoParams(DelegateName_3, int, int);
DelegateName_3 DelegateInst_3;

// 单播委托：有一个参数，有返回值
DECLARE_DELEGATE_RetVal_OneParam(int, DelegateName_4, int);
DelegateName_4 DelegateInst_4;
    
// 绑定委托函数，这里以绑定lambda函数为例 
DelegateInst_1.BindLambda([]{ "Lambda 1"; }); 
// 重复绑定时，会覆盖上一次的绑定，执行新绑定的函数 
DelegateInst_1.BindLambda([]{ "Lambda 2"; }); 

// 执行委托函数，如果定义的委托函数有参数或返回值，在此时传入和获取 
DelegateInst_1.Execute();
// 直接执行未绑定的单播会导致奔溃，执行前最好检查一下 
if (DelegateInst_1.IsBound()) DelegateInst_1.Execute();
// 也可以直接使用虚幻引擎提供的接口一步到位 
// 特别注意的是：有返回值的委托函数，不能用这个接口！
// 这个接口需要返回bool类型标识是否成功执行，可能这个原因使得在语法上不支持用于有返回的委托函数 
DelegateInst_1.ExecuteIfBound(); 

// 解除绑定 
DelegateInst_1.Unbind();

```
## ②静态多播
可以绑定多个委托函数，但委托函数不能有返回值，委托函数参数和静态单播类似，多播委托在广播执行时不一定是按照绑定顺序来的，在广播执行时，不需要判断是否绑定了委托函数，直接广播执行即可：

```cpp
DECLARE_MULTICAST_DELEGATE(DelegateName);
DelegateName DelegateInst;
    
// 逐一添加委托函数 
DelegateInst.AddLambda([]{ "Lambda 1"; }); // 绑定1
DelegateInst.AddLambda([]{ "Lambda 2"; }); // 绑定2
// 额外保存委托handle对象 
FDelegateHandle handleOb = DelegateInst.AddLambda([]{ "Lambda 3"; }); // 绑定3
// 绑定UFUNCTION时需要this指针
DelegateInst.AddUFunction(this, TEXT("FunctionName")); // 绑定4

// 通过广播执行，不需要判断是否绑定了委托函数 
DelegateInst.Broadcast();

// 解除绑定单个绑定，需要保存绑定时的 handle 对象
DelegateInst.Remove(FDelegateHandle);
// 如果想解除所有绑定，可能会想到使用RemoveAll()，但该函数只会解绑指定指针所绑定的委托，
// 如下调用会清除当前类所绑定的委托，当前类绑定委托指的是绑定的时候用到了 this 指针，
// 所以执行后只会清除上述的绑定4，因为用到了this指针，其余3个绑定仍然可以被广播执行
DelegateInst.RemoveAll(this);

// 可以使用Clear接口清除所有绑定，其底层实现利用的是Unbind() 
DelegateInst.Clear();

```

## ③ 动态单播
动态即支持蓝图序列化，可以用宏 UPROPERTY 标记动态单播实例，在添加元数据 BlueprintReadWrite 后即可在蓝图获取到其实例引用，动态委托的类型名称必须以 “F” 开头，虽然可以暴漏给蓝图使用，但动态委托只能绑定UFUNCTION宏标记的函数，还有一点就是动态委托的委托函数参数，需要同时写出参数类型名称和参数变量名称：
```cpp
// 动态委托需要同时写出函数参数类型名称和参数变量名称，且自定义委托名称以‘F’开头 
DECLARE_DYNAMIC_DELEGATE_OneParam(FDelegateName, int, num);

// 动态委托可以使用宏标记暴露给蓝图，但动态单播不能在蓝图定义委托实例和绑定委托函数 
UPROPERTY(BlueprintReadWrite)
    FDelegateName DelegateInst;

// 类似静态单播的绑定，但只能绑定被UFUNCTION标记的函数 
DelegateInst.BindUFunction(this, TEXT("UFunctionName"));
// 官方文档建议用下面的宏来绑定，建议按官方文档的方式来 
DelegateInst.BindDynamic(this, &MyClassName::UFunctionName);

// 执行委托 
if (DelegateInst_1.IsBound()) DelegateInst_1.Execute(666);

// 解除委托 
DelegateInst.Unbind();

```

## ④ 动态多播
动态即支持蓝图序列化，即可在蓝图中绑定事件，但蓝图获取不到在C++中定义的动态多播的实例引用，即使用元数据 BlueprintReadWrite 标记也不行，但可以通过 【Assign 实例名称】 的蓝图节点为在C++中定义的动态多播对象绑定新的委托函数：
```cpp
// 动态委托需要同时写出函数参数类型名称和参数变量名称，且自定义委托名称以‘F’开头 
DECLARE_DYNAMIC_MULTICAST_DELEGATE(FDelegateName, int, num);

// 动态多播委托通过红标记中 BlueprintAssignable 元数据使其可在蓝图中定义委托实例和绑定委托函数 
UPROPERTY(BlueprintAssignable)
    FDelegateName DelegateInst;

// 绑定多个动态委托，委托函数必须是被UFUNCTION标记的函数 
DelegateInst.AddDynamic(this, &MyClassName::UFunctionName_1);
DelegateInst.AddDynamic(this, &MyClassName::UFunctionName_2);
DelegateInst.AddDynamic(this, &MyClassName::UFunctionName_3);

// 广播执行动态多播委托 
DelegateInst.Broadcast();

// 解除单个委托，动态单播解绑就不需要保存FDelegateHandle对象了，和绑定时参数一致 
DelegateInst.RemoveDynamic(this, &MyClassName::UFunctionName_3);
// 解除所有绑定的委托 
DelegateInst.Clear();

```
在C++代码中定义好动态多播实例 DelegateInst 后，可以在蓝图中通过 Assign 实例名称 (即 Assign DelegateInst) 节点来绑定委托函数，新建了一个事件调度器（EventDispatcher）为指定的动态多播对象绑定（Bind Event to Delegate Inst）指定的委托函数（Print String）：
![2025-04-08T15:19:05.webp](https://s3.zmingu.com/images/2025/04/951423618.webp)

① 委托的声明，书写格式遵循：DECLARE_[DYNAMIC]_[MULTICAST]_DELEGATE_[RetVal]_[XXXParam(s)]，单词是有顺序的；

② 单播委托在执行前务必判断是否有绑定委托函数，建议使用 ExecuteIfBound，多播委托的广播执行是安全的，不论是否绑定了委托函数；

③ 多播委托所绑定的委托函数不能有返回值；

④ 动态委托性能比静态委托更低，运行更慢，这是动态委托支持蓝图序列化的代价；

⑤ 动态委托的宏辅助声明，委托函数参数类型名称和参数变量名称都要写出来，静态委托只需要写参数类型名称即可；

⑥ 动态委托的宏声明之后必须有分号，否则有编译错误，而静态委托不需要，为了使得编码统一，用宏来声明委托时，都在后面加分号处理；

⑦ 在 DelegateCombinations.h 头文件中也有一种对事件的宏定义：DECLARE_EVENT_[XXXParam(s)]，按照源码中的注释，本质上就是一个多播委托，但事件在定义的时候需要传入一个拥有者对象，事件只有在该拥有者内部绑定委托才生效，源码注释中建议不要使用此类事件，建议就用普通的多播委托即可。

[x-title]步骤[/x-title]
1. 声明委托
2. 定义委托实例
3. 绑定委托函数
4. 在需要回调的地方执行委托函数

# 自定义事件

1. 声明事件(参数)

```cpp
DECLARE_EVENT_OneParam(MyRawClass, MyActionEvent1, FString);//类名,事件名,参数类型
```

1. 创建事件变量

```cpp
MyActionEvent1 ActionEvent;
```

1. 用事件变量绑定和调用函数

```cpp
ActionEvent.AddUObject(this, &ADelegateActor::OneParamDelegateFunc);

ActionEvent.Broadcast("Event Call");
```

事件和委托的区别


[引用](https://zhuanlan.zhihu.com/p/415867431)
