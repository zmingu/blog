---
title: Docker命令速查表
subtitle:
date: 2022-10-27T21:34:00+08:00
lastmod: 2025-04-07T16:07:11+08:00
slug: dockerml
draft: false
keywords:
  - docker
weight: 0
tags:
  - docker
categories:
  - Linux
toc: true
collections:
  - docker
---
- 查看容器
`docker ps`
- 查看全部容器
 `docker ps -a`
- 启动容器
`docker start dockername`
- 停止容器
`docker stop dockername`
- 重启容器
`docker restart  dockername`
- 删除镜像(先停止)
`docker rmi 镜像id`
- 删除容器
`docker rm 容器名或容器id`
- 查看容器日志
`docker logs -tf 容器id`
- 进入容器
`odcker exec -it 容器id bash`
- 查看更多信息
`docker inspect` 