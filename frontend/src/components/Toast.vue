<template>
  <div
    class="toast"
    v-if="show"
  >
    <div class="weui-mask_transparent"></div>
    <div class="weui-toast">
      <i class="weui-loading weui-icon_toast"></i>
      <p class="weui-toast__content">加载中...</p>
    </div>
  </div>
</template>
<script>
export default {
  name: "Toast",
  props: {
    show: {
      type: Boolean,
      default: false
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
