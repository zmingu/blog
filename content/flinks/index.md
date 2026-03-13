---
title: "友链"
date: 2025-08-25
layout: "flinks"
comment: true
menu:
  main:
    weight: 7
    params:
      icon: "fa-solid fa-users"
---


> 有朋自远方来，不亦乐乎。欢迎交换友链！🤝

### 📌 本站信息

- **名称**：振明的博客
- **链接**：`https://blog.zmingu.com`
- **图标**：`https://blog.zmingu.com/favicon.ico`
- **描述**：休负浪客千里志，三尺青锋渡沧洲。

---

<div id="friends-container">
    <div style="text-align:center;padding:40px;color:var(--fixit-color-secondary);">
        <i class="fa-solid fa-spinner fa-spin"></i> 正在加载朋友们...
    </div>
</div>

<style>
/* 分组标题 */
.friend-group { margin-bottom: 3rem; }
.group-header {
    display: flex; align-items: baseline; gap: 10px;
    border-bottom: 1px dashed var(--fixit-border-color);
    padding-bottom: 10px; margin-bottom: 1.5rem;
}
.group-title { font-size: 1.5rem; font-weight: bold; margin: 0; color: var(--fixit-color-text); }
.group-title i { color: var(--fixit-color-primary); margin-right: 8px; }
.group-desc { font-size: 0.9rem; color: var(--fixit-color-secondary); font-weight: normal; }

/* 网格布局 */
.friend-grid {
    display: grid; gap: 15px;
    grid-template-columns: repeat(1, 1fr); /* 手机端 1 列 */
}
@media (min-width: 768px) { .friend-grid { grid-template-columns: repeat(2, 1fr); } } /* 平板 2 列 */
@media (min-width: 1200px) { .friend-grid { grid-template-columns: repeat(3, 1fr); } } /* 大屏 3 列 */

/* 卡片样式 */
.friend-card {
    display: flex; align-items: center;
    background: var(--fixit-card-bg);
    border: 1px solid var(--fixit-border-color);
    border-radius: 12px; /* 圆角 */
    padding: 12px;
    text-decoration: none !important;
    transition: all 0.3s ease;
    overflow: hidden;
    position: relative;
}

/* 悬停效果：上浮 + 阴影 + 边框变色 */
.friend-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
    border-color: var(--fixit-color-primary);
    z-index: 1;
}

/* 头像 */
.friend-left { margin-right: 15px; flex-shrink: 0; }
.friend-avatar {
    width: 64px !important; height: 64px !important; border-radius: 50% !important;
    border: 2px solid var(--fixit-border-color);
    object-fit: cover; transition: transform 0.5s ease;
    background-color: #fff; display: block;
}
.friend-card:hover .friend-avatar {
    transform: rotate(360deg);
    border-color: var(--fixit-color-primary);
}

/* 文字信息 */
.friend-right { flex: 1; overflow: hidden; display: flex; flex-direction: column; justify-content: center; }
.friend-name {
    font-size: 1.1rem; font-weight: bold; color: var(--fixit-color-text);
    margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    transition: color 0.3s;
}
.friend-card:hover .friend-name { color: var(--fixit-color-primary); }

.friend-desc {
    font-size: 0.85rem; color: var(--fixit-color-secondary);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
</style>

<script>
document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('friends-container');
    // 数据源地址：自动指向 /static/friends.json
    const jsonUrl = '/flinks.json';

    try {
        const res = await fetch(jsonUrl);
        if (!res.ok) throw new Error('数据加载失败');
        const data = await res.json();

        if (!data || data.length === 0) {
            container.innerHTML = '<div style="text-align:center;color:#888">暂无友链</div>';
            return;
        }

        let html = '';
        data.forEach(group => {
            // 生成卡片 HTML
            const itemsHtml = group.items.map(item => `
                <a class="friend-card" target="_blank" href="${item.url}" title="${item.description}">
                    <div class="friend-left">
                        <img class="friend-avatar" src="${item.avatar}" alt="${item.name}" onerror="this.onerror=null;this.src='/images/fixit.min.svg'">
                    </div>
                    <div class="friend-right">
                        <div class="friend-name">${item.name}</div>
                        <div class="friend-desc">${item.description}</div>
                    </div>
                </a>
            `).join('');

            // 生成分组 HTML
            html += `
            <section class="friend-group">
                <h2 class="group-title">
                    <div class="group-header">
                        <span class="group-title"><i class="fa-solid fa-folder-open"></i> ${group.group}</span>
                        ${group.desc ? `<span class="group-desc">${group.desc}</span>` : ''}
                    </div>
                </h2>
                <div class="friend-grid">
                    ${itemsHtml}
                </div>
            </section>
            `;
        });

        container.innerHTML = html;

    } catch (err) {
        console.error(err);
        container.innerHTML = `<div style="text-align:center;color:red;">加载失败: ${err.message}<br>请检查 static/friends.json 文件是否存在</div>`;
    }
});
</script>