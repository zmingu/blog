---
title: 轻语
date: 2024-11-24
type: "mastodon"
layout: "mastodon"
comment: false
menu:
  main:
    weight: 5
    params:
      icon: "fa-brands fa-mastodon"
---
<style>
/* --- 布局容器 --- */
.memos-list { max-width: 600px; margin: 0 auto; }
.memo-item {
    padding: 1.2rem; margin-bottom: 1.5rem;
    border: 1px solid var(--fixit-border-color);
    border-radius: 18px; /* macOS 大圆角 */
    background: var(--fixit-card-bg);
    box-shadow: 0 4px 12px rgba(0,0,0,0.03);
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    animation: fadeIn 0.5s ease; /* 新增进入动画 */
}
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

.memo-item:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.08); }

/* --- 头部 --- */
.memo-header { display: flex; align-items: flex-start; margin-bottom: 0.8rem; }
.memo-avatar { width: 48px; height: 48px; border-radius: 50%; margin-right: 12px; border: 2px solid var(--fixit-card-bg); box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
.memo-name { font-weight: 700; font-size: 1rem; color: var(--fixit-color-text); display: block; }
.memo-date { font-size: 0.85rem; color: var(--fixit-color-secondary); font-weight: 500; opacity: 0.8; }

/* --- 内容 --- */
.memo-content { 
    font-size: 1rem; line-height: 1.6; color: var(--fixit-color-text); margin-bottom: 0.8rem; 
    position: relative; overflow-wrap: break-word; transition: max-height 0.3s ease;
}
.memo-content.collapsed {
    max-height: 140px; overflow: hidden;
    -webkit-mask-image: linear-gradient(180deg, black 60%, transparent);
    mask-image: linear-gradient(180deg, black 60%, transparent);
}
.memo-content a { color: var(--fixit-color-primary); text-decoration: none; font-weight: 500; }
.memo-content a:hover { text-decoration: underline; }
.memo-content p { margin-bottom: 0.5rem; }
.memo-content .invisible, .memo-content .ellipsis { display: none; } 

.read-more-btn {
    color: var(--fixit-color-primary); cursor: pointer; font-size: 0.9rem; font-weight: bold; 
    margin-bottom: 10px; display: inline-block; padding: 4px 10px; border-radius: 20px; 
    background: var(--fixit-code-bg); transition: background 0.2s;
}
.read-more-btn:hover { background: var(--fixit-border-color); }

/* --- 🖼️ 媒体卡片 --- */
.memo-media {
    display: grid; gap: 2px; margin-top: 10px;
    border-radius: 12px; overflow: hidden;
    border: 1px solid rgba(128,128,128,0.1);
}
.media-item {
    width: 100%; height: 100%; object-fit: cover;
    cursor: zoom-in; display: block; background: #000; transition: transform 0.3s;
}
.media-item:hover { transform: scale(1.02); }

.memo-media[data-count="1"] { grid-template-columns: 1fr; aspect-ratio: 16/9; }
.memo-media[data-count="2"] { grid-template-columns: 1fr 1fr; aspect-ratio: 16/9; }
.memo-media[data-count="3"] { grid-template-columns: 1.5fr 1fr; grid-template-rows: 1fr 1fr; aspect-ratio: 4/3; }
.memo-media[data-count="3"] .media-item:first-child { grid-row: 1 / 3; }
.memo-media[data-count="4"] { grid-template-columns: 1fr 1fr; aspect-ratio: 1/1; }
.memo-media[data-count="5"], .memo-media[data-count="6"], .memo-media[data-count="7"], .memo-media[data-count="8"], .memo-media[data-count="9"] { 
    grid-template-columns: repeat(3, 1fr); aspect-ratio: 1/1; 
}

/* --- 底部工具栏 --- */
.memo-footer { 
    display: flex; justify-content: space-between; align-items: center; 
    margin-top: 1rem; padding-top: 0.8rem; border-top: 1px solid rgba(128,128,128,0.1); 
    color: var(--fixit-color-secondary);
}
.mastodon-stats { display: flex; gap: 24px; font-size: 0.9rem; }
.stat-item { 
    display: flex; align-items: center; gap: 6px; cursor: pointer; transition: all 0.2s; 
    padding: 4px 6px; border-radius: 6px;
}
.stat-item:hover { color: var(--fixit-color-primary); background: var(--fixit-code-bg); }
.stat-item.active { color: var(--fixit-color-primary); font-weight: bold; background: var(--fixit-code-bg); }

.waline-trigger { 
    cursor: pointer; font-size: 0.9rem; display: flex; align-items: center; gap: 6px; 
    padding: 6px 12px; border-radius: 20px; background: var(--fixit-code-bg); transition: all 0.2s;
}
.waline-trigger:hover { color: #fff; background: var(--fixit-color-primary); }

/* --- 评论区 --- */
.comments-wrapper { margin-top: 15px; background: var(--fixit-code-bg); border-radius: 12px; padding: 15px; display: none; animation: fadeIn 0.3s ease; }
.mastodon-comment { display: flex; gap: 12px; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid rgba(128,128,128,0.1); }
.mastodon-comment:last-child { border: none; margin-bottom: 0; padding-bottom: 0; }
.m-avatar { width: 36px; height: 36px; border-radius: 50%; }
.m-content { font-size: 0.95rem; flex: 1; overflow-wrap: break-word; color: var(--fixit-color-text); }
.m-author { font-weight: bold; font-size: 0.9rem; margin-bottom: 4px; display: block; color: var(--fixit-color-text); }
.m-content p { margin: 0; }
.memo-comment-box { margin-top: 0; } 

/* --- 🔄 加载更多按钮 --- */
.load-more-container { text-align: center; margin: 30px 0; }
.load-btn {
    background: var(--fixit-card-bg); border: 1px solid var(--fixit-border-color);
    color: var(--fixit-color-text); padding: 10px 30px; border-radius: 30px;
    cursor: pointer; transition: all 0.3s; font-size: 0.95rem; font-weight: bold;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
.load-btn:hover { border-color: var(--fixit-color-primary); color: var(--fixit-color-primary); transform: translateY(-2px); }
.load-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
</style>

<link rel="stylesheet" href="https://unpkg.com/@waline/client@v2/dist/waline.css" />

<div id="memos-list" class="memos-list">
    <div style="text-align: center; padding: 4rem 2rem;">
        <i class="fa-solid fa-spinner fa-spin fa-2x" style="color:var(--fixit-color-secondary)"></i>
        <p style="margin-top:15px;color:var(--fixit-color-secondary)">正在连接长毛象宇宙...</p>
    </div>
</div>

<div id="load-more-wrapper" class="load-more-container" style="display:none;">
    <button id="load-more-btn" class="load-btn" onclick="fetchMastodon()">加载更多</button>
</div>

<script type="module">
    import { init, commentCount } from 'https://unpkg.com/@waline/client@v2/dist/waline.mjs';

    // ================= 配置区域 =================
    const MASTODON_INSTANCE = "https://mastodon.zmingu.com"; 
    const MASTODON_USER_ID = "115107215294383411";
    const WALINE_SERVER_URL = "https://waline.zmingu.com"; 
    
    // ⚙️ 限制设置
    const CONTENT_LIMIT = 200; // 文本折叠阈值
    const PAGE_SIZE = 5;      // 每次加载多少条 (建议 10-20)
    // ===========================================

    const listContainer = document.getElementById('memos-list');
    const loadMoreWrapper = document.getElementById('load-more-wrapper');
    const loadMoreBtn = document.getElementById('load-more-btn');
    
    let nextMaxId = null; // 用于分页的游标
    let isFirstLoad = true;

    function formatTime(isoString) {
        return new Date(isoString).toLocaleString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    }

    // 将 fetchMastodon 挂载到 window，以便按钮调用 (虽然这里是 module，但按钮在 DOM 里)
    window.fetchMastodon = async function() {
        // 按钮状态 Loading
        if (!isFirstLoad) {
            loadMoreBtn.innerText = "加载中...";
            loadMoreBtn.disabled = true;
        }

        try {
            let apiUrl = `${MASTODON_INSTANCE}/api/v1/accounts/${MASTODON_USER_ID}/statuses?exclude_replies=true&exclude_reblogs=true&limit=${PAGE_SIZE}`;
            
            // 如果有下一页的 ID，拼接到 URL
            if (nextMaxId) {
                apiUrl += `&max_id=${nextMaxId}`;
            }

            const res = await fetch(apiUrl);
            if (!res.ok) throw new Error(`Mastodon API: ${res.status}`);
            const data = await res.json();

            // 首次加载清空 loading 动画
            if (isFirstLoad) {
                listContainer.innerHTML = '';
                isFirstLoad = false;
                loadMoreWrapper.style.display = 'block'; // 显示按钮
            }

            // 处理分页
            if (data.length > 0) {
                // 记录最后一条的 ID，供下次使用
                nextMaxId = data[data.length - 1].id;
                
                // 如果返回的数据少于请求的数量，说明没更多了
                if (data.length < PAGE_SIZE) {
                    loadMoreWrapper.style.display = 'none';
                } else {
                    loadMoreBtn.innerText = "加载更多";
                    loadMoreBtn.disabled = false;
                }
            } else {
                // 没有数据了
                loadMoreWrapper.style.display = 'none';
                if (listContainer.innerHTML === '') {
                    listContainer.innerHTML = '<div style="text-align:center;color:#888">暂无内容</div>';
                }
                return;
            }

            let html = '';
            data.forEach(toot => {
                const content = toot.content;
                const dateStr = formatTime(toot.created_at);
                const tootId = toot.id;
                
                const isLong = content.length > (CONTENT_LIMIT + 50);
                const contentClass = isLong ? 'memo-content collapsed' : 'memo-content';
                const btnHtml = isLong ? `<div class="read-more-btn" onclick="toggleContent('${tootId}', this)">展开全文</div>` : '';
                
                let mediaHtml = '';
                const attachments = toot.media_attachments || [];
                const count = attachments.length;

                if (count > 0) {
                    mediaHtml = `<div class="memo-media" data-count="${count}">`;
                    attachments.forEach(media => {
                        if (media.type === 'image') {
                            mediaHtml += `<img class="media-item" src="${media.preview_url}" onclick="window.open('${media.url}')" loading="lazy">`;
                        } else if (media.type === 'video' || media.type === 'gifv') {
                            mediaHtml += `<video class="media-item" src="${media.url}" controls loop playsinline poster="${media.preview_url}"></video>`;
                        } else if (media.type === 'audio') {
                            mediaHtml += `<audio src="${media.url}" controls style="width:100%;margin-top:10px;"></audio>`;
                        }
                    });
                    mediaHtml += `</div>`;
                }

                const repliesCount = toot.replies_count;
                const reblogsCount = toot.reblogs_count;
                const favCount = toot.favourites_count;

                // 使用 insertAdjacentHTML 追加内容，而不是 innerHTML+=，这样不会重置之前的 Waline
                const itemHtml = `
                <div class="memo-item" id="toot-${tootId}">
                    <div class="memo-header">
                        <img class="memo-avatar" src="${toot.account.avatar}">
                        <div>
                            <span class="memo-name">${toot.account.display_name}</span>
                            <span class="memo-date">${dateStr}</span>
                        </div>
                    </div>
                    
                    <div id="content-${tootId}" class="${contentClass}">
                        ${content.replace(/<a /g, '<a target="_blank" ')}
                    </div>
                    ${btnHtml}
                    ${mediaHtml}
                    
                    <div class="memo-footer">
                        <div class="mastodon-stats">
                            <div class="stat-item btn-mastodon-${tootId}" onclick="switchTab('${tootId}', 'mastodon')" title="站内回复">
                                <i class="fa-solid fa-reply"></i> ${repliesCount}
                            </div>
                            <div class="stat-item disabled" title="转发">
                                <i class="fa-solid fa-retweet"></i> ${reblogsCount}
                            </div>
                            <div class="stat-item disabled" title="收藏">
                                <i class="fa-regular fa-star"></i> ${favCount}
                            </div>
                            <a href="${toot.url}" target="_blank" class="stat-item" title="跳转原文">
                                <i class="fa-regular fa-bookmark"></i>
                            </a>
                        </div>
                        
                        <div class="waline-trigger btn-waline-${tootId}" onclick="switchTab('${tootId}', 'waline')" title="访客留言">
                            <i class="fa-regular fa-comment-dots"></i> 
                            <span class="waline-comment-count" data-path="/mastodon/${tootId}">留言</span>
                        </div>
                    </div>

                    <div id="mastodon-area-${tootId}" class="comments-wrapper" style="display:none;">
                        <div id="mastodon-list-${tootId}">
                            <div style="text-align:center"><i class="fa-solid fa-spinner fa-spin"></i></div>
                        </div>
                        <div style="text-align:center;margin-top:10px;">
                             <a href="${toot.url}" target="_blank" style="font-size:0.8rem;color:var(--fixit-color-primary);">去 Mastodon 回复 &rarr;</a>
                        </div>
                    </div>

                    <div id="waline-area-${tootId}" class="comments-wrapper memo-comment-box" style="display:none;"></div>
                </div>`;
                
                listContainer.insertAdjacentHTML('beforeend', itemHtml);
            });

            // 刷新 Waline 评论数 (只刷新新增的其实更优，但这里全量刷新比较简单且开销不大)
            commentCount({ serverURL: WALINE_SERVER_URL, selector: '.waline-comment-count' });

        } catch (err) {
            console.error(err);
            if(isFirstLoad) {
                listContainer.innerHTML = `<div style="text-align:center;color:red;padding:2rem">加载失败: ${err.message}</div>`;
            } else {
                loadMoreBtn.innerText = "加载失败，重试";
                loadMoreBtn.disabled = false;
            }
        }
    }

    // --- 辅助逻辑 (保持不变) ---
    window.toggleContent = function(id, btn) {
        const contentBox = document.getElementById(`content-${id}`);
        contentBox.classList.toggle('collapsed');
        btn.innerText = contentBox.classList.contains('collapsed') ? "展开全文" : "收起";
    }

    window.switchTab = async function(id, type) {
        const mArea = document.getElementById(`mastodon-area-${id}`);
        const wArea = document.getElementById(`waline-area-${id}`);
        const mBtn = document.querySelector(`.btn-mastodon-${id}`);
        const wBtn = document.querySelector(`.btn-waline-${id}`);

        if (type === 'mastodon') {
            if (mArea.style.display === 'block') {
                mArea.style.display = 'none';
                mBtn.classList.remove('active');
            } else {
                mArea.style.display = 'block';
                wArea.style.display = 'none';
                mBtn.classList.add('active');
                wBtn.classList.remove('active');
                loadMastodonData(id);
            }
        } else if (type === 'waline') {
            if (wArea.style.display === 'block') {
                wArea.style.display = 'none';
                wBtn.classList.remove('active');
            } else {
                wArea.style.display = 'block';
                mArea.style.display = 'none';
                wBtn.classList.add('active');
                mBtn.classList.remove('active');
                initWaline(id);
            }
        }
    }

    async function loadMastodonData(id) {
        const container = document.getElementById(`mastodon-list-${id}`);
        if (container.getAttribute('data-loaded') === 'true') return;
        try {
            const res = await fetch(`${MASTODON_INSTANCE}/api/v1/statuses/${id}/context`);
            const data = await res.json();
            const replies = data.descendants;
            if (replies.length === 0) {
                container.innerHTML = '<div style="text-align:center;font-size:0.9rem;color:#888;">暂无回复</div>';
            } else {
                let html = '';
                replies.forEach(reply => {
                    html += `
                    <div class="mastodon-comment">
                        <img class="m-avatar" src="${reply.account.avatar}">
                        <div class="m-content">
                            <span class="m-author">${reply.account.display_name}</span>
                            <div>${reply.content}</div>
                        </div>
                    </div>`;
                });
                container.innerHTML = html;
            }
            container.setAttribute('data-loaded', 'true');
        } catch (err) { container.innerHTML = '加载失败'; }
    }

    function initWaline(id) {
        const elId = `waline-area-${id}`;
        const box = document.getElementById(elId);
        if (!box.hasAttribute('data-loaded')) {
            init({
                el: `#${elId}`,
                serverURL: WALINE_SERVER_URL,
                path: `/mastodon/${id}`,
                dark: 'html[data-theme="dark"]',
                emoji: ['//unpkg.com/@waline/emojis@1.1.0/weibo'],
                login: 'enable',
                pageSize: 5
            });
            box.setAttribute('data-loaded', 'true');
        }
    }

    // 启动首次加载
    fetchMastodon();
</script>