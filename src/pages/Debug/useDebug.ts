const useDebug = () => {
  const handelEnv = () => {
    console.log('切换环境');
  };

  //点击存储工具测试
  const handelStorage = () => {
    console.log('存储工具测试');
  };

  //DB 示例页（增删改查)
  const handelDB = () => {
    console.log('DB 示例页（增删改查)');
  };

  return { handelEnv, handelStorage, handelDB };
};

export default useDebug;
