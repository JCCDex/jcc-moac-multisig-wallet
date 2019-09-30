<template>
  <div class="multisig-wallet-container">
    <div style="position: fixed; height: 100%; width: 100%; top: 0;">
      <div class="multisig-wallet-tab-bar">
        <div class="multisig-wallet-tabs multisig-wallet-tabs-bottom">
          <div class="multisig-wallet-tabs-content-wrap" style="touch-action: pan-x pan-y; position: relative; left: 0%;flex-direction: column;">
            <vote-header :is-voter="isVoter" />
            <component :is="componentId" :is-voter="isVoter" :address="address" />
            <vote-bottom v-show="isVoter && componentId === 'VotingProposalList'" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VoteHeader from "@/components/vote/vote-header";
import VotingProposalList from "@/components/vote/voting-proposal-list";
import VotedProposalList from "@/components/vote/voted-proposal-list";
import VoteBottom from "@/components/vote/vote-bottom";
import tpInfo from "@/js/tp";
import accountInfo from "@/js/account";
import bus from "@/js/bus";

export default {
  name: "Vote",
  components: {
    VoteHeader,
    VoteBottom,
    VotingProposalList,
    VotedProposalList
  },
  data() {
    return {
      isVoter: false,
      componentId: "VotingProposalList",
      address: ""
    };
  },
  async asyncData() {
    let address;
    try {
      if (process.env.NODE_ENV === "development") {
        address = process.env.MOAC_ADDRESS;
      } else {
        address = await tpInfo.getAddress();
      }
      const isVoter = await accountInfo.isVoter(address);
      return { isVoter, address };
    } catch (error) {
      console.log("get isVoter error: ", error);
    }
  },
  created() {
    bus.$on("changeProposalType", this.changeProposalComponent);
  },
  beforeDestroy() {
    bus.$off("changeProposalType", this.changeProposalComponent);
  },
  methods: {
    changeProposalComponent(id) {
      console.log(id);
      if (this.componentId === id) {
        return;
      }
      this.componentId = id;
    }
  }
};
</script>
