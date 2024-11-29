/**
 * @description 检查版本号格式
 */
function checkVersion() {
  const version = process.env.VERSION;
  if (!version) {
    console.error('未提供版本号');
    process.exit(1);
  }

  const versionRegex = /^\d+\.\d+\.\d+$/;
  if (!versionRegex.test(version)) {
    console.error('版本号格式错误，应为 x.y.z');
    process.exit(1);
  }
}

checkVersion(); 