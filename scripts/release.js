const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * @description 更新版本号
 * @param {string} version 新版本号
 */
function updateVersion(version) {
  try {
    const tag = `v${version}`;

    // 更新 package.json
    const packagePath = path.resolve(__dirname, '../package.json');
    const packageJson = require(packagePath);
    
    // 检查版本是否需要更新
    if (packageJson.version === version) {
      console.log(`版本已经是 ${version}，无需更新`);
      return;
    }
    
    // 更新版本号
    packageJson.version = version;
    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n');

    // 更新 plugin.json
    const pluginPath = path.resolve(__dirname, '../plugin.json');
    const pluginJson = require(pluginPath);
    pluginJson.version = version;
    fs.writeFileSync(pluginPath, JSON.stringify(pluginJson, null, 2) + '\n');

    // 提交版本更新
    execSync('git add package.json plugin.json', { stdio: 'inherit' });
    
    // 检查是否有改动需要提交
    const status = execSync('git status --porcelain').toString();
    if (!status) {
      console.log('没有检测到文件更改，可能版本号已经更新');
      return;
    }

    // 提交更改
    execSync(`git commit -m "chore: 更新版本至 ${tag}"`, { stdio: 'inherit' });
    
    // 创建标签
    try {
      execSync(`git tag -d ${tag}`, { stdio: 'inherit' });
      execSync(`git push origin :refs/tags/${tag}`, { stdio: 'inherit' });
    } catch (e) {
      // 忽略标签不存在的错误
    }
    
    execSync(`git tag ${tag}`, { stdio: 'inherit' });
    
    // 推送更改
    console.log('推送更改到远程仓库...');
    execSync('git push', { stdio: 'inherit' });
    execSync('git push --tags', { stdio: 'inherit' });

    console.log(`成功更新版本至 ${tag}`);
    console.log('请手动前往 GitHub Actions 页面触发构建');
    console.log(`https://github.com/xuanbingBank/all-in-one/actions`);
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