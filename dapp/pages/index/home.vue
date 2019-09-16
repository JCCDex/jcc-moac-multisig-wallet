<template>
  <div ref="scroll" class="scroll-wrapper">
    <div class="scroll-content">
      <home-header
        :lock-amount="lockAmount"
        :address="address"
        :vote-amount="voteAmount"
      />
      <home-middle />
      <home-message>
        <div
          flex="main:justify cross:center"
          class="multisig-wallet-message-header"
        >
          <div
            style="border-left: 0.04rem solid #0B1F5D; padding-left: 0.08rem;color: #242D3D"
          >
            {{ $t("latest_message") }}
          </div>
          <div
            class="mutisig-wallet-small-font-size"
            style="color: #A6A8B2;"
            @click="goto('/message')"
          >
            {{ $t("more_messages") }}
          </div>
        </div>
      </home-message>
    </div>
  </div>
</template>

<script>
import BScroll from "@better-scroll/core";
import HomeHeader from "@/components/home/home-header";
import HomeMiddle from "@/components/home/home-middle";
import HomeMessage from "@/components/home/home-message";

export default {
  name: "Home",
  components: {
    HomeHeader,
    HomeMiddle,
    HomeMessage
  },
  data() {
    return {
      bs: null,
      lockAmount: 0,
      voteAmount: 8,
      address: "0xdkwim2swijkdksyw7nuifncxvdrqskd9fkffqsljkwyrtsfkvn4fkwkxmiel"
    };
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
    },
    goto(route) {
      this.$router.push(route);
    }
  }
};
</script>
<style lang="scss">
.multisig-wallet-message-header {
  height: 0.8rem;
  margin: 0 0.3rem;
  border-bottom: 0.01rem solid #e2e6f1;
}
</style>
