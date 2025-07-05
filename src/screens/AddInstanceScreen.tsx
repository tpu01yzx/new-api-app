import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, ApiInstance } from '../types';
import { COLORS, SPACING, FONT_SIZES, SHADOWS, SUCCESS_MESSAGES, ERROR_MESSAGES } from '../constants';
import { generateId, isValidUrl, isValidToken } from '../utils';
import storageService from '../services/storageService';
import apiService from '../services/apiService';

type AddInstanceScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AddInstance'>;

interface Props {
  navigation: AddInstanceScreenNavigationProp;
}

const AddInstanceScreen: React.FC<Props> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);

  const handleTestConnection = async () => {
    if (!validateInputs()) {
      return;
    }

    setTesting(true);
    try {
      const tempInstance: ApiInstance = {
        id: 'temp-test',
        name: name.trim(),
        url: url.trim(),
        accessToken: accessToken.trim(),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      apiService.addInstance(tempInstance);
      const isHealthy = await apiService.healthCheck(tempInstance.id);
      
      if (isHealthy) {
        Alert.alert('连接成功', '实例连接正常，可以添加');
      } else {
        Alert.alert('连接失败', '无法连接到实例，请检查URL和访问令牌');
      }
      
      apiService.removeInstance(tempInstance.id);
    } catch (error) {
      console.error('Connection test failed:', error);
      Alert.alert('连接失败', '测试连接时发生错误');
    } finally {
      setTesting(false);
    }
  };

  const validateInputs = (): boolean => {
    if (!name.trim()) {
      Alert.alert('输入错误', '请输入实例名称');
      return false;
    }

    if (!url.trim()) {
      Alert.alert('输入错误', '请输入实例URL');
      return false;
    }

    if (!isValidUrl(url.trim())) {
      Alert.alert('输入错误', ERROR_MESSAGES.INVALID_URL);
      return false;
    }

    if (!accessToken.trim()) {
      Alert.alert('输入错误', '请输入访问令牌');
      return false;
    }

    if (!isValidToken(accessToken.trim())) {
      Alert.alert('输入错误', ERROR_MESSAGES.INVALID_TOKEN);
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateInputs()) {
      return;
    }

    setLoading(true);
    try {
      const newInstance: ApiInstance = {
        id: generateId(),
        name: name.trim(),
        url: url.trim(),
        accessToken: accessToken.trim(),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await storageService.saveInstance(newInstance);
      Alert.alert('成功', SUCCESS_MESSAGES.INSTANCE_ADDED, [
        { text: '确定', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error('Failed to save instance:', error);
      Alert.alert('错误', '保存实例失败');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.title}>添加新实例</Text>
            <Text style={styles.subtitle}>输入实例信息以添加到管理列表</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>实例名称</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="例如：生产环境API"
                placeholderTextColor={COLORS.textDisabled}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>实例URL</Text>
              <TextInput
                style={styles.input}
                value={url}
                onChangeText={setUrl}
                placeholder="https://api.example.com"
                placeholderTextColor={COLORS.textDisabled}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="url"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>访问令牌</Text>
              <TextInput
                style={styles.input}
                value={accessToken}
                onChangeText={setAccessToken}
                placeholder="输入访问令牌"
                placeholderTextColor={COLORS.textDisabled}
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              style={[styles.testButton, testing && styles.buttonDisabled]}
              onPress={handleTestConnection}
              disabled={testing}
            >
              <Text style={styles.testButtonText}>
                {testing ? '测试中...' : '测试连接'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={handleCancel}
          >
            <Text style={styles.cancelButtonText}>取消</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.saveButton, loading && styles.buttonDisabled]}
            onPress={handleSave}
            disabled={loading}
          >
            <Text style={styles.saveButtonText}>
              {loading ? '保存中...' : '保存'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.separator,
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  form: {
    padding: SPACING.md,
  },
  inputGroup: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SPACING.sm,
    padding: SPACING.md,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    backgroundColor: COLORS.surface,
  },
  testButton: {
    backgroundColor: COLORS.info,
    borderRadius: SPACING.sm,
    padding: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.md,
    ...SHADOWS.sm,
  },
  testButtonText: {
    color: COLORS.surface,
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.separator,
  },
  button: {
    flex: 1,
    borderRadius: SPACING.sm,
    padding: SPACING.md,
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  cancelButton: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: SPACING.sm,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    marginLeft: SPACING.sm,
  },
  cancelButtonText: {
    color: COLORS.text,
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
  saveButtonText: {
    color: COLORS.surface,
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});

export default AddInstanceScreen; 