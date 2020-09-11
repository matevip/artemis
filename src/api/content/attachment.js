import request from "@/utils/request";

export function getAttachmentList(search) {
  return request({
    url: '/mate-component/attachment/page',
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
    url: '/mate-component/attachment/del',
    method: 'post',
    params: {
      ids: ids
    }
  })
}