const { execSync } = require('child_process');

// 获取版本号参数
const version = process.argv[2];

// 验证版本号格式
if (!version || !/^\d+\.\d+\.\d+$/.test(version)) {
  console.error('请提供正确的版本号 (例如: 1.0.0)');
  process.exit(1);
}

try {
  // 检查是否安装了 gh cli
  try {
    execSync('gh --version', { stdio: 'ignore' });
  } catch (error) {
    console.error('请先安装 GitHub CLI (gh)');
    console.error('安装指南: https://cli.github.com/');
    process.exit(1);
  }

  // 触发 workflow
  console.log(`正在触发 Release workflow (版本 ${version})...`);
  execSync(
    `gh workflow run Release --ref main -f version=${version} -f environment=production`,
    { stdio: 'inherit' }
  );

  console.log('\n✨ Release workflow 已触发');
  console.log('你可以在 GitHub Actions 页面查看进度:');
  
  // 获取仓库信息并生成 Actions URL
  const remoteUrl = execSync('git remote get-url origin').toString().trim();
  const repoPath = remoteUrl.match(/github\.com[:/](.+?)(?:\.git)?$/)[1];
  console.log(`https://github.com/${repoPath}/actions`);

} catch (error) {
  console.error('\n❌ 触发 workflow 失败:', error.message);
  process.exit(1);
} 