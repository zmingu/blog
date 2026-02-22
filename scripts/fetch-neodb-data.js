#!/usr/bin/env node

/**
 * 从 zmingu/neodb-data 仓库拉取数据到本地
 * 用途：本地开发环境中获取最新数据，或在 Netlify 构建前更新数据
 * 
 * 使用方式：
 *   npm run fetch:neodb    # 拉取所有数据
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const CATEGORIES = ['game', 'movie', 'tv', 'book'];
const TYPES = ['complete', 'progress', 'wishlist'];
const DATA_DIR = path.join(__dirname, '../static/data/neodb');
const MAX_RETRIES = 3;
const TIMEOUT = 10000; // 10 seconds
const OUTPUT_OPTIONS = {
  minify: true,
  trimFields: true
};

// 确保目录存在
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

/**
 * 从 GitHub Raw 下载 JSON 文件 (带重试和超时)
 */
function downloadFile(url, retries = MAX_RETRIES) {
  return new Promise((resolve, reject) => {
    const request = https.get(url, { timeout: TIMEOUT }, (res) => {
      if (res.statusCode !== 200) {
        res.resume(); // Consume response data to free up memory
        return reject(new Error(`请求失败，状态码: ${res.statusCode}`));
      }

      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`JSON 解析失败: ${e.message}`));
        }
      });
    });

    request.on('error', (err) => {
      reject(new Error(`网络错误: ${err.message}`));
    });

    request.on('timeout', () => {
      request.destroy();
      reject(new Error(`请求超时 (${TIMEOUT}ms)`));
    });
  }).catch(err => {
    if (retries > 0) {
      console.log(`    ⚠️ 下载失败: ${err.message}. 重试中 (${retries} 剩余)...`);
      return new Promise(r => setTimeout(r, 1000)).then(() => downloadFile(url, retries - 1));
    }
    throw err;
  });
}

/**
 * 保存 JSON 数据到本地文件
 */
function toArray(data) {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.data)) return data.data;
  return [];
}

function trimRecord(record) {
  const safeRecord = record || {};
  const item = safeRecord.item || safeRecord;
  return {
    rating_grade: safeRecord.rating_grade,
    created_time: safeRecord.created_time,
    created_at: safeRecord.created_at,
    item: {
      cover_image_url: item.cover_image_url,
      image: item.image,
      rating: item.rating,
      id: item.id,
      url: item.url,
      title: item.title,
      display_title: item.display_title
    }
  };
}

function normalizeData(data) {
  const list = toArray(data);
  if (!OUTPUT_OPTIONS.trimFields) return list;
  return list.map(trimRecord);
}

function saveFile(filename, data) {
  const filePath = path.join(DATA_DIR, filename);
  const json = OUTPUT_OPTIONS.minify
    ? JSON.stringify(data)
    : JSON.stringify(data, null, 2);
  fs.writeFileSync(filePath, json);
  return filePath;
}

/**
 * 主流程
 */
async function main() {
  console.log('🚀 开始拉取 NeoDB 数据...\n');
  console.log(`📁 目标目录: ${DATA_DIR}\n`);

  let successCount = 0;
  let failCount = 0;

  for (const category of CATEGORIES) {
    for (const type of TYPES) {
      const filename = `${category}_${type}.json`;
      const url = `https://raw.githubusercontent.com/zmingu/neodb-data/main/neodb/${filename}`;

      try {
        process.stdout.write(`  ⏳ 下载 ${filename}... `);
        const data = await downloadFile(url);
        const normalized = normalizeData(data);
        const savedPath = saveFile(filename, normalized);
        const count = normalized.length;
        console.log(`✅ 成功 (${count} 条数据)`);
        successCount++;
      } catch (error) {
        console.log(`❌ 失败: ${error.message}`);
        failCount++;
      }
    }
  }

  console.log(`\n📊 拉取完成:`);
  console.log(`   ✅ 成功: ${successCount}/${CATEGORIES.length * TYPES.length}`);
  if (failCount > 0) {
    console.log(`   ❌ 失败: ${failCount}/${CATEGORIES.length * TYPES.length}`);
    process.exit(1);
  }
}

main().catch(error => {
  console.error('\n❌ 致命错误:', error.message);
  process.exit(1);
});
