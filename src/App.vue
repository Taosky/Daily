<template>
<div id="app">
  <transition name="fade">
    <router-view></router-view>
  </transition>
</div>
</template>
<script>
export default {
  name: 'App'
}
</script>
<style>
  .fade-enter-active {
    transition: opacity .5s
  }

  .fade-enter, .fade-leave-to /* .fade-leave-active in below version 2.1.8 */
  {
    opacity: 0
  }
</style>
