/**
 * IQE项目服务器部署优化脚本
 * 为服务器部署准备，全面优化项目结构和代码质量
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ServerDeploymentOptimizer {
  constructor() {
    this.dryRun = true;
    this.deletedFiles = [];
    this.optimizedFiles = [];
    this.errors = [];
  }

  setDryRun(dryRun) {
    this.dryRun = dryRun;
  }

  /**
   * 安全删除文件
   */
  safeDeleteFile(filePath) {
    const fullPath = path.resolve(__dirname, filePath);
    
    try {
      if (fs.existsSync(fullPath)) {
        if (!this.dryRun) {
          fs.unlinkSync(fullPath);
        }
        this.deletedFiles.push(filePath);
        console.log(`${this.dryRun ? '🔍' : '🗑️'} 删除文件: ${filePath}`);
        return true;
      }
    } catch (error) {
      this.errors.push(`删除文件失败 ${filePath}: ${error.message}`);
      console.error(`❌ 删除文件失败 ${filePath}: ${error.message}`);
    }
    return false;
  }

  /**
   * 安全删除目录
   */
  safeDeleteDirectory(dirPath) {
    const fullPath = path.resolve(__dirname, dirPath);
    
    try {
      if (fs.existsSync(fullPath)) {
        if (!this.dryRun) {
          fs.rmSync(fullPath, { recursive: true, force: true });
        }
        this.deletedFiles.push(dirPath);
        console.log(`${this.dryRun ? '🔍' : '🗑️'} 删除目录: ${dirPath}`);
        return true;
      }
    } catch (error) {
      this.errors.push(`删除目录失败 ${dirPath}: ${error.message}`);
      console.error(`❌ 删除目录失败 ${dirPath}: ${error.message}`);
    }
    return false;
  }

  /**
   * 按模式删除文件
   */
  deleteByPattern(directory, pattern) {
    const fullDir = path.resolve(__dirname, directory);
    
    if (!fs.existsSync(fullDir)) {
      return;
    }

    try {
      const files = fs.readdirSync(fullDir);
      const regex = new RegExp(pattern.replace('*', '.*'));
      
      files.forEach(file => {
        if (regex.test(file)) {
          this.safeDeleteFile(path.join(directory, file));
        }
      });
    } catch (error) {
      this.errors.push(`按模式删除失败 ${directory}/${pattern}: ${error.message}`);
      console.error(`❌ 按模式删除失败 ${directory}/${pattern}: ${error.message}`);
    }
  }

  /**
   * 第一阶段：清理测试和调试文件
   */
  cleanupTestAndDebugFiles() {
    console.log('\n🧹 第一阶段：清理测试和调试文件...');
    
    // 根目录测试文件
    const rootTestFiles = [
      'test-api-endpoints.js',
      'test-assistant-api.js', 
      'test-data-sync.js',
      'test-enhanced-intelligent-qa.js',
      'test-field-mapping.js',
      'test-fixed-testing-rules.js',
      'test-frontend-rules-display.js',
      'test-inventory-query.js',
      'test-rules-api.js',
      'test-statistics-cards.js',
      'simple-inventory-test.js',
      'simple-rule-validation.js',
      'comprehensive-rule-analysis.js',
      'comprehensive-rule-field-validation.js',
      'comprehensive-rule-test.js',
      'comprehensive-rules-final-check.js',
      'debug-database-content.js',
      'debug-failed-queries.js',
      'debug-intent-service.js',
      'debug-inventory-data.js',
      'debug-production-query.js',
      'debug-production-tracking-fields.js',
      'debug-testing-data-issue.js',
      'diagnose-api-issue.js'
    ];

    rootTestFiles.forEach(file => this.safeDeleteFile(file));

    // Backend测试文件模式
    this.deleteByPattern('backend', 'test-.*\\.js');
    this.deleteByPattern('backend', 'debug-.*\\.js');
    this.deleteByPattern('backend', 'check-.*\\.js');
    this.deleteByPattern('backend', 'simple-.*\\.js');
    this.deleteByPattern('backend', 'quick-.*\\.js');
  }

  /**
   * 第二阶段：清理修复和临时文件
   */
  cleanupFixAndTempFiles() {
    console.log('\n🧹 第二阶段：清理修复和临时文件...');
    
    // Backend修复文件
    this.deleteByPattern('backend', 'fix-.*\\.js');
    this.deleteByPattern('backend', 'comprehensive-.*\\.js');
    this.deleteByPattern('backend', 'final-.*\\.js');
    this.deleteByPattern('backend', 'optimize-.*\\.js');
    this.deleteByPattern('backend', 'update-.*\\.js');
    this.deleteByPattern('backend', 'validate-.*\\.js');
    this.deleteByPattern('backend', 'verify-.*\\.js');

    // 中文命名的文件
    this.deleteByPattern('backend', '修复.*\\.js');
    this.deleteByPattern('backend', '检查.*\\.js');
    this.deleteByPattern('backend', '测试.*\\.js');
    this.deleteByPattern('backend', '清理.*\\.js');
    this.deleteByPattern('backend', '执行.*\\.js');
    this.deleteByPattern('backend', '排查.*\\.js');
    this.deleteByPattern('backend', '数据.*\\.js');
    this.deleteByPattern('backend', '最终.*\\.js');
    this.deleteByPattern('backend', '查找.*\\.js');
    this.deleteByPattern('backend', '深度.*\\.js');
    this.deleteByPattern('backend', '直接.*\\.js');
    this.deleteByPattern('backend', '简单.*\\.js');
    this.deleteByPattern('backend', '系统.*\\.js');
    this.deleteByPattern('backend', '综合.*\\.js');
    this.deleteByPattern('backend', '规则.*\\.js');
    this.deleteByPattern('backend', '调整.*\\.js');
    this.deleteByPattern('backend', '通过.*\\.js');
    this.deleteByPattern('backend', '验证.*\\.js');

    // 临时目录
    this.safeDeleteDirectory('temp');
    this.safeDeleteDirectory('temp_edit');
    this.safeDeleteDirectory('backend/logs');
  }

  /**
   * 第三阶段：清理重复和冗余文件
   */
  cleanupDuplicateFiles() {
    console.log('\n🧹 第三阶段：清理重复和冗余文件...');
    
    // 重复的数据处理文件
    const duplicateFiles = [
      'backend/clean-duplicate-unreasonable-rules.js',
      'backend/delete-inappropriate-rules.js',
      'backend/fix-duplicate-examples.js',
      'backend/fix-remaining-duplicates.js',
      'backend/comprehensive-rules-check.js'
    ];

    duplicateFiles.forEach(file => this.safeDeleteFile(file));

    // 根目录重复文件
    const rootDuplicates = [
      'check-all-api-endpoints.js',
      'check-data-status.js',
      'check-data-sync-issue.js',
      'check-database-data.js',
      'check-database-rules.js',
      'check-frontend-testing-data.js',
      'check-intent-rules-db.js',
      'check-inventory-fields.js',
      'check-inventory-test-tables.js',
      'check-lab-tests-fields.js',
      'check-lab-tests-real-data.js',
      'check-lab-tests-structure.js',
      'check-left-panel-rules.js',
      'check-memory-data.js',
      'check-mysql-rules.js',
      'check-online-query-sql.js',
      'check-production-data-integrity.js',
      'check-rules-and-tables.js',
      'check-rules-field-mismatch.js',
      'check-sample-data.js',
      'check-test-field-mapping.js',
      'check-testing-rules-fields.js'
    ];

    rootDuplicates.forEach(file => this.safeDeleteFile(file));
  }

  /**
   * 第四阶段：清理过时的报告和文档
   */
  cleanupReportsAndDocs() {
    console.log('\n🧹 第四阶段：清理过时的报告和文档...');
    
    // 过时的报告文件
    const reportFiles = [
      'API_OPTIMIZATION_SUMMARY.md',
      'API_UNIFICATION_SUMMARY.md', 
      'DATA_SYNC_ISSUE_RESOLUTION_REPORT.md',
      'FIELD_MAPPING_FIX_REPORT.md',
      'INTELLIGENT_QA_SYSTEM_COMPLETION_REPORT.md',
      'NLP规则优化完成报告.md',
      'QMS_AI_Assistant_Optimization_Report.md',
      'RULES_CATEGORY_FIX_SUMMARY.md',
      'RULES_UPDATE_SUMMARY.md',
      'RULE_LIBRARY_FIX_SUMMARY.md',
      'SYSTEM_VALIDATION_COMPLETE_REPORT.md',
      'TESTING_RULES_FIX_REPORT.md',
      '干扰文件清理评估报告.md',
      '智能数据探索系统.md',
      '智能问答系统优化完成报告.md',
      '规则库检查优化报告.md',
      '问答系统优化完成报告.md',
      '系统架构分析报告.md'
    ];

    reportFiles.forEach(file => this.safeDeleteFile(file));

    // Backend报告文件
    this.deleteByPattern('backend', '.*-report\\.md');
    this.deleteByPattern('backend', '.*-summary\\.md');
    this.deleteByPattern('backend', '.*完成报告\\.md');
    this.deleteByPattern('backend', '.*优化报告\\.md');
  }

  /**
   * 第五阶段：清理JSON和临时数据文件
   */
  cleanupDataFiles() {
    console.log('\n🧹 第五阶段：清理JSON和临时数据文件...');
    
    const dataFiles = [
      'cleanup-report-1752629143437.json',
      'cleanup-report-1752629184509.json',
      'backend/rule-validation-report.json',
      'backend/rule_validation_report.json',
      'backend/rules-for-frontend.json',
      'backend/enhanced_rules_export.json'
    ];

    dataFiles.forEach(file => this.safeDeleteFile(file));
  }

  /**
   * 生成优化报告
   */
  generateOptimizationReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        deletedFiles: this.deletedFiles.length,
        optimizedFiles: this.optimizedFiles.length,
        errors: this.errors.length
      },
      deletedFiles: this.deletedFiles,
      optimizedFiles: this.optimizedFiles,
      errors: this.errors
    };

    const reportPath = `optimization-report-${Date.now()}.json`;
    
    if (!this.dryRun) {
      fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
      console.log(`\n📊 优化报告已生成: ${reportPath}`);
    }

    console.log('\n📋 优化统计:');
    console.log(`   删除文件: ${this.deletedFiles.length} 个`);
    console.log(`   优化文件: ${this.optimizedFiles.length} 个`);
    console.log(`   错误数量: ${this.errors.length} 个`);

    if (this.errors.length > 0) {
      console.log('\n❌ 错误列表:');
      this.errors.forEach(error => console.log(`   ${error}`));
    }
  }

  /**
   * 执行完整优化
   */
  async optimize() {
    console.log(`🚀 开始服务器部署优化 (${this.dryRun ? '预览模式' : '实际执行'})...`);
    
    this.cleanupTestAndDebugFiles();
    this.cleanupFixAndTempFiles();
    this.cleanupDuplicateFiles();
    this.cleanupReportsAndDocs();
    this.cleanupDataFiles();
    
    this.generateOptimizationReport();
    
    if (this.dryRun) {
      console.log('\n💡 这是预览模式，没有实际删除文件');
      console.log('要执行实际优化，请运行: node 服务器部署优化脚本.js --execute');
    } else {
      console.log('\n✅ 服务器部署优化完成！');
      console.log('📦 项目已为服务器部署做好准备');
    }
  }
}

// 主函数
async function main() {
  const optimizer = new ServerDeploymentOptimizer();
  
  // 检查命令行参数
  const args = process.argv.slice(2);
  const executeMode = args.includes('--execute');
  
  optimizer.setDryRun(!executeMode);
  
  console.log('🚀 IQE项目服务器部署优化工具');
  console.log('================================');
  
  if (!executeMode) {
    console.log('⚠️ 当前为预览模式，不会实际删除文件');
    console.log('要执行实际优化，请添加 --execute 参数');
  }
  
  await optimizer.optimize();
}

// 运行优化
main().catch(console.error);

export default ServerDeploymentOptimizer;
