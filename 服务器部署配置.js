/**
 * IQE项目服务器部署配置脚本
 * 生成生产环境配置文件和部署脚本
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ServerDeploymentConfig {
  constructor() {
    this.configs = {};
    this.scripts = {};
    this.dockerFiles = {};
  }

  /**
   * 生成环境配置文件
   */
  generateEnvironmentConfigs() {
    console.log('🔧 生成环境配置文件...');

    // 生产环境配置
    this.configs.production = {
      '.env.production': `# IQE生产环境配置
NODE_ENV=production
PORT=3001
HOST=0.0.0.0

# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_NAME=iqe_inspection
DB_USER=iqe_user
DB_PASSWORD=your_secure_password

# Redis配置（如果使用）
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password

# 日志配置
LOG_LEVEL=info
LOG_FILE=/var/log/iqe/app.log

# 安全配置
JWT_SECRET=your_jwt_secret_key_here
SESSION_SECRET=your_session_secret_here
CORS_ORIGIN=https://your-domain.com

# AI服务配置
DEEPSEEK_API_KEY=your_deepseek_api_key
BAIDU_API_KEY=your_baidu_api_key
BAIDU_SECRET_KEY=your_baidu_secret_key

# 文件上传配置
UPLOAD_MAX_SIZE=10485760
UPLOAD_PATH=/var/uploads/iqe

# 监控配置
ENABLE_MONITORING=true
HEALTH_CHECK_INTERVAL=30000`,

      'backend/.env.production': `# Backend生产环境配置
NODE_ENV=production
PORT=3001
HOST=0.0.0.0

# 数据库配置
DATABASE_URL=mysql://iqe_user:your_secure_password@localhost:3306/iqe_inspection

# API配置
API_RATE_LIMIT=1000
API_TIMEOUT=30000

# 缓存配置
CACHE_TTL=3600
ENABLE_CACHE=true`,

      'ai-inspection-dashboard/.env.production': `# Frontend生产环境配置
NODE_ENV=production
VITE_API_BASE_URL=https://your-domain.com/api
VITE_APP_TITLE=IQE智能质检系统
VITE_APP_VERSION=1.0.0
VITE_ENABLE_MOCK=false
VITE_ENABLE_DEVTOOLS=false`
    };

    // 开发环境配置
    this.configs.development = {
      '.env.development': `# IQE开发环境配置
NODE_ENV=development
PORT=3001
HOST=localhost

# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_NAME=iqe_inspection_dev
DB_USER=root
DB_PASSWORD=Zxylsy.99

# 开发工具
ENABLE_HOT_RELOAD=true
ENABLE_DEBUG=true
LOG_LEVEL=debug`
    };
  }

  /**
   * 生成部署脚本
   */
  generateDeploymentScripts() {
    console.log('🚀 生成部署脚本...');

    // Linux部署脚本
    this.scripts['deploy.sh'] = `#!/bin/bash
# IQE项目Linux服务器部署脚本

set -e

echo "🚀 开始部署IQE智能质检系统..."

# 检查Node.js版本
if ! command -v node &> /dev/null; then
    echo "❌ Node.js未安装，请先安装Node.js 16+"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js版本过低，需要16+，当前版本: $(node -v)"
    exit 1
fi

# 检查MySQL
if ! command -v mysql &> /dev/null; then
    echo "⚠️ MySQL未安装，请确保MySQL服务可用"
fi

# 创建必要目录
echo "📁 创建必要目录..."
sudo mkdir -p /var/log/iqe
sudo mkdir -p /var/uploads/iqe
sudo chown -R $USER:$USER /var/log/iqe /var/uploads/iqe

# 安装依赖
echo "📦 安装项目依赖..."
npm ci --only=production

# 安装后端依赖
cd backend
npm ci --only=production
cd ..

# 构建前端
echo "🏗️ 构建前端应用..."
cd ai-inspection-dashboard
npm ci
npm run build
cd ..

# 设置环境变量
echo "⚙️ 配置环境变量..."
if [ ! -f .env.production ]; then
    echo "⚠️ 请配置.env.production文件"
    cp .env.production.example .env.production
fi

# 设置数据库
echo "🗄️ 初始化数据库..."
cd backend
npm run db:seed
cd ..

# 设置系统服务
echo "🔧 设置系统服务..."
sudo tee /etc/systemd/system/iqe-backend.service > /dev/null <<EOF
[Unit]
Description=IQE Backend Service
After=network.target mysql.service

[Service]
Type=simple
User=$USER
WorkingDirectory=$(pwd)/backend
Environment=NODE_ENV=production
ExecStart=/usr/bin/node src/index.js
Restart=always
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=iqe-backend

[Install]
WantedBy=multi-user.target
EOF

# 启动服务
sudo systemctl daemon-reload
sudo systemctl enable iqe-backend
sudo systemctl start iqe-backend

echo "✅ 部署完成！"
echo "🌐 后端服务: http://localhost:3001"
echo "📊 系统状态: sudo systemctl status iqe-backend"
echo "📝 日志查看: sudo journalctl -u iqe-backend -f"`;

    // Windows部署脚本
    this.scripts['deploy.ps1'] = `# IQE项目Windows服务器部署脚本

Write-Host "🚀 开始部署IQE智能质检系统..." -ForegroundColor Green

# 检查Node.js
try {
    $nodeVersion = node -v
    Write-Host "✅ Node.js版本: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js未安装，请先安装Node.js 16+" -ForegroundColor Red
    exit 1
}

# 创建必要目录
Write-Host "📁 创建必要目录..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path "C:\\logs\\iqe"
New-Item -ItemType Directory -Force -Path "C:\\uploads\\iqe"

# 安装依赖
Write-Host "📦 安装项目依赖..." -ForegroundColor Yellow
npm ci --only=production

# 安装后端依赖
Set-Location backend
npm ci --only=production
Set-Location ..

# 构建前端
Write-Host "🏗️ 构建前端应用..." -ForegroundColor Yellow
Set-Location ai-inspection-dashboard
npm ci
npm run build
Set-Location ..

# 配置环境变量
Write-Host "⚙️ 配置环境变量..." -ForegroundColor Yellow
if (!(Test-Path ".env.production")) {
    Write-Host "⚠️ 请配置.env.production文件" -ForegroundColor Yellow
    Copy-Item ".env.production.example" ".env.production"
}

# 启动服务
Write-Host "🚀 启动服务..." -ForegroundColor Yellow
Start-Process -FilePath "node" -ArgumentList "backend/src/index.js" -WindowStyle Hidden

Write-Host "✅ 部署完成！" -ForegroundColor Green
Write-Host "🌐 后端服务: http://localhost:3001" -ForegroundColor Cyan`;

    // Docker部署脚本
    this.scripts['deploy-docker.sh'] = `#!/bin/bash
# IQE项目Docker部署脚本

echo "🐳 使用Docker部署IQE智能质检系统..."

# 构建镜像
docker-compose build

# 启动服务
docker-compose up -d

# 等待服务启动
echo "⏳ 等待服务启动..."
sleep 30

# 检查服务状态
docker-compose ps

echo "✅ Docker部署完成！"
echo "🌐 访问地址: http://localhost:3001"`;
  }

  /**
   * 生成Docker配置
   */
  generateDockerConfigs() {
    console.log('🐳 生成Docker配置文件...');

    // Dockerfile for backend
    this.dockerFiles['backend/Dockerfile'] = `# IQE Backend Dockerfile
FROM node:18-alpine

WORKDIR /app

# 复制package文件
COPY package*.json ./
COPY pnpm-lock.yaml ./

# 安装依赖
RUN npm ci --only=production

# 复制源代码
COPY . .

# 创建非root用户
RUN addgroup -g 1001 -S nodejs
RUN adduser -S iqe -u 1001

# 设置权限
RUN chown -R iqe:nodejs /app
USER iqe

# 暴露端口
EXPOSE 3001

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
  CMD curl -f http://localhost:3001/health || exit 1

# 启动命令
CMD ["node", "src/index.js"]`;

    // Dockerfile for frontend
    this.dockerFiles['ai-inspection-dashboard/Dockerfile'] = `# IQE Frontend Dockerfile
FROM node:18-alpine as builder

WORKDIR /app

# 复制package文件
COPY package*.json ./
COPY pnpm-lock.yaml ./

# 安装依赖
RUN npm ci

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

# 生产镜像
FROM nginx:alpine

# 复制构建结果
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制nginx配置
COPY nginx.conf /etc/nginx/nginx.conf

# 暴露端口
EXPOSE 80

# 启动nginx
CMD ["nginx", "-g", "daemon off;"]`;

    // Docker Compose
    this.dockerFiles['docker-compose.yml'] = `version: '3.8'

services:
  mysql:
    image: mysql:8.0
    container_name: iqe-mysql
    environment:
      MYSQL_ROOT_PASSWORD: your_root_password
      MYSQL_DATABASE: iqe_inspection
      MYSQL_USER: iqe_user
      MYSQL_PASSWORD: your_secure_password
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
      - ./db-schema-optimized-v4.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - iqe-network

  backend:
    build: ./backend
    container_name: iqe-backend
    environment:
      NODE_ENV: production
      DB_HOST: mysql
      DB_PORT: 3306
      DB_NAME: iqe_inspection
      DB_USER: iqe_user
      DB_PASSWORD: your_secure_password
    ports:
      - "3001:3001"
    depends_on:
      - mysql
    networks:
      - iqe-network
    volumes:
      - ./logs:/var/log/iqe
      - ./uploads:/var/uploads/iqe

  frontend:
    build: ./ai-inspection-dashboard
    container_name: iqe-frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - iqe-network

  redis:
    image: redis:alpine
    container_name: iqe-redis
    ports:
      - "6379:6379"
    networks:
      - iqe-network
    volumes:
      - redis_data:/data

volumes:
  mysql_data:
  redis_data:

networks:
  iqe-network:
    driver: bridge`;

    // Nginx配置
    this.dockerFiles['ai-inspection-dashboard/nginx.conf'] = `events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    sendfile        on;
    keepalive_timeout  65;

    server {
        listen       80;
        server_name  localhost;

        root   /usr/share/nginx/html;
        index  index.html index.htm;

        # 前端路由支持
        location / {
            try_files $uri $uri/ /index.html;
        }

        # API代理
        location /api/ {
            proxy_pass http://backend:3001/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # 静态资源缓存
        location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}`;
  }

  /**
   * 生成监控配置
   */
  generateMonitoringConfigs() {
    console.log('📊 生成监控配置...');

    this.configs.monitoring = {
      'monitoring/pm2.config.js': `module.exports = {
  apps: [{
    name: 'iqe-backend',
    script: './backend/src/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    error_file: '/var/log/iqe/error.log',
    out_file: '/var/log/iqe/out.log',
    log_file: '/var/log/iqe/combined.log',
    time: true,
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024'
  }]
};`,

      'monitoring/health-check.js': `// 健康检查脚本
import http from 'http';

const healthCheck = () => {
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/health',
    method: 'GET',
    timeout: 5000
  };

  const req = http.request(options, (res) => {
    if (res.statusCode === 200) {
      console.log('✅ 服务健康');
      process.exit(0);
    } else {
      console.log('❌ 服务异常');
      process.exit(1);
    }
  });

  req.on('error', (err) => {
    console.log('❌ 健康检查失败:', err.message);
    process.exit(1);
  });

  req.on('timeout', () => {
    console.log('❌ 健康检查超时');
    req.destroy();
    process.exit(1);
  });

  req.end();
};

healthCheck();`
    };
  }

  /**
   * 写入所有配置文件
   */
  writeConfigFiles() {
    console.log('💾 写入配置文件...');

    // 写入环境配置
    Object.entries(this.configs).forEach(([category, configs]) => {
      Object.entries(configs).forEach(([filename, content]) => {
        const filePath = path.resolve(__dirname, filename);
        const dir = path.dirname(filePath);
        
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        
        fs.writeFileSync(filePath, content);
        console.log(`✅ 生成: ${filename}`);
      });
    });

    // 写入部署脚本
    Object.entries(this.scripts).forEach(([filename, content]) => {
      const filePath = path.resolve(__dirname, filename);
      fs.writeFileSync(filePath, content);
      
      // 设置执行权限（Linux/Mac）
      if (filename.endsWith('.sh')) {
        try {
          fs.chmodSync(filePath, '755');
        } catch (error) {
          console.log(`⚠️ 无法设置执行权限: ${filename}`);
        }
      }
      
      console.log(`✅ 生成: ${filename}`);
    });

    // 写入Docker文件
    Object.entries(this.dockerFiles).forEach(([filename, content]) => {
      const filePath = path.resolve(__dirname, filename);
      const dir = path.dirname(filePath);
      
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(filePath, content);
      console.log(`✅ 生成: ${filename}`);
    });
  }

  /**
   * 生成部署指南
   */
  generateDeploymentGuide() {
    const guide = `# IQE智能质检系统部署指南

## 📋 部署前准备

### 系统要求
- Node.js 16+
- MySQL 8.0+
- Redis (可选)
- Nginx (生产环境推荐)

### 环境配置
1. 复制 \`.env.production.example\` 为 \`.env.production\`
2. 修改数据库连接信息
3. 配置AI服务API密钥
4. 设置安全密钥

## 🚀 部署方式

### 方式一：传统部署
\`\`\`bash
# Linux
chmod +x deploy.sh
./deploy.sh

# Windows
powershell -ExecutionPolicy Bypass -File deploy.ps1
\`\`\`

### 方式二：Docker部署
\`\`\`bash
chmod +x deploy-docker.sh
./deploy-docker.sh
\`\`\`

### 方式三：PM2部署
\`\`\`bash
npm install -g pm2
pm2 start monitoring/pm2.config.js
\`\`\`

## 📊 监控和维护

### 服务状态检查
\`\`\`bash
# 系统服务
sudo systemctl status iqe-backend

# Docker
docker-compose ps

# PM2
pm2 status
\`\`\`

### 日志查看
\`\`\`bash
# 系统日志
sudo journalctl -u iqe-backend -f

# Docker日志
docker-compose logs -f

# PM2日志
pm2 logs iqe-backend
\`\`\`

### 健康检查
\`\`\`bash
node monitoring/health-check.js
\`\`\`

## 🔧 故障排除

### 常见问题
1. **端口占用**: 检查3001端口是否被占用
2. **数据库连接**: 确认MySQL服务运行正常
3. **权限问题**: 确保日志和上传目录有写权限
4. **内存不足**: 监控服务器内存使用情况

### 性能优化
1. 启用Redis缓存
2. 配置Nginx反向代理
3. 使用PM2集群模式
4. 定期清理日志文件

## 📞 技术支持
如遇问题，请查看日志文件或联系技术支持团队。
`;

    fs.writeFileSync(path.resolve(__dirname, 'DEPLOYMENT_GUIDE.md'), guide);
    console.log('✅ 生成: DEPLOYMENT_GUIDE.md');
  }

  /**
   * 执行完整配置生成
   */
  async generate() {
    console.log('🚀 开始生成服务器部署配置...');
    
    this.generateEnvironmentConfigs();
    this.generateDeploymentScripts();
    this.generateDockerConfigs();
    this.generateMonitoringConfigs();
    this.writeConfigFiles();
    this.generateDeploymentGuide();
    
    console.log('\n✅ 服务器部署配置生成完成！');
    console.log('📁 生成的文件:');
    console.log('   • 环境配置文件 (.env.*)');
    console.log('   • 部署脚本 (deploy.*)');
    console.log('   • Docker配置 (Dockerfile, docker-compose.yml)');
    console.log('   • 监控配置 (monitoring/*)');
    console.log('   • 部署指南 (DEPLOYMENT_GUIDE.md)');
    console.log('\n📖 请阅读 DEPLOYMENT_GUIDE.md 了解详细部署步骤');
  }
}

// 主函数
async function main() {
  const config = new ServerDeploymentConfig();
  
  console.log('⚙️ IQE项目服务器部署配置生成器');
  console.log('================================');
  
  await config.generate();
}

// 运行配置生成
main().catch(console.error);

export default ServerDeploymentConfig;
