<template>
  <div class="multisig-wallet-container">
    <div style="position: fixed; height: 100%; width: 100%; top: 0;">
      <div class="multisig-wallet-tab-bar">
        <div class="multisig-wallet-tabs multisig-wallet-tabs-bottom">
          <div class="multisig-wallet-tabs-content-wrap" style="touch-action: pan-x pan-y; position: relative; left: 0%;flex-direction: column">
            <wallet-header :title="$t('withdraw_declare')" />
            <div flex class="scroll-wrapper" style="height: calc(100% - 0.8rem);background-color: #fff;">
              <scroll ref="scroll" flex="dir:top cross: center">
                <div class="multisig-wallet-withdraw-tip-container">
                  <p v-for="(tip, index) in $t('withdraw_tips')" :key="index">
                    {{ tip }}
                  </p>

                  <div flex="cross:center" style="margin-top: 1.35rem;" @click="acceptAgreement">
                    <svg class="multisig-wallet-icon multisig-wallet-icon-small" aria-hidden="true" style="margin-right: 0.1rem;">
                      <use :xlink:href="icon" />
                    </svg>
                    {{ $t("accept_agreement") }}
                  </div>
                </div>
                <div class="multisig-wallet-withdraw-bottom-container" flex-box="1" flex="dir:top cross: center">
                  <p>{{ $t("withdraw_amount", { colon: "：" }) }}</p>

                  <van-field v-model="value" center type="number" :placeholder="$t('pls_input_amount')">
                    <span slot="button" size="small" type="primary">
                      {{ $t("moac") }}
                    </span>
                  </van-field>

                  <div flex="main: justify cross:center" style="margin-top: 0.24rem;">
                    <span>{{ $t("max_withdraw", { amount: amount, token: $t("moac") }) }}</span>
                  </div>

                  <div v-show="showElement" flex-box="1" flex="cross:bottom" style="margin-top:0.5rem;">
                    <button :disabled="!withdrawEnable" class="multisig-wallet-button multisig-wallet-withdraw-button" style="width: 100%;" @click="show = true">
                      {{ $t("withdraw") }}
                    </button>
                  </div>
                </div>
              </scroll>
            </div>
          </div>
        </div>
      </div>
    </div>
    <van-action-sheet v-model="show" :title="$t('withdraw_action.title')">
      <p style="text-align:left;margin-top:0.45rem;">
        {{
          $t("withdraw_action.amount", {
            amount: value,
            token: $t("moac")
          })
        }}
      </p>
      <p style="text-align:left;margin-top:0.45rem;margin-bottom:0.95rem">
        {{
          $t("withdraw_action.percent", {
            percent
          })
        }}
      </p>

      <button class="multisig-wallet-button multisig-wallet-confirm-button" style="width:100%;" @click="withdrawConfirm">
        {{ $t("withdraw_action.button") }}
      </button>
    </van-action-sheet>
  </div>
</template>
<script>
import BigNumber from "bignumber.js";
import WalletHeader from "@/components/header";
import { isValidNumber } from "@/js/util";
import tpInfo from "@/js/tp";
import multisigContractInstance from "@/js/contract";
import { Toast } from "vant";
import * as transaction from "@/js/transaction";
import accountInfo from "@/js/account";
import scrollIntoView from "@/mixins/scrollIntoView";
import keyEvent from "@/mixins/keyEvent";
import scrollMixin from "@/mixins/scroll";

export default {
  name: "Withdraw",
  components: {
    WalletHeader
  },
  mixins: [scrollIntoView, keyEvent, scrollMixin],
  data() {
    return {
      amount: "",
      value: "",
      agree: false,
      show: false
    };
  },
  computed: {
    withdrawEnable() {
      const value = parseFloat(this.value);
      return this.agree && isValidNumber(value) && value > 0 && new BigNumber(value).isLessThanOrEqualTo(this.amount);
    },
    icon() {
      return this.agree ? "#icon-selected" : "#icon-unselected";
    },
    percent() {
      const percent = (this.value / this.amount) * 100;
      return percent.toFixed(2) + "%";
    }
  },
  async asyncData() {
    try {
      const address = await tpInfo.getAddress();
      const node = await tpInfo.getNode();
      const amount = await multisigContractInstance.init(node).getBalance(address);
      return { amount };
    } catch (error) {
      console.log("init withdraw amount error: ", error);
      return { amount: "0" };
    }
  },
  deactivated() {
    this.$destroy();
  },
  methods: {
    acceptAgreement() {
      this.agree = !this.agree;
    },
    async withdrawConfirm() {
      this.show = false;
      try {
        const address = await tpInfo.getAddress();
        const hasVotingWithdrawState = await accountInfo.hasVotingWithdrawProposal(address);
        if (hasVotingWithdrawState === null) {
          return Toast.fail(this.$t("message.request_voting_withdraw_failed"));
        }
        if (hasVotingWithdrawState) {
          return Toast.fail(this.$t("message.has_voting_withdraw"));
        }
        const node = await tpInfo.getNode();
        const instance = multisigContractInstance.init(node);
        const state = await instance.getStopDeposit();
        if (!state) {
          return Toast.fail(this.$t("message.could_not_withdraw"));
        }
        const topicId = Date.now();
        console.log("topic id: ", topicId);
        const timestamp = topicId;
        const endtime = timestamp + 3 * 24 * 60 * 60 * 1000;
        const hash = await instance.createWithdrawProposal(topicId, timestamp, endtime, this.value);
        console.log("withdraw proposal hash: ", hash);

        Toast.loading({
          duration: 0,
          forbidClick: true,
          loadingType: "spinner",
          message: this.$t("message.loading")
        });
        // confirm status by hash
        setTimeout(async () => {
          let res = null;
          while (res === null) {
            try {
              res = await transaction.requestReceipt(hash);
              console.log("res: ", res);
            } catch (error) {
              console.log("request receipt error: ", error);
            }
          }
          if (transaction.isSuccessful(res)) {
            Toast.success(this.$t("message.submit_succeed"));
            // submit success, destroy state
            accountInfo.destroy("hasVotingWithdrawProposalState");
          } else {
            Toast.fail(this.$t("message.submit_failed"));
          }
        }, 30000);
      } catch (error) {
        console.log("deposit error: ", error);
        Toast.fail(this.$t("message.submit_failed"));
      }
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
