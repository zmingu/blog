---
title: Cursor禁用自动更新和进行无限学习
date: 2024-12-20T22:12:00+08:00
slug: cursor-disable-update
draft: false
keywords:
  - Cursor
  - AI
tags:
  - AI
categories:
  - AI
toc: true
collections:
  - Cursor
---

1. 安装版本
2. 在程序内禁用更新
![](https://s3.zmingu.com/images/2025/04/1135593996.webp "禁用更新1")
![](https://s3.zmingu.com/images/2025/04/416806266.webp "禁用更新2")
3. 删除并设置为只读防止更新

- 将该文件夹删除，并新建同名文件，注意是文件
`C:\Users\{你的用户名}\AppData\Local\cursor-updater`

- 将该文件删除，并新建同名文件，并将该文件设置为只读。
`C:\Users\{你的用户名}\AppData\Local\Programs\cursor\resources\app-update.yml`