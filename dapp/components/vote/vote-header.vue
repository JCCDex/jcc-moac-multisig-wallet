<template>
  <div style="padding:0.26rem 0 0.1rem 0;">
    <div v-if="isVoter" flex="main:justify cross:center" style="padding:0 0.5rem;">
      <button class="multisig-wallet-button multisig-wallet-recall-button" style="width: auto;padding: 0 0.2rem" flex="main:center cross:center" @click="goto('/proposal/recall')">
        <div class="multisig-wallet-icon-circle" flex="main:center cross:center" style="margin-right: 0.13rem;">
          <svg class="multisig-wallet-icon" aria-hidden="true">
            <use xlink:href="#icon-recall-voter" />
          </svg>
        </div>
        {{ $t("recall_voter") }}
      </button>

      <button class="multisig-wallet-button multisig-wallet-vote-button" style="width: auto;padding: 0 0.2rem" flex="main:center cross:center" @click="goto('/proposal/modifyPercent')">
        <div class="multisig-wallet-icon-circle" flex="main:center cross:center" style="margin-right: 0.13rem;">
          <svg class="multisig-wallet-icon" aria-hidden="true">
            <use xlink:href="#icon-vote-percent" />
          </svg>
        </div>
        {{ $t("vote_percent") }}
      </button>
    </div>

    <div v-else flex="main:justify cross:center" style="padding:0 0.5rem;">
      <button class="multisig-wallet-button multisig-wallet-apply-button" style="width: 100%;" flex="main:center cross:center" @click="show = true">
        <div class="multisig-wallet-icon-circle" flex="main:center cross:center" style="margin-right: 0.13rem;">
          <svg class="multisig-wallet-icon" aria-hidden="true">
            <use xlink:href="#icon-recall-voter" />
          </svg>
        </div>
        {{ $t("apply_voter") }}
      </button>
    </div>

    <div flex="main:center cross:center" class="multisig-wallet-proposal-choose-container multisig-wallet-large-font-size">
      <p :class="{ active: isVoting }" style="margin-right: 1.5rem" @click="changeProposalType('VotingProposalList')">
        {{ $t("voting_proposal") }}
      </p>
      <p :class="{ active: !isVoting }" @click="changeProposalType('VotedProposalList')">
        {{ $t("voted_proposal") }}
      </p>
    </div>

    <van-action-sheet v-model="show" :title="$t('apply_action.title')" get-container="body">
      <div class="multisig-wallet-apply-action-sheet-container">
        <p v-for="(item, key) in $t('apply_action.contents')" :key="key">
          {{ item }}
        </p>
      </div>

      <button class="multisig-wallet-button multisig-wallet-confirm-button" style="width:100%;" @click="confirmApply">
        {{ $t("apply_action.button") }}
      </button>
    </van-action-sheet>
  </div>
</template>
<script>
import bus from "@/js/bus";
import tpInfo from "@/js/tp";
import accountInfo from "@/js/account";
import multisigContractInstance from "@/js/contract";
import * as transaction from "@/js/transaction";
import { Toast } from "vant";

export default {
  name: "VoteHeader",
  props: {
    isVoter: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      type: "VotingProposalList",
      show: false
    };
  },
  computed: {
    isVoting() {
      return this.type === "VotingProposalList";
    }
  },
  methods: {
    goto(route) {
      this.$router.push(route);
    },
    changeProposalType(type) {
      if (type === this.type) {
        return;
      }
      if (type === "VotedProposalList") {
        bus.$emit("selectedProposal", false, true);
      }
      this.type = type;
      bus.$emit("changeProposalType", type);
    },
    async confirmApply() {
      this.show = false;

      // clear cache to request latest state so that prevent from applying again if had been voter
      // certainly it doesn't make a difference if apply again, the main purpose is to prevent from expanding gas
      accountInfo.destroy("isVoter");

      try {
        const isVoter = await accountInfo.isVoter();
        if (!isVoter) {
          const topicId = Date.now();
          console.log("topic id: ", topicId);
          const timestamp = topicId;
          const endtime = timestamp + 3 * 24 * 60 * 60 * 1000;
          const address = await tpInfo.getAddress();
          const node = await tpInfo.getNode();
          const instance = multisigContractInstance.init(node);
          const hash = await instance.createVoterProposal(topicId, timestamp, endtime, address);
          console.log("create voter proposal hash: ", hash);

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
              Toast.success(this.$t("message.apply_succeed"));
            } else {
              Toast.fail(this.$t("message.apply_failed"));
            }
          }, 30000);
        } else {
          Toast.fail(this.$t("message.is_voter"));
        }
      } catch (error) {
        console.log("create voter proposal error: ", error);
        Toast.fail(this.$t("message.apply_failed"));
      }
    }
  }
};
</script>

<style lang="scss">
.multisig-wallet-proposal-choose-container {
  height: 0.8rem;
  line-height: 0.8rem;
  background-color: #fff;
  margin-top: 0.26rem;
  > p {
    height: 100%;
    color: #5d637f;

    &.active {
      color: #0b1f5d;
      border-bottom: 0.02rem solid #0b1f5d;
    }
  }
}

.multisig-wallet-apply-action-sheet-container {
  text-align: left;
  margin-top: 0.15rem;
  margin-bottom: 0.55rem;

  p {
    margin-top: 0.1rem;

    &:not(:first-child) {
      color: #0b1f5d;
    }
  }
}
</style>
