<template>
  <div class="scroll-wrapper">
    <div class="mine-wrap">
      <div
        v-for="(cell, key) in cells"
        :key="key"
        flex="main:justify cross:center"
        class="mine-cell"
        @click="goto(cell)"
      >
        <div flex="main:justify cross:center">
          <svg class="icon" aria-hidden="true" style="margin-right: 15px;">
            <use :xlink:href="cell.icon" />
          </svg>
          {{ cell.name }}
        </div>
        <i class="arrow arrow-right" style="bottom: 6px;" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Mine",
  data() {
    return {};
  },
  computed: {
    cells() {
      return [
        {
          name: this.$t("locked_position_detail"),
          icon: "#icon-locked-detail",
          to: "/locked"
        },
        {
          name: this.$t("withdraw_detail"),
          icon: "#icon-withdraw-detail",
          to: "/withdraw"
        },
        {
          name: this.$t("help_center"),
          icon: "#icon-help",
          to: "/help"
        },
        {
          name: this.$t("copyright"),
          icon: "#icon-copyright",
          to: "/copyright"
        }
      ];
    }
  },
  methods: {
    goto(cell) {
      this.$router.push(cell.to);
    }
  }
};
</script>
<style lang="scss">
.mine-wrap {
  background-color: #fff;
  margin-top: 10px;
  padding: 0 15px;

  .mine-cell {
    height: 60px;

    &:not(:first-of-type) {
      border-top: 1px solid #e2e6f1;
    }
  }
}
</style>
