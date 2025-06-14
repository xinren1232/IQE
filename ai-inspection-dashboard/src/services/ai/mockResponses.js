/**
 * AI服务模拟响应数据
 * 用于在AI服务不可用时提供模拟响应
 */

const mockResponses = {
  // 默认响应
  default: "我是IQE质量智能助手，目前正在模拟模式下运行。请问有什么可以帮助您的？",
  
  // 基于关键词的响应
  "质量": "质量问题通常可能来自多个方面，包括原材料质量、生产工艺、设备状态和人员操作等。建议查看最近的质量检测报告，分析异常趋势。",
  "批次": "批次管理是质量控制的重要环节。您可以通过系统查询特定批次的详细信息，包括生产日期、检验结果和当前状态等。",
  "实验": "实验室检验是保证产品质量的关键步骤。我们的系统可以追踪每个样品的检验过程和结果，确保数据的完整性和可追溯性。",
  "库存": "库存管理模块可以帮助您实时掌握各类物料的库存情况，包括数量、批次和状态等信息。您还可以设置库存预警，避免缺料或积压。",
  "生产": "生产管理涉及计划排程、物料准备、过程控制和异常处理等多个环节。我们的系统可以帮助您监控生产进度和质量状态。",
  "异常": "发现异常后，应立即启动异常处理流程，包括记录、分析、处置和预防措施。您可以在系统中创建异常报告并跟踪解决进度。",
  "设备": "设备状态监控对保证产品质量至关重要。我们的系统可以收集设备运行参数，分析性能趋势，预测潜在故障。",
  "检验": "检验规范应根据产品特性和客户要求制定，明确检验项目、方法和标准。您可以在系统中查看和更新检验规范。",
  "标准": "质量标准是评判产品质量的依据，包括内部标准和外部标准。您可以在系统中查询适用的质量标准和要求。",
  "报告": "质量报告提供产品质量状态的全面视图，包括合格率、不良率和异常分布等。您可以在系统中生成各类质量报告。",

  // 特定命令的响应
  "查询库存": "正在查询库存信息，请稍候...\n\n模拟库存数据:\n- 物料M001：100件，正常\n- 物料M002：200件，已冻结\n- 物料M003：50件，待检",
  "查看测试结果": "正在加载测试结果，请稍候...\n\n模拟测试数据:\n- 测试T001：通过，得分95\n- 测试T002：不通过，得分65\n- 测试T003：等待确认",
  "冻结批次": "批次冻结操作已模拟执行。在实际环境中，这将阻止该批次物料的使用，直到解除冻结状态。",
  "释放批次": "批次释放操作已模拟执行。在实际环境中，这将允许该批次物料恢复正常使用状态。"
};

export default mockResponses;
