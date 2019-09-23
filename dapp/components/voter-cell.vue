<template>
  <div flex="main:justify cross:center" style="width: 100%;">
    <div flex="cross:center" style="width: calc(100% - 0.4rem)">
      <div style="width:100%">
        <div class="multisig-wallet-large-font-size" style="color: #0B1F5D;text-align:left;">
          {{ $t("recall_page.title", { index: index + 1 }) }}
        </div>
        <div class="van-ellipsis" style="color: #6B6E73;text-align:left;margin-top:0.1rem;">
          {{ voter }}
        </div>
      </div>
    </div>
    <i class="multisig-wallet-arrow multisig-wallet-arrow-right" style="bottom: 0.06rem;" />
  </div>
</template>
<script>
export default {
  props: {
    voter: {
      type: String,
      default() {
        return "";
      }
    },
    index: {
      type: Number,
      default() {
        return 0;
      }
    }
  },
  methods: {}
};
</script>
<style lang="scss"></style>
