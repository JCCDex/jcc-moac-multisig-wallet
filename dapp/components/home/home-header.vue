<template>
  <div class="multisig-wallet-home-header-container">
    <div flex="main:center cross:center" class="multisig-wallet-home-header-wallet-container multisig-wallet-small-font-size">
      <svg class="multisig-wallet-icon multisig-wallet-icon-small" style="margin-right:0.08rem" aria-hidden="true">
        <use xlink:href="#icon-wallet" />
      </svg>
      {{ $t("moac_wallet") }}
    </div>
    <div id="multisig-wallet-address" class="multisig-wallet-larger-font-size" style="color: #DDE9FF;word-break:break-all;text-align:left;margin-top: 0.14rem;">
      {{ address }}
    </div>

    <div flex="main:justify cross:center" class="multisig-wallet-normal-font-size" style="margin-top:0.23rem;color: #9FB6FD;">
      <div>
        {{ $t("lock_amount", { amount: lockAmount }) }}
      </div>
      <div>
        {{ $t("vote_amount", { amount: voteAmount }) }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomeHeader",
  props: {
    lockAmount: {
      require: true,
      type: String,
      default: "0"
    },
    voteAmount: {
      require: true,
      type: Number,
      default: 0
    },
    address: {
      require: true,
      type: String,
      default: ""
    }
  }
};
</script>
<style lang="scss">
.multisig-wallet-home-header-container {
  height: 2.32rem;
  background-color: #0b1f5d;
  border-radius: 0 0 0.12rem 0.12rem;
  padding: 0.2rem 0.27rem;

  .multisig-wallet-home-header-wallet-container {
    height: 0.38rem;
    background-color: #5777da;
    border-radius: 0.06rem;
    min-width: 170px;
    width: 1.7rem;
    color: #edf2ff;
  }
}
</style>
