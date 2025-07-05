/**
 * New API Manager App
 * 跨平台移动应用，用于统一监控和管理多个 new-api 实例
 *
 * @format
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './src/types';
import HomeScreen from './src/screens/HomeScreen';
import AddInstanceScreen from './src/screens/AddInstanceScreen';
import InstanceDetailScreen from './src/screens/InstanceDetailScreen';
import LogsScreen from './src/screens/LogsScreen';
import StatsScreen from './src/screens/StatsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { APP_INFO } from './src/constants';

const Stack = createStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#007AFF',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{
            title: APP_INFO.name,
            headerStyle: {
              backgroundColor: '#007AFF',
            },
          }}
        />
        <Stack.Screen 
          name="AddInstance" 
          component={AddInstanceScreen} 
          options={{
            title: '添加实例',
            headerBackTitle: '返回',
          }}
        />
        <Stack.Screen 
          name="InstanceDetail" 
          component={InstanceDetailScreen} 
          options={{
            title: '实例详情',
            headerBackTitle: '返回',
          }}
        />
        <Stack.Screen 
          name="Logs" 
          component={LogsScreen} 
          options={{
            title: '日志查看',
            headerBackTitle: '返回',
          }}
        />
        <Stack.Screen 
          name="Stats" 
          component={StatsScreen} 
          options={{
            title: '详细统计',
            headerBackTitle: '返回',
          }}
        />
        <Stack.Screen 
          name="Settings" 
          component={SettingsScreen} 
          options={{
            title: '设置',
            headerBackTitle: '返回',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
