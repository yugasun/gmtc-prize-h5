<template>
  <div
    class="dialog"
    v-if="show"
  >
    <div class="weui-mask"></div>
    <div class="weui-dialog">
      <div class="weui-dialog__bd">{{ content }}</div>
      <div class="weui-dialog__ft">
        <a
          href="javascript:;"
          @click="hide"
          class="weui-dialog__btn weui-dialog__btn_primary"
        >确定</a>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Dialog",
  props: {
    show: {
      type: Boolean,
      default: false
    },
    content: {
      type: String,
      default: ""
    }
  },
  methods: {
    hide() {
      this.$emit("hide");
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
