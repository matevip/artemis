import { LogParams, LogListGetResultModel } from './model/logModel';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  LogList = '/mate-system/log/page',
}

export const getLogListByPage = (params: LogParams) =>
  defHttp.get<LogListGetResultModel>({ url: Api.LogList, params });
