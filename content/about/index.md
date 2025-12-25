---
title: "关于"
date: 2024-11-24
description: "关于振明，关于这个博客"
layout: "about"
comment: true
menu:
  main:
    weight: 8
    params:
      icon: "fa-regular fa-id-card"
---

{{< typeit tag=h2 >}}
久不逢君花渐落，一朝相遇满堂红。你好，我是振明👋
{{< /typeit >}}

### 🧙‍♂️ 关于我 

**本名振明，亦唤明古。**

行走江湖，常以 `zmingu` 为号。
既是一名爱折腾的开发者，也是一个永远对新事物保持好奇的探索者。

**缘起** 于 2008 年那个盛夏，初抵深圳，初识计算机。
或许正是那年屏幕里闪烁的 `7k7k` 和 `4399`，在少年心中埋下了如今这场关于代码的梦。

**此间** 是我的数字花园，亦是练功房。
我在此记录技术所得、生活碎碎念，以及书影音游的掠影。

**我笃信文字的力量，坚持记录，只为保卫那份珍贵的表达欲。**

---

### 🛠️ 技术栈

<div class="skill-container">
    <div class="skill-item">
        <i class="fa-solid fa-code" style="color: #00599C;"></i> C++
    </div>
    <div class="skill-item">
    <img src="/icons/unrealengine.svg" class="custom-icon ue-icon" alt="UE">
    Unreal Engine
    </div>
    <div class="skill-item">
        <i class="fa-solid fa-gamepad" style="color: #e34f26;"></i> Game Dev
    </div>
    <div class="skill-item">
        <i class="fa-brands fa-python" style="color: #3776ab;"></i> Python
    </div>
    <div class="skill-item">
        <i class="fa-solid fa-shapes" style="color: #fcc624;"></i> CG / 渲染
    </div>
    <div class="skill-item">
        <i class="fa-brands fa-unity" style="color: #929292ff;"></i> Unity
    </div>
    <div class="skill-item">
        <i class="fa-brands fa-html5" style="color: #e34f26;"></i> HTML5
    </div>
    <div class="skill-item">
        <i class="fa-brands fa-css3-alt" style="color: #1572b6;"></i> CSS3
    </div>
    <div class="skill-item">
        <i class="fa-brands fa-js" style="color: #f7df1e;"></i> JavaScript
    </div>
    <div class="skill-item">
        <i class="fa-brands fa-python" style="color: #3776ab;"></i> Python
    </div>
    <div class="skill-item">
        <i class="fa-brands fa-docker" style="color: #2496ed;"></i> Docker
    </div>
    <div class="skill-item">
        <i class="fa-brands fa-linux" style="color: #fcc624;"></i> Linux
    </div>
</div>

---

### 📬 联系我

如果你对我的文章感兴趣，或者想和我交流，可以通过以下方式找到我：

<div class="contact-container">
    <a href="https://github.com/zmingu" target="_blank" class="contact-item">
        <i class="fa-brands fa-github"></i> GitHub
    </a>
    <a href="https://mastodon.zmingu.com/@zmingu" target="_blank" class="contact-item">
        <i class="fa-brands fa-mastodon"></i> Mastodon
    </a>
    <a href="mailto:zmingu@126.com" class="contact-item">
        <i class="fa-solid fa-envelope"></i> Email
    </a>
</div>

---

### 📜 关于本站
- 2025.10.24：更换 [FixIt](https://vercel.com) 主题，部署于 [Vercel](https://vercel.com)，图片存储于自建 S3。
- 2025.08.25：拥抱静态，拥抱`Hugo`。
- 2025.04.08：网站数据迁移到本地服务器，数据无价，反代存在问题待修复。
- 2024.11.19: 更换域名为`blog.zmingu.com`,数据库由`sqlite3`换成`mysql`。
- 2024.01.22：回归[Typecho](https://typecho.org/)，拥抱轻简，主题使用[initial_plus](https://blog.alttt.com/398.html/comment-page-1)。博客字体使用[霞鹜文楷](https://github.com/lxgw/LxgwWenKai)。
- 2023.12.16：将评论系统`twikoo`部署在微软云服务器中的容器中。
- 2023.12.11：将原博客域名`blog.zming.top`更换为为`blog.zmingu.top`。
- 2023.6.10：云服务器到期，使用`NotionNext+Verecl`部署。
- 2022.10.3：博客运行在腾讯轻量云服务器中，使用typecho创建。
- long time ago:源于小时候部署在免费云空间中的小网站。

> "Life is short, talk is cheap."

<style>
/* --- 技术栈 & 联系方式卡片基础样式 --- */
.skill-container, .contact-container {
    display: flex; flex-wrap: wrap; gap: 12px; margin-top: 1rem;
}
.skill-item, .contact-item {
    padding: 8px 16px; border-radius: 12px; 
    background: var(--fixit-card-bg); border: 1px solid var(--fixit-border-color);
    color: var(--fixit-color-text); font-size: 0.95rem; font-weight: 500;
    display: flex; align-items: center; gap: 8px; transition: all 0.3s ease;
    box-shadow: 0 2px 6px rgba(0,0,0,0.03); text-decoration: none !important;
}
.skill-item:hover, .contact-item:hover {
    transform: translateY(-3px); box-shadow: 0 6px 12px rgba(0,0,0,0.08);
    border-color: var(--fixit-color-primary); color: var(--fixit-color-primary);
}

/* --- 图标样式 --- */
/* 1. 通用 FontAwesome 图标 */
.skill-item i, .contact-item i { font-size: 1.1rem; }

/* 2. 自定义本地图片图标 (如 Unreal) */
.custom-icon {
    width: 1.1em; 
    height: 1.1em; 
    vertical-align: -0.2em; 
    object-fit: contain;
    transition: all 0.3s ease;
}

/* --- 🌑 核心修复：深色模式适配 --- */
/* 当网页处于 [data-theme='dark'] 模式时，针对 ue-icon 这个类：
   1. brightness(0) -> 先把图片变成全黑
   2. invert(1)     -> 再把全黑反转成全白
   这样无论原图是什么深色，这里都会强制变成纯白色！
*/
[data-theme='dark'] .ue-icon {
    filter: brightness(0) invert(1);
}

/* --- 折腾记录列表样式 --- */
.history-container {
    background: var(--fixit-code-bg);
    border-radius: 12px;
    padding: 1.5rem;
    border: 1px solid var(--fixit-border-color);
}
.history-list {
    list-style: none; padding: 0; margin: 0;
}
.history-list li {
    position: relative; padding-left: 1.5rem; margin-bottom: 1rem;
    line-height: 1.6; font-size: 0.95rem;
}
.history-list li::before {
    content: "•"; position: absolute; left: 0; color: var(--fixit-color-primary);
    font-weight: bold; font-size: 1.2rem; line-height: 1.5rem;
}
.history-list .date {
    font-family: monospace; background: var(--fixit-card-bg);
    padding: 2px 6px; border-radius: 4px; margin-right: 8px;
    font-size: 0.85rem; border: 1px solid var(--fixit-border-color);
    color: var(--fixit-color-secondary);
}
.history-list .date.highlight {
    background: var(--fixit-color-primary); color: #fff; border-color: var(--fixit-color-primary);
    font-weight: bold;
}
</style>

