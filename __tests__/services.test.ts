import mockDataService from '../src/services/mockDataService';
import { generateId, isValidUrl, isValidToken, formatDate } from '../src/utils';

describe('Services Tests', () => {
  describe('MockDataService', () => {
    it('generates system status with correct structure', () => {
      const status = mockDataService.generateSystemStatus();
      
      expect(status).toHaveProperty('health');
      expect(status).toHaveProperty('version');
      expect(status).toHaveProperty('keyCount');
      expect(status).toHaveProperty('userCount');
      expect(status).toHaveProperty('modelCount');
      expect(status).toHaveProperty('uptime');
      
      expect(['healthy', 'warning', 'error']).toContain(status.health);
      expect(typeof status.keyCount).toBe('number');
      expect(typeof status.userCount).toBe('number');
      expect(typeof status.modelCount).toBe('number');
      expect(typeof status.uptime).toBe('number');
    });

    it('generates recent keys with correct structure', () => {
      const keys = mockDataService.generateRecentKeys(5);
      
      expect(keys).toHaveLength(5);
      keys.forEach(key => {
        expect(key).toHaveProperty('id');
        expect(key).toHaveProperty('name');
        expect(key).toHaveProperty('lastUsed');
        expect(key).toHaveProperty('usage');
        expect(key.lastUsed).toBeInstanceOf(Date);
        expect(typeof key.usage).toBe('number');
      });
    });

    it('generates logged users with correct structure', () => {
      const users = mockDataService.generateLoggedUsers(3);
      
      expect(users).toHaveLength(3);
      users.forEach(user => {
        expect(user).toHaveProperty('id');
        expect(user).toHaveProperty('username');
        expect(user).toHaveProperty('email');
        expect(user).toHaveProperty('lastLogin');
        expect(user).toHaveProperty('isActive');
        expect(user.lastLogin).toBeInstanceOf(Date);
        expect(typeof user.isActive).toBe('boolean');
        expect(user.email).toContain('@');
      });
    });

    it('generates model usage with correct structure', () => {
      const models = mockDataService.generateModelUsage(4);
      
      expect(models).toHaveLength(4);
      models.forEach(model => {
        expect(model).toHaveProperty('modelName');
        expect(model).toHaveProperty('callCount');
        expect(model).toHaveProperty('tokenCount');
        expect(model).toHaveProperty('lastUsed');
        expect(model.lastUsed).toBeInstanceOf(Date);
        expect(typeof model.callCount).toBe('number');
        expect(typeof model.tokenCount).toBe('number');
      });
    });

    it('generates API stats with correct structure', () => {
      const stats = mockDataService.generateApiStats();
      
      expect(stats).toHaveProperty('totalRequests');
      expect(stats).toHaveProperty('successfulRequests');
      expect(stats).toHaveProperty('failedRequests');
      expect(stats).toHaveProperty('averageResponseTime');
      expect(stats).toHaveProperty('requestsPerHour');
      
      expect(typeof stats.totalRequests).toBe('number');
      expect(typeof stats.successfulRequests).toBe('number');
      expect(typeof stats.failedRequests).toBe('number');
      expect(stats.totalRequests).toBeGreaterThanOrEqual(stats.successfulRequests + stats.failedRequests);
    });
  });

  describe('Utils Functions', () => {
    it('generates unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      
      expect(id1).not.toBe(id2);
      expect(typeof id1).toBe('string');
      expect(typeof id2).toBe('string');
      expect(id1.length).toBeGreaterThan(0);
      expect(id2.length).toBeGreaterThan(0);
    });

    it('validates URLs correctly', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('http://example.com')).toBe(true);
      expect(isValidUrl('https://api.example.com/v1')).toBe(true);
      
      expect(isValidUrl('invalid-url')).toBe(false);
      expect(isValidUrl('ftp://example.com')).toBe(false);
      expect(isValidUrl('')).toBe(false);
      expect(isValidUrl('not-a-url')).toBe(false);
    });

    it('validates tokens correctly', () => {
      expect(isValidToken('valid-token-123')).toBe(true);
      expect(isValidToken('abc123')).toBe(true);
      expect(isValidToken('token with spaces')).toBe(true);
      
      expect(isValidToken('')).toBe(false);
      expect(isValidToken('   ')).toBe(false);
      expect(isValidToken('\t\n')).toBe(false);
    });

    it('formats dates correctly', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      const formatted = formatDate(date);
      
      expect(typeof formatted).toBe('string');
      expect(formatted).toContain('2024');
      expect(formatted).toContain('01');
      expect(formatted).toContain('15');
    });
  });
}); 