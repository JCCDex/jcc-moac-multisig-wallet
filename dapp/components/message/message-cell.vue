<template>
  <div class="multisig-wallet-message-cell-container" flex="main:justify cross:center" @click="goto('/message/detail')">
    <div flex="cross:center" style="width: calc(100% - 0.4rem)">
      <component :is="componentId" />
      <div style="margin-left:0.19rem;text-align: left;max-width:calc(100% - 1rem)">
        <div>
          <span class="multisig-wallet-large-font-size" style="color: #0B1F5D;">
            {{ proposalType }}
          </span>
          <span class="multisig-wallet-small-font-size" style="margin-left:0.28rem;color: #9EA4C4">
            {{ time }}
          </span>
        </div>
        <div class="van-ellipsis" style="color: #6B6E73;text-align:left;margin-top:0.04rem;">
          {{ proposalSimpleContent }}
        </div>
      </div>
    </div>
    <i class="multisig-wallet-arrow multisig-wallet-arrow-right" style="bottom: 0.06rem;" />
  </div>
</template>
<script>
import LockIcon from "./locked-icon";
import ModifyVotePercentIcon from "./modify-vote-percent-icon";
import RecallVoterIcon from "./recall-voter-icon";
import VoteApplyIcon from "./vote-apply-icon";
import WithdrawApplyIcon from "./withdraw-apply-icon";
import proposalMixin from "@/mixins/proposal";
import { TYPE_CONFIG_PERCENT, TYPE_WITHDRAW, TYPE_VOTE, TYPE_RECALL } from "@/js/constant";

export default {
  components: {
    LockIcon,
    ModifyVotePercentIcon,
    RecallVoterIcon,
    VoteApplyIcon,
    WithdrawApplyIcon
  },
  mixins: [proposalMixin],
  props: {
    proposal: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  computed: {
    componentId() {
      let maps = new Map([[TYPE_CONFIG_PERCENT, "ModifyVotePercentIcon"], [TYPE_RECALL, "RecallVoterIcon"], [TYPE_VOTE, "VoteApplyIcon"], [TYPE_WITHDRAW, "WithdrawApplyIcon"]]);
      return maps.get(this.proposal.voteType);
    }
  },
  methods: {
    goto(route) {
      this.$router.push(route);
    }
  }
};
</script>
<style lang="scss">
.multisig-wallet-message-cell-container {
  height: 1.4rem;
  margin: 0 0.29rem 0 0.31rem;

  &:not(:last-child) {
    border-bottom: 0.01rem solid #e2e6f1;
  }
}
</style>
