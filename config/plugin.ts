import { EggPlugin } from 'egg';

const plugin: EggPlugin = {
  // static: true,
  handlebars: {
    enable: true,
    package: 'egg-view-nunjucks',
  },
};

export default plugin;
