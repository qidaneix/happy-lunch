import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export default (appInfo: EggAppInfo): object  => {
  const config = {} as PowerPartial<EggAppConfig>;

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1542440359581_7687';

  // add your egg config in here
  config.middleware = [];
  config.view = {
    defaultViewEngine: 'nunjucks',
    mapping: {
      '.nj': 'nunjucks',
    },
  };
  (config.redis as any) = {
    client: {
      port: 6379, // Redis port
      host: '182.254.213.162', // Redis host
      password: 'Xj10052124',
      db: 0,
    },
  };
  config.io = {
    namespace: {
      '/': {
        connectionMiddleware: [],
        packetMiddleware: [],
      },
    },
  };
  config.multipart = {
    mode: 'file',
  };

  // add your special config in here
  // 百度AI配置参数
  const aiConfig = {
    AiUrl: 'https://aip.baidubce.com/rest/2.0/image-classify/v1/body_num',
    tokenUrl: 'https://aip.baidubce.com/oauth/2.0/token',
    grantType: 'client_credentials',
    clientId: 'WTQZro0FkEs4KnFWuuvGFIph',
    clientSecret: 'VMQdPIGChwsORONKvdeZ4s6AIBGOGz8t',
  };

  // the return config will combines to EggAppConfig
  return {
    ...config,
    aiConfig,
  };
};
