<template>
  <div class="multisig-wallet-container">
    <div style="position: fixed; height: 100%; width: 100%; top: 0;">
      <div class="multisig-wallet-tab-bar">
        <div class="multisig-wallet-tabs multisig-wallet-tabs-bottom">
          <div class="multisig-wallet-tabs-content-wrap" style="touch-action: pan-x pan-y; position: relative; left: 0%;flex-direction: column">
            <wallet-header :title="$t('withdraw_detail')" />
            <div ref="scroll" class="scroll-wrapper" style="margin-top: 0.1rem; background-color: #fff;height: calc(100% - 0.9rem);">
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
                <div style="padding:0 0.28rem 0.05rem 0.28rem;">
                  <div v-for="(item, index) in dataList" :key="index" class="multisig-wallet-withdraw-cell" flex="main:center dir:top">
                    <div class="multisig-wallet-withdraw-cell-time" flex>
                      {{ item }}
                    </div>
                    <div flex="main:justify cross:center">
                      <div>
                        {{ $t("withdraw_amount", { colon: "：" })
                        }}{{
                          $t("token_amount", {
                            amount: item,
                            token: $t("moac")
                          })
                        }}
                      </div>
                      <div>{{ $t("withdraw_percent", { colon: "：" }) }}{{ item }}%</div>
                    </div>
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

import WalletHeader from "@/components/header";
BScroll.use(PullDown);

function getOneRandomList(step = 0) {
  const arr = Array.apply(null, { length: step }).map((...args) => args[1]);
  return arr.sort(() => Math.random() - 0.5);
}

const TIME_BOUNCE = 800;
const TIME_STOP = 600;
const THRESHOLD = 70;
const STOP = 56;
let STEP = 10;

export default {
  components: {
    WalletHeader
  },
  data() {
    return {
      beforePullDown: true,
      isPullingDown: false,
      bscroll: null,
      dataList: getOneRandomList(STEP)
    };
  },
  beforeDestroy() {
    if (this.bscroll) {
      this.bscroll.destroy();
      this.bscroll = null;
    }
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
        }
      });

      this.bscroll.on("pullingDown", this.pullingDownHandler);
    },
    async pullingDownHandler() {
      this.beforePullDown = false;
      this.isPullingDown = true;
      await this.requestData();

      this.isPullingDown = false;
      this.finishPullDown();
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
@import "@/style/mixin.scss";

.multisig-wallet-withdraw-cell {
  height: 1.2rem;
  @include px2px("font-size", 12);
  border-bottom: 0.01rem solid #e2e6f1;

  .multisig-wallet-withdraw-cell-time {
    margin-bottom: 0.08rem;
  }
}
</style>
