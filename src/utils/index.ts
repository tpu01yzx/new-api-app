// 生成唯一ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// 格式化日期
export const formatDate = (date: Date): string => {
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

// 格式化相对时间
export const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return `${days}天前`;
  } else if (hours > 0) {
    return `${hours}小时前`;
  } else if (minutes > 0) {
    return `${minutes}分钟前`;
  } else {
    return '刚刚';
  }
};

// 格式化文件大小
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// 格式化数字（添加千分位分隔符）
export const formatNumber = (num: number): string => {
  return num.toLocaleString('zh-CN');
};

// 格式化百分比
export const formatPercentage = (value: number, total: number): string => {
  if (total === 0) return '0%';
  const percentage = ((value / total) * 100).toFixed(1);
  return `${percentage}%`;
};

// 验证URL格式
export const isValidUrl = (url: string): boolean => {
  try {
    const urlObject = new URL(url);
    return urlObject.protocol === 'http:' || urlObject.protocol === 'https:';
  } catch {
    return false;
  }
};

// 验证访问令牌格式
export const isValidToken = (token: string): boolean => {
  return token.trim().length > 0;
};

// 延迟函数
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// 防抖函数
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void => {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// 节流函数
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void => {
  let lastTime = 0;
  
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastTime >= wait) {
      lastTime = now;
      func(...args);
    }
  };
};

// 获取健康状态颜色
export const getHealthColor = (health: 'healthy' | 'warning' | 'error'): string => {
  switch (health) {
    case 'healthy':
      return '#34C759';
    case 'warning':
      return '#FF9500';
    case 'error':
      return '#FF3B30';
    default:
      return '#8E8E93';
  }
};

// 获取日志级别颜色
export const getLogLevelColor = (level: 'error' | 'warning' | 'info'): string => {
  switch (level) {
    case 'error':
      return '#FF3B30';
    case 'warning':
      return '#FF9500';
    case 'info':
      return '#5AC8FA';
    default:
      return '#8E8E93';
  }
};

// 截断文本
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// 安全解析JSON
export const safeJsonParse = <T>(json: string, defaultValue: T): T => {
  try {
    return JSON.parse(json);
  } catch {
    return defaultValue;
  }
};

// 检查字符串是否为空
export const isEmpty = (str: string | null | undefined): boolean => {
  return !str || str.trim().length === 0;
};

// 生成随机颜色
export const generateRandomColor = (): string => {
  const colors = [
    '#007AFF', '#5856D6', '#34C759', '#FF9500', '#FF3B30', 
    '#5AC8FA', '#FF2D92', '#AF52DE', '#32D74B', '#FFD60A'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}; 