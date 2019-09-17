<template>
  <div class="mutisig-wallet-container">
    <div style="position: fixed; height: 100%; width: 100%; top: 0;">
      <div class="mutisig-wallet-tab-bar">
        <div class="mutisig-wallet-tabs mutisig-wallet-tabs-bottom">
          <div
            class="mutisig-wallet-tabs-content-wrap"
            style="touch-action: pan-x pan-y; position: relative; left: 0%;flex-direction: column"
          >
            <wallet-header :title="$t('recall_voter')" />
            <div
              style="color: #181C24;height:0.86rem; line-height:0.86rem; text-align:left;padding-left:0.3rem;"
            >
              {{ $t("click_to_recall") }}
            </div>
            <div
              ref="scroll"
              class="scroll-wrapper"
              style="background-color: #fff;height: calc(100% - 1.66rem);"
            >
              <div
                flex="dir:top cross: center"
                class="mutisig-wallet-recall-container"
                style="min-height: calc(100% + 0.01rem)"
              >
                <voter-cell v-for="(item, key) in 15" :key="key" />
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
import VoterCell from "@/components/voter-cell";
export default {
  name: "Recall",
  components: {
    WalletHeader,
    VoterCell
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
.mutisig-wallet-recall-container {
  padding: 0 0.3rem;
  background-color: #fff;

  p {
    text-align: left;
    margin-bottom: 0.16rem;
  }
}
</style>
