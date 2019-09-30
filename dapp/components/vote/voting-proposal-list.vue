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
      <div v-if="showEmpty" style="background-color:  #f2f4fb">
        <empty-content />
      </div>
    </div>
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
      proposals: []
    };
  },
  created() {
    this.bscroll = null;
    this.pullingDownHandler();
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
          this.bscroll.finishPullDown();
          resolve();
        }, 1000);
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
