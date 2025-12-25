---
title: 新路由newifi3-d2最稳定固件刷写教程
date: 2025-09-09 00:38:56 +08:00
slug: newifi3-d2
draft: false
summary: "Newifi3 D2 刷入 immortalwrt 21.02.7 固件，配置换源、USB扩容、zram 及 IPv6 中继。"
keywords:
  - newifi3
  - immortalwrt
tags:
  - Openwrt
  - 路由器
categories:
  - 路由器
toc: true
collections:
  - router
---

1. 固件：immortalwrt 21.02.7
2. 换源：
```
sed -e 's,https://downloads.immortalwrt.org,https://mirrors.cernet.edu.cn/immortalwrt,g' \
    -e 's,https://mirrors.vsean.net/openwrt,https://mirrors.cernet.edu.cn/immortalwrt,g' \
    -i.bak /etc/opkg/distfeeds.conf
```
3. 扩容
```
opkg update
opkg install block-mount kmod-usb-storage kmod-usb-storage-uas kmod-fs-ext4 e2fsprogs cfdisk

mkfs.ext4 /dev/sda1

mount -t ext4 /dev/sda1 /mnt
cp /overlay/* /mnt -a
umount /mnt

block detect > /etc/config/fstab
uci set fstab.@mount[0].target='/overlay'
uci set fstab.@mount[0].enabled='1'
uci commit fstab

reboot
```
3. 安装zram
```
opkg update
opkg install kmod-zram zram-swap

dmesg | grep zram
cat /sys/block/zram0/comp_algorithm
cat /sys/block/zram0/disksize
```
4. 设置中继IPV6
	1. 设置WAN口和LAN口的，DHCP服务器 为三个中继模式
	2. 在/etc/config/dhcp中，在WAN口配置下添加一条 option master '1'
	3. 重启路由