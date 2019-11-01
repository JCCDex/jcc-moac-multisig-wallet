<template>
  <div class="multisig-wallet-proposal-cell-container" flex="main:justify cross:center">
    <div flex="cross:center" style="width:calc(100% - 0.4rem)">
      <svg v-if="isVoting && isVoter && !proposal.hadVoted" class="multisig-wallet-icon" style="margin-right:0.19rem;" aria-hidden="true" @click="selected">
        <use :xlink:href="icon" />
      </svg>
      <div style="text-align: left;" :style="{ 'max-width': !isVoting || !isVoter || proposal.hadVoted ? '100%' : 'calc(100% - 0.6rem)' }" @click="goto('/proposal/detail')">
        <div>
          <span class="multisig-wallet-large-font-size" style="color: #181C24;">
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
    <i class="multisig-wallet-arrow multisig-wallet-arrow-right" style="bottom: 0.06rem;" @click="goto('/proposal/detail')" />
  </div>
</template>
<script>
import proposalMixin from "@/mixins/proposal";
export default {
  mixins: [proposalMixin],
  props: {
    proposal: {
      type: Object,
      default() {
        return {};
      }
    },
    isVoter: {
      type: Boolean
    }
  },
  computed: {
    isVoting() {
      return this.proposal.voting;
    },
    icon() {
      return this.proposal.selected ? "#icon-selected" : "#icon-unselected";
    }
  },
  methods: {
    goto() {
      this.$router.push("/proposal/" + this.proposal.topicId);
    },
    selected() {
      this.proposal.selected = !this.proposal.selected;
      this.$emit("selectedProposal");
    }
  }
};
</script>
<style lang="scss">
.multisig-wallet-proposal-cell-container {
  height: 1.26rem;
  margin: 0 0.3rem;

  &:not(:last-child) {
    border-bottom: 0.01rem solid #e2e6f1;
  }
}
</style>
