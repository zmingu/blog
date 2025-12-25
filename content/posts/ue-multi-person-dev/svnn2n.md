---
title: "UE异地协同开发-SVN（n2n探索篇 ）"
subtitle:
date: 2022-11-19T20:22:00+08:00
lastmod: 2025-04-07T16:11:39+08:00
slug: svnn2n
draft: false
summary: "使用 n2n 组建虚拟局域网实现 UE 项目异地 SVN 协同开发。"
keywords:
  - 虚幻引擎多人开发
  - SVN
  - n2n
weight: 0
tags:
  - 虚幻引擎
categories:
  - 虚幻引擎
toc: true
collections:
  - Unreal Engine Multi Person Development
---
# 一.服务端配置
1. 下载N2N的deb包:[ntop/n2n](https://github.com/ntop/n2n)

2. 安装deb包(Debian)
`sudo dpkg -i package_file.deb`

3. 服务器开启服务（如果使用阿里云或腾讯云记得开放防火墙端口）
```
#实际使用时，可以去掉 -f 参数，使其后台运行
supernode -p 9527 -f
```

# 二.客户端配置
1. 客户端下载：[EasyN2N启动器](https://bugxia.com/357.html)


2. 客户端设置：服务器，虚拟网ip和小组名称。
![hm67crsczp.webp](https://s3.zmingu.com/images/2024/01/hm67crsczp.webp)

# 测试
- 测试成功，传输速度受云服务器带宽限制。
![test.webp](https://s3.zmingu.com/images/2024/01/hm67pddpi4.webp)