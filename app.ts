import { Application } from 'egg';

export default (app: Application) => {
  app.beforeStart(async () => {
    await app.redis.set('res', JSON.stringify({
      success: false,
      result: null,
      msg: 'no init image yet',
    }));
  });
};
