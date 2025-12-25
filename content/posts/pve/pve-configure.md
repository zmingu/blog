---
title: PVE配置
date: 2025-09-09 10:22:41 +08:00
slug: pve-configure
draft: false
summary: "PVE 进阶配置指南：显卡直通、硬盘直通、黑群晖安装、Docker 配置、LXC 容器管理及 CPU 省电优化。"
keywords:
  - pve
tags:
  - pve
categories:
  - 服务器
toc: true
collections:
  - pve
---
# 修改IP
- `/etc/network/interfaces`
- `/etc/issue`
- `/etc/hosts`

# 直通显卡
1. 修改grub启动参数：改文件 `/etc/default/grub` 中 `GRUB_CMDLINE_LINUX_DEFAULT` 配置：
	```cpp
	`GRUB_CMDLINE_LINUX_DEFAULT="quiet iommu=pt initcall_blacklist=sysfb_init amd_iommu=on drm.debug=0 kvm_amd.nested=1 kvm.ignore_msrs=1 kvm.report_ignored_msrs=0 pci=assign-busses pcie_acs_override=downstream,multifunction vfio_iommu_type1.allow_unsafe_interrupts=1"`
	
	```
	- 其中必须添加的：
		- `iommu=pt` 设置iommu为直通模式pass through
		- `initcall_blacklist=sysfb_init` 屏蔽掉pve7.2的一个bug
		- `pcie_acs_override=downstream,multifunction` iommu分组补丁  
	    - 其他参数之前直通存在问题，修改的一些配置，具体含义未详细了解，去掉是否有影响本人未做尝试。
	- 执行`update-grub`更新grub
2. 添加驱动黑名单：修改或新增配置文件`/etc/modprobe.d/blacklist.conf`， 添加内容：
	```cpp
	blacklist amdgpu
	blacklist snd_hda_intel
	```
3. 添加加载模块：修改或新增配置文件`/etc/modules`， 添加内容：
	```cpp
	vfio 
	vfio_iommu_type1 
	vfio_pci
	vfio_virqfd
	```
4. 获取核显id并绑定核显设备
	```cpp
	root@nas:/# lspci -D -nnk | grep VGA
	0000:07:00.0 VGA compatible controller [0300]: Advanced Micro Devices, Inc. [AMD/ATI] Cezanne [1002:1638] (rev c9)
	```
	- 记下命令显示的最前面的数字序号为IOMMU分组 `0000:07:00.0`；后面中括弧中`1002:1638`为设备id
	- 修改或新增配置文件`/etc/modprobe.d/vfio.conf`， 添加内容：
		```cpp
		options vfio-pci ids=1002:1638
		options vfio-pci disable_idle_d3=1
		```
	- 其中`1002:1638`为核显设备id，如果已经存在其他直通设备，请使用 `,` 进行分隔填写多个，如：  
`options vfio-pci ids=14c3:7961,1002:1638`
执行命令： `update-initramfs -u -k all`  
重启机器：`reboot`

```
4. 添加vendor-reset

AMD显卡直通会出现第一次启动VM之后，如果关闭或重启VM，显卡就会工作不正常、掉驱动甚至不工作，这是由于AMD Reset Bug导致VM关机后显卡不能正确重置(重新被宿主机系统抓取)，大多数主机开机只能使用一次，第二次尝试使用显卡则会导致VM启动失败，甚至影响VM宿主机卡死

安装编译vendor-reset驱动需要的依赖(在网卡部分安装过则可以跳过)

apt install pve-headers-$(uname -r)
apt install git dkms build-essential

下载vender-reset驱动并编译
git clone https://github.com/gnif/vendor-reset.git
cd vendor-reset
dkms install .

将驱动添加到modules管理中
echo "vendor-reset" >> /etc/modules
update-initramfs -u

重启后运行
dmesg | grep vendor
如果有输出，则表示安装成功
[    8.851280] vendor_reset_hook: installed
```

