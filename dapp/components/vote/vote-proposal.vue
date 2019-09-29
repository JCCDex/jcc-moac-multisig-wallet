<template>
  <div ref="scroll" class="scroll-wrapper" style="height: calc(100vh - 4.4rem);">
    <div class="scroll-content" style="min-height: calc(100vh - 4.35rem);position: relative;">
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

      <div v-if="!beforePullUp" class="pullup-wrapper multisig-wallet-small-font-size">
        <div v-if="!isPullUpLoad" class="before-trigger">
          <span>{{ $t("pull_up_more") }}</span>
        </div>
        <div v-else class="after-trigger">
          <span>{{ $t("loading") }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BScroll from "@better-scroll/core";
import PullDown from "@better-scroll/pull-down";
import Pullup from "@better-scroll/pull-up";
import debounce from "lodash/debounce";
import ProposalCell from "@/components/proposal-cell";
import bus from "@/js/bus";
import multisigContractInstance from "@/js/contract";
import voteInfo from "@/js/vote";
import tpInfo from "@/js/tp";

BScroll.use(PullDown);
BScroll.use(Pullup);

export default {
  components: {
    ProposalCell
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
      beforePullUp: true,
      isPullUpLoad: false,
      beforePullDown: true,
      isPullingDown: false,
      type: "voting",
      proposals: []
    };
  },
  computed: {
    isVoting() {
      return this.type === "voting";
    }
  },
  created() {
    this.bscroll = null;
    bus.$on("changeProposalType", this.refresh);
  },
  beforeDestroy() {
    bus.$off("changeProposalType", this.refresh);
  },
  mounted() {
    this.initBscroll();
    this.pullingDownHandler();
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
        },
        pullUpLoad: {
          threshold: 500
        }
      });

      this.bscroll.on("pullingDown", debounce(this.pullingDownHandler, 500));
      this.bscroll.on("pullingUp", debounce(this.pullingUpHandler, 500));
    },
    async refresh(type) {
      this.type = type;
      this.proposals = [];
      this.bscroll.closePullUp();
      this.bscroll.scrollTo(0, 0);
      await this.pullingDownHandler();
      this.bscroll.refresh();
      this.bscroll.openPullUp({
        threshold: 500
      });
    },
    async pullingDownHandler() {
      this.beforePullDown = false;
      this.isPullingDown = true;
      let proposals;
      if (this.isVoting) {
        proposals = await this.requestVotingProposals();
      } else {
        proposals = await this.requestVotedProposals();
      }
      this.proposals = proposals;
      this.isPullingDown = false;
      this.finishPullDown();
    },
    async pullingUpHandler() {
      if (this.type === "voting") {
        return;
      }
      this.beforePullUp = false;
      this.isPullUpLoad = true;
      const proposals = await this.requestVotedProposals();
      this.proposals = [...this.proposals, ...proposals];
      this.bscroll.finishPullUp();
      this.bscroll.refresh();

      this.isPullUpLoad = false;
      this.beforePullUp = true;
    },
    async finishPullDown() {
      await new Promise(resolve => {
        setTimeout(() => {
          this.bscroll.finishPullDown();
          resolve();
        }, 600);
      });
      setTimeout(() => {
        this.beforePullDown = true;
        this.bscroll.refresh();
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
        const responses = await Promise.all(props);
        const proposals = responses.map(response => {
          // set is voting or not
          response.voting = true;
          // set default select state
          response.selected = true;
          return response;
        });
        return proposals;
      } catch (error) {
        console.log("reqeust voting proposal error: ", error);
      }
    },
    async requestVotedProposals() {
      const votedCount = await voteInfo.getVotedCount(this.isVoter);
      if (votedCount === 0) {
        return;
      }
      if (votedCount <= this.proposals.length) {
        return;
      }
      console.log("current voted proposals count: ", this.proposals.length);
      console.log("all voted proposals count: ", votedCount);
      let start = this.proposals.length;
      let end = start + 2;
      if (end >= votedCount - 1) {
        end = votedCount - 1;
      }
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
