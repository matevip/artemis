import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';

export const columns: BasicColumn[] = [
  {
    title: '客户端Id',
    dataIndex: 'clientId',
    width: 100,
  },
  {
    title: '客户端密钥',
    dataIndex: 'clientSecret',
    width: 100,
  },
  {
    title: '授权类型',
    dataIndex: 'authorizedGrantTypes',
    width: 130,
  },
  {
    title: '授权范围',
    dataIndex: 'scope',
    width: 90,
  },
  {
    title: '令牌过期秒数',
    dataIndex: 'accessTokenValidity',
    width: 130,
  },
  {
    title: '令牌过期秒数',
    dataIndex: 'refreshTokenValidity',
    width: 130,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 100,
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'title',
    label: '操作',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'traceId',
    label: 'traceId',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'type',
    label: '日志类型',
    component: 'Select',
    componentProps: {
      options: [
        { label: '日志', value: '1' },
        { label: '异常', value: '2' },
      ],
    },
    colProps: { span: 8 },
  },
];

export const formSchema: FormSchema[] = [
  {
    field: 'type',
    label: '日志类型',
    required: true,
    component: 'Select',
    componentProps: {
      options: [
        { label: '日志', value: '1' },
        { label: '异常', value: '2' },
      ],
    },
    dynamicDisabled: true,
  },
  {
    field: 'title',
    label: '日志标题',
    component: 'Input',
  },
  {
    field: 'method',
    label: '执行方法',
    component: 'Input',
  },
  {
    field: 'url',
    label: '请求路径',
    component: 'Input',
  },
  {
    field: 'params',
    label: '请求参数',
    component: 'InputTextArea',
  },
  {
    label: '操作内容',
    field: 'operation',
    component: 'InputTextArea',
  },
  {
    field: 'exception',
    label: '异常信息',
    component: 'InputTextArea',
  }
];
