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
