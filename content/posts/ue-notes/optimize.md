---
title: "虚幻引擎性能优化"
subtitle:
date: 2025-02-11T00:07:00+08:00
lastmod: 2025-04-15T14:45:23+08:00
slug: ue-optimize
draft: false
keywords:
  - 虚幻引擎性能优化
weight: 0
tags:
  - 虚幻引擎笔记
categories:
  - 虚幻引擎
toc: true
collections:
  - ue-notes
---
# 常用命令

## profile GPU

ctrl+shit+，
![image.webp](https://s3.zmingu.com/images/2025/04/3967146619.webp)

## stat

![image 1.webp](https://s3.zmingu.com/images/2025/04/1032805360.webp)

stat unit          - 显示基本性能统计
stat fps           - 显示帧率
stat game         - 显示游戏线程统计
stat gpu          - 显示GPU统计
stat memory      - 显示内存使用
stat startfile    - 开始记录性能数据
stat stopfile     - 停止记录性能数据

- stat CPULoad: cpu利用率
- stat Engine: 显示一般渲染状态，例如帧时间，以及正在渲染的三角形数量的计数器
- stat fps
- stat Game: 游戏内各个进程tick耗时
- stat GPU: GPU统计数据
- stat Memory: 内存使用统计
- stat SceneRendering: 查看场景渲染统计
- stat ShaderCompiling: 着色器编译信息
- stat Shaders: 着色器压缩统计
- stat ShadowRendering: 阴影计算开销
- stat TargetPlatform: 目标平台信息
- stat UI: UI性能信息
- stat Unit: 总体帧时间、游戏线程、渲染线程与GPU时间

## Unreal Insights

!![image 2.png](https://s3.zmingu.com/images/2025/04/2406862328.png)

Trace

![image 3.webp](https://s3.zmingu.com/images/2025/04/1721442751.webp)

开启命名统计事件更详细

记录命令：

Trace.Send localhost CPU

Trace.File ExampleTrace gpu,cpu,frame

Trace.Send
Trace.File

Trace.Stop
stat NamedEvents

[虚幻引擎中的Unreal Insights | 虚幻引擎 5.5 文档 | Epic Developer Community](https://dev.epicgames.com/documentation/zh-cn/unreal-engine/unreal-insights-in-unreal-engine)