import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { Tag } from 'ant-design-vue';

export const columns: BasicColumn[] = [
  {
    title: '表名',
    dataIndex: 'tableName',
    width: 100,
  },
  {
    title: 'Engine',
    dataIndex: 'engine',
    width: 100,
  },
  {
    title: '备注',
    dataIndex: 'tableComment',
    width: 100,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 100,
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'tableName',
    label: '表名',
    component: 'Input',
    componentProps: {
      placeholder: '请输入表名',
    },
    colProps: { span: 8 },
  },
];

export const formSchema: FormSchema[] = [
  {
    field: 'id',
    label: 'ID',
    component: 'Input',
    show: false,
  },
  {
    field: 'code',
    label: '编码',
    component: 'Input',
  },
  {
    field: 'serviceId',
    label: '服务ID',
    component: 'Input',
  },
  {
    field: 'name',
    label: '名称',
    component: 'Input',
  },
  {
    field: 'method',
    label: '请求方法',
    component: 'Input',
  },
  {
    field: 'className',
    label: '类名',
    component: 'Input',
  },
  {
    field: 'methodName',
    label: '方法名',
    component: 'Input',
  },
  {
    field: 'status',
    label: '状态',
    component: 'RadioButtonGroup',
    defaultValue: '0',
    componentProps: {
      options: [
        { label: '启用', value: '0' },
        { label: '禁用', value: '1' },
      ],
    },
  },
];
