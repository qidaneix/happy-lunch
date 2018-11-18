import { Service } from 'egg';
import * as fs from 'mz/fs';

/**
 * Test Service
 */
export default class extends Service {
  /**
   * 百度操作一波
   * @param filepath 
   */
  public async image(filepath: string) {
    const AIConfig = this.config.AIConfig;
    const { data: { access_token: accessToken } } = await this.ctx.curl(AIConfig.tokenUrl, {
      method: 'POST',
      contentType: 'application/x-www-form-urlencoded',
      dataType: 'json',
      data: {
        grant_type: AIConfig.grantType,
        client_id: AIConfig.clientId,
        client_secret: AIConfig.clientSecret,
      },
    });
    const imageBase64 = new Buffer(await fs.readFile(filepath)).toString('base64');
    const { data: { person_num: personNum } } = await this.ctx.curl(AIConfig.AIUrl, {
      method: 'POST',
      contentType: 'application/x-www-form-urlencoded',
      dataType: 'json',
      data: {
        access_token: accessToken,
        image: imageBase64,
      },
    });
    return personNum;
  }
}
