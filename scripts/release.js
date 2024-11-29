const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * @description 更新版本号
 * @param {string} version 新版本号
 */
function updateVersion(version) {
  try {
    // 更新 package.json
    const packagePath = path.resolve(__dirname, '../package.json');
    const packageJson = require(packagePath);
    packageJson.version = version;
    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n');

    // 更新 plugin.json
    const pluginPath = path.resolve(__dirname, '../plugin.json');
    const pluginJson = require(pluginPath);
    pluginJson.version = version;
    fs.writeFileSync(pluginPath, JSON.stringify(pluginJson, null, 2) + '\n');

    // Git 操作
    execSync('git add package.json plugin.json', { stdio: 'inherit' });
    
    // 检查是否有改动需要提交
    const status = execSync('git status --porcelain').toString();
    if (!status) {
      console.log('没有需要提交的更改');
      return;
    }

    // 提交更改
    execSync(`git commit -m "chore: 更新版本至 v${version}"`, { stdio: 'inherit' });
    execSync(`git tag v${version}`, { stdio: 'inherit' });
    execSync('git push', { stdio: 'inherit' });
    execSync('git push --tags', { stdio: 'inherit' });

    console.log(`成功更新版本至 v${version}`);
  } catch (error) {
    console.error('更新版本失败:', error.message);
    process.exit(1);
  }
}

// 从命令行参数获取版本号
const version = process.argv[2];
if (!version) {
  console.error('请提供版本号');
  process.exit(1);
}

// 验证版本号格式
const versionRegex = /^\d+\.\d+\.\d+$/;
if (!versionRegex.test(version)) {
  console.error('版本号格式错误，应为 x.y.z');
  process.exit(1);
}

updateVersion(version); 