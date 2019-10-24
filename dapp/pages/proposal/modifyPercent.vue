<template>
  <div ref="scroll" class="multisig-wallet-container">
    <div style="position: fixed; height: 100%; width: 100%; top: 0;">
      <div class="multisig-wallet-tab-bar">
        <div class="multisig-wallet-tabs multisig-wallet-tabs-bottom">
          <div class="multisig-wallet-tabs-content-wrap" style="touch-action: pan-x pan-y; position: relative; left: 0%;flex-direction: column">
            <wallet-header :title="$t('vote_percent')" />
            <div flex="dir:top cross: center" class="multisig-wallet-modify-percent-container">
              <p>
                {{ $t("current_percent", { percent }) }}
              </p>
              <p>{{ $t("modify_percent") }}</p>

              <van-field v-model="value" center type="number">
                <span slot="button" size="small" type="primary">
                  %
                </span>
              </van-field>
              <div v-show="showElement" flex-box="1" flex="cross:bottom">
                <button :disabled="!modifyEnable" class="multisig-wallet-button multisig-wallet-confirm-button" style="width: 100%;" @click="show = true">
                  {{ $t("modify_confirm") }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <van-action-sheet v-model="show" :title="$t('modify_percent_action.title')" get-container="body">
      <p style="margin:0.44rem 0 0.95rem 0;">
        {{ $t("modify_percent_action.content", { percent: value }) }}
      </p>

      <button class="multisig-wallet-button multisig-wallet-confirm-button" style="width:100%;" @click="confirmModify">
        {{ $t("modify_percent_action.button") }}
      </button>
    </van-action-sheet>
  </div>
</template>
<script>
import BScroll from "@better-scroll/core";
import WalletHeader from "@/components/header";
import voteInfo from "@/js/vote";
import { isValidNumber } from "@/js/util";
import accountInfo from "@/js/account";
import multisigContractInstance from "@/js/contract";
import * as transaction from "@/js/transaction";
import { Toast } from "vant";
import tpInfo from "@/js/tp";
import keyEvent from "@/mixins/keyEvent";

export default {
  name: "ModifyPercent",
  components: {
    WalletHeader
  },
  mixins: [keyEvent],
  data() {
    return {
      percent: "",
      value: "",
      show: false
    };
  },
  computed: {
    modifyEnable() {
      let value = parseFloat(this.value);
      return isValidNumber(value) && value > 50;
    }
  },
  async asyncData() {
    try {
      const percent = await voteInfo.getPassPercent();
      return { percent: percent + "%" };
    } catch (error) {
      return { percent: "0%" };
    }
  },
  mounted() {
    this.init();
  },
  deactivated() {
    this.$destroy();
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
    async confirmModify() {
      this.show = false;

      // clear cache to request latest state
      accountInfo.destroy("isVoter");

      if (this.value + "%" === this.percent) {
        return Toast.fail(this.$t("message.not_need_create_percent_proposal"));
      }
      try {
        const isVoter = await accountInfo.isVoter();
        if (isVoter) {
          const topicId = Date.now();
          console.log("topic id: ", topicId);
          const timestamp = topicId;
          const endtime = timestamp + 3 * 24 * 60 * 60 * 1000;
          const node = await tpInfo.getNode();
          const instance = multisigContractInstance.init(node);
          const hash = await instance.createPercentProposal(topicId, timestamp, endtime, parseFloat(this.value));
          console.log("create percent proposal hash: ", hash);

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
            } else {
              Toast.fail(this.$t("message.submit_failed"));
            }
          }, 30000);
        } else {
          Toast.fail(this.$t("message.is_not_voter"));
        }
      } catch (error) {
        console.log("create percent proposal error: ", error);
        Toast.fail(this.$t("message.submit_failed"));
      }
    }
  }
};
</script>
<style lang="scss">
.multisig-wallet-modify-percent-container {
  padding: 0.24rem 0.3rem 0.3rem;
  height: calc(100% - 0.8rem);
  color: #181c24;

  p {
    text-align: left;
    margin-bottom: 0.16rem;
  }
}
</style>
