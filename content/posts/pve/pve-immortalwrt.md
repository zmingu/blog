---
title: PVE安装和配置immortalwrt
date: 2025-09-09 10:22:41 +08:00
slug: pve-immortalwrt
draft: false
keywords:
  - pve
  - immortalwrt
  - 虚拟机
  - immortalwrt-efi
  - immortalwrt-squashfs
tags:
  - pve
  - immortalwrt
  - 虚拟机
categories:
  - 服务器
toc: true
collections:
  - pve
---
1. 下载固件 Generic x86/64 的 squashfs-combined-efi.img.gz
2. 创建虚拟机
	1. 常规-高级
		- [x] 开机自启动
	2. 操作系统
		- [x] 不使用任何介质
	3. 系统
		-  ![image.png](https://s3.zmingu.com/images/2025/09/09/20250909103328728.webp)
	4. 磁盘
		- 不需要磁盘
	5. CPU
		- 核心自由分配，给4核心
		- 类别：Host
	6. 内存
		- 1024
	7. 网络
		- 默认
3. 解压固件压缩包得到img镜像上传固件到PVE
	1. 得到上传后的地址：`/var/lib/vz/template/iso/immortalwrt-24.10.2-x86-64-generic-squashfs-combined-efi.img`
4. 导入镜像到虚拟机中
	1. 到 pve-shell 界面
	2. 运行`qm disk import 107 /var/lib/vz/template/iso/immortalwrt-24.10.2-x86-64-generic-squashfs-combined-efi.img local-lvm`
	3. 需要改的是虚拟机编号 `107`，和镜像地址为自己的
5. 双击虚拟机-硬件-未使用的磁盘0，默认即可
6. 磁盘扩容
	1. ImmortalWrt官方镜像只有300M的空间，我们扩到2G
	2. 选中刚刚的硬盘，上方磁盘操作，调整大小，增量为2
	3. 此时分区并未扩容，因为这只是增加了虚拟磁盘的大小，而分区的大小未改变，因此我们在进入系统后需要进行二次更改
7. 添加网卡（如果你有多个网口）
	1. 先确定pve现在使用的虚拟网桥`vmbr0`绑定的哪个网卡，如果直通了该网卡会导致网页管理界面挂掉
		1. pve-系统-网络-观察`vmbr0`绑定的端口/从属，我这为`enp3s0f0`
		2. shell 运行 `ethtool -i 'enp3s0f0'`,找到结果中的`bus-info`，这便是虚拟网球绑定的pci设备id，我这是`bus-info: 0000:03:00.0`
		3. 在直通的过程中，注意不要将这个网卡直通给虚拟机
	2. 硬件-添加-PCI设备
	3. 原始设备中找到自己的其他网卡-勾选所有功能
8. 添加引导
	1. 默认不会启动虚拟机中的镜像，需要修改引导
	2. 选择`选项`-`引导顺序`,只勾选`scsi0`
9. 启动虚拟机，关闭启动选项中的net0启动
	1. 启动后报错，任意键进bios
	2. `Device Manager`-`Secure Boot Configuration`-`Attempt Secure Boot` 回车两下，取消选中
	3. F10 - Y 确认
	4. 一路按`Esc`键退出到`Boot Manager`首页，选择`Continue`并回车重启
10. 更改Lan口地址
	1. `ifconfig`查看当前lan口地址，显示为`192.168.1.1`
	2. 修改配置文件，运行`vim /etc/config/network`，找到lan口的ip地址，按i进入编辑模式，我修改为192.168.2.5，ESC后依次输入 :wq 保存并退出
	3. reboot
11. 利用PVE扩容镜像
# 安装iStore商店
wget -qO imm.sh https://cafe.cpolar.cn/wkdaily/zero3/raw/branch/main/zero3/imm.sh && chmod +x imm.sh && ./imm.sh
is-opkg install luci-i18n-quickstart-zh-cn

扩容
[基于efi启动的squashfs格式的 immortalwrt/或openwrt 软路由系统overlay空间扩容\_immortalwrt扩容-CSDN博客](https://blog.csdn.net/qq_36961488/article/details/148231601)
