# IQE动态检验系统部署指南

## GitHub Pages部署流程

### 方案1：本地构建+手动部署（当前方案）
1. 本地开发完成后构建项目：
   `" >> deploy-guide.md; echo 
npm
run
build >> deploy-guide.md; echo 
`"
2. 手动部署到GitHub Pages:
   - 将dist目录中的所有文件下载到本地
   - 登录GitHub网页界面
   - 上传这些文件到仓库（可以是主分支或gh-pages分支）
   - 在仓库设置中启用GitHub Pages
   - 将dist目录中的所有文件下载到本地
   - 登录GitHub网页界面
   - 上传这些文件到仓库（可以是主分支或gh-pages分支）
   - 在仓库设置中启用GitHub Pages

### 方案2：使用部署脚本（网络连接正常时）
如果网络连接正常，可以使用deploy-win.ps1脚本自动部署：
`" >> deploy-guide.md; echo 
npm
run
deploy-win >> deploy-guide.md; echo `"
如果网络连接正常，可以使用deploy-win.ps1脚本自动部署：
npm run deploy-win
