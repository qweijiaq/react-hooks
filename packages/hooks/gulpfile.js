const commonConfig = require('../../gulpfile'); // 导入通用的 gulp 配置文件
const gulp = require('gulp'); // 导入 gulp 模块
const fs = require('fs'); // 导入 Node.js 的文件系统模块
const fse = require('fs-extra'); // 导入 fs-extra 模块，提供了更多的文件操作方法
const fg = require('fast-glob'); // 导入 fast-glob 模块，用于快速匹配文件
const gm = require('gray-matter'); // 导入 gray-matter 模块，用于解析 Markdown 文件的元数据

/**
 * 生成描述信息
 * @param {string} mdPath Markdown 文件路径
 * @returns {Promise<string>} 描述信息
 */
async function genDesc(mdPath) {
  if (!fs.existsSync(mdPath)) {
    // 如果文件不存在则返回
    return;
  }
  const mdFile = fs.readFileSync(mdPath, 'utf8'); // 读取 Markdown 文件内容
  const { content } = gm(mdFile); // 解析 Markdown 文件的元数据
  // 匹配标题下的第一个句子作为描述信息
  let description =
    (content.replace(/\r\n/g, '\n').match(/# \w+[\s\n]+(.+?)(?:, |\. |\n|\.\n)/m) || [])[1] || '';
  // 去除首尾空格并将首字母转换为小写
  description = description.trim();
  description = description.charAt(0).toLowerCase() + description.slice(1);
  return description;
}

/**
 * 生成元数据
 * @returns {Promise<Object>} 元数据对象
 */
async function genMetaData() {
  const metadata = {
    functions: [], // 存储函数信息的数组
  };
  const hooks = fg // 使用 fast-glob 匹配符合条件的文件路径
    .sync('src/use*', {
      onlyDirectories: true,
    })
    .map((hook) => hook.replace('src/', '')) // 去除路径前缀
    .sort(); // 对路径进行排序
  await Promise.allSettled(
    // 使用 Promise.allSettled 并发执行异步任务
    hooks.map(async (hook) => {
      const description = await genDesc(`src/${hook}/index.md`); // 生成描述信息
      return {
        name: hook, // 函数名称
        description, // 函数描述
      };
    }),
  ).then((res) => {
    // 将结果存储到元数据对象中
    metadata.functions = res.map((item) => {
      if (item.status === 'fulfilled') {
        return item.value;
      }
      return null;
    });
  });
  return metadata; // 返回生成的元数据对象
}

// 定义名为 'metadata' 的 gulp 任务，用于生成元数据
gulp.task('metadata', async function () {
  const metadata = await genMetaData(); // 生成元数据
  await fse.writeJson('metadata.json', metadata, { spaces: 2 }); // 将元数据写入 JSON 文件
});

// 导出默认的 gulp 任务，依次执行通用的 gulp 配置任务和生成元数据任务
exports.default = gulp.series(commonConfig.default, 'metadata');
