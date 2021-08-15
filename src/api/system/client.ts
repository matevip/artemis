import { ClientParams, ClientListGetResultModel } from './model/clientModel';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  CilentList = '/mate-system/client/page',
}

export const getClientListByPage = (params: ClientParams) =>
  defHttp.get<ClientListGetResultModel>({ url: Api.CilentList, params });
