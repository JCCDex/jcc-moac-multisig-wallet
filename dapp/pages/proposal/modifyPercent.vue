<template>
  <div ref="scroll" class="mutisig-wallet-container">
    <div style="position: fixed; height: 100%; width: 100%; top: 0;">
      <div class="mutisig-wallet-tab-bar">
        <div class="mutisig-wallet-tabs mutisig-wallet-tabs-bottom">
          <div
            class="mutisig-wallet-tabs-content-wrap"
            style="touch-action: pan-x pan-y; position: relative; left: 0%;flex-direction: column"
          >
            <wallet-header :title="$t('vote_percent')" />
            <div
              flex="dir:top cross: center"
              class="mutisig-wallet-modify-percent-container"
            >
              <p>
                {{ $t("current_percent", { percent: "10%" }) }}
              </p>
              <p>{{ $t("modify_percent") }}</p>

              <van-field center type="number">
                <span slot="button" size="small" type="primary">
                  %
                </span>
              </van-field>
              <div flex-box="1" flex="cross:bottom">
                <button
                  class="mutisig-wallet-button mutisig-wallet-confirm-button"
                  style="width: 100%;"
                >
                  {{ $t("modify_confirm") }}
                </button>
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
  name: "Withdraw",
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
.mutisig-wallet-modify-percent-container {
  padding: 0.24rem 0.3rem 0.3rem;
  height: calc(100% - 0.8rem);
  color: #181c24;

  p {
    text-align: left;
    margin-bottom: 0.16rem;
  }
}
</style>
