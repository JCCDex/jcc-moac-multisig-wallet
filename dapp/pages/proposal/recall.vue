<template>
  <div class="multisig-wallet-container">
    <div style="position: fixed; height: 100%; width: 100%; top: 0;">
      <div class="multisig-wallet-tab-bar">
        <div class="multisig-wallet-tabs multisig-wallet-tabs-bottom">
          <div class="multisig-wallet-tabs-content-wrap" style="touch-action: pan-x pan-y; position: relative; left: 0%;flex-direction: column">
            <wallet-header :title="$t('recall_voter')" />
            <div style="color: #181C24;height:0.86rem; line-height:0.86rem; text-align:left;padding-left:0.3rem;">
              {{ $t("click_to_recall") }}
            </div>
            <div ref="scroll" class="scroll-wrapper" style="background-color: #fff;height: calc(100% - 1.66rem);">
              <Scroll flex="dir:top cross: center" class="multisig-wallet-recall-container" style="min-height: calc(100% + 0.01rem)">
                <div v-for="(voter, key) of voters" :key="key" flex="main:justify cross:center" class="multisig-wallet-voter-cell-container" @click="showAction(voter)">
                  <voter-cell :voter="voter" :index="key" />
                </div>
              </Scroll>
            </div>
          </div>
        </div>
      </div>
    </div>
    <van-action-sheet v-model="show" :title="$t('recall_action.title')">
      <p style="text-align:left;margin-top:0.45rem;margin-bottom:0.95rem">
        {{ $t("recall_action.content", { voter: selectedVoter }) }}
      </p>

      <button class="multisig-wallet-button multisig-wallet-confirm-button" style="width:100%;" @click="recallConfirm">
        {{ $t("recall_action.button") }}
      </button>
    </van-action-sheet>
  </div>
</template>
<script>
import WalletHeader from "@/components/header";
import VoterCell from "@/components/voter-cell";
import multisigContractInstance from "@/js/contract";
import accountInfo from "@/js/account";
import * as transaction from "@/js/transaction";
import { Toast } from "vant";
import tpInfo from "@/js/tp";
import scrollMixin from "@/mixins/scroll";

export default {
  name: "Recall",
  components: {
    WalletHeader,
    VoterCell
  },
  mixins: [scrollMixin],
  data() {
    return {
      show: false,
      selectedVoter: "",
      voters: []
    };
  },
  async asyncData() {
    try {
      const node = await tpInfo.getNode();
      const voters = await multisigContractInstance.init(node).getVoters();
      return { voters };
    } catch (error) {
      console.log("request voters error: ", error);
    }
  },
  deactivated() {
    this.$destroy();
  },
  methods: {
    showAction(voter) {
      this.selectedVoter = voter;
      this.show = true;
    },
    async recallConfirm() {
      this.show = false;

      // clear cache to request latest state
      accountInfo.destroy("isVoter");

      try {
        const isVoter = await accountInfo.isVoter();
        if (isVoter) {
          const node = await tpInfo.getNode();
          const topicId = Date.now();
          console.log("topic id: ", topicId);
          const timestamp = topicId;
          const endtime = timestamp + 3 * 24 * 60 * 60 * 1000;
          const instance = multisigContractInstance.init(node);
          const hash = await instance.createRecallProposal(topicId, timestamp, endtime, this.selectedVoter);
          console.log("create recall proposal hash: ", hash);

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
              } else {
                Toast.fail(this.$t("message.submit_failed"));
              }
            } else {
              Toast.fail(this.$t("message.request_receipt_failed"));
            }
          }, 20000);
        } else {
          Toast.fail(this.$t("message.is_not_voter"));
        }
      } catch (error) {
        console.log("create recall proposal error: ", error);
        Toast.fail(error.message);
      }
    }
  }
};
</script>
<style lang="scss">
.multisig-wallet-recall-container {
  padding: 0 0.3rem;
  background-color: #fff;

  p {
    text-align: left;
    margin-bottom: 0.16rem;
  }

  .multisig-wallet-voter-cell-container {
    height: 1.26rem;

    &:not(:last-child) {
      border-bottom: 0.01rem solid #e2e6f1;
    }
  }
}
</style>
