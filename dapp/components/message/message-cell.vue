<template>
  <div
    class="mutisig-wallet-message-cell-container"
    flex="main:justify cross:center"
    @click="goto('/message/detail')"
  >
    <div flex="cross:center">
      <component :is="componentId" />
      <div style="margin-left:0.19rem;">
        <div>
          <span class="mutisig-wallet-large-font-size" style="color: #0B1F5D;">
            {{ `提现申请` }}
          </span>
          <span
            class="mutisig-wallet-small-font-size"
            style="margin-left:0.28rem;color: #9EA4C4"
          >
            {{ `3分钟前` }}
          </span>
        </div>
        <div style="color: #6B6E73;text-align:left;margin-top:0.04rem;">
          {{ `xxx申请提现` }}
        </div>
      </div>
    </div>
    <i
      class="mutisig-wallet-arrow mutisig-wallet-arrow-right"
      style="bottom: 0.06rem;"
    />
  </div>
</template>
<script>
import LockIcon from "./locked-icon";
import ModifyVotePercentIcon from "./modify-vote-percent-icon";
import RecallVoterIcon from "./recall-voter-icon";
import VoteApplyIcon from "./vote-apply-icon";
import WithdrawApplyIcon from "./withdraw-apply-icon";

export default {
  components: {
    LockIcon,
    ModifyVotePercentIcon,
    RecallVoterIcon,
    VoteApplyIcon,
    WithdrawApplyIcon
  },
  props: {
    message: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  computed: {
    componentId() {
      let maps = new Map([
        [0, "LockIcon"],
        [1, "ModifyVotePercentIcon"],
        [2, "RecallVoterIcon"],
        [3, "VoteApplyIcon"],
        [4, "WithdrawApplyIcon"]
      ]);
      return maps.get(this.message.type);
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
.mutisig-wallet-message-cell-container {
  height: 1.4rem;
  margin: 0 0.29rem 0 0.31rem;

  &:not(:last-child) {
    border-bottom: 0.01rem solid #e2e6f1;
  }
}
</style>
