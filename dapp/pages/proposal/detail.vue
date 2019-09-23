<template>
  <div class="multisig-wallet-container">
    <div style="position: fixed; height: 100%; width: 100%; top: 0;">
      <div class="multisig-wallet-tab-bar">
        <div class="multisig-wallet-tabs multisig-wallet-tabs-bottom">
          <div class="multisig-wallet-tabs-content-wrap" style="touch-action: pan-x pan-y; position: relative; left: 0%;flex-direction: column">
            <wallet-header :title="$t('proposal_detail')" />
            <div ref="scroll" class="scroll-wrapper" style="height: calc(100% - 0.8rem);">
              <div flex="dir:top cross: center" class="multisig-wallet-proposal-detail-container">
                <p>提案简称：0xdj……wiskd申请成为投票人</p>
                <p>议题类型：申请投票</p>
                <p>发起人：skeef</p>
                <p>发起时间：2019-10-06</p>
                <p>失效时间：2019-10-09</p>
                <p>
                  <span>投票状态：</span>
                  <span style="color: #375CCF">投票中</span>
                </p>
                <div style="height: 0.06rem;border-radius:0.06rem;margin-bottom:0.32rem;" flex>
                  <div style="width: 35%; background-color: #476EEA;height:100%;" />
                  <div style="width: 15%; background-color: #F87272;height:100%;" />
                  <div style="width: 50%; background-color: #94A5D7;height:100%;" />
                </div>
                <div flex>
                  <button class="multisig-wallet-button multisig-wallet-small-button" style="position:relative; width:50%; background-color: #476EEA;border-radius:0;">
                    赞成

                    <div style="position:absolute;height:0.6rem;top:0;right:0.2rem" flex="main:center cross:center">
                      <svg class="multisig-wallet-icon multisig-wallet-icon-smaller" aria-hidden="true" style="margin-right: 0.05rem;">
                        <use xlink:href="#icon-agree" />
                      </svg>
                      5
                    </div>
                  </button>
                  <button class="multisig-wallet-button multisig-wallet-small-button" style="position:relative; width:50%; background-color: #F87272;border-radius:0;">
                    反对
                    <div style="position:absolute;height:0.6rem;top:0;right:0.2rem" flex="main:center cross:center">
                      <svg class="multisig-wallet-icon multisig-wallet-icon-smaller" aria-hidden="true" style="margin-right: 0.05rem;margin-top:0.04rem;">
                        <use xlink:href="#icon-against" />
                      </svg>
                      1
                    </div>
                  </button>
                </div>

                <div style="background-color: #fff;">
                  <div v-for="(item, index) in 5" :key="index" style="padding:0.2rem 0.3rem 0.2rem 0.2rem">
                    <p style="color:#181C24">
                      1.ox2sjmdsjim8wksklmvn0wkd1nsjew8nadietwimrl
                    </p>
                    <p class="multisig-wallet-small-font-size" style="color: #6B6E73;margin-left:0.16rem;">
                      2019-10-07 10:30:29
                    </p>
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
import WalletHeader from "@/components/header";
export default {
  name: "Recall",
  components: {
    WalletHeader
  },
  data() {
    return {};
  },
  mounted() {
    this.init();
  },
  updated() {
    this.bs.refresh();
  },
  beforeDestroy() {
    this.bs.destroy();
  },
  methods: {
    init() {
      this.bs = new BScroll(this.$refs.scroll, {
        scrollY: true,
        click: true
      });
    }
  }
};
</script>
<style lang="scss">
.multisig-wallet-proposal-detail-container {
  padding: 0.24rem 0.3rem 0 0.3rem;

  p {
    text-align: left;
    margin-bottom: 0.2rem;
  }
}
</style>
