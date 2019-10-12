<template>
  <div ref="scroll" class="scroll-wrapper" style="height: calc(100vh - 4.5rem);">
    <div class="scroll-content" style="min-height: calc(100vh - 4.45rem);position: relative;">
      <div class="pulldown-wrapper multisig-wallet-small-font-size">
        <div v-show="beforePullDown">
          <span>{{ $t("pull_down_refresh") }}</span>
        </div>
        <div v-show="!beforePullDown">
          <div v-show="isPullingDown">
            <span>{{ $t("loading") }}</span>
          </div>
          <div v-show="!isPullingDown">
            <span>{{ $t("pull_down_refresh_success") }}</span>
          </div>
        </div>
      </div>
      <div style="background-color: #fff">
        <proposal-cell v-for="(item, index) in proposals" :key="index" :proposal="item" :is-voter="isVoter" />
      </div>
      <div v-if="showEmpty" style="background-color:  #f2f4fb">
        <empty-content />
      </div>
    </div>

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
import BScroll from "@better-scroll/core";
import PullDown from "@better-scroll/pull-down";
import debounce from "lodash/debounce";
import ProposalCell from "@/components/proposal-cell";
import multisigContractInstance from "@/js/contract";
import tpInfo from "@/js/tp";
import emptyContent from "@/components/empty";
import bus from "@/js/bus";
import accountInfo from "@/js/account";
import * as transaction from "@/js/transaction";
import { Toast } from "vant";

BScroll.use(PullDown);

export default {
  components: {
    ProposalCell,
    emptyContent
  },
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
      beforePullDown: true,
      isPullingDown: false,
      showEmpty: false,
      voteType: "",
      show: false,
      selectedCount: 0,
      confirm: null,
      proposals: [],
      bscroll: null
    };
  },
  created() {
    this.pullingDownHandler();
    bus.$on("selectAll", this.selectAll);
    bus.$on("voteProposal", this.showVoteAction);
  },
  beforeDestroy() {
    if (this.bscroll) {
      this.bscroll.destroy();
      this.bscroll = null;
    }
    bus.$off("selectAll", this.selectAll);
    bus.$off("voteProposal", this.showVoteAction);
  },
  mounted() {
    this.initBscroll();
  },
  methods: {
    initBscroll() {
      this.bscroll = new BScroll(this.$refs.scroll, {
        scrollY: true,
        click: true,
        bounceTime: 800,
        pullDownRefresh: {
          threshold: 70,
          stop: 56
        }
      });
      this.bscroll.on("pullingDown", debounce(this.pullingDownHandler, 500));
    },
    async pullingDownHandler() {
      this.beforePullDown = false;
      this.isPullingDown = true;
      let proposals = await this.requestVotingProposals();
      if (proposals) {
        this.proposals = proposals;
      }
      if (this.proposals.length === 0) {
        this.showEmpty = true;
      } else {
        this.showEmpty = false;
      }

      this.finishPullDown();
    },
    async finishPullDown() {
      await new Promise(resolve => {
        setTimeout(() => {
          this.isPullingDown = false;
          if (this.bscroll) {
            this.bscroll.finishPullDown();
          }
          resolve();
        }, 1000);
      });
      setTimeout(() => {
        this.beforePullDown = true;
        if (this.bscroll) {
          this.bscroll.refresh();
        }
      }, 800);
    },
    async requestVotingProposals() {
      try {
        const node = await tpInfo.getNode();
        const instance = multisigContractInstance.init(node);
        let proposalIds;
        if (this.isVoter) {
          proposalIds = await instance.getAllVotingTopicIds();
        } else {
          proposalIds = await instance.getAllMyVotingTopicIds(this.address);
        }
        const props = [];
        for (const id of proposalIds) {
          props.push(instance.getTopic(id));
        }
        const proposals = await Promise.all(props);

        for (const proposal of proposals) {
          if (proposal.yesCount !== "0" || proposal.noCount !== "0") {
            const voteDetails = await instance.getVoteDetailsByTopic(proposal.topicId);
            proposal.hadVoted = Boolean(voteDetails.find(detail => detail.voter.toLowerCase() === this.address.toLowerCase()));
          } else {
            proposal.hadVoted = false;
          }
          // set is voting or not
          proposal.voting = true;
          // set default select state
          if (!proposal.hadVoted) {
            proposal.selected = true;
          }
        }
        return proposals;
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
