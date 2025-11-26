---
title: 小米cr8808最稳hzyitc固件教程
date: 2025-09-07 14:37:50 +08:00
slug: xiaomi-cr8808
draft: false
keywords:
  - 小米cr8808
  - hzyitc固件
  - Openwrt
  - qsdk
tags:
  - Openwrt
  - 路由器
categories:
  - 路由器
toc: true
collections:
  - router
---

固件（支持NSS NAT）：
[GitHub - hzyitc/openwrt-redmi-ax3000 at ipq50xx-qsdk-kernel-5.4-openwrt-21.02-qsdk-11.5.05.841.1029](https://github.com/hzyitc/openwrt-redmi-ax3000/tree/ipq50xx-qsdk-kernel-5.4-openwrt-21.02-qsdk-11.5.05.841.1029)

初始化操作：
1. 快速换源命令： `sed -i 's_downloads.openwrt.org_mirrors.aliyun.com/openwrt_' /etc/opkg/distfeeds.conf`
2. 更新软件列表：`opkg update`
3. 安装简中界面：`opkg install luci-i18n-base-zh-cn luci-i18n-opkg-zh-cn luci-i18n-firewall-zh-cn`
4. 设置正确的系统：系统-常规设置-时区，设置为`Asia/Shanghai`
5. 开启硬件加速：开启位置为，网络-防火墙-路由/NAT分载，勾选两个。
6. 安装`zram`扩容内存（设置位置在-系统-系统-ZRam设置）：`opkg install kmod-zram zram-swap`
	1. 安装zstd压缩支持：`opkg install kmod-lib-zstd kmod-lib-lz4 kmod-lib-lzo`
7. CPU 性能调度优化:opkg update && opkg install irqbalance
8. 开启数据包引导 (Packet Steering):- “**网络**” -> “**接口**” -> “**全局网络选项**”。勾选 “**数据包引导 (Packet Steering)**”。
9. 安装`wget-ssl`：`opkg install wget-ssl`
10. 有线无线mesh（kvr漫游）支持：
	1. 安装软件包：`opkg remove wpad-basic & opkg install wpad-mesh-openssl`
	2. 编辑无线配置：`vi /etc/config/wireless`
	3. 找到并替换`option ieee80211r '1'`为
		```
		option ieee80211k '1'  
		option rrm_neighbor_report '1'  
		option rrm_beacon_report '1'  
		option ieee80211v '1'  
		option bss_transition '1'  
		option ieee80211r '1'  
		option mobility_domain '1234'  
		option ft_over_ds '1'  
		option ft_psk_generate_local '1'
		```
	4. 若要使用5G的`160Mhz`频宽，需要设置信道为`36`国家代码为`CN`

11. 科学上网：passwall
	1. 安装透明代理基础依赖：`opkg install ipset iptables-mod-tproxy iptables-mod-iprange iptables-mod-conntrack-extra kmod-ipt-nat`
	2. 卸载 `dnsmasq `安装 后面会安装`dnsmasq-full`
	3. 将全部依赖.ipk临时复制到root目录，并执行命令安装所有依赖：`opkg intsll *.ipk`
		- 会提示已经存在/etc/config/dhcp配置，dnsmasq-full为我们创建的dhcp配置模板被重命名为dhcp-opkg放在同目录下，不必理会
		- 然后删除root目录下的所有ipk文件
	4. 安装passwall界面和汉化包
		- 将luci-app-passwall以及汉化包临时放入root目录，执行安装命令：`opkg intsll *.ipk`
	5. 更新下规则重启就能科学上网了
12. 安装其他实用工具（可选）
	1. 可以直接在线安装的：upnp，wol，smartdns，wireguard，zerotier，adblock 
		1. Upnp：`opkg install luci-app-upnp luci-i18n-upnp-zh-cn`
		2. Wol网络唤醒：`opkg install luci-app-wol luci-i18n-wol-zh-cn 
		3. Smartdns：`opkg install luci-app-smartdns luci-i18n-smartdns-zh-cn`
		4. Wireguard代理：`opkg install luci-app-wireguard luci-i18n-wireguard-zh-cn`
		5. 去广告Adblock：`opkg install luci-app-adblock luci-i18n-simple-adblock-zh-cn`
	2. 需要离线包离线安装的（可选，自测，依赖问题需自行寻找依赖，我能提供的依赖都在文章末尾给出）
		1. CPU调度设置：luci-app-cpufreq
		2. Zerotier组网：luci-i18n-zerotier
```
luci-app-ac1
luci-app-adblock
luci-app-adbybyplus
luci-app-aliddnsluci-app-ddns
luci-app-ddns-go
luci-app-smartdns
luci-app-passwal1
luci-app-ssr-plus
luci-appopenclash
luci-appwireguard
luci-app-openvpn
luci-app-zerotierluci-app-frpc
luci-app-turboacc
luci-app-aria2
luci-app--ransmission
luci-app-gbittorrent
luci-app-xunlei
luci-app-samba4
luci-app-alist
luci-app-minidlna
luci-app-ilebrowser
luci-app-rclone
luci-app-advanced-reboot
luci-app-argon-config
luci-app-autoreboot
luci-app-commands
luci-app-cpufreq
luci-app-diskman
luci-app-firewal1
luci-app-nlbwmonluci-app-opkg
luci-app-sqm
luci-app-statistics
luci-app-ttyd
luci-app-wo1
luci-app-wifischedule

```




AX3000 -> 原厂CR8808