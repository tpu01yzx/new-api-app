import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { 
  RootStackParamList, 
  ApiInstance, 
  SystemStatus, 
  RecentKey, 
  LoggedUser, 
  ModelUsage, 
  AccessIP, 
  ApiStats 
} from '../types';
import { COLORS, SPACING, FONT_SIZES, SHADOWS } from '../constants';
import { 
  formatDate, 
  formatNumber, 
  formatPercentage, 
  getHealthColor, 
  truncateText 
} from '../utils';
import storageService from '../services/storageService';
import apiService from '../services/apiService';

type InstanceDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'InstanceDetail'>;
type InstanceDetailScreenRouteProp = RouteProp<RootStackParamList, 'InstanceDetail'>;

interface Props {
  navigation: InstanceDetailScreenNavigationProp;
  route: InstanceDetailScreenRouteProp;
}

const InstanceDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { instanceId } = route.params;
  
  const [instance, setInstance] = useState<ApiInstance | null>(null);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [recentKeys, setRecentKeys] = useState<RecentKey[]>([]);
  const [loggedUsers, setLoggedUsers] = useState<LoggedUser[]>([]);
  const [modelUsage, setModelUsage] = useState<ModelUsage[]>([]);
  const [accessIPs, setAccessIPs] = useState<AccessIP[]>([]);
  const [apiStats, setApiStats] = useState<ApiStats | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadInstanceData = useCallback(async () => {
    try {
      // 加载实例基本信息
      const instances = await storageService.getInstances();
      const currentInstance = instances.find(i => i.id === instanceId);
      
      if (!currentInstance) {
        Alert.alert('错误', '实例不存在', [
          { text: '确定', onPress: () => navigation.goBack() }
        ]);
        return;
      }

      setInstance(currentInstance);
      
      // 确保实例已添加到API服务
      apiService.addInstance(currentInstance);

      // 并行加载所有监控数据
      const [
        statusResult,
        keysResult,
        usersResult,
        modelsResult,
        ipsResult,
        statsResult,
      ] = await Promise.allSettled([
        apiService.getSystemStatus(instanceId),
        apiService.getRecentKeys(instanceId),
        apiService.getLoggedUsers(instanceId),
        apiService.getModelUsage(instanceId),
        apiService.getAccessIPs(instanceId),
        apiService.getApiStats(instanceId),
      ]);

      // 处理结果
      if (statusResult.status === 'fulfilled') {
        setSystemStatus(statusResult.value);
      }
      if (keysResult.status === 'fulfilled') {
        setRecentKeys(keysResult.value);
      }
      if (usersResult.status === 'fulfilled') {
        setLoggedUsers(usersResult.value);
      }
      if (modelsResult.status === 'fulfilled') {
        setModelUsage(modelsResult.value);
      }
      if (ipsResult.status === 'fulfilled') {
        setAccessIPs(ipsResult.value);
      }
      if (statsResult.status === 'fulfilled') {
        setApiStats(statsResult.value);
      }

    } catch (error) {
      console.error('Failed to load instance data:', error);
      Alert.alert('错误', '加载数据失败');
    } finally {
      setLoading(false);
    }
  }, [instanceId, navigation]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadInstanceData();
    setRefreshing(false);
  }, [loadInstanceData]);

  useEffect(() => {
    loadInstanceData();
  }, [loadInstanceData]);

  const handleViewLogs = () => {
    navigation.navigate('Logs', { instanceId });
  };

  const handleViewStats = () => {
    navigation.navigate('Stats', { instanceId });
  };

  const renderStatusCard = () => {
    if (!systemStatus) return null;

    const healthColor = getHealthColor(systemStatus.health);

    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>系统状态</Text>
        <View style={styles.statusGrid}>
          <View style={styles.statusItem}>
            <View style={[styles.statusIndicator, { backgroundColor: healthColor }]} />
            <Text style={styles.statusLabel}>状态</Text>
            <Text style={styles.statusValue}>
              {systemStatus.health === 'healthy' ? '正常' : '异常'}
            </Text>
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>版本</Text>
            <Text style={styles.statusValue}>{systemStatus.version}</Text>
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>密钥数量</Text>
            <Text style={styles.statusValue}>{formatNumber(systemStatus.keyCount)}</Text>
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>用户数量</Text>
            <Text style={styles.statusValue}>{formatNumber(systemStatus.userCount)}</Text>
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>模型数量</Text>
            <Text style={styles.statusValue}>{formatNumber(systemStatus.modelCount)}</Text>
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>运行时间</Text>
            <Text style={styles.statusValue}>{Math.floor(systemStatus.uptime / 3600)}h</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderStatsCard = () => {
    if (!apiStats) return null;

    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>API统计</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{formatNumber(apiStats.totalRequests)}</Text>
            <Text style={styles.statLabel}>总请求数</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: COLORS.success }]}>
              {formatNumber(apiStats.successfulRequests)}
            </Text>
            <Text style={styles.statLabel}>成功请求</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: COLORS.error }]}>
              {formatNumber(apiStats.failedRequests)}
            </Text>
            <Text style={styles.statLabel}>失败请求</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{apiStats.averageResponseTime}ms</Text>
            <Text style={styles.statLabel}>平均响应</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderListCard = (title: string, items: any[], renderItem: (item: any) => React.ReactNode) => {
    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{title}</Text>
        {items.length === 0 ? (
          <Text style={styles.emptyText}>暂无数据</Text>
        ) : (
          <View style={styles.listContainer}>
            {items.slice(0, 5).map((item, index) => (
              <View key={index} style={styles.listItem}>
                {renderItem(item)}
              </View>
            ))}
            {items.length > 5 && (
              <Text style={styles.moreText}>还有 {items.length - 5} 条数据...</Text>
            )}
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>加载中...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!instance) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>实例不存在</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.header}>
          <Text style={styles.instanceName}>{instance.name}</Text>
          <Text style={styles.instanceUrl}>{instance.url}</Text>
        </View>

        {renderStatusCard()}
        {renderStatsCard()}

        {renderListCard('最近访问的密钥', recentKeys, (key: RecentKey) => (
          <View style={styles.keyItem}>
            <Text style={styles.keyName}>{truncateText(key.name, 20)}</Text>
            <Text style={styles.keyUsage}>使用: {key.usage}</Text>
            <Text style={styles.keyTime}>{formatDate(key.lastUsed)}</Text>
          </View>
        ))}

        {renderListCard('在线用户', loggedUsers, (user: LoggedUser) => (
          <View style={styles.userItem}>
            <Text style={styles.userName}>{user.username}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            <Text style={styles.userTime}>{formatDate(user.lastLogin)}</Text>
          </View>
        ))}

        {renderListCard('模型使用', modelUsage, (model: ModelUsage) => (
          <View style={styles.modelItem}>
            <Text style={styles.modelName}>{model.modelName}</Text>
            <Text style={styles.modelCalls}>调用: {formatNumber(model.callCount)}</Text>
            <Text style={styles.modelTokens}>Token: {formatNumber(model.tokenCount)}</Text>
          </View>
        ))}

        {renderListCard('访问IP', accessIPs, (ip: AccessIP) => (
          <View style={styles.ipItem}>
            <Text style={styles.ipAddress}>{ip.ip}</Text>
            <Text style={styles.ipDomain}>{ip.domain || '未知域名'}</Text>
            <Text style={styles.ipCount}>访问: {formatNumber(ip.accessCount)}</Text>
          </View>
        ))}

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={handleViewLogs}>
            <Text style={styles.actionButtonText}>查看日志</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleViewStats}>
            <Text style={styles.actionButtonText}>详细统计</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.textSecondary,
  },
  header: {
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.separator,
  },
  instanceName: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  instanceUrl: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: SPACING.sm,
    padding: SPACING.md,
    margin: SPACING.md,
    marginBottom: 0,
    ...SHADOWS.sm,
  },
  cardTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statusItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: SPACING.xs,
  },
  statusLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  statusValue: {
    fontSize: FONT_SIZES.md,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  statValue: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  statLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  listContainer: {
    maxHeight: 200,
  },
  listItem: {
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.separator,
  },
  emptyText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingVertical: SPACING.lg,
  },
  moreText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.sm,
  },
  keyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  keyName: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    flex: 1,
  },
  keyUsage: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginHorizontal: SPACING.sm,
  },
  keyTime: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
  },
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userName: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    flex: 1,
  },
  userEmail: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginHorizontal: SPACING.sm,
  },
  userTime: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
  },
  modelItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modelName: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    flex: 1,
  },
  modelCalls: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginHorizontal: SPACING.sm,
  },
  modelTokens: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
  },
  ipItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ipAddress: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    flex: 1,
  },
  ipDomain: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginHorizontal: SPACING.sm,
  },
  ipCount: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: SPACING.md,
  },
  actionButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SPACING.sm,
    padding: SPACING.md,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: SPACING.sm,
    ...SHADOWS.sm,
  },
  actionButtonText: {
    color: COLORS.surface,
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
});

export default InstanceDetailScreen; 