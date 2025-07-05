import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { 
  ApiInstance, 
  SystemStatus, 
  RecentKey, 
  LoggedUser, 
  ModelUsage, 
  AccessIP, 
  ErrorLog, 
  ApiStats 
} from '../types';
import mockDataService from './mockDataService';

class ApiService {
  private instances: Map<string, AxiosInstance> = new Map();

  // 添加API实例
  addInstance(apiInstance: ApiInstance): void {
    const axiosInstance = axios.create({
      baseURL: apiInstance.url,
      timeout: 10000,
      headers: {
        'Authorization': `Bearer ${apiInstance.accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    // 请求拦截器
    axiosInstance.interceptors.request.use(
      (config) => {
        console.log(`[${apiInstance.name}] Request:`, config.method?.toUpperCase(), config.url);
        return config;
      },
      (error) => {
        console.error(`[${apiInstance.name}] Request Error:`, error);
        return Promise.reject(error);
      }
    );

    // 响应拦截器
    axiosInstance.interceptors.response.use(
      (response) => {
        console.log(`[${apiInstance.name}] Response:`, response.status, response.data);
        return response;
      },
      (error) => {
        console.error(`[${apiInstance.name}] Response Error:`, error);
        return Promise.reject(error);
      }
    );

    this.instances.set(apiInstance.id, axiosInstance);
  }

  // 移除API实例
  removeInstance(instanceId: string): void {
    this.instances.delete(instanceId);
  }

  // 获取系统状态
  async getSystemStatus(instanceId: string): Promise<SystemStatus> {
    const instance = this.instances.get(instanceId);
    if (!instance) {
      throw new Error(`Instance ${instanceId} not found`);
    }

    try {
      const response = await instance.get('/api/status');
      return {
        health: response.data.success ? 'healthy' : 'error',
        version: response.data.version || 'unknown',
        keyCount: response.data.key_count || 0,
        userCount: response.data.user_count || 0,
        modelCount: response.data.model_count || 0,
        uptime: response.data.uptime || 0,
      };
    } catch (error) {
      console.warn('Failed to get system status from API, using mock data:', error);
      // 返回模拟数据
      return mockDataService.generateSystemStatus();
    }
  }

  // 获取最近访问的KEY
  async getRecentKeys(instanceId: string): Promise<RecentKey[]> {
    const instance = this.instances.get(instanceId);
    if (!instance) {
      throw new Error(`Instance ${instanceId} not found`);
    }

    try {
      const response = await instance.get('/api/keys/recent');
      return response.data.map((key: any) => ({
        id: key.id,
        name: key.name,
        lastUsed: new Date(key.last_used),
        usage: key.usage || 0,
      }));
    } catch (error) {
      console.warn('Failed to get recent keys from API, using mock data:', error);
      return mockDataService.generateRecentKeys();
    }
  }

  // 获取登录用户
  async getLoggedUsers(instanceId: string): Promise<LoggedUser[]> {
    const instance = this.instances.get(instanceId);
    if (!instance) {
      throw new Error(`Instance ${instanceId} not found`);
    }

    try {
      const response = await instance.get('/api/users/online');
      return response.data.map((user: any) => ({
        id: user.id,
        username: user.username,
        email: user.email,
        lastLogin: new Date(user.last_login),
        isActive: user.is_active,
      }));
    } catch (error) {
      console.warn('Failed to get logged users from API, using mock data:', error);
      return mockDataService.generateLoggedUsers();
    }
  }

  // 获取模型使用情况
  async getModelUsage(instanceId: string): Promise<ModelUsage[]> {
    const instance = this.instances.get(instanceId);
    if (!instance) {
      throw new Error(`Instance ${instanceId} not found`);
    }

    try {
      const response = await instance.get('/api/models/usage');
      return response.data.map((model: any) => ({
        modelName: model.model_name,
        callCount: model.call_count || 0,
        tokenCount: model.token_count || 0,
        lastUsed: new Date(model.last_used),
      }));
    } catch (error) {
      console.warn('Failed to get model usage from API, using mock data:', error);
      return mockDataService.generateModelUsage();
    }
  }

  // 获取访问IP列表
  async getAccessIPs(instanceId: string): Promise<AccessIP[]> {
    const instance = this.instances.get(instanceId);
    if (!instance) {
      throw new Error(`Instance ${instanceId} not found`);
    }

    try {
      const response = await instance.get('/api/access/ips');
      return response.data.map((ip: any) => ({
        ip: ip.ip,
        domain: ip.domain,
        location: ip.location,
        accessCount: ip.access_count || 0,
        lastAccess: new Date(ip.last_access),
      }));
    } catch (error) {
      console.warn('Failed to get access IPs from API, using mock data:', error);
      return mockDataService.generateAccessIPs();
    }
  }

  // 获取异常日志
  async getErrorLogs(instanceId: string, limit: number = 50): Promise<ErrorLog[]> {
    const instance = this.instances.get(instanceId);
    if (!instance) {
      throw new Error(`Instance ${instanceId} not found`);
    }

    try {
      const response = await instance.get(`/api/logs/errors?limit=${limit}`);
      return response.data.map((log: any) => ({
        id: log.id,
        level: log.level,
        message: log.message,
        timestamp: new Date(log.timestamp),
        source: log.source,
        details: log.details,
      }));
    } catch (error) {
      console.warn('Failed to get error logs from API, using mock data:', error);
      return mockDataService.generateErrorLogs(limit);
    }
  }

  // 获取API统计
  async getApiStats(instanceId: string): Promise<ApiStats> {
    const instance = this.instances.get(instanceId);
    if (!instance) {
      throw new Error(`Instance ${instanceId} not found`);
    }

    try {
      const response = await instance.get('/api/stats');
      return {
        totalRequests: response.data.total_requests || 0,
        successfulRequests: response.data.successful_requests || 0,
        failedRequests: response.data.failed_requests || 0,
        averageResponseTime: response.data.average_response_time || 0,
        requestsPerHour: response.data.requests_per_hour || 0,
      };
    } catch (error) {
      console.warn('Failed to get API stats from API, using mock data:', error);
      return mockDataService.generateApiStats();
    }
  }

  // 健康检查
  async healthCheck(instanceId: string): Promise<boolean> {
    const instance = this.instances.get(instanceId);
    if (!instance) {
      return false;
    }

    try {
      const response = await instance.get('/api/health');
      return response.status === 200;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }
}

export default new ApiService(); 