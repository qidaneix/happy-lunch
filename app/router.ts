import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  router.get('/init', controller.home.init);
  router.post('/image', controller.home.image);
  router.get('/result', controller.home.result);
  router.get('/', controller.home.index);
};
