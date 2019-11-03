<template>
  <div class="scroll-wrapper" style="height: calc(100vh - 4.5rem);">
    <scroll ref="scroll" :options="options" class="scroll-content" style="min-height: calc(100vh - 4.45rem);position: relative;" @pulling-down="pullingDownHandler">
      <div style="background-color: #fff">
        <proposal-cell v-for="(item, index) in proposals" :key="index" :proposal="item" :is-voter="isVoter" @selectedProposal="selectedProposal" />
      </div>
      <div v-if="showEmpty" style="background-color:  #f2f4fb">
        <empty-content />
      </div>
    </scroll>

    <van-action-sheet v-model="show" :title="$t('vote_action.title')" get-container="body">
      <p style="margin:0.44rem 0 0.95rem 0;">
        {{ $t("vote_action.content", { count: selectedCount, type: voteType }) }}
      </p>

      <button class="multisig-wallet-button multisig-wallet-confirm-button" style="width:100%;" @click="voteConfirm">
        {{ $t("vote_action.button") }}
      </button>
    </van-action-sheet>
  </div>
</template>

<script>
import ProposalCell from "@/components/proposal-cell";
import multisigContractInstance from "@/js/contract";
import tpInfo from "@/js/tp";
import emptyContent from "@/components/empty";
import bus from "@/js/bus";
import accountInfo from "@/js/account";
import * as transaction from "@/js/transaction";
import { Toast } from "vant";
import scrollMixin from "@/mixins/scroll";
import votingCache from "@/js/votingProposalCache";
import cloneDeep from "clone-deep";

export default {
  components: {
    ProposalCell,
    emptyContent
  },
  mixins: [scrollMixin],
  props: {
    isVoter: {
      type: Boolean
    },
    address: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      showEmpty: false,
      voteType: "",
      show: false,
      selectedCount: 0,
      confirm: null,
      proposals: []
    };
  },
  computed: {
    options() {
      return {
        pullDownRefresh: {
          txt: this.$t("pull_down_refresh_success")
        }
      };
    }
  },
  created() {
    this.pullingDownHandler(true);
    bus.$on("selectAll", this.selectAll);
    bus.$on("voteProposal", this.showVoteAction);
  },
  beforeDestroy() {
    bus.$off("selectAll", this.selectAll);
    bus.$off("voteProposal", this.showVoteAction);
  },
  activated() {
    this.$refs.scroll && this.$refs.scroll.refresh();
  },
  methods: {
    async pullingDownHandler(cache = false) {
      let proposals = await this.requestVotingProposals(cache);
      if (proposals) {
        this.proposals = proposals;
      }
      if (this.proposals.length === 0) {
        this.showEmpty = true;
      } else {
        this.showEmpty = false;
      }
      const hasVoting = proposals.some(proposals => !proposals.hadVoted);
      bus.$emit("selectedProposal", false, false, hasVoting);

      setTimeout(() => {
        this.$refs.scroll.forceUpdate(true);
      }, 2000);
    },
    async requestVotingProposals(cache) {
      try {
        const node = await tpInfo.getNode();
        const instance = multisigContractInstance.init(node);
        let caches;
        if (votingCache.hasCache()) {
          caches = await votingCache.get(true);
        } else {
          caches = [];
        }
        const proposals = await votingCache.get(cache);
        if (!proposals) {
          return proposals;
        }

        for (const proposal of proposals) {
          if (proposal.yesCount !== "0" || proposal.noCount !== "0") {
            const cacheProposal = caches.find(cache => cache.topicId === proposal.topicId);

            if (cacheProposal && cacheProposal.hadVoted) {
              proposal.hadVoted = true;
            } else {
              console.log("request vote detail: " + proposal.topicId);
              const voteDetails = await instance.getVoteDetailsByTopic(proposal.topicId);
              proposal.hadVoted = Boolean(voteDetails.find(detail => detail.voter.toLowerCase() === this.address.toLowerCase()));
            }
          } else {
            proposal.hadVoted = false;
          }
          // set is voting or not
          proposal.voting = true;
          // set default select state
          if (!proposal.hadVoted) {
            proposal.selected = false;
          }
        }
        votingCache.update(proposals);

        const copy = cloneDeep(proposals);

        copy.sort((prev, next) => {
          if (!prev.hadVoted && next.hadVoted) {
            return -1;
          }
          if (prev.hadVoted && !next.hadVoted) {
            return 1;
          }
          return 0;
        });
        return copy;
      } catch (error) {
        console.log("reqeust voting proposal error: ", error);
        return null;
      }
    },
    selectAll(flag) {
      for (const proposal of this.proposals) {
        if (!proposal.hadVoted) {
          proposal.selected = flag;
        }
      }
    },
    selectedProposal() {
      const hasSelected = this.proposals.find(proposal => proposal.selected);
      const hasUnselected = this.proposals.find(proposal => !proposal.selected);
      bus.$emit("selectedProposal", !hasUnselected, Boolean(hasSelected));
    },
    showVoteAction(confirm) {
      const selectedProposals = this.proposals.filter(proposal => proposal.selected && !proposal.hadVoted);

      if (selectedProposals.length === 0) {
        return;
      }
      this.confirm = confirm;
      this.show = true;
      this.selectedCount = selectedProposals.length;
      this.voteType = this.confirm ? this.$t("approval") : this.$t("against");
    },
    async voteConfirm() {
      this.show = false;

      const selectedProposals = this.proposals.filter(proposal => proposal.selected);

      if (selectedProposals.length === 0) {
        return;
      }

      // clear cache to request latest state
      accountInfo.destroy("isVoter");

      try {
        const isVoter = await accountInfo.isVoter();
        if (isVoter) {
          const timestamp = Date.now();
          const node = await tpInfo.getNode();
          const instance = multisigContractInstance.init(node);
          let hash;
          if (selectedProposals.length === 1) {
            hash = await instance.voteTopic(selectedProposals[0].topicId, timestamp, this.confirm);
          } else {
            const topicIds = selectedProposals.map(proposal => proposal.topicId);
            hash = await instance.batchVoteTopic(topicIds, timestamp, this.confirm);
          }
          console.log("vote hash: ", hash);

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
        console.log("vote error: ", error);
        Toast.fail(this.$t("message.submit_failed"));
      }
    }
  }
};
</script>
<style lang="scss">
@import "@/style/mixin.scss";

.multisig-wallet-locked-cell {
  height: 1.2rem;
  @include px2px("font-size", 12);
  border-bottom: 0.01rem solid #e2e6f1;

  .multisig-wallet-locked-cell-time {
    margin-bottom: 0.08rem;
  }
}
</style>
