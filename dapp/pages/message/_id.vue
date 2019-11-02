<template>
  <div class="multisig-wallet-container">
    <div style="position: fixed; height: 100%; width: 100%; top: 0;">
      <div class="multisig-wallet-tab-bar">
        <div class="multisig-wallet-tabs multisig-wallet-tabs-bottom">
          <div class="multisig-wallet-tabs-content-wrap" style="touch-action: pan-x pan-y; position: relative; left: 0%;flex-direction: column">
            <div ref="scroll" class="scroll-wrapper" style="margin-top:0.1rem; height: calc(100% - 0.1rem);">
              <div class="multisig-wallet-message-detail-container">
                <Scroll>
                  <p class="multisig-wallet-large-font-size" style="color: #0B1F5D">
                    {{ proposalType }}
                  </p>
                  <p class="multisig-wallet-small-font-size" style="color: #9EA4C4">
                    {{ submitTime }}
                  </p>
                  <p>
                    {{ this.$t("message_detail.apply_wallet", { address: proposal.sponsor }) }}
                  </p>
                  <p>{{ messageContent }}</p>
                </Scroll>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import proposalMixin from "@/mixins/proposal";
import multisigContractInstance from "@/js/contract";
import tpInfo from "@/js/tp";
import { TYPE_CONFIG_COUNT, TYPE_CONFIG_PERCENT, TYPE_WITHDRAW, TYPE_VOTE, TYPE_RECALL } from "@/js/constant";
import BigNumber from "bignumber.js";
import tinydate from "tinydate";
import scrollMixin from "@/mixins/scroll";

export default {
  name: "MessageDetail",
  mixins: [proposalMixin, scrollMixin],
  data() {
    return {
      proposal: {}
    };
  },
  computed: {
    messageContent() {
      let { voteType, target, value } = this.proposal;
      if (voteType === TYPE_CONFIG_COUNT) {
        return "";
      }
      if (voteType === TYPE_CONFIG_PERCENT) {
        return this.$t("message_detail.modify_percent", {
          percent: value + "%"
        });
      }
      if (voteType === TYPE_WITHDRAW) {
        return this.$t("message_detail.withdraw_amount", {
          amount: new BigNumber(value).dividedBy(10 ** 18).toString(10),
          token: this.$t("moac")
        });
      }
      if (voteType === TYPE_VOTE) {
        return this.$t("message_detail.apply_address", {
          address: target
        });
      }
      if (voteType === TYPE_RECALL) {
        return this.$t("message_detail.recall_address", {
          address: target
        });
      }
      return "";
    },
    submitTime() {
      return this.$t("message_detail.submit_time", {
        time: this.formatTime(this.proposal.timestamp)
      });
    }
  },
  async asyncData({ params }) {
    try {
      const node = await tpInfo.getNode();
      const inst = multisigContractInstance.init(node);
      const proposal = await inst.getTopic(params.id);
      return { proposal };
    } catch (error) {
      console.log("request topic detail error: ", error);
    }
  },
  deactivated() {
    this.$destroy();
  },
  methods: {
    formatTime(timestamp) {
      return tinydate("{YYYY}-{MM}-{DD} {HH}:{mm}")(new Date(parseInt(timestamp)));
    }
  }
};
</script>
<style lang="scss">
.multisig-wallet-message-detail-container {
  background-color: #fff;
  padding: 0.23rem;
  color: #6b6e73;

  p {
    text-align: left;
    word-break: break-all;

    &:not(:first-child) {
      margin-top: 0.17rem;
    }
  }
}
</style>
