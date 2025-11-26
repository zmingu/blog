---
title: "使用NotionNext+Vercel搭建基于Notion的免云服务器博客"
subtitle:
date: 2023-11-09T19:30:00+08:00
lastmod: 2025-04-08T13:12:41+08:00
slug: notionnext
draft: false
keywords:
  - NotionNext
  - Vercel
weight: 0
tags:
  - Blog
  - NotionNext
categories:
  - 博客
toc: true
---
NotionNext+Vercel


- 2024/01/22更新
    - 回归Typecho，拥抱轻简。
- 2023/12/11更新
    - 因域名取消备案，不再使用国内**CND**加速，改为使用[**LightCDN**](https://client.lightcdn.com/)加速网站访问：
- 2023/11/10更新
    - 现已通过[**七牛云CDN**](https://portal.qiniu.com/)加速网站访问:
![notionblog-tuya.webp](https://s3.zmingu.com/images/2024/01/hm6bnxmm75.webp)
# 一.介绍
1. 使用该方案搭建的博客只需域名成本。
2. 基于Notion，拥有美观的主题和丰富的功能。
3. 由于Vercel的一些不可抗拒因素，该方案部署的网页在国内浏览速度较慢，可通过几种方案加速。归根结底都是使用CDN，无非是免费或收费的区别。

# 二.NotionNext项目介绍及搭建:
1. 项目官网：[Tangly Blog | 记录与分享](https://www.tangly1024.com/) 


2. 部署及配置方法:[Vercel部署](https://docs.tangly1024.com/article/vercel-deploy-notion-next)

# 三.加速网站访问
## 免费CDN：

1. Cloudflare CDN
 - 可使用默认小黄云，或者使用 风之遐想的[CloudFlare 加速解析](https://www.fzxx.xyz/cloudflare-accelerate-parsing/)，以及 [CloudFlare优选节点监测平台](https://cfnode.eu.org/cname.html)
2. BlogCDN
 - [tanglu](https://blog.tanglu.me/)为初创博主提供长期维护的公益CDN，申请方法见其博客：[为博客等公益站点提供免费的三网优化高防CDN](https://blog.tanglu.me/blogcdn/)

3. 其他各大品牌CDN，
 - 国内大部分需要域名备案，国外则不需要。


# 结语

由于个人兴趣趋势，从当初懵懵懂懂的免费云空间，在后来腾讯云服务器搭建的Typecho，到现在的NotionNext，建站技术在逐步摸索中，如有建议希望能与我交流。

截至2023/11/09，由于没有成功申请到BlogCDN，本博客使用的是风之遐想的Cloudflare加速解析，不知是否达到预期加速效果，博客优化先告一段落。