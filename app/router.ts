import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  router.get('/init', controller.home.init);
  router.post('/image', controller.home.image);
  router.get('/res', controller.home.res);
  router.get('/', controller.home.index);
  router.get('/test', controller.home.test);
};
