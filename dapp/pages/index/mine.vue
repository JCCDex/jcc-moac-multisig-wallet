<template>
  <div class="scroll-wrapper">
    <div class="mutisig-wallet-mine-wrap">
      <div
        v-for="(cell, key) in cells"
        :key="key"
        flex="main:justify cross:center"
        class="mutisig-wallet-mine-cell"
        @click="goto(cell)"
      >
        <div flex="main:justify cross:center">
          <svg
            class="mutisig-wallet-icon mutisig-wallet-icon-large"
            aria-hidden="true"
            style="margin-right: 0.15rem;"
          >
            <use :xlink:href="cell.icon" />
          </svg>
          {{ cell.name }}
        </div>
        <i
          class="mutisig-wallet-arrow mutisig-wallet-arrow-right"
          style="bottom: 0.06rem;"
        />
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
          to: "/locked/list"
        },
        {
          name: this.$t("withdraw_detail"),
          icon: "#icon-withdraw-detail",
          to: "/withdraw/list"
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
.mutisig-wallet-mine-wrap {
  background-color: #fff;
  margin-top: 0.2rem;
  padding: 0 0.15rem;

  .mutisig-wallet-mine-cell {
    height: 1.2rem;

    &:not(:first-of-type) {
      border-top: 0.01rem solid #e2e6f1;
    }
  }
}
</style>
