<template>
  <div class="mutisig-wallet-container">
    <div style="position: fixed; height: 100%; width: 100%; top: 0;">
      <div class="mutisig-wallet-tab-bar">
        <div class="mutisig-wallet-tabs mutisig-wallet-tabs-bottom">
          <div
            class="mutisig-wallet-tabs-content-wrap"
            style="touch-action: pan-x pan-y; position: relative; left: 0%;flex-direction: column"
          >
            <wallet-header :title="$t('withdraw_declare')" />
            <div
              ref="scroll"
              flex
              class="scroll-wrapper"
              style="height: calc(100% - 0.8rem);  background-color: #fff;"
            >
              <div flex="dir:top cross: center">
                <div class="mutisig-wallet-withdraw-tip-container">
                  <p v-for="(tip, index) in $t('withdraw_tips')" :key="index">
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
                <div
                  class="mutisig-wallet-withdraw-bottom-container"
                  flex-box="1"
                  flex="dir:top cross: center"
                >
                  <p>{{ $t("withdraw_amount", { colon: "：" }) }}</p>

                  <van-cell-group>
                    <van-field center type="number">
                      <span slot="button" size="small" type="primary">
                        MOAC
                      </span>
                    </van-field>
                  </van-cell-group>

                  <div
                    flex="main: justify cross:center"
                    style="margin-top: 0.24rem;"
                  >
                    <span>{{
                      $t("max_withdraw", { amount: amount, token: $t("moac") })
                    }}</span>
                  </div>

                  <div flex-box="1" flex="cross:bottom">
                    <button
                      class="mutisig-wallet-button mutisig-wallet-withdraw-button"
                      style="width: 100%;margin-top:1.24rem;"
                    >
                      {{ $t("withdraw") }}
                    </button>
                  </div>
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
export default {
  name: "Withdraw",
  components: {
    WalletHeader
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
      this.bs = new BScroll(this.$refs.scroll, {
        scrollY: true,
        click: true
      });
    }
  }
};
</script>
<style lang="scss">
.mutisig-wallet-withdraw-tip-container {
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

.mutisig-wallet-withdraw-bottom-container {
  padding: 0.3rem;

  > p {
    color: #0b1f5d;
    text-align: left;
    margin-bottom: 0.13rem;
  }
}
</style>
