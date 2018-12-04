// This file is created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportAccessToken from '../../../app/service/accessToken';
import ExportHome from '../../../app/service/home';

declare module 'egg' {
  interface IService {
    accessToken: ExportAccessToken;
    home: ExportHome;
  }
}
