<template>
  <div class="multisig-wallet-container">
    <div style="position: fixed; height: 100%; width: 100%; top: 0;">
      <div class="multisig-wallet-tab-bar">
        <div class="multisig-wallet-tabs multisig-wallet-tabs-bottom">
          <div class="multisig-wallet-tabs-content-wrap" style="touch-action: pan-x pan-y; position: relative; left: 0%;flex-direction: column">
            <wallet-header :title="$t('lock_declare')" />
            <div flex class="scroll-wrapper" style="height: calc(100% - 0.8rem);background-color: #fff;">
              <scroll ref="scroll" flex="dir:top cross: center">
                <div class="multisig-wallet-lock-tip-container">
                  <p v-for="(tip, index) in $t('locked_tips')" :key="index">
                    {{ tip }}
                  </p>

                  <div flex="cross:center" style="margin-top: 1.35rem;" @click="acceptAgreement">
                    <svg class="multisig-wallet-icon multisig-wallet-icon-small" aria-hidden="true" style="margin-right: 0.1rem;">
                      <use :xlink:href="icon" />
                    </svg>
                    {{ $t("accept_agreement") }}
                  </div>
                </div>
                <div class="multisig-wallet-lock-bottom-container" flex-box="1" flex="dir:top cross: center">
                  <p>{{ $t("locked_amount", { colon: "：" }) }}</p>
                  <van-field v-model="amount" center type="number" :placeholder="$t('pls_input_amount')">
                    <span slot="button" size="small" type="primary">
                      {{ $t("moac") }}
                    </span>
                  </van-field>
                  <div flex="main:justify cross:center" style="margin-top: 0.24rem;">
                    <span>{{ $t("max_locked", { amount: parseFloat(balance).toFixed(6), token: $t("moac") }) }}</span>
                    <span>{{ $t("locked_amount_tip") }}</span>
                  </div>

                  <div v-show="showElement" flex-box="1" flex="cross:bottom" style="margin-top: 0.5rem;">
                    <button :disabled="!lockEnable" class="multisig-wallet-button multisig-wallet-lock-button" style="width: 100%;" @click="show = true">
                      {{ $t("lock") }}
                    </button>
                  </div>
                </div>
              </scroll>
            </div>
          </div>
        </div>
      </div>
    </div>

    <van-action-sheet v-model="show" :title="$t('lock_action.title')">
      <p style="text-align:left;margin-top:0.45rem;margin-bottom:0.95rem">
        {{
          $t("lock_action.content", {
            amount,
            token: $t("moac")
          })
        }}
      </p>

      <button class="multisig-wallet-button multisig-wallet-confirm-button" style="width:100%;" @click="depositConfirm">
        {{ $t("lock_action.button") }}
      </button>
    </van-action-sheet>
  </div>
</template>
<script>
import BigNumber from "bignumber.js";
import WalletHeader from "@/components/header";
import tpInfo from "@/js/tp";
import multisigContractInstance from "@/js/contract";
import { Toast } from "vant";
import * as transaction from "@/js/transaction";
import scrollIntoView from "@/mixins/scrollIntoView";
import keyEvent from "@/mixins/keyEvent";
import scrollMixin from "@/mixins/scroll";

export default {
  name: "Lock",
  components: {
    WalletHeader
  },
  mixins: [scrollIntoView, keyEvent, scrollMixin],
  data() {
    return {
      balance: "",
      amount: "",
      agree: false,
      show: false
    };
  },
  computed: {
    lockEnable() {
      const minGas = 0.01;
      const bn = new BigNumber(this.amount);
      return this.agree && BigNumber.isBigNumber(bn) && bn.modulo(1000).toNumber() === 0 && bn.isGreaterThanOrEqualTo(1000) && bn.plus(minGas).isLessThan(this.balance);
    },
    icon() {
      return this.agree ? "#icon-selected" : "#icon-unselected";
    }
  },
  async asyncData() {
    try {
      const address = await tpInfo.getAddress();
      const node = await tpInfo.getNode();
      const balance = await multisigContractInstance.init(node).moac.getBalance(address);
      return { balance };
    } catch (error) {
      console.log("reqeust moac balance error: ", error);
      return { balance: "0" };
    }
  },
  deactivated() {
    this.$destroy();
  },
  methods: {
    acceptAgreement() {
      this.agree = !this.agree;
    },
    async depositConfirm() {
      this.show = false;
      try {
        const node = await tpInfo.getNode();
        const instance = multisigContractInstance.init(node);
        const state = await instance.getStopDeposit();
        if (state) {
          return Toast.fail(this.$t("message.could_not_deposit"));
        }
        const hash = await instance.deposit(this.amount);
        console.log("deposit hash: ", hash);

        Toast.loading({
          duration: 0,
          forbidClick: true,
          loadingType: "spinner",
          message: this.$t("message.loading")
        });
        // confirm status by hash
        setTimeout(async () => {
          const res = await transaction.requestReceipt(hash);

          if (res) {
            if (transaction.isSuccessful(res)) {
              Toast.success(this.$t("message.submit_succeed"));
              this.$router.push("/home");
            } else {
              Toast.fail(this.$t("message.submit_failed"));
            }
          } else {
            Toast.fail(this.$t("message.request_receipt_failed"));
          }
        }, 20000);
      } catch (error) {
        console.log("deposit error: ", error);
        Toast.fail(error.message);
      }
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
