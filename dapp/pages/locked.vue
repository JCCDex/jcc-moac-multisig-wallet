<template>
  <div class="mutisig-wallet-container">
    <div style="position: fixed; height: 100%; width: 100%; top: 0px;">
      <div class="mutisig-wallet-tab-bar">
        <div class="mutisig-wallet-tabs mutisig-wallet-tabs-bottom">
          <div
            class="mutisig-wallet-tabs-content-wrap"
            style="touch-action: pan-x pan-y; position: relative; left: 0%;flex-direction: column"
          >
            <wallet-header :title="$t('locked_position_detail')" />
            <div
              ref="scroll"
              class="scroll-wrapper"
              style="margin-top: 10px; background-color: #fff;height: calc(100% - 50px);"
            >
              <div
                class="scroll-content"
                style="padding:0 14px 5px 14px; min-height: calc(100% + 1px)"
              >
                <div class="pulldown-wrapper">
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

                <div
                  v-for="(item, index) in dataList"
                  :key="index"
                  class="mutisig-wallet-locked-cell"
                  flex="main:center dir:top"
                >
                  <div class="mutisig-wallet-locked-cell-time" flex>
                    {{ item }}
                  </div>
                  <div flex="main:justify cross:center">
                    <div>
                      {{ $t("locked_amount", { colon: "：" })
                      }}{{
                        $t("token_amount", {
                          amount: item,
                          token: $t("moac")
                        })
                      }}
                    </div>
                    <div>
                      {{ $t("locked_percent", { colon: "：" }) }}{{ item }}%
                    </div>
                  </div>
                </div>

                <div v-if="!beforePullUp" class="pullup-wrapper">
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

import WalletHeader from "@/components/header";
BScroll.use(PullDown);
BScroll.use(Pullup);

function getOneRandomList(step = 0) {
  const arr = Array.apply(null, { length: step }).map((...args) => args[1]);
  return arr.sort(() => Math.random() - 0.5);
}

const TIME_BOUNCE = 800;
const TIME_STOP = 600;
const THRESHOLD = 70;
const STOP = 56;
let STEP = 1;

export default {
  components: {
    WalletHeader
  },
  data() {
    return {
      beforePullUp: true,
      isPullUpLoad: false,
      beforePullDown: true,
      isPullingDown: false,
      dataList: getOneRandomList(STEP)
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
        bounceTime: TIME_BOUNCE,
        pullDownRefresh: {
          threshold: THRESHOLD,
          stop: STOP
        },
        pullUpLoad: {
          threshold: THRESHOLD
        }
      });

      this.bscroll.on("pullingDown", this.pullingDownHandler);
      this.bscroll.on("pullingUp", this.pullingUpHandler);
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
      STEP += 1;
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
        this.dataList = newData;
      } catch (err) {
        // handle err
        console.log(err);
      }
    },
    ajaxGet(/* url */) {
      return new Promise(resolve => {
        setTimeout(() => {
          const dataList = getOneRandomList(STEP);
          resolve(dataList);
        }, 1000);
      });
    }
  }
};
</script>
<style lang="scss">
.mutisig-wallet-locked-cell {
  height: 60px;
  font-size: 12px;
  border-bottom: 1px solid #e2e6f1;

  // &:not(:last-of-type) {
  //   border-bottom: 1px solid #e2e6f1;
  // }

  .mutisig-wallet-locked-cell-time {
    margin-bottom: 4px;
  }
}
</style>