[PVE使用AMD CPU 5600G 核显直通\_pve 5600g核显直通-CSDN博客](https://blog.csdn.net/qq_42912965/article/details/126815332)



#  直通硬盘
```text
ls /dev/disk/by-id
qm set 103 -sata2 /dev/disk/by-id/ata-Micron_M600_MTFDDAK1T0MBF_1613122FA078.
qm set 103 -sata3 /dev/disk/by-id/ata-WDC_WD10SPZX-21Z10T0_WD-WXH1A39FD0TY
```
# 安装黑群晖

[GitHub - RROrg/rr: Redpill Recovery (arpl-i18n)](https://github.com/RROrg/rr)一键安装脚本：
```
curl -fsSL https://github.com/RROrg/rr/raw/refs/heads/main/scripts/pve.sh | bash
```

2. 洗白
3. 9p共享
	1. args: -cpu host,+kvm_pv_eoi,+kvm_pv_unhalt,svm,hv_vendor_id=AuthenticAMD -fsdev local,security_model=passthrough,id=fsdev0,path=/mnt/pve/ssd -device virtio-9p-pci,id=fs0,fsdev=fsdev0,mount_tag=virtio9p
4. 






# PVE
## 一键脚本（自行验证）
1. [Mapleawaa/PVE-Tools-9](https://github.com/Mapleawaa/PVE-Tools-9)
	-
2. [xiangfeidexiaohuo/pve-diy](https://github.com/xiangfeidexiaohuo/pve-diy)
	1. bash -c "$(curl -fsSL https://raw.githubusercontent.com/xiangfeidexiaohuo/pve-diy/master/pve.sh)"
3. ~~pve_source(支持pve8，未更新，功能自测)~~
```bash
wget -q -O /root/pve_source.tar.gz 'https://bbs.x86pi.cn/file/topic/2024-01-06/file/24f723efc6ab4913b1f99c97a1d1a472b2.gz' && tar zxvf /root/pve_source.tar.gz && /root/./pve_source
```
1. ~~pvetools(支持pve8，未更新，功能自测)~~
   ```bash
	export LC_ALL=en_US.UTF-8
	apt update && apt -y install git && git clone https://github.com/ivanhao/pvetools.git
	cd pvetools
	./pvetools.sh
	```



风扇监控：安装完驱动后，在/etc/default/grub增加 acpi_enforce_resources=lax，最后update-grub




```bash
# 更改虚拟机ID
# 获取 lv_name、vg_name
lvs --noheadings -o lv_name,vg_name | grep 210
# 返回值 vm-210-disk-0 pve
# pve/vm-210-disk-0 是 $vg_name/$lv_name
# 然后执行命令，如果有多个，每个执行一次替换
lvrename pve/vm-210-disk-0 vm-310-disk-0
# KVM进入 `/etc/pve/qemu-server` 目录, LXC 容器进入 `/etc/pve/lxc` 目录
# 重命名配置文件
mv 210.conf 310.conf
# 编辑该配置文件，修改VM磁盘ID，配置项 `sata0`、`sata1`等等
echo "ALTER USER postgres with encrypted password 'Zmingu1025.';" | sudo -u postgres psql
```
# Docker
1. frp
	1. 加密传输：新版已全局默认，单个为`transport.useEncryption = true`
	2. 压缩传输：如果有前置Nginx，则去Nginx设置压缩，`transport.useCompression = true`

2. Traefik
	1. 加密Dashboard
		1. `echo $(htpasswd -nb your_username your_password) | sed -e s/\\$/\\$\\$/g`
		2. 修改`traefik`的`docker-compose.yml`，为其**labels**添加中间件配置：
			```yaml
labels:
# ... 其他标签保持不变 ...
# --- Basic Auth 中间件定义 ---
- "traefik.http.middlewares.my-auth.basicauth.users=your_username:$$apr1$$..." # 粘贴上一步生成的字符串
# --- 将中间件应用到 Dashboard ---
- "traefik.http.routers.dashboard.middlewares=my-auth"
```
		3. 信任来自 FRP 管道的请求
			```yaml
# 定义入口点 (EntryPoints)，即流量的入口
entryPoints:
  web:
    address: ":80"
    # --- 添加下面这部分 ---
    forwardedHeaders:
      # 信任所有来源的 X-Forwarded-* 头信息
      # 在我们的架构中，只有可信的FRP管道会连接到这个端口，所以这样设置是安全的
      insecure: true
```
3. 暴露docker远程API
[Docker 启用 远程 API \| 知识库](https://wiki.martinpu.cn/enable-docker-api.html#docker-api)


## LXC端口转发
```
echo 'net.ipv4.ip_forward = 1' | tee -a /etc/sysctl.d/99-tailscale.conf
echo 'net.ipv6.conf.all.forwarding = 1' | tee -a /etc/sysctl.d/99-tailscale.conf
sysctl -p /etc/sysctl.d/99-tailscale.conf

tailscale up --advertise-routes=192.168.2.0/24

```


apt install mesa-va-drivers radeontop vainfo

2. LXC挂载NFS
```shell
	apt-get install nfs-common -y
	showmount -e NFS服务器的ip地址
	mkdir /mnt/nfs
	mount -t nfs4 192.168.2.3:/volume3/video /mnt/nfs
	> # 编辑/etc/fstab：
> 
> nano /etc/fstab
> 
> # 添加挂载内容，重启后用df -h或ls查看自动挂载是否生效：
> 
> //NFS服务器ip地址:/共享目录名 /mnt/smb nfs auto,nolock 0 0
```
2. LXC挂载webdav
```shell
	apt-get install davfs2 -y
	apt-get install neon -y
	mkdir /mnt/webdav
	mount -t davfs http://服务器ip或者域名:端口号/dav /mnt/webdav
	# 根据提示输入用户名和密码即可。
	
	#开机自动挂载
# 编辑/etc/fstab：
nano /etc/fstab
# 添加配置：
# https://服务器ip或域名:端口号/dav /mnt/webdav davfs user,noauto,uid=用户名,file_mode=600,dir_mode=700 0 1
```
[post.smzdm.com/p/al82p3eg/](https://post.smzdm.com/p/al82p3eg/)
3. LXC frpc
/usr/local/bin/
/tc/frp

# LXC
## alpine安装fprc

```
[Alpine Linux如何安装FRP最新版 \| 24K PLUS](https://www.24kplus.com/linux/2323.html)
tee /etc/init.d/frpc <<EOF
#!/sbin/openrc-run
name="frp client"
command="/usr/local/bin/frpc"
command_args="-c /opt/frpc/frpc.toml"
command_user="nobody"

depend() {
    need net
}
EOF

sudo chmod +x /etc/init.d/frpc
sudo rc-update add frpc default

sudo service frpc start
sudo service frpc status

sudo service frpc stop
sudo cp frps /usr/local/bin/frpc
sudo service frpc start

```

# ZFS使用
```
数据集：
zfs destroy hdd-data/storage                                # 摧毁数据集
zfs create -o mountpoint=/mnt/hdd-data/media hdd-data/media # 创建用于存放媒体文件的数据集

# 设置顶层不放置文件
zfs set mountpoint=none hdd-data


```



# Debain命令






# PVE
## BIOS设置
### 主板设置
1. 开启SVM模式
2. 开启IOMMU
3. 关闭 CSM Support
4. 关闭 Secure Boot (安全启动)
- CPU C-States： `Enabled`
- **Power Supply Idle Control**：Low Current Idle
- PCI Express Active State Power Management：Enabled
- 禁用声卡
## 初始化
1. 社区脚本初始化源等： `bash -c "$(curl -fsSL https://git.community-scripts.org/community-scripts/ProxmoxVE/raw/branch/main/tools/pve/post-pve-install.sh)" `
```
 ✓ Disabled 'pve-enterprise' repository
 ✓ Disabled 'ceph enterprise' repository
 ✓ Added 'pve-no-subscription' repository
 ✓ 'ceph' package repository (no-subscription) already exists (skipped)
 ✓ Added 'pve-test' repository
 ✓ Disabled subscription nag (Delete browser cache)
 ✓ Disabled high availability
 ✓ Disabled Corosync
 ✓ Updated Proxmox VE
 ✓ Completed Post Install Routines
```
2. Github脚本： `bash <(curl -sSL https://ghfast.top/github.com/Mapleawaa/PVE-Tools-9/blob/main/PVE-Tools.sh)`
	1. 换源：
	2. 卸载ceph
```
[2025-10-15 21:14:34] [STEP] 开始为您的 PVE 换上飞速源
[2025-10-15 21:14:34] [INFO] 安全更新源选择
  安全更新源包含重要的系统安全补丁，选择合适的源很重要：
  1) 使用官方安全源 (推荐，更新最及时，但可能较慢)
  2) 使用镜像站安全源 (速度快，但可能有延迟)

  请选择 [1-2] (默认: 1): 1
[2025-10-15 21:14:46] [INFO] 将使用官方安全更新源
[2025-10-15 21:14:46] [INFO] 正在配置 Debian 镜像源...
[2025-10-15 21:14:47] [INFO] 贴心备份完成: /etc/apt/sources.list.d/debian.sources
[2025-10-15 21:14:47] [INFO] 备份文件位置: /etc/pve-tools-9-bak/debian.sources.backup.20251015_211447
[2025-10-15 21:14:47] [INFO] 正在关闭企业源（我们用免费版就够啦）...
[2025-10-15 21:14:47] [INFO] 贴心备份完成: /etc/apt/sources.list.d/pve-enterprise.sources
[2025-10-15 21:14:47] [INFO] 备份文件位置: /etc/pve-tools-9-bak/pve-enterprise.sources.backup.20251015_211447
[2025-10-15 21:14:47] [INFO] 正在配置 Ceph 镜像源...
[2025-10-15 21:14:47] [INFO] 贴心备份完成: /etc/apt/sources.list.d/ceph.sources
[2025-10-15 21:14:47] [INFO] 备份文件位置: /etc/pve-tools-9-bak/ceph.sources.backup.20251015_211447
[2025-10-15 21:14:47] [INFO] 正在添加免费版专用源...
[2025-10-15 21:14:47] [INFO] 正在加速 CT 模板下载...
[2025-10-15 21:14:47] [INFO] 贴心备份完成: /usr/share/perl5/PVE/APLInfo.pm
[2025-10-15 21:14:47] [INFO] 备份文件位置: /etc/pve-tools-9-bak/APLInfo.pm.backup.20251015_211447
[2025-10-15 21:14:47] [SUCCESS] 太棒了！所有源都换成飞速版本啦

  Ceph管理
------------------------------------------------
  1  . 添加ceph-squid源 (PVE8/9专用)
  2  . 添加ceph-quincy源 (PVE7/8专用)
  3  . 卸载Ceph (完全移除Ceph)
------------------------------------------------
  0  . 返回主菜单
------------------------------------------------

请选择 [0-3]: 3

[2025-10-15 21:18:18] [WARN] 会卸载ceph，并删除所有ceph相关文件！
Failed to stop ceph-mon.target: Unit ceph-mon.target not loaded.
ceph-mon: no process found
ceph-mgr: no process found
ceph-mds: no process found
ceph-osd: no process found
unable to get monitor info from DNS SRV with service name: ceph-mon
2025-10-15T21:18:19.259+0800 7b2ff81ccb80 -1 failed for service _ceph-mon._tcp
2025-10-15T21:18:19.260+0800 7b2ff81ccb80 -1 monclient: get_monmap_and_config cannot identify monitors to contact
rados_connect failed - No such file or directory
Error gathering ceph info, already purged? Message: rados_connect failed - No such file or directory
Removing config & keyring files
Package 'ceph-mon' is not installed, so not removed
Package 'ceph-osd' is not installed, so not removed
Package 'ceph-mgr' is not installed, so not removed
Package 'ceph-mds' is not installed, so not removed
Summary:
  Upgrading: 0, Installing: 0, Removing: 0, Not Upgrading: 0
Package 'ceph-base' is not installed, so not removed
Package 'ceph-mgr-modules-core' is not installed, so not removed
Summary:
  Upgrading: 0, Installing: 0, Removing: 0, Not Upgrading: 0
mv: cannot move '/etc/apt/sources.list.d/ceph.sources' to '/etc/apt/backup/ceph.sources.bak': No such file or directory
[2025-10-15 21:18:19] [SUCCESS] 已成功卸载ceph.

 
```
2. 设置CPU：
	1. 社区脚本设置省电模式：bash -c "$(curl -fsSL https://raw.githubusercontent.com/community-scripts/ProxmoxVE/main/tools/pve/scaling-governor.sh)"
	2. 查看当前运行模式：cat /sys/devices/system/cpu/cpu*/cpufreq/scaling_governor
	3. 查看当前可以用的运行模式：cat /sys/devices/system/cpu/cpu0/cpufreq/scaling_available_governors
	4. 深度休眠需启用 BIOS C-States：cat /sys/devices/system/cpu/cpu0/cpuidle/state*/name（确认有 C6）
	5. 限制最大最小频率：
		1. apt-get install linux-cpupower
		2. cpupower frequency-set -g powersave -d 400MHz -u 2000MHz
		3. cpupower frequency-set -d 2.5GHz -u 3.6GHz
```
# 查看CPU驱动
cpupower frequency-info

# Governor 选择节能模式
sudo cpupower frequency-set -g powersave

# 限制CPU频率在 400MHz ~ 3.6GHz
sudo cpupower frequency-set -d 400MHz -u 1500MHz

cpupower -c all frequency-set -d 1.0GHz # 设置CPU最小频率为2.4GHz
cpupower -c all frequency-set -u 2.4GHz # 设置CPU最大频率为2.4GHz

# 查看实时频率
watch -n 1 "grep 'cpu MHz' /proc/cpuinfo"
watch -n 1 cpupower monitor
watch -n 1 cat /sys/devices/system/cpu/cpu*/cpufreq/scaling_cur_freq

tuned-adm profile powersave
```
2. 系统服务：
	1. 查看正在运行的系统服务：systemctl list-units --type=service --state=running

 安装风扇传感器：[GitHub - skyshenma/pve-nsa-fan-ctrl](https://github.com/skyshenma/pve-nsa-fan-ctrl)
	1. `apt install smartmontools lm-sensors build-essential -y`
	2. `apt install pve-headers-$(uname -r)`
```
git clone https://github.com/shauno8/it87.git
cd it87
make
make install
modprobe -r it87
modprobe it87 ignore_resource_conflict=1 force_id=0x8620
echo "options it87 ignore_resource_conflict=1 force_id=0x8620" > /etc/modprobe.d/it87.conf
echo "it87" >> /etc/modules
update-initramfs -u



```
1. 设置风扇控制：etc/fancontrol
```
# Configuration file generated by pwmconfig, changes will be lost
INTERVAL=10
DEVPATH=hwmon1=devices/platform/it87.2624 hwmon2=devices/pci0000:00/0000:00:18.3
DEVNAME=hwmon1=it8620 hwmon2=k10temp
FCTEMPS=hwmon1/pwm1=hwmon2/temp1_input
FCFANS= hwmon1/pwm1=hwmon1/fan1_input
MINTEMP=hwmon1/pwm1=30
MAXTEMP=hwmon1/pwm1=75
MINSTART=hwmon1/pwm1=10
MINSTOP=hwmon1/pwm1=20
```
5. 设置IPV6
	- `/etc/network/interfaces`：`post-up echo "2" > /proc/sys/net/ipv6/conf/vmbr0/accept_ra`


⚠️upload failed, check dev console
#### 方法一：使用 `hd-idle` (推荐)

1. **安装 `hd-idle`**: 打开PVE的Shell或通过SSH登录，执行：
    
    Bash
    

- ```
    apt update
    apt install hd-idle -y
    ```
    
- **配置 `hd-idle`**: 编辑它的配置文件：
    
    Bash
    

```
nano /etc/default/hd-idle
```

找到 `HD_IDLE_OPTS` 这一行，修改它。

- `-i 0`：禁用 `hd-idle` 的默认计时器（我们将在下面为特定磁盘设置）。
    
- `-a sda`：指定要管理的硬盘名称（`sda`, `sdb` 等）。**请务必用 `lsblk` 或 `fdisk -l` 命令确认你的HDD盘符！** 不要对系统盘（通常是SSD）设置。
    
- `-i 600`：设置闲置时间，单位是秒。`600` 就是10分钟。对于备份盘或媒体盘，可以设置长一点，比如 `1800` (30分钟) 或 `3600` (1小时)。
    

**示例配置**：假设你的HDD是 `/dev/sdb`，你希望它闲置30分钟后休眠。

Ini, TOML

```
# /etc/default/hd-idle

START_HD_IDLE=true

# -i 0 是为了让默认配置不对所有硬盘生效
# 之后用 -a 指定硬盘名，再用 -i 指定该硬盘的超时时间
HD_IDLE_OPTS="-i 0 -a sdb -i 1800" 
```

如果你有多块HDD需要管理，可以这样写（`/dev/sdb` 30分钟休眠，`/dev/sdc` 1小时休眠）：

Ini, TOML

- ```
    HD_IDLE_OPTS="-i 0 -a sdb -i 1800 -a sdc -i 3600"
    ```
    
- **启动并设置开机自启**:
    
    Bash
    

```
systemctl enable hd-idle
systemctl start hd-idle
```



### 最后：如何监控？

设置休眠后，你应该监控一下硬盘的 `Load_Cycle_Count` (LCC)，确保它不会增长得过快。

1. **安装S.M.A.R.T.工具**:
    
    Bash
    

- ```
    apt install smartmontools -y
    ```
    
- **查看硬盘信息**:
    
    Bash
    

```
smartctl -a /dev/sdc | grep Load_Cycle_Count
```

记下当前的数值。过一天或者几天再来看一下，如果每天增长几百甚至上千，说明你的休眠时间设置得太短，硬盘被频繁唤醒，建议延长闲置时间。如果每天只增长几次或几十次，那就是一个非常健康的设置。








## 虚拟飞牛FnOS

## LXC
### 创建容器模版
#### Debain
```bash
# 安装curl
apt update && apt install curl
# 换源和更新：
bash <(curl -sSL https://linuxmirrors.cn/main.sh)
# 开启root的ssh：
bash <(curl -sSL https://raw.githubusercontent.com/zmingu/mytools/refs/heads/main/open-root-ssh.sh)
apt clean
```
### Alpine
```csharp
//Alpine Linux 初始化
sed -i 's/dl-cdn.alpinelinux.org/mirrors.ustc.edu.cn/g' /etc/apk/repositories

apk add curl
apk add bash
bash <(curl -sSL https://linuxmirrors.cn/main.sh)

apk add openssh
bash <(curl -sSL https://raw.githubusercontent.com/zmingu/mytools/refs/heads/main/open-root-ssh.sh)
rc-update add sshd
rc-service sshd start

apk add tzdata
ls /usr/share/zoneinfo
echo "Asia/Shanghai" > /etc/timezone
apk del tzdata

```



NFS使用

mkdir -p /mnt/immich
umount /mnt/immich
rm -rf /mnt/immich
chown -R 999:991 /mnt/immich
nano /etc/pve/lxc/100.conf
mount -t nfs 10.0.0.103:/volume3/video /mnt/video
你的群辉IP:/volume1/immich-storage /mnt/immich-nfs nfs defaults 0 0
mp0: /mnt/immich-nfs,mp=/mnt/immich
cd /opt/immich 
ln -sf /mnt/immich/upload app/upload # app 目录链接  
ln -sf /mnt/immich/library app/machine-learning/upload # ML 目录链接（如果启用 OpenVINO）


chown -R 100999:100991 /mnt/immich





