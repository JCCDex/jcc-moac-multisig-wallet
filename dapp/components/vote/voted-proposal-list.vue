<template>
  <div class="scroll-wrapper" style="height: calc(100vh - 3.3rem);">
    <scroll ref="scroll" style="height: calc(100vh - 3.25rem);position: relative;" :options="options" @pulling-down="pullingDownHandler" @pulling-up="pullingUpHandler">
      <div style="background-color: #fff">
        <proposal-cell v-for="(item, index) in proposals" :key="index" :proposal="item" :is-voter="isVoter" />
      </div>
      <div v-if="proposals.length === 0 && showEmpty" style="background-color:  #f2f4fb">
        <empty-content />
      </div>
    </scroll>
  </div>
</template>

<script>
import ProposalCell from "@/components/proposal-cell";
import emptyContent from "@/components/empty";
import multisigContractInstance from "@/js/contract";
import voteInfo from "@/js/vote";
import tpInfo from "@/js/tp";
import scrollMixin from "@/mixins/scroll";

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
      proposals: []
    };
  },
  computed: {
    options() {
      return {
        pullDownRefresh: {
          txt: this.$t("pull_down_refresh_success")
        },
        pullUpLoad: {
          threshold: 500
        }
      };
    }
  },
  mounted() {
    this.pullingDownHandler();
  },
  activated() {
    this.$refs.scroll && this.$refs.scroll.refresh();
  },
  methods: {
    async pullingDownHandler() {
      const votedCount = await voteInfo.getVotedCount(this.isVoter);
      const { start, end } = this.getStartEnd(0, votedCount);
      let proposals = await this.requestVotedProposals(start, end);
      if (proposals) {
        this.proposals = proposals;
      }
      if (this.proposals.length === 0) {
        this.showEmpty = true;
      } else {
        this.showEmpty = false;
      }
      setTimeout(() => {
        this.$refs.scroll.forceUpdate(true);
      }, 2000);
    },
    async pullingUpHandler() {
      const votedCount = await voteInfo.getVotedCount(this.isVoter);
      console.log("current voted proposals count: ", this.proposals.length);
      console.log("all voted proposals count: ", votedCount);
      if (votedCount === 0) {
        this.$refs.scroll.forceUpdate();
        return;
      }
      if (votedCount <= this.proposals.length) {
        this.$refs.scroll.forceUpdate();
        return;
      }
      const { start, end } = this.getStartEnd(this.proposals.length, votedCount);
      const proposals = await this.requestVotedProposals(start, end);
      if (proposals) {
        this.proposals = [...this.proposals, ...proposals];
        setTimeout(() => {
          this.$refs.scroll.forceUpdate(true, false);
        }, 1000);
      }
    },
    getStartEnd(start, votedCount) {
      let end = start + 9;
      if (end >= votedCount - 1) {
        end = votedCount - 1;
      }
      return { start, end };
    },
    async requestVotedProposals(start, end) {
      console.log("start: ", start);
      console.log("end: ", end);
      try {
        const node = await tpInfo.getNode();
        const instance = multisigContractInstance.init(node);
        let proposalIds;
        if (this.isVoter) {
          proposalIds = await instance.getVotedTopicIds(start, end);
        } else {
          proposalIds = await instance.getMyVotedTopicIds(this.address, start, end);
        }
        const props = [];
        for (const id of proposalIds) {
          props.push(instance.getTopic(id));
        }
        const responses = await Promise.all(props);
        const proposals = responses.filter(response => response.sponsor !== "0x0000000000000000000000000000000000000000");
        return proposals;
      } catch (error) {
        console.log("reqeust voted proposal error: ", error);
        return null;
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
