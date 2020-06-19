<template>
  <component v-bind="linkProps(to)">
    <slot />
  </component>
</template>

<script>
  import { isExternal } from '@/utils/validate'

  export default {
    props: {
      to: {
        type: String,
        required: true
      }
    },
    // computed: {
    //   isExternal() {
    //     return isExternal(this.to)
    //   },
    //   type() {
    //     if (this.isExternal) {
    //       return 'a'
    //     }
    //     return 'router-link'
    //   }
    // },
    methods: {
      linkProps(url) {
        if (this.isExternal) {
          return {
            is: 'a',
            href: url,
            target: '_blank',
            rel: 'noopener'
          }
        }
        return {
          is: 'router-link',
          to: url
        }
      }
    }
  }
</script>
