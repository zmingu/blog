---
title: "卸载应用保留数据-ADB命令"
subtitle:
date: 2022-10-26T21:08:00+08:00
lastmod: 2025-04-07T16:05:05+08:00
slug: uninstallapp
draft: false
keywords:
  - Android
  - ADB
tags:
  - Android
categories:
  - Android
toc: true
---
# 使用场景
>当我有修改版的应用需要安装，但是有核心破解也无法安装上，就需要卸载重装，并希望保留数据。

安装app：`adb install apk路径`

卸载app：`adb uninstall 包名`

卸载app但保留数据和缓存文件：`adb shell pm uninstall -k 包名`