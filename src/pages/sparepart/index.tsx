import { StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import colors from '~/common/colors';

import type React from 'react';

const Sparepart: React.FC = () => {
  const insets = useSafeAreaInsets();
  // 获取手机状态栏的高度
  return (
    <LinearGradient colors={[]} locations={[0, 0.5, 1]}>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Text>备件</Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
});

export default Sparepart;
