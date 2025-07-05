// 应用信息
export const APP_INFO = {
  name: 'New API Manager',
  version: '0.0.1',
  description: '统一监控和管理多个 new-api 实例',
};

// 颜色主题
export const COLORS = {
  primary: '#007AFF',
  secondary: '#5856D6',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  info: '#5AC8FA',
  
  // 背景色
  background: '#F2F2F7',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  
  // 文字颜色
  text: '#000000',
  textSecondary: '#8E8E93',
  textDisabled: '#C7C7CC',
  
  // 边框颜色
  border: '#C6C6C8',
  separator: '#E5E5EA',
};

// 字体大小
export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 30,
};

// 间距
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

// 边界半径
export const BORDER_RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999,
};

// 阴影
export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
};

// 默认刷新间隔（毫秒）
export const REFRESH_INTERVALS = {
  status: 30000,    // 30秒刷新系统状态
  logs: 10000,      // 10秒刷新日志
  stats: 60000,     // 1分钟刷新统计
};

// API端点
export const API_ENDPOINTS = {
  STATUS: '/api/status',
  HEALTH: '/api/health',
  KEYS_RECENT: '/api/keys/recent',
  USERS_ONLINE: '/api/users/online',
  MODELS_USAGE: '/api/models/usage',
  ACCESS_IPS: '/api/access/ips',
  LOGS_ERRORS: '/api/logs/errors',
  STATS: '/api/stats',
};

// 错误消息
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '网络连接错误，请检查网络设置',
  UNAUTHORIZED: '访问令牌无效，请重新设置',
  INSTANCE_NOT_FOUND: '找不到指定的实例',
  INVALID_URL: '请输入有效的URL地址',
  INVALID_TOKEN: '请输入有效的访问令牌',
  UNKNOWN_ERROR: '发生未知错误，请稍后重试',
};

// 成功消息
export const SUCCESS_MESSAGES = {
  INSTANCE_ADDED: '实例添加成功',
  INSTANCE_UPDATED: '实例更新成功',
  INSTANCE_DELETED: '实例删除成功',
  SETTINGS_SAVED: '设置保存成功',
}; 