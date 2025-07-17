/**
 * IQE项目依赖项优化脚本
 * 分析和优化项目依赖，为服务器部署准备
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class DependencyOptimizer {
  constructor() {
    this.packageFiles = [];
    this.unusedDependencies = [];
    this.duplicateDependencies = [];
    this.optimizationSuggestions = [];
  }

  /**
   * 扫描所有package.json文件
   */
  scanPackageFiles() {
    console.log('🔍 扫描项目中的package.json文件...');
    
    const packagePaths = [
      'package.json',
      'backend/package.json',
      'ai-inspection-dashboard/package.json',
      'frontend/package.json',
      'api-service/package.json'
    ];

    packagePaths.forEach(packagePath => {
      const fullPath = path.resolve(__dirname, packagePath);
      if (fs.existsSync(fullPath)) {
        try {
          const content = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
          this.packageFiles.push({
            path: packagePath,
            content: content,
            dependencies: content.dependencies || {},
            devDependencies: content.devDependencies || {}
          });
          console.log(`✅ 找到: ${packagePath}`);
        } catch (error) {
          console.error(`❌ 解析失败 ${packagePath}: ${error.message}`);
        }
      }
    });

    console.log(`📦 总共找到 ${this.packageFiles.length} 个package.json文件`);
  }

  /**
   * 分析重复依赖
   */
  analyzeDuplicateDependencies() {
    console.log('\n🔍 分析重复依赖...');
    
    const allDependencies = new Map();
    
    this.packageFiles.forEach(pkg => {
      const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
      
      Object.entries(allDeps).forEach(([name, version]) => {
        if (!allDependencies.has(name)) {
          allDependencies.set(name, []);
        }
        allDependencies.get(name).push({
          package: pkg.path,
          version: version
        });
      });
    });

    // 找出重复的依赖
    allDependencies.forEach((usages, depName) => {
      if (usages.length > 1) {
        const versions = [...new Set(usages.map(u => u.version))];
        if (versions.length > 1) {
          this.duplicateDependencies.push({
            name: depName,
            usages: usages,
            versions: versions
          });
        }
      }
    });

    if (this.duplicateDependencies.length > 0) {
      console.log('⚠️ 发现重复依赖:');
      this.duplicateDependencies.forEach(dup => {
        console.log(`   ${dup.name}:`);
        dup.usages.forEach(usage => {
          console.log(`     ${usage.package}: ${usage.version}`);
        });
      });
    } else {
      console.log('✅ 没有发现重复依赖');
    }
  }

  /**
   * 分析未使用的依赖
   */
  analyzeUnusedDependencies() {
    console.log('\n🔍 分析可能未使用的依赖...');
    
    // 常见的可能未使用的依赖模式
    const suspiciousDependencies = [
      'axios-mock-adapter', // 通常只在开发时使用
      'supertest', // 测试依赖
      'jest', // 测试依赖
      'nodemon', // 开发依赖
      '@types/', // TypeScript类型定义
      'eslint', // 代码检查
      'prettier' // 代码格式化
    ];

    this.packageFiles.forEach(pkg => {
      const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
      
      Object.keys(allDeps).forEach(depName => {
        const isSuspicious = suspiciousDependencies.some(pattern => 
          depName.includes(pattern)
        );
        
        if (isSuspicious) {
          this.unusedDependencies.push({
            package: pkg.path,
            dependency: depName,
            version: allDeps[depName],
            reason: '可能未使用或应移至devDependencies'
          });
        }
      });
    });

    if (this.unusedDependencies.length > 0) {
      console.log('⚠️ 可能未使用的依赖:');
      this.unusedDependencies.forEach(unused => {
        console.log(`   ${unused.package}: ${unused.dependency} (${unused.reason})`);
      });
    } else {
      console.log('✅ 没有发现明显未使用的依赖');
    }
  }

  /**
   * 生成优化建议
   */
  generateOptimizationSuggestions() {
    console.log('\n💡 生成优化建议...');

    // 1. 版本统一建议
    if (this.duplicateDependencies.length > 0) {
      this.optimizationSuggestions.push({
        type: 'version_unification',
        title: '统一依赖版本',
        description: '以下依赖在不同包中使用了不同版本，建议统一版本',
        items: this.duplicateDependencies.map(dup => ({
          dependency: dup.name,
          versions: dup.versions,
          recommendation: `建议统一使用最新稳定版本`
        }))
      });
    }

    // 2. 依赖清理建议
    if (this.unusedDependencies.length > 0) {
      this.optimizationSuggestions.push({
        type: 'dependency_cleanup',
        title: '清理未使用依赖',
        description: '以下依赖可能未被使用，建议移除或移至devDependencies',
        items: this.unusedDependencies
      });
    }

    // 3. 生产环境优化建议
    this.optimizationSuggestions.push({
      type: 'production_optimization',
      title: '生产环境优化',
      description: '为服务器部署优化依赖配置',
      items: [
        {
          suggestion: '使用 npm ci 而不是 npm install 进行生产部署',
          reason: '更快、更可靠、更适合生产环境'
        },
        {
          suggestion: '设置 NODE_ENV=production',
          reason: '跳过devDependencies安装，减少包大小'
        },
        {
          suggestion: '考虑使用 npm prune --production',
          reason: '移除开发依赖，减少部署包大小'
        },
        {
          suggestion: '启用npm缓存',
          reason: '加速后续部署'
        }
      ]
    });

    // 4. 安全性建议
    this.optimizationSuggestions.push({
      type: 'security_optimization',
      title: '安全性优化',
      description: '提升依赖安全性的建议',
      items: [
        {
          suggestion: '定期运行 npm audit',
          reason: '检查已知安全漏洞'
        },
        {
          suggestion: '使用 npm audit fix',
          reason: '自动修复可修复的安全问题'
        },
        {
          suggestion: '考虑使用 package-lock.json',
          reason: '锁定依赖版本，确保部署一致性'
        }
      ]
    });
  }

  /**
   * 生成package.json优化版本
   */
  generateOptimizedPackageFiles() {
    console.log('\n🔧 生成优化的package.json文件...');

    this.packageFiles.forEach(pkg => {
      const optimized = JSON.parse(JSON.stringify(pkg.content));
      
      // 添加生产环境脚本
      if (!optimized.scripts) {
        optimized.scripts = {};
      }
      
      if (pkg.path === 'backend/package.json') {
        optimized.scripts['start:prod'] = 'NODE_ENV=production node src/index.js';
        optimized.scripts['install:prod'] = 'npm ci --only=production';
      }
      
      if (pkg.path === 'ai-inspection-dashboard/package.json') {
        optimized.scripts['build:prod'] = 'NODE_ENV=production vite build';
        optimized.scripts['preview:prod'] = 'NODE_ENV=production vite preview';
      }

      // 添加engines字段（如果没有）
      if (!optimized.engines) {
        optimized.engines = {
          node: '>=16.0.0',
          npm: '>=8.0.0'
        };
      }

      const optimizedPath = pkg.path.replace('.json', '.optimized.json');
      fs.writeFileSync(
        path.resolve(__dirname, optimizedPath),
        JSON.stringify(optimized, null, 2)
      );
      
      console.log(`✅ 生成优化版本: ${optimizedPath}`);
    });
  }

  /**
   * 生成优化报告
   */
  generateOptimizationReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalPackageFiles: this.packageFiles.length,
        duplicateDependencies: this.duplicateDependencies.length,
        unusedDependencies: this.unusedDependencies.length,
        optimizationSuggestions: this.optimizationSuggestions.length
      },
      packageFiles: this.packageFiles.map(pkg => ({
        path: pkg.path,
        dependencyCount: Object.keys(pkg.dependencies).length,
        devDependencyCount: Object.keys(pkg.devDependencies).length
      })),
      duplicateDependencies: this.duplicateDependencies,
      unusedDependencies: this.unusedDependencies,
      optimizationSuggestions: this.optimizationSuggestions
    };

    const reportPath = `dependency-optimization-report-${Date.now()}.json`;
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`\n📊 依赖优化报告已生成: ${reportPath}`);
    return report;
  }

  /**
   * 显示优化建议
   */
  displayOptimizationSuggestions() {
    console.log('\n💡 优化建议:');
    console.log('=============');

    this.optimizationSuggestions.forEach((suggestion, index) => {
      console.log(`\n${index + 1}. ${suggestion.title}`);
      console.log(`   ${suggestion.description}`);
      
      if (suggestion.items && suggestion.items.length > 0) {
        suggestion.items.forEach(item => {
          if (typeof item === 'string') {
            console.log(`   • ${item}`);
          } else if (item.suggestion) {
            console.log(`   • ${item.suggestion}`);
            if (item.reason) {
              console.log(`     理由: ${item.reason}`);
            }
          } else if (item.dependency) {
            console.log(`   • ${item.dependency}: ${item.versions ? item.versions.join(', ') : item.version}`);
          }
        });
      }
    });
  }

  /**
   * 执行完整的依赖优化分析
   */
  async optimize() {
    console.log('🚀 开始依赖项优化分析...');
    
    this.scanPackageFiles();
    this.analyzeDuplicateDependencies();
    this.analyzeUnusedDependencies();
    this.generateOptimizationSuggestions();
    this.generateOptimizedPackageFiles();
    
    const report = this.generateOptimizationReport();
    this.displayOptimizationSuggestions();
    
    console.log('\n📋 优化统计:');
    console.log(`   Package文件: ${report.summary.totalPackageFiles} 个`);
    console.log(`   重复依赖: ${report.summary.duplicateDependencies} 个`);
    console.log(`   可疑依赖: ${report.summary.unusedDependencies} 个`);
    console.log(`   优化建议: ${report.summary.optimizationSuggestions} 条`);
    
    console.log('\n✅ 依赖项优化分析完成！');
    console.log('📦 请查看生成的优化报告和建议');
  }
}

// 主函数
async function main() {
  const optimizer = new DependencyOptimizer();
  
  console.log('📦 IQE项目依赖项优化工具');
  console.log('==========================');
  
  await optimizer.optimize();
}

// 运行优化
main().catch(console.error);

export default DependencyOptimizer;
