<template>
  <div class="multisig-wallet-container">
    <div style="position: fixed; height: 100%; width: 100%; top: 0;">
      <div class="multisig-wallet-tab-bar">
        <div class="multisig-wallet-tabs multisig-wallet-tabs-bottom">
          <div class="multisig-wallet-tabs-content-wrap" style="touch-action: pan-x pan-y; position: relative; left: 0%;flex-direction: column">
            <div ref="scroll" class="scroll-wrapper" style="margin-top: 0.1rem; background-color: #fff;height: calc(100% - 0.1rem);">
              <div class="scroll-content" style="min-height: calc(100% + 0.01rem);position: relative;">
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
                <message-cell v-for="(message, index) in messages" :key="index" :proposal="message" />
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
          </div>
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
import MessageCell from "@/components/message/message-cell";
import tpInfo from "@/js/tp";
import multisigContractInstance from "@/js/contract";
BScroll.use(PullDown);
BScroll.use(Pullup);

export default {
  name: "Messages",
  components: {
    MessageCell
  },
  data() {
    return {
      beforePullUp: true,
      isPullUpLoad: false,
      beforePullDown: true,
      isPullingDown: false,
      messages: []
    };
  },
  async asyncData() {
    try {
      const node = await tpInfo.getNode();
      const instance = multisigContractInstance.init(node);
      let proposalIds = await instance.getAllVotingTopicIds();
      const props = [];
      for (const id of proposalIds) {
        props.push(instance.getTopic(id));
      }
      const proposals = await Promise.all(props);
      return { messages: proposals };
    } catch (error) {
      console.log("init messages data error: ", error);
    }
  },
  created() {
    this.bscroll = null;
  },
  deactivated() {
    this.$destroy();
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

      this.bscroll.on("pullingDown", debounce(this.pullingDownHandler, 1000));
    },
    async pullingDownHandler() {
      this.beforePullDown = false;
      this.isPullingDown = true;
      await this.requestData();
      this.isPullingDown = false;
      this.finishPullDown();
    },
    async finishPullDown() {
      const stopTime = 600;
      await new Promise(resolve => {
        setTimeout(() => {
          this.bscroll.finishPullDown();
          resolve();
        }, stopTime);
      });
      setTimeout(() => {
        this.beforePullDown = true;
        this.bscroll.refresh();
      }, 800);
    },
    async requestData() {
      try {
        const node = await tpInfo.getNode();
        const instance = multisigContractInstance.init(node);
        let proposalIds = await instance.getAllVotingTopicIds();
        const props = [];
        for (const id of proposalIds) {
          props.push(instance.getTopic(id));
        }
        const proposals = await Promise.all(props);
        this.messages = proposals;
      } catch (error) {
        console.log("init messages data error: ", error);
      }
    }
  }
};
</script>
