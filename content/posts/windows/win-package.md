---
title: "系统封装优化-Win10_22H2_19045.2728 by Zmingu"
subtitle:
date: 2024-12-29T23:40:00+08:00
lastmod: 2025-04-17T09:31:41+08:00
slug: win-package
draft: false
summary: "Win10 22H2 系统封装教程：母盘制作、优化精简、软件集成和万能驱动。"
keywords:
  - Windows
  - 系统封装
weight: 0
tags:
  - Windows
  - 系统封装
categories:
  - Windows
toc: true
---
●-基于Windows10 22H2 x64 制作， 版本号 19045.2728，集成 .NET Framework 3.5/4.8
●-适度精简优化，自带万能驱动
●-主要调整内容：启用Admin内置管理员账户; +集成常用运行库; +常用优化调整
●-仅保留专业版
●-具体精简优化内容见封装笔记：[笔记地址](https://blog.zmingu.com/note/packagewin.html)
●-如您使用该系统出现问题，请在评论留言

ESD映像文件名称：Win10_22h2_19045.2728(2024.12_SHA1-1BF240838).esd
文件大小：7.34 GB (7882867440 字节)
制作时间：2024年12月28日
MD5 ：E54C3D9E0F9B84CC2EF72F59B66CAE22
SHA1 ：1BF240838B1CBB7810FC13D52561F8C835B039E0

[下载地址](https://alist.zmingu.com/%E5%A4%A9%E7%BF%BC%E4%BA%91%E7%9B%98/%E7%B3%BB%E7%BB%9F%E5%B0%81%E8%A3%85/3.%E6%9C%80%E7%BB%88%E7%B3%BB%E7%BB%9F)

# 系统封装记录

type: Post
status: Published
slug: PackageWin
summary: 自用封装系统
category: Windows

# 母盘制作

1. **使用MSMG Toolkit工具精简母盘**
    1. 将iso文件解压到工具根目录DVD文件夹
    2. 管理员运行start.cmd
    3. 主界面 1-1-选择专业版-Y-N-N 
    4. 主界面 3-1 精简组件
        
        ```jsx
        1.Internet
        	3.Edge(**NTLite免费版无法删除**)
        2.多媒体
        	无
        3.网络
        	无
        4.隐私
        	2.客户体验改善计划(CEIP)(**NTLite免费版无法删除**)
        5.远程
        	3.0neDrive 桌面客户端(**NTLite免费版无法删除**)
        6.系统
        	16.安全中心(**NTLite免费版无法删除**)
        7.系统应用
        	17.地图控件(**NTLite免费版无法删除**)
        	**27.**零售演示内容(**NTLite免费版无法删除**)
        	33.Skype ORTC(**NTLite免费版无法删除**)
          34.SmartScreen(**NTLite免费版无法删除**)
          41.Defender(**NTLite免费版无法删除**)
          44.混合现实WMR(**NTLite免费版无法删除**)
          46.Windows Reader(PDF)(**NTLite免费版无法删除**)
        8.Windows应用
        	16.地图（Microsoft.WindowsMaps）(**NTLite免费版无法删除**)
        ```
        
    5. 主界面-6-2-N(在NTlite中删除其他系统的版本)-Y
2. 提取母盘sources/install.wim
3. 使用**NTLite精简母盘**
    
    ```jsx
    1. 整合
      1.更新整合
    	  1.打上.NET3.5补丁
    	3.注册表
    		1.修复打印机共享11b问题.reg
    2.移除
    	1.组件移除（如下）
    3.配置
    	1.功能设置
    		1.启用启用SMB1
    	2.设置（如下)
    ```
    
    - 精简
        
        ```jsx
        移除 Windows Defender（杀毒）                移除 Recovery Reset 支持
        移除 Edge（浏览器）                                移除 移动计划
        保留 Cortana (小娜)                                  移除 SecureAssessmentBrowser 参加测验
        移除 Windows Mail(Windows 邮件)        移除 SmartScreen 筛选器        
        移除 Windows Mixed Reality(混合现实)        移除 Skype ORTC 视频电话相关
        移除 Windows Reader (PDF)                        移除 Skype App 视频电话
        移除 Windows Recovery(Windows 恢复)        移除 Microsoft Solitaire Collection 纸牌
        移除 SoundRecorder   录音机                  移除 Microsoft 3DViewer '3D 查看器'
        移除 Windows 系统评估工具 (WinSAT)        移除 Microsoft Sticky Notes 便笺
        移除 Windows客户体验改善计划                 移除 Targeted Content service(定向内容服务)
        移除 NET assembly 缓存                                移除 CallingShellApp 通话
        移除 Windows Recovery(WinRE)-云下载 移除 TV Tuner 编码与支持
        移除 Microsoft Edge DevTools 客户端     移除 Microsoft Paint 图画 3D
        移除 Windows Alarms & Clock 警报和时钟 移除 Webcam Experience(网络摄像头体验)
        移除 Microsoft Messaging  消息                 移除 Microsoft.BingWeather 'MSN 天气'
        移除 Xbox 应用                                            移除 Xbox.TCUI
        移除 Microsoft Pay        支付                             移除 XboxGameOverlay
        移除 XboxGamingOverlay                           移除 XboxIdentityProvider
        移除 ECApp 目视控制                                    移除 XboxSpeechToTextOverlay
        移除 EdgeDevToolsClient                            移除 XGpuEjectDialog
        移除 Windows media player 媒体播放器     移除 YourPhone 手机
        移除 Feedback Hub        反馈中心                      移除 ZuneMusic 音乐
        移除 ZuneVideo  视频                                  移除 软盘
        移除 Microsoft news         新闻                    移除 57-bit linear addressing 线性寻址
        移除 mail and calendar 邮件和日历                    移除 安全中心
        移除 Get Help 获取帮助                               移除 Windows voice recorder 语音记录器
        移除 Microsoft Edge Update                            移除 讲述人
        移除 Holo MDL2 Assets 混合现实相关         移除 企业数据保护 (EDP/WIP)
        移除 Windows web 体验包                            移除 零售演示内容
        移除 Maps 地图                                            移除 DirectX WARP JIT 服务
        移除 MixedReality.Portal 混合现实相关        移除 Windows To Go
        移除 Windows 推送通知服务                        移除 钱包服务
        移除 Cloud Notifications 云通知                  移除 Microsoft Edge (Legacy)
        移除 Office.OneNote                                      移除 Microsoft Edge (Chromium)
        移除 OfficeHub                                             移除 manifest备份
        移除 OneDrive(微软云盘)                                     移除 备份与恢复
        移除 系统恢复                                                移除 Movies TV    电影和电视                                   
        移除 Microsoft People 人员                             移除 网络连接流         
        移除 PeopleExperienceHost人员体验主机     移除 提示(Win10 1607之前叫“入门”）
        移除 桌面图片下载器                                             移除 强制网络门户流
        移除 参加测验                                                移除 内容传递管理器
        移除 地图控制                                                     移除 添加文件夹建议对话框
        移除 Windows shell experience 体验            移除 指定访问锁定应用
        ```
        
    - 设置
        
        ```jsx
        使用 NTLite 2024.8.10045 正式版 进行以下设置：
        禁止 自动安装赞助商的应用（客户体验）
        禁止 Installer detection （安装程序检测）
        禁止 使用SmartScreen在线服务来检查IE中的网页内答
        禁止 使用页面预测功能来提升阅读，提高浏览速度。浏览数据会被发送到Microsoft。
        禁止 允许帮助提升用户体验
        启用 在恢复时显示登录屏幕（从屏保恢复桌面）
        禁止 用户使用 Windows 系统时获取提示、技巧以及建设
        禁止 使用 Smartscreen 在线服务检测Edge浏览器中的网页内容
        禁止 偶尔在“开始”屏幕中显示建议
        禁止 向Microsoft发送有关我的写作习惯的信息，以便在将来改进键入与写入功能
        禁止 在锁屏界面获取更多的有趣元素、提示以及技巧
        禁止 打开SmartScreen筛迭器，以检查Windows应用商店应用所使用的Web内容
        禁止 收集写作文本（ink-墨迹）让Windows和小娜更好的了解你
        禁止 收集通讯录让Windows和小娜更好的了解你
        禁止 收集键入文本让和小娜更好的了解你
        禁止 自动安装建议的应用
        禁止 通过将用户的输入数据发送给Microsoft来个性化用户的语音输入、键盘输入和墨迹输入
        禁止 预安装OEM应用
        禁止 预安装应用
        		桌面：搜索（任务栏）   默认改成图标。
        		
        		  桌面图标-回收站、控制面板、用户文件夹、网络、计算机  这五项  默认改成已启用。
                系统：保留空间   默认改成 已禁用。
                          首次登录动画  默认  改成  已禁用。
        ```
        
    1. 保存映像并剪去其他版本系统
    2. 二次精简WD（Windows Defender）
        1. 再此挂载镜像
        2. …\NLTmpMnt\Windows\Containers下的所有-删除
        3. …\NLTmpMnt\Windows\WinSxS\amd64_microsoft-windows-dyn*下的所有-删除
            
            ![1.png](https://s3.zmingu.com/images/2025/04/3134967625.png)
            
    3. 保存最终母盘镜像

# 虚拟机封装

## 创建虚拟机

1. 新建虚拟机-经典-稍后安装操作系统-版本Windows 10 x64-选择虚拟机保存位置-默认-自定义硬件(CD/DVD选择使用ISO映像文件HotPE.iso，处理器根据自身机器选择，内存根据自身机器选择(>4G)，移除网络适配器，移除USB控制器，移除声卡)
2. 进入BIOS设置CD为第一启动项(略)
    
    ![2.png](https://s3.zmingu.com/images/2025/04/3536838178.png)
    
3. 分区装系统
    1. 分两个区一个装系统，一个放封装需要的软件。
    2. 安装系统
4. 在区域设置界面Ctrl+Shift+F3进入审核模式，弹出系统准备工具界面，直接X掉
5. 启用Admin管理员账户，Win+R运行`compmgmt.msc`，系统工具-本地用户和组-用户-Administratior-右键属性-取消勾选账户已禁用
6. 关机拍快照，备注：安装母盘，进入审核模式，启用Admnn
7. 开始优化和精简
    1. 修复IE11浏览器，禁止其跳向并安装Edge
    2. 安装 Flash_34.0.0.301_三合一
    3. 安装微软常用运行库，DirectX修复工具增强版，安装WebView
    4. 放入万能驱动
        1. C盘根目录新建sysprep文件夹，并拖入万能驱动文件夹
    5. 放入激活批处理工具
        1. C盘Windows/Setup目录，放入MAS_AIO_v2.9_Chs.cmd
    6. 关闭更新，关闭Defender
    7. 安装必备软件：
        1. 输入法：默认且只保留搜狗拼音(大水牛6.7iv2)
        2. 解压：WinRAR7.01-Final-x64烈火汉化版
        3. 文本：Notepad3_6.24.1221.1.x64(替换自带记事本)
        4. 图像：JPEGView64_1.3.46(设为默认图片查看器)
        5. 音乐：CloudMusic-v2.10.11.201538-Modified(带换源可听下架)
        6. 视频：РotРlayer-241216(1.7.22398)-x64-Stable
        7. 办公：WPS2023专业增强版-v12.8.2.18913
        8. PDF编辑：PDF-XChange-Editor-Plus-v10.4.4.392-x64
        9. 杀软：sysdiag-all-x64-6.0.4.5-2024.12.23.1
        10. 资源管理器：Directory Opus Pro 13.12
    8. 小鱼儿工具-原创工具-个性设置与应用关联备份还原-备份默认应用关联
    9. 进PE-小鱼儿-工备份-备份系统个性设置
8. 封装
    1. SC封装工具-体验-目标系统
        
        ![3.webp](https://s3.zmingu.com/images/2025/04/2566662858.webp)
        
    2. 计划任务
        
        ![4.webp](https://s3.zmingu.com/images/2025/04/3351558839.webp)
        
    3. 封装后关闭计算机
    4. 封装
9. 进PE-小鱼儿工具-恢复默认应用关联-恢复 系统个性设置
10. 用小鱼儿工具修改注册表，屏蔽 个人数据跨境传输 提示
    
    ```jsx
    Windows Registry Editor Version 5.00
    
    [HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\CloudExperienceHost\Intent\PersonalDataExport]
    
    "PDEShown"=dword:00000001
    
     
    
    [HKEY_USERS\.DEFAULT\Software\Microsoft\Windows\CurrentVersion\CloudExperienceHost\Intent\PersonalDataExport]
    
    "PDEShown"=dword:00000001
    
    2023 年 7 月之前更新的 Windows 10 & 11 需要将此注册表项要调整为 "PDEShown"=dword:00000001）
    ```
    
11. Dism++备份系统