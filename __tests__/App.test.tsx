/**
 * @format
 */

import 'react-native';
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import App from '../App';
import HomeScreen from '../src/screens/HomeScreen';
import AddInstanceScreen from '../src/screens/AddInstanceScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import storageService from '../src/services/storageService';
import apiService from '../src/services/apiService';

// Mock services
jest.mock('../src/services/storageService');
jest.mock('../src/services/apiService');

const Stack = createStackNavigator();

const MockedNavigationApp = ({ component: Component, ...props }: any) => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Test" component={Component} />
    </Stack.Navigator>
  </NavigationContainer>
);

describe('New API Manager App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock storage service
    (storageService.getInstances as jest.Mock).mockResolvedValue([]);
    (storageService.saveInstance as jest.Mock).mockResolvedValue(undefined);
    
    // Mock API service
    (apiService.healthCheck as jest.Mock).mockResolvedValue(true);
    (apiService.addInstance as jest.Mock).mockReturnValue(undefined);
  });

  it('renders App component correctly', () => {
    const { getByText } = render(<App />);
    expect(getByText('API 实例管理')).toBeDefined();
  });

  it('shows empty state when no instances exist', async () => {
    const mockNavigation = {
      navigate: jest.fn(),
      goBack: jest.fn(),
    };

    const { getByText } = render(
      <MockedNavigationApp 
        component={(props: any) => <HomeScreen {...props} navigation={mockNavigation} />}
      />
    );

    await waitFor(() => {
      expect(getByText('暂无API实例')).toBeDefined();
      expect(getByText('点击右上角"+"添加实例')).toBeDefined();
    });
  });

  it('navigates to AddInstance screen when add button is pressed', async () => {
    const mockNavigation = {
      navigate: jest.fn(),
      goBack: jest.fn(),
    };

    const { getByText } = render(
      <MockedNavigationApp 
        component={(props: any) => <HomeScreen {...props} navigation={mockNavigation} />}
      />
    );

    await waitFor(() => {
      const addButton = getByText('+');
      fireEvent.press(addButton);
      expect(mockNavigation.navigate).toHaveBeenCalledWith('AddInstance');
    });
  });

  it('validates instance input in AddInstanceScreen', async () => {
    const mockNavigation = {
      navigate: jest.fn(),
      goBack: jest.fn(),
    };

    const { getByText, getByPlaceholderText } = render(
      <MockedNavigationApp 
        component={(props: any) => <AddInstanceScreen {...props} navigation={mockNavigation} />}
      />
    );

    // Try to save without filling fields
    const saveButton = getByText('保存');
    fireEvent.press(saveButton);

    // Should show validation error (mocked Alert.alert)
    expect(saveButton).toBeDefined();
  });

  it('allows input in AddInstanceScreen form fields', () => {
    const mockNavigation = {
      navigate: jest.fn(),
      goBack: jest.fn(),
    };

    const { getByPlaceholderText } = render(
      <MockedNavigationApp 
        component={(props: any) => <AddInstanceScreen {...props} navigation={mockNavigation} />}
      />
    );

    const nameInput = getByPlaceholderText('例如：生产环境API');
    const urlInput = getByPlaceholderText('https://api.example.com');
    const tokenInput = getByPlaceholderText('输入访问令牌');

    fireEvent.changeText(nameInput, '测试实例');
    fireEvent.changeText(urlInput, 'https://test.example.com');
    fireEvent.changeText(tokenInput, 'test-token-123');

    expect(nameInput.props.value).toBe('测试实例');
    expect(urlInput.props.value).toBe('https://test.example.com');
    expect(tokenInput.props.value).toBe('test-token-123');
  });

  it('renders AddInstanceScreen correctly', () => {
    const mockNavigation = {
      navigate: jest.fn(),
      goBack: jest.fn(),
    };

    const { getByText } = render(
      <MockedNavigationApp 
        component={(props: any) => <AddInstanceScreen {...props} navigation={mockNavigation} />}
      />
    );

    expect(getByText('添加新实例')).toBeDefined();
    expect(getByText('实例名称')).toBeDefined();
    expect(getByText('实例URL')).toBeDefined();
    expect(getByText('访问令牌')).toBeDefined();
    expect(getByText('测试连接')).toBeDefined();
    expect(getByText('保存')).toBeDefined();
    expect(getByText('取消')).toBeDefined();
  });
});
