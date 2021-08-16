import { MenuVO, MenuDTO, Menu } from './model/menuModel';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  Page = '/mate-system/role/page',
  Set = '/mate-system/role/set',
  Del = '/mate-system/role/delete',
  SetStatus = '/mate-system/role/set-status',
}

// 菜单树
export const rolePage = (params?: MenuVO) => defHttp.get<MenuDTO>({ url: Api.Page, params });

// 保存
export const roleSet = (params: Menu) => defHttp.post<Menu>({ url: Api.Set, params });

// 删除
export const roleDel = (params: { ids: String }) =>
  defHttp.post<boolean>({ url: Api.Del + `?ids=${params.ids}` });

// 设置状态
export const roleSetStatus = (id: number, status: string) =>
  defHttp.post({ url: Api.SetStatus, params: { id, status } });
