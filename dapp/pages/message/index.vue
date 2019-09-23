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
                <message-cell v-for="(message, index) in messages" :key="index" :message="message" />
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
import throttle from "lodash/throttle";
import MessageCell from "@/components/message/message-cell";

BScroll.use(PullDown);
BScroll.use(Pullup);

function getOneRandomList() {
  const type = Math.floor(Math.random() * 5);
  return { type: type };
}

const TIME_BOUNCE = 800;
const TIME_STOP = 600;
const THRESHOLD = 70;
const STOP = 56;

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
      messages: [getOneRandomList()]
    };
  },
  created() {
    this.bscroll = null;
  },
  mounted() {
    this.initBscroll();
  },
  methods: {
    initBscroll() {
      this.bscroll = new BScroll(this.$refs.scroll, {
        scrollY: true,
        click: true,
        bounceTime: TIME_BOUNCE,
        pullDownRefresh: {
          threshold: THRESHOLD,
          stop: STOP
        },
        pullUpLoad: {
          threshold: 0
        }
      });

      this.bscroll.on("pullingDown", throttle(this.pullingDownHandler, 1000));
      this.bscroll.on("pullingUp", throttle(this.pullingUpHandler, 1000));
    },
    async pullingDownHandler() {
      this.beforePullDown = false;
      this.isPullingDown = true;
      await this.requestData();

      this.isPullingDown = false;
      this.finishPullDown();
    },
    async pullingUpHandler() {
      this.beforePullUp = false;
      this.isPullUpLoad = true;
      await this.requestData();

      this.bscroll.finishPullUp();
      this.bscroll.refresh();

      this.isPullUpLoad = false;
      this.beforePullUp = true;
    },
    async finishPullDown() {
      const stopTime = TIME_STOP;
      await new Promise(resolve => {
        setTimeout(() => {
          this.bscroll.finishPullDown();
          resolve();
        }, stopTime);
      });
      setTimeout(() => {
        this.beforePullDown = true;
        this.bscroll.refresh();
      }, TIME_BOUNCE);
    },
    async requestData() {
      try {
        const newData = await this.ajaxGet(/* url */);
        this.messages = [...this.messages, newData];
      } catch (err) {
        // handle err
        console.log(err);
      }
    },
    ajaxGet(/* url */) {
      return new Promise(resolve => {
        setTimeout(() => {
          const dataList = getOneRandomList();
          resolve(dataList);
        }, 1000);
      });
    }
  }
};
</script>
