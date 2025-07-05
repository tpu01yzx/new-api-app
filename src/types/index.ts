// API 实例类型
export interface ApiInstance {
  id: string;
  name: string;
  url: string;
  accessToken: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 系统状态类型
export interface SystemStatus {
  health: 'healthy' | 'warning' | 'error';
  version: string;
  keyCount: number;
  userCount: number;
  modelCount: number;
  uptime: number;
}

// 最近访问的KEY
export interface RecentKey {
  id: string;
  name: string;
  lastUsed: Date;
  usage: number;
}

// 登录用户信息
export interface LoggedUser {
  id: string;
  username: string;
  email: string;
  lastLogin: Date;
  isActive: boolean;
}

// 调用模型信息
export interface ModelUsage {
  modelName: string;
  callCount: number;
  tokenCount: number;
  lastUsed: Date;
}

// 访问IP信息
export interface AccessIP {
  ip: string;
  domain?: string;
  location?: string;
  accessCount: number;
  lastAccess: Date;
}

// 异常日志
export interface ErrorLog {
  id: string;
  level: 'error' | 'warning' | 'info';
  message: string;
  timestamp: Date;
  source: string;
  details?: string;
}

// API调用统计
export interface ApiStats {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  requestsPerHour: number;
}

// 导航类型
export type RootStackParamList = {
  Home: undefined;
  InstanceDetail: { instanceId: string };
  AddInstance: undefined;
  Settings: undefined;
  Logs: { instanceId: string };
  Stats: { instanceId: string };
}; 