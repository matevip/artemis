import { defHttp } from '/@/utils/http/axios';

enum Api {
  Page = '/mate-code/table/table-page',
  Preview = '/mate-code/table/preview',
}

// 分页查询
export const tablePage = (params: any) => defHttp.get({ url: Api.Page, params });

// 预览
export const tablePreview = (params: string) =>
  defHttp.get({ url: `${Api.Preview}?tableName=${params}` });
