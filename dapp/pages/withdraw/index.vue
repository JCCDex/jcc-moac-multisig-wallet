<template>
  <div class="multisig-wallet-container">
    <div style="position: fixed; height: 100%; width: 100%; top: 0;">
      <div class="multisig-wallet-tab-bar">
        <div class="multisig-wallet-tabs multisig-wallet-tabs-bottom">
          <div
            class="multisig-wallet-tabs-content-wrap"
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
                <div class="multisig-wallet-withdraw-tip-container">
                  <p v-for="(tip, index) in $t('withdraw_tips')" :key="index">
                    {{ tip }}
                  </p>

                  <div
                    flex="cross:center"
                    style="margin-top: 1.35rem;"
                    @click="acceptAgreement"
                  >
                    <svg
                      class="multisig-wallet-icon multisig-wallet-icon-small"
                      aria-hidden="true"
                      style="margin-right: 0.1rem;"
                    >
                      <use :xlink:href="icon" />
                    </svg>
                    {{ $t("accept_agreement") }}
                  </div>
                </div>
                <div
                  class="multisig-wallet-withdraw-bottom-container"
                  flex-box="1"
                  flex="dir:top cross: center"
                >
                  <p>{{ $t("withdraw_amount", { colon: "：" }) }}</p>

                  <van-field
                    v-model="value"
                    center
                    type="number"
                    :placeholder="$t('pls_input_amount')"
                  >
                    <span slot="button" size="small" type="primary">
                      {{ $t("moac") }}
                    </span>
                  </van-field>

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
                      :disabled="!withdrawEnable"
                      class="multisig-wallet-button multisig-wallet-withdraw-button"
                      style="width: 100%;"
                      @click="show = true"
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
    <van-action-sheet v-model="show" :title="$t('withdraw_action_sheet_title')">
      <p style="text-align:left;margin-top:0.45rem;">
        {{
          $t("withdraw_action_sheet_amount", {
            amount: value,
            token: $t("moac")
          })
        }}
      </p>
      <p style="text-align:left;margin-top:0.45rem;margin-bottom:0.95rem">
        {{
          $t("withdraw_action_sheet_percent", {
            percent
          })
        }}
      </p>

      <button
        class="multisig-wallet-button multisig-wallet-confirm-button"
        style="width:100%;"
      >
        {{ $t("withdraw_confirm") }}
      </button>
    </van-action-sheet>
  </div>
</template>
<script>
import BigNumber from "bignumber.js";
import BScroll from "@better-scroll/core";
import WalletHeader from "@/components/header";
import { isValidAmount } from "@/js/util";

export default {
  name: "Withdraw",
  components: {
    WalletHeader
  },
  data() {
    return {
      amount: "1000",
      value: "",
      agree: false,
      show: false
    };
  },
  computed: {
    withdrawEnable() {
      const value = parseFloat(this.value);
      return (
        this.agree &&
        isValidAmount(value) &&
        value > 0 &&
        new BigNumber(value).isLessThanOrEqualTo(this.amount)
      );
    },
    icon() {
      return this.agree ? "#icon-selected" : "#icon-unselected";
    },
    percent() {
      const percent = (this.value / this.amount) * 100;
      return percent.toFixed(2) + "%";
    }
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
    },
    acceptAgreement() {
      this.agree = !this.agree;
    }
  }
};
</script>
<style lang="scss">
.multisig-wallet-withdraw-tip-container {
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

.multisig-wallet-withdraw-bottom-container {
  padding: 0.3rem;

  > p {
    color: #0b1f5d;
    text-align: left;
    margin-bottom: 0.13rem;
  }
}
</style>
