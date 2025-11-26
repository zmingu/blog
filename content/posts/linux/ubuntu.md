---
title: "Ubuntu Server 笔记"
subtitle:
date: 2025-03-17T08:16:00+08:00
lastmod: 2025-04-17T08:13:47+08:00
slug: ubuntu
draft: false
keywords:
  - Ubuntu Server
weight: 0
tags:
  - Linux
categories:
  - Linux
toc: true
---
# 修改静态IP
`/etc/netplan/50-cloud-init.yaml`
```
network:
    renderer: networkd
    ethernets:
        ens18:
            dhcp4: false
            dhcp6: false
            addresses: [192.168.2.105/24] 
            routhttps://s3.zmingu.com/images             via: 192.168.2.5
            nameservers:
                addresses: [192.168.2.5]
                search: []
    version: 2
```