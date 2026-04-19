import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import colors from '~/common/colors';

import ListItem from './ListItem';
import useDebug from './useDebug';

const DebugPages: React.FC = () => {
  const { handelEnv, handelStorage, handelDB } = useDebug();
  const DATA = [
    {
      key: 'env',
      label: '切换环境',
      value: 'test',
      onPress: handelEnv,
    },
    {
      key: 'storageTest',
      label: '存储工具测试',
      value: 'MMKV',
      onPress: handelStorage,
    },
    {
      key: 'dbCrudDemo',
      label: 'DB 示例页（增删改查）',
      value: 'app_meta',
      onPress: handelDB,
    },
  ];

  return (
    <View style={styles.listContent}>
      <FlatList
        data={DATA}
        renderItem={({ item }) => <ListItem item={item} showSeparator={false} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listContent: {
    flex: 1,
    backgroundColor: colors.pageBackground,
  },
});

export default DebugPages;
