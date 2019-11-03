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
  activated() {
    this.initData();
  },
  methods: {
    goto(route) {
      this.$router.push(route);
    },
    async initData() {
      try {
        const address = await tpInfo.getAddress();
        this.address = address || "";
        const isVoter = await accountInfo.isVoter();
        const node = await tpInfo.getNode();
        const instance = multisigContractInstance.init(node);
        const lockAmount = await instance.getBalance(address);
        let voteAmount;
        if (isVoter) {
          // request all voting proposal count
          voteAmount = await instance.getVotingCount();
        } else {
          // request my voting proposal count
          voteAmount = await instance.getMyVotingCount(address);
        }
        this.voteAmount = voteAmount;
        this.lockAmount = lockAmount;
      } catch (error) {
        console.log(error);
      }

      try {
        const proposals = await votingCache.get();
        if (proposals) {
          this.proposals = proposals.slice(0, 10);
        }
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
