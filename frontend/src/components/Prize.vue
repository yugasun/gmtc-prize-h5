<template>
  <section class="prize-section">
    <img
      :src="item.src"
      alt
      class="prize-img left"
    />
    <div class="right section-right">
      <h5 class="title">{{ item.title }}</h5>
      <p class="subtitle">{{ item.subtitle }}</p>
      <div class="button-wrapper">
        <img
          src="../assets/tag.png"
          alt="Star"
          class="star"
          v-if="!item.empty"
        />
        <div class="left prize-value">
          <span>价值</span>
          <strong class="value-text">￥{{ item.value }}</strong>
        </div>
        <div
          class="left prize-start prize-get-btn"
          v-if="item.started && !item.empty"
          @click="getPrize(item.prizeId)"
          :style="{justifyContent: 'center', fontSize: '20px'}"
        >
          <span>立即抢</span>
        </div>
        <div
          class="left prize-start disable"
          v-else-if="item.empty"
          :class="'empty'"
        >
          <span>抢光了</span>
        </div>
        <div
          class="left prize-start disable"
          v-else
        >
          <span>开抢时间</span>
          <strong class="start-text">{{ item.start }}</strong>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  name: "Prize",
  props: {
    item: {}
  },
  methods: {
    getPrize(prizeId) {
      this.$emit("get-prize", prizeId);
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
