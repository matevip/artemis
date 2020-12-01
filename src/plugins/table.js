import Vue from 'vue'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'

import VXETablePluginElement from 'vxe-table-plugin-element'
import 'vxe-table-plugin-element/dist/style.css'
VXETable.use(VXETablePluginElement)

Vue.use(VXETable)
