import { Service } from 'egg';

interface Response<T = any> {
  data: T;
}

interface ResponseDataSuccess {
  access_token: string;
  expires_in: number;
}

interface ResponseDataFail {
  error: string;
  error_description: string;
}

/**
 * accessToken Service
 */
export default class extends Service {
  /**
   * 获取百度accessToken
   * @param void
   */
  public async get() {
    const aiConfig = this.config.aiConfig;
    const { ctx, app } = this;
    const { data } = await ctx.curl<Response<ResponseDataSuccess|ResponseDataFail>>(aiConfig.tokenUrl, {
      method: 'POST',
      contentType: 'application/x-www-form-urlencoded',
      dataType: 'json',
      data: {
        grant_type: aiConfig.grantType,
        client_id: aiConfig.clientId,
        client_secret: aiConfig.clientSecret,
      },
    });

    const res: {
      success: boolean;
      accessToken: string|undefined;
    } = {
      success: false,
      accessToken: undefined,
    };
    if ((data as ResponseDataFail).error) {
      ctx.logger.error(new Error(JSON.stringify(data)));
      res.success = false;
      return res;
    } else {
      res.success = true;
      res.accessToken = (data as ResponseDataSuccess).access_token;
      await app.redis.set('accessToken', res.accessToken);
      return res;
    }
  }
}
