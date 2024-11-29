const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * @description 更新版本号
 * @param {string} version 新版本号
 */
function updateVersion(version) {
  // 更新 package.json
  const packagePath = path.resolve(__dirname, '../package.json');
  const packageJson = require(packagePath);
  packageJson.version = version;
  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));

  // 更新 plugin.json
  const pluginPath = path.resolve(__dirname, '../plugin.json');
  const pluginJson = require(pluginPath);
  pluginJson.version = version;
  fs.writeFileSync(pluginPath, JSON.stringify(pluginJson, null, 2));

  // 提交更改
  execSync('git add package.json plugin.json');
  execSync(`git commit -m "chore: 更新版本至 v${version}"`);
  execSync(`git tag v${version}`);
  execSync('git push');
  execSync('git push --tags');
}

// 从命令行参数获取版本号
const version = process.argv[2];
if (!version) {
  console.error('请提供版本号');
  process.exit(1);
}

updateVersion(version); 