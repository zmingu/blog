---
title: 群辉释放80/443端口
date: 2025-08-05 13:30:02 +08:00
slug: synology-release-80-443
draft: false
summary: "群辉 NAS 释放 80/443 端口：修改 nginx 配置文件改用 8880/8443。"
keywords:
  - 群辉
  - synology
  - nas
tags:
  - 群辉
categories:
  - nas
toc: true
collections:
  - synology
---

### 群辉释放80/443端口，并将端口设置为8880/8443
```shell
# 切换到root用户 
sudo -i
cd /usr/syno/share/nginx
cp server.mustache server.mustache.bak # 备份原文件 
sed -i "s/80/8880/g" server.mustache DSM.mustache WWWService.mustache 
sed -i "s/443/8443/g" server.mustache DSM.mustache WWWService.mustache
```
`