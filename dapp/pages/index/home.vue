<template>
  <div ref="scroll" class="scroll-wrapper">
    <div class="scroll-content">
      <home-header :lock-amount="lockAmount" :address="address" :vote-amount="voteAmount" />
      <home-middle />
      <home-message :messages="proposals">
        <div flex="main:justify cross:center" class="multisig-wallet-message-header">
          <div style="border-left: 0.04rem solid #0B1F5D; padding-left: 0.08rem;color: #242D3D">
            {{ $t("latest_message") }}
          </div>
          <div class="multisig-wallet-small-font-size" style="color: #A6A8B2;" @click="goto('/message')">
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
import tpInfo from "@/js/tp";
import accountInfo from "@/js/account";
import multisigContractInstance from "@/js/contract";

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
      lockAmount: "0",
      voteAmount: 0,
      address: "",
      proposals: []
    };
  },
  async asyncData() {
    try {
      let lockAmount, voteAmount;
      const isVoter = await accountInfo.isVoter();
      const address = await tpInfo.getAddress();
      const node = await tpInfo.getNode();
      const instance = multisigContractInstance.init(node);
      if (isVoter) {
        // request all voting proposal count
        voteAmount = await instance.getVotingCount();
      } else {
        // request my voting proposal count
        voteAmount = await instance.getMyVotingCount(address);
      }
      lockAmount = await instance.getBalance(address);
      let proposalIds = await instance.getAllVotingTopicIds();
      const props = [];
      if (proposalIds.length > 10) {
        // show max length is 10
        proposalIds = proposalIds.slice(0, 10);
      }
      for (const id of proposalIds) {
        props.push(instance.getTopic(id));
      }
      const proposals = await Promise.all(props);
      return { lockAmount, voteAmount, proposals };
    } catch (error) {
      console.log("init home data error: ", error);
    }
  },
  mounted() {
    this.init();
    tpInfo.getAddress().then(address => {
      this.address = address || "";
    });
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
