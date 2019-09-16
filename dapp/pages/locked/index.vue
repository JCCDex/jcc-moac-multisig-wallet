<template>
  <div class="mutisig-wallet-container">
    <div style="position: fixed; height: 100%; width: 100%; top: 0;">
      <div class="mutisig-wallet-tab-bar">
        <div class="mutisig-wallet-tabs mutisig-wallet-tabs-bottom">
          <div
            class="mutisig-wallet-tabs-content-wrap"
            style="touch-action: pan-x pan-y; position: relative; left: 0%;flex-direction: column"
          >
            <wallet-header :title="$t('lock_declare')" />
            <div
              ref="lockScroll"
              class="scroll-wrapper"
              style="height: calc(100% - 0.8rem);background-color: #fff;"
            >
              <div>
                <div class="multisig-wallet-lock-tip-container">
                  <p v-for="(tip, index) in $t('locked_tips')" :key="index">
                    {{ tip }}
                  </p>

                  <div flex="cross:center" style="margin-top: 2.35rem;">
                    <svg
                      class="mutisig-wallet-icon mutisig-wallet-icon-small"
                      aria-hidden="true"
                      style="margin-right: 0.1rem;"
                    >
                      <use xlink:href="#icon-unselected" />
                    </svg>
                    {{ $t("accept_agreement") }}
                  </div>
                </div>
                <div class="multisig-wallet-lock-bottom-container">
                  <p>{{ $t("locked_amount", { colon: "：" }) }}</p>
                  <wallet-input ref="input">
                    <span
                      style="position:absolute; top:0.2rem; right: 0.2rem;bottom:0.2rem;"
                    >
                      MOAC
                    </span>
                  </wallet-input>
                  <div
                    flex="main:justify cross:center"
                    style="margin-top: 0.24rem;"
                  >
                    <span>{{
                      $t("max_locked", { amount: amount, token: $t("moac") })
                    }}</span>
                    <span>{{ $t("locked_amount_tip") }}</span>
                  </div>

                  <button
                    class="multisig-wallet-button multisig-wallet-lock-button"
                    style="width: 100%;margin-top:1.24rem;"
                  >
                    {{ $t("lock") }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import BScroll from "@better-scroll/core";
import WalletHeader from "@/components/header";
import WalletInput from "@/components/input";
export default {
  name: "Withdraw",
  components: {
    WalletHeader,
    WalletInput
  },
  data() {
    return {
      amount: "1000"
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
      this.bs = new BScroll(this.$refs.lockScroll, {
        scrollY: true,
        click: true
      });
    }
  }
};
</script>
<style lang="scss">
.multisig-wallet-lock-tip-container {
  padding: 0.24rem 0.24rem 0.45rem 0.3rem;
  color: #4c4f54;
  background-color: #f2f4fb;

  > p {
    text-align: left;

    &:not(:first-child) {
      margin-top: 0.4rem;
    }
  }
}

.multisig-wallet-lock-bottom-container {
  padding: 0.3rem;

  > p {
    color: #0b1f5d;
    text-align: left;
    margin-bottom: 0.13rem;
  }
}
</style>
