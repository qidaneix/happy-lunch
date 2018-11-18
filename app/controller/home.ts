import { Controller } from 'egg';
import * as fs from 'mz/fs';

export default class HomeController extends Controller {
  public async index() {
    const { ctx } = this;
    await ctx.render('home/index.nj');
  }

  public async image() {
    const { ctx } = this;
    const file = (ctx.request as any).files[0];
    let result: any = '';
    try {
      result = await ctx.service.home.image(file.filepath);
    } finally {
      await fs.unlink(file.filepath);
    }
    ctx.body = result;
  }
}
