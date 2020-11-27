import { title } from '@/config'

/**
 * @author pangu 7333791@qq.com
 * @description 设置标题
 * @param pageTitle
 * @returns {string}
 */
export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle}-${title}`
  }
  return `${title}`
}
