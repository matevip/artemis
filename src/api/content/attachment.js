import request from "@/utils/request";

export function getAttachmentList(search) {
  return request({
    url: '/mate-component/sys-attachment/list',
    method: 'get',
    params: {
      current: search.current,
      size: search.size,
      keyword: search.keyword,
      startDate: search.startDate,
      endDate: search.endDate
    }
  })
}

export function deleteAttachment(ids) {
  return request({
    url: '/mate-component/sys-attachment/delete',
    method: 'post',
    params: {
      ids: ids
    }
  })
}