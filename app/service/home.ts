import { Service } from 'egg';
import * as fs from 'mz/fs';

/**
 * Home Service
 */
export default class extends Service {
  /**
   * 百度操作一波
   * @param filepath
   */
  public async image(filepath: string) {
    const AIConfig = this.config.AIConfig;
    const { ctx, app } = this;
    const { data: { access_token: accessToken } } = await ctx.curl(AIConfig.tokenUrl, {
      method: 'POST',
      contentType: 'application/x-www-form-urlencoded',
      dataType: 'json',
      data: {
        grant_type: AIConfig.grantType,
        client_id: AIConfig.clientId,
        client_secret: AIConfig.clientSecret,
      },
    });
    const imageBase64 = (await fs.readFile(filepath)).toString('base64');
    const { data: { person_num: personNum } } = await ctx.curl(AIConfig.AIUrl, {
      method: 'POST',
      contentType: 'application/x-www-form-urlencoded',
      dataType: 'json',
      data: {
        access_token: accessToken,
        image: imageBase64,
      },
    });
    await (app as any).redis.set('personNum', personNum);
    await (app as any).io.of('/').emit('personNum', personNum);
    return personNum;
  }
}
