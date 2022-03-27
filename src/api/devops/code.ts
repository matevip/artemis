import { defHttp } from '/@/utils/http/axios';

enum Api {
  Page = '/mate-code/table/table-page',
}

// 分页查询
export const tablePage = (params) => defHttp.get({ url: Api.Page, params });
