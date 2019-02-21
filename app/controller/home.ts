import { Controller } from 'egg';
import * as fs from 'mz/fs';

export default class HomeController extends Controller {
  public async index() {
    const { ctx } = this;
    await ctx.render('home/index.nj');
  }

  public async test() {
    const { ctx } = this;
    await ctx.render('home/test.nj');
  }

  public async init() {
    const { ctx } = this;
    await ctx.render('home/init.nj');
  }

  public async res() {
    const { ctx, app } = this;
    ctx.body = await app.redis.get('res');
  }

  public async image() {
    const { ctx } = this;
    const file = (ctx.request as any).files[0];
    try {
      const res = await ctx.service.home.image(file.filepath);
      ctx.body = {
        success: res.success,
        result: {
          personNum: res.result.personNum,
        },
        msg: res.msg,
      };
    } finally {
      await fs.unlink(file.filepath);
    }
  }
}
