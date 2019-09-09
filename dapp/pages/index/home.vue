<template>
  <div ref="scroll" class="scroll-wrapper">
    <div class="scroll-content">
      <div v-for="(item, index) in 100" :key="index" class="scroll-item">
        {{ item }}
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from "@better-scroll/core";

export default {
  name: "Home",
  data() {
    return {
      bs: null
    };
  },
  mounted() {
    this.init();
  },
  updated() {
    this.bs.refresh();
  },
  beforeDestroy() {
    this.bs.destroy();
  },
  methods: {
    init() {
      this.bs = new BScroll(this.$refs.scroll, {
        scrollY: true,
        click: true
      });
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/stylus" scoped>
.scroll-wrapper {
  height: auto;
  overflow: hidden;
  width: 100%;
  flex-shrink: 0;

  .scroll-item {
    height: 50px;
    line-height: 50px;
    font-size: 24px;
    font-weight: bold;
    border-bottom: 1px solid #eee;
    text-align: center;

    &:nth-child(2n) {
      background-color: #f3f5f7;
    }

    &:nth-child(2n + 1) {
      background-color: #42b983;
    }
  }
}
</style>
