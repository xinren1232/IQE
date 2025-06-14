/**
 * 规则库服务 - 提供NLP和MySQL集成的规则管理
 * 用于指导自然语言处理和数据库查询之间的映射关系
 */

class RulesDatabaseService {
  constructor() {
    this.rules = new Map();
    this.initialized = false;
  }

  /**
   * 初始化规则库
   */
  async initialize() {
    // 这里应该从服务器加载规则库
    // 目前使用本地规则进行模拟
    
    this.rules.set('quality_metrics', {
      patterns: ['质量指标', '质量标准'],
      sqlTemplate: 'SELECT metric_name, threshold, unit FROM quality_metrics WHERE product_id = {productId}',
      requiredParams: ['productId']
    });
    
    this.rules.set('lab_results', {
      patterns: ['实验室结果', '测试结果', '检验数据'],
      sqlTemplate: 'SELECT test_date, result_value, pass_fail FROM lab_results WHERE batch_id = {batchId} ORDER BY test_date DESC LIMIT 10',
      requiredParams: ['batchId']
    });
    
    this.initialized = true;
    return true;
  }

  /**
   * 根据规则名称获取规则
   * @param {string} ruleName - 规则名称
   * @returns {Object|null} 规则对象或null
   */
  getRule(ruleName) {
    return this.rules.get(ruleName) || null;
  }

  /**
   * 根据用户输入文本匹配规则
   * @param {string} text - 用户输入文本
   * @returns {Array} 匹配的规则列表
   */
  matchRules(text) {
    if (!this.initialized) {
      return [];
    }

    const matches = [];
    
    for (const [ruleName, rule] of this.rules.entries()) {
      for (const pattern of rule.patterns) {
        if (text.includes(pattern)) {
          matches.push({
            ruleName,
            rule,
            pattern
          });
          break;
        }
      }
    }
    
    return matches;
  }
}

// 创建单例
const rulesDatabaseService = new RulesDatabaseService();

export { rulesDatabaseService };
export default rulesDatabaseService;
