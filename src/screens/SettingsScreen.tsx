import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { COLORS, SPACING, FONT_SIZES } from '../constants';

type SettingsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Settings'>;

interface Props {
  navigation: SettingsScreenNavigationProp;
}

const SettingsScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>设置</Text>
        <Text style={styles.placeholder}>此功能正在开发中...</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  placeholder: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

export default SettingsScreen; 