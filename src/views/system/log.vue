<template>
  <div class="app-container">
    <vxe-grid ref="xGrid" v-bind="gridOptions"></vxe-grid>
  </div>
</template>

<script>
  import flex from '@/styles/flex.css'
  import { getLogList, deleteLog } from '@/api/system/log'
  import { downloadFile } from '@/utils'
  // 权限判断指令
  import permission from '@/directive/permission/index'

  export default {
    directives: { permission },
    data() {
      return {
        gridOptions: {
          border: true,
          resizable: true,
          showHeaderOverflow: true,
          showOverflow: true,
          highlightHoverRow: true,
          keepSource: true,
          id: 'full_edit_1',
          height: 666,
          rowId: 'id',
          customConfig: {
            storage: true,
            checkMethod: this.checkColumnMethod,
          },
          printConfig: {
            columns: [
              { field: 'traceId' },
              { field: 'createBy' },
              { field: 'title' },
              { field: 'method' },
              { field: 'url' },
              { field: 'ip' },
              { field: 'location' },
              { field: 'executeTime' },
              { field: 'createTime' },
            ],
          },
          sortConfig: {
            trigger: 'cell',
          },
          filterConfig: {
            remote: true,
          },
          pagerConfig: {
            pageSize: 10,
            pageSizes: [5, 10, 15, 20, 50, 100, 200, 500, 1000],
          },
          toolbarConfig: {
            buttons: [
              {
                code: 'delete',
                name: '批量删除',
                icon: 'el-icon-delete',
                status: 'danger',
                //控制按钮的显示和隐藏
                visible: true,
              },
            ],
            refresh: true,
            import: true,
            export: true,
            print: true,
            custom: true,
          },
          proxyConfig: {
            seq: true, // 启用动态序号代理
            sort: true, // 启用排序代理
            filter: true, // 启用筛选代理
            form: true, // 启用表单代理
            props: {
              result: 'data.records',
              total: 'data.total',
            },
            ajax: {
              // 接收 Promise 对象
              query: ({ page, sort, filters, form }) => {
                // 处理排序条件
                const queryParams = Object.assign(
                  {
                    sort: sort.property,
                    order: sort.order,
                  },
                  form
                )
                // 处理筛选条件
                filters.forEach(({ property, values }) => {
                  queryParams[property] = values.join(',')
                })
                return getLogList(page)
                // return XEAjax.get(
                //   `https://api.xuliangzhan.com:10443/api/pub/page/list/${page.pageSize}/${page.currentPage}`,
                //   queryParams
                // )
              },
              delete: ({ body }) => {
                // XEAjax.post(
                //   'https://api.xuliangzhan.com:10443/api/pub/save',
                //   body
                // ),
                const ids = []
                body.removeRecords.forEach((row) => {
                  ids.push(row.id)
                })
                deleteLog(ids.join(','))
              },
            },
          },
          columns: [
            { type: 'checkbox', title: 'ID', width: 120, fixed: 'left' },
            { type: 'seq', type: 'seq', title: '序号', width: '60' },
            {
              field: 'traceId',
              title: 'TRACEID',
              sortable: true,
              width: 160,
            },
            {
              field: 'createBy',
              title: '操作人',
              width: 160,
            },
            {
              field: 'title',
              title: '操作',
              width: 160,
            },
            {
              field: 'method',
              title: '执行方法',
              editRender: { name: 'input' },
              width: 160,
            },
            {
              field: 'url',
              title: '请求路径',
              visible: false,
              sortable: true,
              editRender: {
                name: '$input',
                props: { type: 'number', min: 1, max: 120 },
              },
              width: 160,
            },
            {
              field: 'ip',
              title: 'IP地址',
              editRender: {
                name: '$input',
              },
              width: 160,
            },
            {
              field: 'location',
              title: '地区',
              sortable: true,
              width: 160,
            },
            {
              field: 'executeTime',
              title: '耗时',
              sortable: true,

              width: 100,
            },
            {
              field: 'createTime',
              title: '创建时间',
              fixed: 'right',
              width: 160,
              sortable: true,
              formatter: this.formatDate,
            },
          ],
          checkboxConfig: {
            labelField: 'id',
            reserve: true,
            highlight: true,
            range: true,
          },
          editConfig: {
            trigger: 'click',
            mode: 'row',
            showStatus: true,
          },
        },
      }
    },

    computed: {
      ids() {
        let ids = []
        this.selectionList.forEach((ele) => {
          ids.push(ele.id)
        })
        return ids.join(',')
      },
    },
    created() {},
    methods: {
      // formatDate({ cellValue }) {
      //   return XEUtils.toDateString(cellValue, 'yyyy-MM-dd HH:ss:mm')
      // },
    },
  }
</script>

<style lang="scss" scoped>
  @import '@/styles/mate.scss';
</style>
