# utools-plugin-template

基于`utools-plugin-template`模版开发，一个主打啥都有的插件，根据评论区反馈，持续添加功能

## ✨ 功能表

- [ ] 📝 笔记
  - [ ] 支持Markdown
- [ ] 🔧 插件设置
  - [ ] 基础设置
    - [x] 主题设置
    - [x] 设置数据导出为json
    - [x] 设置数据的导入
  - [ ] 自义定样式

## 🥩 开始使用

### 🔗 克隆项目

```bash
git clone https://github.com/QC2168/utools-plugin-template.git
```

### 🔧 安装依赖

> 推荐使用`pnpm`包管理工具，如果您还没有安装可以执行`npm install -g pnpm`进行安装

```bash
pnpm install
```

### 🛫 启动项目

```bash
pnpm dev
```

### 📦 打包项目

```bash
pnpm build
```

> 执行`build`命令时，会将插件直接构建成`upx`包，开发者无需在`utools`开发者工具中二次构建 🚀

### 多个preload文件处理

> 原理：通过读取提供的`preload.js`文件，获取所需的依赖包后，在插件打包目录下执行`npm install`实现依赖安装

```js
const install = require("@qc2168/vite-plugin-utools").install
// 添加编译后的preload文件
install(['./dist/preload.js', './dist/preload2.js'])
```

### 如何启动插件

在`utools`中，打开`utools`开发者工具，并新建一个项目

根据您的实际情况，填写插件所需信息

![20231110155724](https://raw.githubusercontent.com/QC2168/note-img/main/20231110155724.png)

执行`dev`指令，生成`dist`文件夹，将文件路径选中`/dist/plugin.json`

![20231110155834](https://raw.githubusercontent.com/QC2168/note-img/main/20231110155834.png)

![20231110155947](https://raw.githubusercontent.com/QC2168/note-img/main/20231110155947.png)

启动插件，并触发插件第一个关键字

![20231110160045](https://raw.githubusercontent.com/QC2168/note-img/main/20231110160045.png)

![20231110160101](https://raw.githubusercontent.com/QC2168/note-img/main/20231110160101.png)

![20231110160121](https://raw.githubusercontent.com/QC2168/note-img/main/20231110160121.png)

开始你的开发之旅吧~

## 🍭 最后

如果您有更好的想法，欢迎提交`issue`或者`pr` 🥰🥰

如果您觉得这个项目对您有帮助，可以点击右上角的`star`按钮支持一下我，谢谢您~ 😘😘

## 💖 感谢项目

- [utools-plugin-template](https://github.com/QC2168/utools-plugin-template)
