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

// 确保目录存在
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

/**
 * 从 GitHub Raw 下载 JSON 文件
 */
function downloadFile(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`JSON 解析失败: ${e.message}`));
        }
      });
    }).on('error', reject);
  });
}

/**
 * 保存 JSON 数据到本地文件
 */
function saveFile(filename, data) {
  const filePath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
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
        const savedPath = saveFile(filename, data);
        console.log(`✅ 成功 (${data.length} 条数据)`);
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
  }

  if (failCount > 0) {
    process.exit(1);
  }
}

main().catch(error => {
  console.error('\n❌ 错误:', error.message);
  process.exit(1);
});
