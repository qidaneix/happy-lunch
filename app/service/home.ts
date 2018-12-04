import { Service } from 'egg';
import * as fs from 'mz/fs';

interface Response<T = any> {
  data: T;
}

interface ResponseDataSuccess {
  person_num: number;
  image: string;
}

interface ResponseDataFail {
  error_code: number;
  error_msg: string;
}

interface Res<T = any> {
  success: boolean;
  result: T;
  msg: string;
}

interface Result {
  personNum: number;
  image: string;
}

/**
 * Home Service
 */
export default class extends Service {
  /**
   * 百度操作一波
   * @param filepath
   */
  public async image(filepath: string) {
    const res: Res<Result> = {
      success: false,
      result: {
        personNum: 0,
        image: '',
      },
      msg: '',
    };
    const AIConfig = this.config.AIConfig;
    const { ctx, app } = this;
    let accessToken: string|undefined = await app.redis.get('accessToken');
    if (!accessToken) {
      const accessTokenRes = await this.ctx.service.accessToken.get();
      if (!accessTokenRes.success) {
        res.success = false;
        res.msg = 'get access token wrong';
        return this.handleResult(res);
      } else {
        accessToken = accessTokenRes.accessToken;
      }
    }
    const imageBase64 = (await fs.readFile(filepath)).toString('base64');
    const { data } = await ctx.curl<Response<ResponseDataSuccess|ResponseDataFail>>(AIConfig.AIUrl, {
      method: 'POST',
      contentType: 'application/x-www-form-urlencoded',
      dataType: 'json',
      data: {
        access_token: accessToken,
        image: imageBase64,
        show: true,
      },
    });
    if ((data as ResponseDataFail).error_code) {
      ctx.logger.error(new Error(JSON.stringify(data)));
      res.success = false;
      res.msg = (data as ResponseDataFail).error_msg;
      return this.handleResult(res);
    } else {
      res.success = true;
      (res.result as Result).personNum = (data as ResponseDataSuccess).person_num;
      (res.result as Result).image = (data as ResponseDataSuccess).image;
      return this.handleResult(res);
    }
  }

  /**
   * 统一返回值处理
   * @param filepath
   */
  private async handleResult(res: Res<Result>) {
    const { app } = this;
    await app.redis.set('res', JSON.stringify(res));
    await (app.io.of('/') as any).emit('res', JSON.stringify(res));
    return res;
  }
}
