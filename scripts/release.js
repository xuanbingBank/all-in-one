const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 获取版本号参数
const version = process.argv[2];

// 验证版本号格式
if (!version || !/^\d+\.\d+\.\d+$/.test(version)) {
  console.error('请提供正确的版本号 (例如: 1.0.0)');
  process.exit(1);
}

/**
 * @description 更新本地版本号
 */
async function updateLocalVersion() {
  try {
    const tag = `v${version}`;

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
    execSync(`git commit -m "🔧 chore: 更新版本至 ${tag}"`, { stdio: 'inherit' });
    
    // 创建新标签
    try {
      execSync(`git tag -d ${tag}`, { stdio: 'ignore' });
      execSync(`git push origin :refs/tags/${tag}`, { stdio: 'ignore' });
    } catch (e) {
      // 忽略标签不存在的错误
    }
    execSync(`git tag ${tag}`, { stdio: 'inherit' });
    
    // 推送更改
    execSync('git push', { stdio: 'inherit' });
    execSync('git push --tags', { stdio: 'inherit' });

    return true;
  } catch (error) {
    console.error('更新本地版本失败:', error.message);
    return false;
  }
}

/**
 * @description 触发 GitHub workflow
 */
async function triggerWorkflow() {
  try {
    execSync('gh --version', { stdio: 'ignore' });
    
    console.log(`正在触发 Release workflow (版本 ${version})...`);
    execSync(
      `gh workflow run Release --ref main -f version=${version} -f environment=production`,
      { stdio: 'inherit' }
    );

    console.log('\n✨ Release workflow 已触发');
    
    // 获取仓库 URL
    const remoteUrl = execSync('git remote get-url origin').toString().trim();
    const repoPath = remoteUrl.match(/github\.com[:/](.+?)(?:\.git)?$/)[1];
    console.log('你可以在 GitHub Actions 页面查看进度:');
    console.log(`https://github.com/${repoPath}/actions`);
    
    return true;
  } catch (error) {
    console.log('\n⚠️ 无法触发 GitHub workflow');
    console.log('原因: 未安装或未登录 GitHub CLI');
    console.log('你可以:');
    console.log('1. 安装 GitHub CLI:');
    console.log('   官方网站: https://cli.github.com/');
    console.log('   安装方式:');
    console.log('   # Windows (使用 winget):');
    console.log('   winget install GitHub.cli');
    console.log('   # Windows (使用 scoop):');
    console.log('   scoop install gh');
    console.log('   # 其他安装方式请访问官网');
    console.log('2. 登录: gh auth login');
    console.log('3. 安装完成后执行: pnpm run release:workflow');
    console.log('4. 或访问以下地址手动触发 workflow:');
    try {
      const remoteUrl = execSync('git remote get-url origin').toString().trim();
      const repoPath = remoteUrl.match(/github\.com[:/](.+?)(?:\.git)?$/)[1];
      console.log(`   https://github.com/${repoPath}/actions/workflows/release.yml`);
    } catch (e) {
      console.log('   无法获取仓库地址,请手动访问 GitHub 仓库');
    }
    return false;
  }
}

// 主流程
async function main() {
  console.log(`开始发布版本 ${version}...`);
  
  // 1. 更新本地版本
  const localUpdateSuccess = await updateLocalVersion();
  if (!localUpdateSuccess) {
    process.exit(1);
  }
  
  // 2. 尝试触发 workflow
  await triggerWorkflow();
  
  console.log('\n✅ 本地版本更新完成');
}

main().catch(error => {
  console.error('发布过程出错:', error);
  process.exit(1);
}); 