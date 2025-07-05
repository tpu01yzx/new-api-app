import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiInstance } from '../types';

class StorageService {
  private static readonly INSTANCES_KEY = 'api_instances';
  private static readonly SELECTED_INSTANCE_KEY = 'selected_instance';

  // 获取所有API实例
  async getInstances(): Promise<ApiInstance[]> {
    try {
      const data = await AsyncStorage.getItem(StorageService.INSTANCES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to get instances:', error);
      return [];
    }
  }

  // 保存API实例
  async saveInstance(instance: ApiInstance): Promise<void> {
    try {
      const instances = await this.getInstances();
      const existingIndex = instances.findIndex(i => i.id === instance.id);
      
      if (existingIndex >= 0) {
        instances[existingIndex] = instance;
      } else {
        instances.push(instance);
      }
      
      await AsyncStorage.setItem(
        StorageService.INSTANCES_KEY, 
        JSON.stringify(instances)
      );
    } catch (error) {
      console.error('Failed to save instance:', error);
      throw error;
    }
  }

  // 删除API实例
  async deleteInstance(instanceId: string): Promise<void> {
    try {
      const instances = await this.getInstances();
      const filteredInstances = instances.filter(i => i.id !== instanceId);
      
      await AsyncStorage.setItem(
        StorageService.INSTANCES_KEY, 
        JSON.stringify(filteredInstances)
      );
    } catch (error) {
      console.error('Failed to delete instance:', error);
      throw error;
    }
  }

  // 获取选中的实例ID
  async getSelectedInstanceId(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(StorageService.SELECTED_INSTANCE_KEY);
    } catch (error) {
      console.error('Failed to get selected instance:', error);
      return null;
    }
  }

  // 设置选中的实例ID
  async setSelectedInstanceId(instanceId: string): Promise<void> {
    try {
      await AsyncStorage.setItem(StorageService.SELECTED_INSTANCE_KEY, instanceId);
    } catch (error) {
      console.error('Failed to set selected instance:', error);
      throw error;
    }
  }

  // 清除所有数据
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        StorageService.INSTANCES_KEY,
        StorageService.SELECTED_INSTANCE_KEY
      ]);
    } catch (error) {
      console.error('Failed to clear all data:', error);
      throw error;
    }
  }
}

export default new StorageService(); 