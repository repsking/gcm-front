<template>
  <div
    v-if="inFuture"
    class="navbar-container main-menu-content"
  >
    <horizontal-nav-menu-items :items="navMenuItems" />
    <horizontal-nav-menu-items
      v-if="isDev"
      :items="menu"
    />
  </div>
</template>

<script>
import navMenuItems from '@/navigation/horizontal'
import menu from '@/navigation/horizontal/menu'
import HorizontalNavMenuItems from './components/horizontal-nav-menu-items/HorizontalNavMenuItems.vue'

export default {
  components: {
    HorizontalNavMenuItems,
  },
  data: () => ({
    menu
  }),
  setup() {
    return {
      navMenuItems,
    }
  },
}
</script>

<style lang="scss">
@import "~@core/scss/base/core/menu/menu-types/horizontal-menu.scss";
</style>
