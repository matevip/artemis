// 引入基础包
import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel';

// 定义查询参数
export type DictVO = BasicPageParams & {
  code?: string;
  dictValue?: string;
};

// 定义日志对象
export interface Dict {
  id: string;
  parentId: string;
  code: string;
  dictKey: string;
  dictValue: string;
  sort: string;
  remark: string;
  createTime: string;
}

// 根据日志对象生成响应模型
export type DictDTO = BasicFetchResult<DictVO>;
