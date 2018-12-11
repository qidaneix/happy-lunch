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
    // 返回/发射/存储值
    const res: Res<Result> = {
      success: false,
      result: {
        personNum: 0,
        image: '',
      },
      msg: '',
    };
    // 百度AI
    const aiConfig = this.config.aiConfig;
    const { ctx, app } = this;
    // 尝试从redis获取asccessToken
    let accessToken: string|undefined = await app.redis.get('accessToken');
    if (!accessToken) {
      // 若获取失败，尝试直接请求asccessToken
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
    // 发起Ai请求
    const { data } = await ctx.curl<Response<ResponseDataSuccess|ResponseDataFail>>(aiConfig.AiUrl, {
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
   * @param res
   */
  private async handleResult(res: Res<Result>) {
    const { app } = this;
    await app.redis.set('res', JSON.stringify(res));
    await (app.io.of('/') as any).emit('res', JSON.stringify(res));
    return res;
  }
}
