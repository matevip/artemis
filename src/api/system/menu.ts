import { MenuVO, MenuDTO, Menu } from './model/menuModel';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  List = '/mate-system/menu/list',
  Set = '/mate-system/menu/set',
  Del = '/mate-system/menu/del',
}

// 菜单树
export const list = (params?: MenuVO) => defHttp.get<MenuDTO>({ url: Api.List, params });

// 保存
export const set = (params: Menu) => defHttp.post<Menu>({ url: Api.Set, params });

// 删除
export const del = (params: { ids: String }) =>
  defHttp.post<boolean>({ url: Api.Del + `?ids=${params.ids}` });
