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
          <i :class="cell.icon" style="margin-right: 14px;" /> {{ cell.name }}
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
          route: "/locked",
          icon: "locked-icon",
          to: "/locked"
        },
        {
          name: this.$t("withdraw_detail"),
          route: "/withdraw",
          icon: "withdraw-icon",
          to: "/withdraw"
        },
        {
          name: this.$t("help_center"),
          route: "/help",
          icon: "help-icon",
          to: "/help"
        },
        {
          name: this.$t("copyright"),
          route: "/copyright",
          icon: "copyright-icon",
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
