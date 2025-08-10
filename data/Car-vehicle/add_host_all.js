const fs = require("fs");
const path = require("path");

const ROOT_DIR = "/Users/zhihanli/Documents/web-CMU-page/data"; // 你的 data 根目录
function addHostField(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  let data;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    console.error(`❌ JSON 解析失败: ${filePath}`);
    return;
  }

  if (!Array.isArray(data.references)) {
    console.warn(`⚠️ 文件中没有 references 数组: ${filePath}`);
    return;
  }

  let updated = false;

  data.references.forEach(ref => {
    if (!ref.host && ref.link) {
      try {
        const url = new URL(ref.link);
        ref.host = url.hostname.replace(/^www\./, "");
        updated = true;
      } catch (e) {
        console.warn(`⚠️ 无法解析 link: ${ref.link} in ${filePath}`);
      }
    }
  });

  if (updated) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
    console.log(`✅ 已添加 host 字段: ${filePath}`);
  } else {
    console.log(`ℹ️ 无需更新: ${filePath}`);
  }
}

function traverseDir(dir) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach(entry => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      traverseDir(fullPath);
    } else if (entry.isFile() && entry.name === "ai-overview.json") {
      addHostField(fullPath);
    }
  });
}

traverseDir(ROOT_DIR);
console.log("🎯 处理完成");
