import { 
  SystemStatus, 
  RecentKey, 
  LoggedUser, 
  ModelUsage, 
  AccessIP, 
  ErrorLog, 
  ApiStats 
} from '../types';
import { generateId } from '../utils';

class MockDataService {
  // 生成模拟系统状态
  generateSystemStatus(): SystemStatus {
    return {
      health: Math.random() > 0.8 ? 'error' : Math.random() > 0.6 ? 'warning' : 'healthy',
      version: 'v1.2.3',
      keyCount: Math.floor(Math.random() * 50) + 10,
      userCount: Math.floor(Math.random() * 20) + 5,
      modelCount: Math.floor(Math.random() * 15) + 8,
      uptime: Math.floor(Math.random() * 864000) + 86400, // 1-10天
    };
  }

  // 生成模拟最近访问的KEY
  generateRecentKeys(count: number = 10): RecentKey[] {
    const keys: RecentKey[] = [];
    const keyNames = [
      'GPT-4-Key-001', 'Claude-Key-002', 'GPT-3.5-Key-003', 
      'PaLM-Key-004', 'ChatGPT-Key-005', 'Bard-Key-006',
      'LLaMA-Key-007', 'Vicuna-Key-008', 'Alpaca-Key-009'
    ];

    for (let i = 0; i < count; i++) {
      keys.push({
        id: generateId(),
        name: keyNames[i % keyNames.length] + `-${i}`,
        lastUsed: new Date(Date.now() - Math.random() * 86400000 * 7), // 过去7天
        usage: Math.floor(Math.random() * 1000),
      });
    }

    return keys.sort((a, b) => b.lastUsed.getTime() - a.lastUsed.getTime());
  }

  // 生成模拟在线用户
  generateLoggedUsers(count: number = 8): LoggedUser[] {
    const users: LoggedUser[] = [];
    const usernames = [
      'admin', 'developer', 'tester', 'user001', 'user002', 
      'manager', 'analyst', 'support'
    ];
    const domains = ['example.com', 'test.org', 'demo.net'];

    for (let i = 0; i < count; i++) {
      const username = usernames[i % usernames.length];
      const domain = domains[Math.floor(Math.random() * domains.length)];
      
      users.push({
        id: generateId(),
        username: username + (i > usernames.length - 1 ? i : ''),
        email: `${username}@${domain}`,
        lastLogin: new Date(Date.now() - Math.random() * 86400000), // 过去24小时
        isActive: Math.random() > 0.2,
      });
    }

    return users.sort((a, b) => b.lastLogin.getTime() - a.lastLogin.getTime());
  }

  // 生成模拟模型使用情况
  generateModelUsage(count: number = 12): ModelUsage[] {
    const models = [
      'gpt-4', 'gpt-3.5-turbo', 'claude-v1', 'claude-instant',
      'text-davinci-003', 'text-curie-001', 'palm-2', 'llama-2',
      'vicuna-13b', 'alpaca-7b', 'chatglm-6b', 'baichuan-13b'
    ];

    const usageData: ModelUsage[] = [];

    for (let i = 0; i < count; i++) {
      usageData.push({
        modelName: models[i % models.length],
        callCount: Math.floor(Math.random() * 5000) + 100,
        tokenCount: Math.floor(Math.random() * 1000000) + 10000,
        lastUsed: new Date(Date.now() - Math.random() * 86400000 * 3), // 过去3天
      });
    }

    return usageData.sort((a, b) => b.callCount - a.callCount);
  }

  // 生成模拟访问IP
  generateAccessIPs(count: number = 15): AccessIP[] {
    const ips: AccessIP[] = [];
    const domains = [
      'office.company.com', 'vpn.corp.net', 'home.user.org',
      'mobile.carrier.com', 'cloud.provider.io', 'cdn.service.net'
    ];
    const locations = [
      '北京', '上海', '深圳', '杭州', '成都', '广州', 
      '武汉', '西安', '南京', '天津'
    ];

    for (let i = 0; i < count; i++) {
      const ip = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
      
      ips.push({
        ip,
        domain: Math.random() > 0.3 ? domains[Math.floor(Math.random() * domains.length)] : undefined,
        location: locations[Math.floor(Math.random() * locations.length)],
        accessCount: Math.floor(Math.random() * 500) + 1,
        lastAccess: new Date(Date.now() - Math.random() * 86400000 * 2), // 过去2天
      });
    }

    return ips.sort((a, b) => b.accessCount - a.accessCount);
  }

  // 生成模拟错误日志
  generateErrorLogs(count: number = 20): ErrorLog[] {
    const logs: ErrorLog[] = [];
    const levels: ('error' | 'warning' | 'info')[] = ['error', 'warning', 'info'];
    const sources = ['API Gateway', 'Auth Service', 'Model Service', 'Database', 'Cache', 'Queue'];
    const errorMessages = [
      'Connection timeout to model service',
      'Invalid API key provided',
      'Rate limit exceeded for user',
      'Model inference failed',
      'Database connection lost',
      'Cache miss for frequent request',
      'Queue processing delayed',
      'Authentication token expired',
      'Request payload too large',
      'Service temporarily unavailable'
    ];

    for (let i = 0; i < count; i++) {
      const level = levels[Math.floor(Math.random() * levels.length)];
      const source = sources[Math.floor(Math.random() * sources.length)];
      const message = errorMessages[Math.floor(Math.random() * errorMessages.length)];

      logs.push({
        id: generateId(),
        level,
        message,
        timestamp: new Date(Date.now() - Math.random() * 86400000 * 7), // 过去7天
        source,
        details: Math.random() > 0.5 ? `Additional details for ${message.toLowerCase()}` : undefined,
      });
    }

    return logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // 生成模拟API统计
  generateApiStats(): ApiStats {
    const totalRequests = Math.floor(Math.random() * 100000) + 10000;
    const failedRequests = Math.floor(totalRequests * (Math.random() * 0.1)); // 0-10%失败率
    const successfulRequests = totalRequests - failedRequests;

    return {
      totalRequests,
      successfulRequests,
      failedRequests,
      averageResponseTime: Math.floor(Math.random() * 500) + 50, // 50-550ms
      requestsPerHour: Math.floor(Math.random() * 5000) + 500,
    };
  }

  // 模拟网络延迟
  async delay(ms: number = 500): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, ms));
  }

  // 生成完整的模拟数据集
  async generateFullDataSet() {
    await this.delay(Math.random() * 1000 + 500); // 0.5-1.5s延迟

    return {
      systemStatus: this.generateSystemStatus(),
      recentKeys: this.generateRecentKeys(),
      loggedUsers: this.generateLoggedUsers(),
      modelUsage: this.generateModelUsage(),
      accessIPs: this.generateAccessIPs(),
      errorLogs: this.generateErrorLogs(),
      apiStats: this.generateApiStats(),
    };
  }
}

export default new MockDataService(); 