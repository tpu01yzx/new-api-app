import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ApiInstance, RootStackParamList } from '../types';
import { COLORS, SPACING, FONT_SIZES, SHADOWS } from '../constants';
import { formatRelativeTime, getHealthColor } from '../utils';
import storageService from '../services/storageService';
import apiService from '../services/apiService';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [instances, setInstances] = useState<ApiInstance[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [instanceStatuses, setInstanceStatuses] = useState<Record<string, boolean>>({});

  const loadInstances = useCallback(async () => {
    try {
      const loadedInstances = await storageService.getInstances();
      setInstances(loadedInstances);
      
      // 检查每个实例的健康状态
      const statusChecks = loadedInstances.map(async (instance) => {
        apiService.addInstance(instance);
        const isHealthy = await apiService.healthCheck(instance.id);
        return { id: instance.id, isHealthy };
      });
      
      const statuses = await Promise.allSettled(statusChecks);
      const statusMap: Record<string, boolean> = {};
      
      statuses.forEach((result, index) => {
        const instanceId = loadedInstances[index].id;
        if (result.status === 'fulfilled') {
          statusMap[instanceId] = result.value.isHealthy;
        } else {
          statusMap[instanceId] = false;
        }
      });
      
      setInstanceStatuses(statusMap);
    } catch (error) {
      console.error('Failed to load instances:', error);
      Alert.alert('错误', '加载实例列表失败');
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadInstances();
    setRefreshing(false);
  }, [loadInstances]);

  useFocusEffect(
    useCallback(() => {
      loadInstances();
    }, [loadInstances])
  );

  const handleInstancePress = (instance: ApiInstance) => {
    navigation.navigate('InstanceDetail', { instanceId: instance.id });
  };

  const handleAddInstance = () => {
    navigation.navigate('AddInstance');
  };

  const handleDeleteInstance = async (instance: ApiInstance) => {
    Alert.alert(
      '删除确认',
      `确定要删除实例 "${instance.name}" 吗？`,
      [
        { text: '取消', style: 'cancel' },
        {
          text: '删除',
          style: 'destructive',
          onPress: async () => {
            try {
              await storageService.deleteInstance(instance.id);
              apiService.removeInstance(instance.id);
              await loadInstances();
            } catch (error) {
              console.error('Failed to delete instance:', error);
              Alert.alert('错误', '删除实例失败');
            }
          },
        },
      ]
    );
  };

  const renderInstanceItem = ({ item }: { item: ApiInstance }) => {
    const isHealthy = instanceStatuses[item.id];
    const healthColor = isHealthy ? getHealthColor('healthy') : getHealthColor('error');
    
    return (
      <TouchableOpacity
        style={styles.instanceCard}
        onPress={() => handleInstancePress(item)}
        onLongPress={() => handleDeleteInstance(item)}
      >
        <View style={styles.instanceHeader}>
          <View style={styles.instanceInfo}>
            <Text style={styles.instanceName}>{item.name}</Text>
            <Text style={styles.instanceUrl}>{item.url}</Text>
          </View>
          <View style={[styles.statusIndicator, { backgroundColor: healthColor }]} />
        </View>
        <View style={styles.instanceFooter}>
          <Text style={styles.instanceStatus}>
            {isHealthy ? '在线' : '离线'}
          </Text>
          <Text style={styles.instanceTime}>
            {formatRelativeTime(item.updatedAt)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>API 实例管理</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddInstance}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {instances.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>暂无API实例</Text>
          <Text style={styles.emptySubtext}>点击右上角"+"添加实例</Text>
        </View>
      ) : (
        <FlatList
          data={instances}
          renderItem={renderInstanceItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.separator,
  },
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.md,
  },
  addButtonText: {
    fontSize: FONT_SIZES.xxl,
    color: COLORS.surface,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: SPACING.md,
  },
  instanceCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SPACING.sm,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  instanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  instanceInfo: {
    flex: 1,
  },
  instanceName: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  instanceUrl: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: SPACING.sm,
  },
  instanceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  instanceStatus: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  instanceTime: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  emptySubtext: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textDisabled,
  },
});

export default HomeScreen; 