import { Application } from 'egg';

export default (app: Application) => {
  app.beforeStart(async () => {
    await app.redis.set('res', JSON.stringify({
      success: false,
      result: {
        personNum: 0,
        image: '',
      },
      msg: 'no init image yet',
    }));
  });
};
