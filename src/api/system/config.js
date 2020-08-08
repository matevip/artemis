import request from "@/utils/request";

export function getConfigByCode(code) {
    return request({
        url: '/mate-component/sys-config/getConfigByCode',
        method: 'get',
        params: {
            code,
        }
    })
}

export function saveConfigOss(data) {
    return request({
        url: '/mate-component/sys-config/saveConfigOss',
        method: 'post',
        data: data,
        params: {
            code: data.code
        }

    })
}