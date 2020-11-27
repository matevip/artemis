import request from '@/utils/request'

export function getTableList(dataSourceId) {
  return request({
    url: '/mate-code/code/table-list',
    method: 'post',
    params: {
      dataSourceId,
    },
  })
}

export function genCode(data) {
  return request({
    url: '/mate-code/code/generator-code',
    method: 'post',
    responseType: 'blob',
    params: {
      packageName: data.packageName,
      prefix: data.prefix,
      modelName: data.modelName,
      datasourceId: data.datasourceId,
      tableName: data.tableName,
    },
  })
}
