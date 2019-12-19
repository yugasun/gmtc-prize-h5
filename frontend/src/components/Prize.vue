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
      <p class="start-time">{{ item.start }} 开抢</p>
      <div class="button-wrapper">
        <img
          src="../assets/tag.png"
          alt="Star"
          class="star"
          v-if="!item.empty"
        />
        <div class="left prize-value" :class="item.empty ? 'empty' : ''">
          <span>价值</span>
          <strong class="value-text">￥{{ item.value }}</strong>
        </div>
        <div
          class="left prize-start prize-get-btn"
          v-if="item.started && !item.empty"
          @click="debounce(getPrize(item.prizeId), 500)"
        >
          <span>立即抢</span>
        </div>
        <div
          class="left prize-start disable empty"
          v-else-if="item.empty"
        >
          <span>抢光了</span>
        </div>
        <div
          class="left prize-start disable"
          v-else
        >
          <span>还未开始</span>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import { debounce } from '../utils/index';

export default {
  name: "Prize",
  props: {
    item: {}
  },
  methods: {
    debounce,
    getPrize(prizeId) {
      this.$emit("get-prize", prizeId);
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
