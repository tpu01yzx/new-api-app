import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { COLORS, SPACING, FONT_SIZES } from '../constants';

type StatsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Stats'>;
type StatsScreenRouteProp = RouteProp<RootStackParamList, 'Stats'>;

interface Props {
  navigation: StatsScreenNavigationProp;
  route: StatsScreenRouteProp;
}

const StatsScreen: React.FC<Props> = ({ navigation, route }) => {
  const { instanceId } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>详细统计</Text>
        <Text style={styles.subtitle}>实例ID: {instanceId}</Text>
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
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },
  placeholder: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

export default StatsScreen; 