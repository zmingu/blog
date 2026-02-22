---
title: "掠影"
date: 2025-08-25
layout: ""
comment: false
menu:
  main:
    weight: 6
    params:
      icon: "fa-solid fa-film"
---

这里记录了我的游戏、阅读和观影历史，数据同步自 NeoDB。

<div id="neodb-container" class="neodb-container">
  <nav id="neodb-nav" class="neodb-nav">
    </nav>

  <div id="neodb-type-nav" class="neodb-type-nav">
    <button class="neodb-type-item active" data-type="complete">玩过/看过</button>
    <button class="neodb-type-item" data-type="progress">在玩/在看</button>
    <button class="neodb-type-item" data-type="wishlist">想玩/想看</button>
  </div>

  <div id="neodb-grid" class="neodb-grid">
    <div class="neodb-loading">
        <i class="fa-solid fa-spinner fa-spin"></i> 数据加载中...
    </div>
  </div>

  <div id="neodb-load-more" class="neodb-load-more">
    <button id="load-more-btn" class="neodb-btn">加载更多</button>
    <p id="no-more-items" style="display: none;">没有更多内容了</p>
  </div>
</div>

<style>
  .neodb-container { margin-top: 2rem; }
  .neodb-nav { display: flex; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem; border-bottom: 1px solid var(--fixit-border-color); padding-bottom: 0.5rem; }
  .neodb-nav-item { padding: 0.5rem 1rem; font-size: 0.95rem; font-weight: 500; color: var(--fixit-font-color); background: transparent; border: none; border-bottom: 2px solid transparent; cursor: pointer; opacity: 0.7; transition: all 0.2s; }
  .neodb-nav-item:hover { opacity: 1; color: var(--fixit-primary-color); }
  .neodb-nav-item.active { opacity: 1; color: var(--fixit-primary-color); border-bottom-color: var(--fixit-primary-color); }
  .neodb-type-nav { display: flex; gap: 0.8rem; margin-bottom: 1.5rem; }
  .neodb-type-item { padding: 0.4rem 1rem; font-size: 0.85rem; border-radius: 4px; border: 1px solid var(--fixit-border-color); background: transparent; color: var(--fixit-font-color); cursor: pointer; transition: all 0.2s; }
  .neodb-type-item.active { background: var(--fixit-primary-color); color: #fff; border-color: var(--fixit-primary-color); }
  .neodb-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 1.2rem; }
  .neodb-item { position: relative; border: 1px solid var(--fixit-border-color); border-radius: 6px; overflow: hidden; background: var(--fixit-card-bg); transition: transform 0.2s; }
  .neodb-item:hover { transform: translateY(-4px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
  .neodb-cover-wrap { display: block; position: relative; aspect-ratio: 2/3; overflow: hidden; background: var(--fixit-code-bg-color); }
  .neodb-cover-wrap img { width: 100%; height: 100%; object-fit: cover; margin: 0; }
  .neodb-badge-new { position: absolute; top: 0; right: 0; background: #f00; color: #fff; font-size: 10px; padding: 2px 6px; border-bottom-left-radius: 4px; }
  .neodb-card-content { padding: 0.75rem; }
  .neodb-rating-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; font-size: 0.75rem; color: var(--fixit-secondary-color); }
  .neodb-card-title { font-size: 0.9rem; font-weight: 600; line-height: 1.3; margin: 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .neodb-card-title a { color: var(--fixit-font-color); text-decoration: none; }
  .neodb-card-title a:hover { color: var(--fixit-primary-color); }
  .neodb-load-more { text-align: center; margin-top: 2rem; }
  .neodb-btn { padding: 0.5rem 1.5rem; border: 1px solid var(--fixit-border-color); background: var(--fixit-code-bg-color); color: var(--fixit-font-color); cursor: pointer; border-radius: 20px; }
  .neodb-btn:hover { border-color: var(--fixit-primary-color); color: var(--fixit-primary-color); }
  .neodb-loading { text-align: center; padding: 2rem; color: var(--fixit-secondary-color); grid-column: 1/-1; }
</style>

<script>
(function() {
  const NEODB_CONFIG = {
    // 修改顺序：游戏 -> 电影 -> 番剧 -> 书籍
    categories: [
      { key: 'game', name: '游戏' },
      { key: 'movie', name: '电影' },
      { key: 'tv', name: '番剧' },
      { key: 'book', name: '书籍' },
    ],
    typeTexts: {
      book: {complete: "读过", progress: "在读", wishlist: "想读"},
      movie: {complete: "看过", progress: "在看", wishlist: "想看"},
      tv: {complete: "看过", progress: "在看", wishlist: "想看"},
      game: {complete: "玩过", progress: "在玩", wishlist: "想玩"},
    }
  };

  let currentCategory = NEODB_CONFIG.categories[0]?.key || 'game';
  let currentType = 'complete';
  let currentPage = 1;
  let isLoading = false;
  let allData = {}; 
  let hasMoreData = false;
  let autoLoadArmed = true;
  // 每页渲染数量：调大更顺滑但首屏更重
  const ITEMS_PER_PAGE = 24;
  // 距离底部多少提前触发加载（IntersectionObserver rootMargin）
  const INFINITE_SCROLL_ROOT_MARGIN = '200px 0px';
  const CACHE_CONFIG = {
    prefix: 'neodb_cache_v1',
    ttl: 6 * 60 * 60 * 1000
  };

  function getCacheKey(category, type) {
    return `${CACHE_CONFIG.prefix}:${category}_${type}`;
  }

  function readCache(category, type) {
    try {
      const raw = localStorage.getItem(getCacheKey(category, type));
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || !Array.isArray(parsed.data)) return null;
      return parsed;
    } catch (error) {
      return null;
    }
  }

  function writeCache(category, type, data) {
    try {
      const payload = { ts: Date.now(), data: data || [] };
      localStorage.setItem(getCacheKey(category, type), JSON.stringify(payload));
    } catch (error) {
      // localStorage 可能不可用或空间不足，静默失败即可
    }
  }

  function isCacheFresh(ts) {
    return typeof ts === 'number' && (Date.now() - ts) < CACHE_CONFIG.ttl;
  }

  function generateNavButtons() {
    const navContainer = document.getElementById('neodb-nav');
    if (!navContainer) return;
    navContainer.innerHTML = '';
    NEODB_CONFIG.categories.forEach((category, index) => {
      const isActive = index === 0;
      const button = document.createElement('button');
      button.className = `neodb-nav-item ${isActive ? 'active' : ''}`;
      button.setAttribute('data-category', category.key);
      button.textContent = category.name;
      navContainer.appendChild(button);
    });
  }

  async function fetchNeoDBData(category, type) {
    console.log(`[本地优先] 开始加载 ${category}_${type}`);
    
    // 第一优先级：本地文件 (/data/neodb/)
    const localUrl = `/data/neodb/${category}_${type}.json`;
    try {
      const response = await fetch(localUrl, { cache: 'force-cache' });
      if (response.ok) {
        const data = await response.json();
        const dataArray = Array.isArray(data) ? data : (data.data || []);
        console.log(`[本地数据] 成功加载 ${category}_${type}, 数据条数: ${dataArray.length}`);
        return { data: dataArray };
      }
    } catch (error) {
      console.warn(`[本地数据] 加载失败: ${error.message}`);
    }

    // 第二优先级：jsDelivr CDN (GitHub 源)
    const cdnUrl = `https://cdn.jsdelivr.net/gh/zmingu/neodb-data@main/neodb/${category}_${type}.json`;
    try {
      const response = await fetch(cdnUrl, { cache: 'force-cache' });
      if (response.ok) {
        const data = await response.json();
        const dataArray = Array.isArray(data) ? data : (data.data || []);
        console.log(`[CDN数据] 成功从 jsDelivr 加载 ${category}_${type}, 数据条数: ${dataArray.length}`);
        return { data: dataArray };
      }
    } catch (error) {
      console.warn(`[CDN数据] jsDelivr 加载失败: ${error.message}`);
    }

    // 第三优先级：GitHub Raw (备用)
    const githubUrl = `https://raw.githubusercontent.com/zmingu/neodb-data/main/neodb/${category}_${type}.json`;
    try {
      const response = await fetch(githubUrl, { cache: 'force-cache' });
      if (response.ok) {
        const data = await response.json();
        const dataArray = Array.isArray(data) ? data : (data.data || []);
        console.log(`[GitHub] 成功从 GitHub Raw 加载 ${category}_${type}, 数据条数: ${dataArray.length}`);
        return { data: dataArray };
      }
    } catch (error) {
      console.warn(`[GitHub] GitHub Raw 加载失败: ${error.message}`);
    }

    console.error(`加载 ${category}_${type} 所有来源都失败`);
    return { data: [] };
  }

  function renderStars(rating) {
    if (!rating || rating === 0) return '⭐';
    const stars = Math.min(5, Math.round(rating / 2));
    return '⭐'.repeat(Math.max(1, stars));
  }
  function renderRatingText(rating) {
    return (!rating || rating === 0) ? '暂无' : rating.toFixed(1);
  }
  function isRecent(createdTime) {
    if (!createdTime) return false;
    return (new Date() - new Date(createdTime)) < (15 * 24 * 60 * 60 * 1000);
  }

  function renderItem(shelfItem) {
    const item = shelfItem.item || shelfItem;
    const rating = shelfItem.rating_grade || item.rating || 0;
    const stars = renderStars(rating);
    const isRecentItem = isRecent(shelfItem.created_time || shelfItem.created_at);
    
    // 替换域名
    let coverUrl = item.cover_image_url || item.image || '/img/404.webp';
    coverUrl = coverUrl.replace('neodb.social', 'neodb.prvcy.page');
    let linkUrl = item.id || item.url || '#';
    linkUrl = linkUrl.replace('neodb.social', 'neodb.prvcy.page');
    const title = item.title || item.display_title || 'No Title';

    return `
      <div class="neodb-item">
        <div class="neodb-cover-wrap">
          ${isRecentItem ? '<div class="neodb-badge-new">New</div>' : ''}
          <a href="${linkUrl}" target="_blank" rel="noreferrer" style="display:block;height:100%;">
            <img src="${coverUrl}" alt="${title}" loading="lazy" onerror="this.src='/img/404.webp'">
          </a>
        </div>
        <div class="neodb-card-content">
          <div class="neodb-rating-row">
            <span>${stars}</span>
            <span>${renderRatingText(rating)}</span>
          </div>
          <h3 class="neodb-card-title">
            <a href="${linkUrl}" target="_blank" rel="noreferrer">${title}</a>
          </h3>     
        </div>
      </div>
    `;
  }

  function renderGrid(data, page = 1, append = false) {
    const grid = document.getElementById('neodb-grid');
    if(!grid) return;
    const startIndex = append ? (page - 1) * ITEMS_PER_PAGE : 0;
    const endIndex = page * ITEMS_PER_PAGE;
    const pageData = data.slice(startIndex, endIndex);

    if (!append) {
      if (!data || data.length === 0) {
        grid.innerHTML = '<div class="neodb-loading">暂无数据</div>';
        return;
      } else { grid.innerHTML = ''; }
    }
    const itemsHtml = pageData.map(shelfItem => renderItem(shelfItem)).join('');
    if (append) grid.insertAdjacentHTML('beforeend', itemsHtml);
    else grid.innerHTML = itemsHtml;
  }

  function updateTypeTexts(category) {
    const texts = NEODB_CONFIG.typeTexts[category] || NEODB_CONFIG.typeTexts.movie;
    document.querySelectorAll('.neodb-type-item').forEach(btn => {
      const type = btn.dataset.type;
      if (texts[type]) btn.textContent = texts[type];
    });
  }

  function triggerLoadMore() {
    if (isLoading || !hasMoreData) return;
    currentPage++;
    loadData(currentCategory, currentType, currentPage, true);
  }

  function setupInfiniteScroll() {
    const target = document.getElementById('neodb-load-more');
    if (!target || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          autoLoadArmed = true;
          return;
        }
        if (!autoLoadArmed) return;
        if (isLoading || !hasMoreData) return;
        autoLoadArmed = false;
        triggerLoadMore();
      });
    }, { rootMargin: INFINITE_SCROLL_ROOT_MARGIN });
    observer.observe(target);
  }

  function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) return;
    navigator.serviceWorker.register('/sw-neodb.js', { scope: '/neodb/' }).catch(() => {});
  }

  async function loadData(category, type, page = 1, append = false) {
    if (isLoading) return;
    isLoading = true;
    const grid = document.getElementById('neodb-grid');
    const loadMoreBtn = document.getElementById('load-more-btn');
    const noMoreItems = document.getElementById('no-more-items');

    if (!append) {
      grid.innerHTML = '<div class="neodb-loading"><i class="fa-solid fa-spinner fa-spin"></i> Loading...</div>';
      if(loadMoreBtn) loadMoreBtn.style.display = 'none';
      if(noMoreItems) noMoreItems.style.display = 'none';
    } else {
      if (loadMoreBtn) {
        loadMoreBtn.disabled = true;
        loadMoreBtn.textContent = '加载中...';
      }
    }

    const cacheKey = `${category}_${type}`;
    if (!allData[cacheKey]) {
      const cached = readCache(category, type);
      if (cached && cached.data) {
        allData[cacheKey] = cached.data;
        renderGrid(cached.data, page, append);
        const hasMore = cached.data.length > page * ITEMS_PER_PAGE;
        hasMoreData = hasMore;
        if (hasMore) {
          if(loadMoreBtn) {
            loadMoreBtn.style.display = 'inline-block';
            loadMoreBtn.disabled = false;
            loadMoreBtn.textContent = '加载更多';
          }
          if(noMoreItems) noMoreItems.style.display = 'none';
        } else {
          if(loadMoreBtn) loadMoreBtn.style.display = 'none';
          if(noMoreItems) noMoreItems.style.display = 'block';
        }
        isLoading = false;
        if (!isCacheFresh(cached.ts)) {
          fetchNeoDBData(category, type).then(res => {
            const freshData = res.data || [];
            writeCache(category, type, freshData);
            allData[cacheKey] = freshData;
            if (category === currentCategory && type === currentType) {
              renderGrid(freshData, currentPage, false);
              const hasMore = freshData.length > currentPage * ITEMS_PER_PAGE;
              hasMoreData = hasMore;
              if (hasMore) {
                if(loadMoreBtn) {
                  loadMoreBtn.style.display = 'inline-block';
                  loadMoreBtn.disabled = false;
                  loadMoreBtn.textContent = '加载更多';
                }
                if(noMoreItems) noMoreItems.style.display = 'none';
              } else {
                if(loadMoreBtn) loadMoreBtn.style.display = 'none';
                if(noMoreItems) noMoreItems.style.display = 'block';
              }
            }
          }).catch(() => {});
        }
        return;
      }
      const res = await fetchNeoDBData(category, type);
      allData[cacheKey] = res.data || [];
      writeCache(category, type, allData[cacheKey]);
    }

    const data = allData[cacheKey];
    renderGrid(data, page, append);

    const hasMore = data.length > page * ITEMS_PER_PAGE;
    hasMoreData = hasMore;
    if (hasMore) {
      if(loadMoreBtn) {
        loadMoreBtn.style.display = 'inline-block';
        loadMoreBtn.disabled = false;
        loadMoreBtn.textContent = '加载更多';
      }
      if(noMoreItems) noMoreItems.style.display = 'none';
    } else {
      if(loadMoreBtn) loadMoreBtn.style.display = 'none';
      if(noMoreItems) noMoreItems.style.display = 'block';
    }
    isLoading = false;
  }

  function init() {
    const container = document.getElementById('neodb-container');
    if (!container) return;
    generateNavButtons();
    container.addEventListener('click', function(e) {
        if(e.target.classList.contains('neodb-nav-item')) {
            document.querySelectorAll('.neodb-nav-item').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentCategory = e.target.dataset.category;
            currentPage = 1;
            updateTypeTexts(currentCategory);
            loadData(currentCategory, currentType, 1, false);
        }
        if(e.target.classList.contains('neodb-type-item')) {
            document.querySelectorAll('.neodb-type-item').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentType = e.target.dataset.type;
            currentPage = 1;
            loadData(currentCategory, currentType, 1, false);
        }
        if(e.target.id === 'load-more-btn') {
            triggerLoadMore();
        }
    });
    setupInfiniteScroll();
    loadData(currentCategory, currentType, 1, false);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      init();
      registerServiceWorker();
    });
  } else {
    init();
    registerServiceWorker();
  }
})();
</script>
