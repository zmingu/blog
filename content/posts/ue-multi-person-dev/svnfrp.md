---
title: "UE异地协同开发-SVN（frp服务探索篇）"
subtitle:
date: 2022-11-30T21:36:00+08:00
lastmod: 2025-04-07T16:12:03+08:00
slug: ue-svn-frp
draft: false
keywords:
  - 虚幻引擎多人开发
  - SVN
  - frp
weight: 0
tags:
  - 虚幻引擎
categories:
  - 虚幻引擎
toc: true
collections:
  - Unreal Engine Multi Person Development
---
# 一.需求描述

> 之前想着异地协同开发，一开始想到的是使用异地组网的方式(参见[N2N服务篇](https://blog.zmingu.com/note/ue-svn-n2n.html)文章)，后面发现是我想复杂了，那个方法需要多台电脑同时开启N2N
edge。后面才想明白其实不需要组网，各个客户端只需要能够顺利访问部署了VisualSVN
Server服务的那台电脑就行了，而SVN服务端电脑是没有必要去访问到各个客户端的。所以其实只需要使用最简单的方法，Frp内网穿透就行了。
> 

# 二.实现条件

1. 拥有公网IP的云服务器一台。（Linux和Win都可，尽量大带宽），用于搭建Frp服务端。
2. 部署项目的机器A，安装VisualSVN Server，同时作为Frp客户端。
3. 用于拉库测试的任意网络环境的机器B


# 三.实现步骤

## 1.云服务器搭建frp服务。
1. 项目地址：[frp](https://github.com/fatedier/frp)
[x-github url="https://github.com/fatedier/frp"/]

2. 下载对应版本Frp，根据你的云服务器系统选择Linux或Win版本
(啊哈，既然有了Win的服务器了，我为啥不把VisualSVN Server直接安装到云服务器上呢，因为我腾讯云带宽4M，下载速度太慢，故选择购买了便宜国外大带宽小硬盘服务器，测试下来传输速度1-2MB)

3. 这里我下载的是Linux版本作为Frp服务器，需要修改frps.ini文件（其实frp还有很多高级配置）,给出简单示例：
```
[common]
bind_port = 7000
dashboard_port = 7500
dashboard_user = admin
dashboard_pwd = 123456
vhost_http_port = 8888
```
4. 运行frps服务(可自行添加自启)
`/home/frp/frps -c /home/frp/frps.ini &`

## 2.部署项目的机器A配置
1. 运行SVNServer服务端和Frp客户端。
2. 下载Windows版Frp，修改frpc.ini，在该文件目录下运行CMD命令行窗口输入命令：
`frpc.exe -c frpc.ini`
3. frpc.ini配置
```
[common]
server_addr = 你的云服务器的公网IP
server_port = 7000

[svn]
type = tcp
local_port = 7777
local_ip = 127.0.0.1
remote_port = 7777
```
3. 这里的local_port是机器A上SVNServer的端口，默认为443或80，可以改成自己想要的，防止冲突。


## 3.拉库测试的机器B
1. 检出：`https://你的云服务器IP地址:7777/svn/仓库名`

##4.改善
1. 此方法要保证运行frpc的机器A，命令行窗口不能关闭，既一直运行frpc客户端。
2. 刚好我的路由刷了OpenWrt固件，里面有Frp穿透功能，所以只要保证路由一直开着，机器A可以无需运行frpc客户端。配置方法参照frpc.ini。
  ![test.webp](https://s3.zmingu.com/images/2024/01/hm62df37i7.webp)