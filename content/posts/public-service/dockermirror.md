---
title: "自建Docker Hub&GHCR 镜像加速"
subtitle:
date: 2024-12-07T13:15:00+08:00
lastmod: 2025-04-07T13:18:39+08:00
slug: dockermirror
draft: false
summary: "自建 Docker Hub 镜像加速服务：配置 registry-mirrors 或直接使用镜像前缀。"
keywords:
  - docker
weight: 0
tags:
  - docker
categories:
  - Linux
toc: true
collections:
  - public-service
---
> 自建镜像，请勿滥用。
# 方法一:修改镜像源

- 命令设置registry mirror
    
    ```bash
    mkdir -p /etc/docker
    ```
    
    ```bash
    
    tee /etc/docker/daemon.json <<EOF
    {
        "registry-mirrors": ["https://docker.zmingu.com"]
    }
    EOF
    ```
    
    ```bash
    systemctl daemon-reload
    ```
    
    ```bash
    systemctl restart docker
    ```
    

# 方法二：拉取命令中直接使用

不用设置环境也可以直接使用，在镜像前加`docker.zmingu.com`用法示例：

```bash
docker pull docker.zmingu.com/nginx
```

