<template>
  <Scroll ref="scroll" class="scroll-wrapper">
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
  </Scroll>
</template>

<script>
import HomeHeader from "@/components/home/home-header";
import HomeMiddle from "@/components/home/home-middle";
import HomeMessage from "@/components/home/home-message";
import tpInfo from "@/js/tp";
import accountInfo from "@/js/account";
import multisigContractInstance from "@/js/contract";
import scrollMixin from "@/mixins/scroll";
import votingCache from "@/js/votingProposalCache";

export default {
  name: "Home",
  components: {
    HomeHeader,
    HomeMiddle,
    HomeMessage
  },
  mixins: [scrollMixin],
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
      return { lockAmount, voteAmount };
    } catch (error) {
      console.log("init home data error: ", error);
    }
  },
  mounted() {
    tpInfo.getAddress().then(address => {
      this.address = address || "";
    });
  },
  created() {
    this.initMessages();
  },
  methods: {
    goto(route) {
      this.$router.push(route);
    },
    async initMessages() {
      try {
        const proposals = await votingCache.get();
        this.proposals = proposals.slice(0, 10);
      } catch (error) {
        console.log(error);
        this.proposals = [];
      }
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
