<template>
  <div class="multisig-wallet-container">
    <div style="position: fixed; height: 100%; width: 100%; top: 0;">
      <div class="multisig-wallet-tab-bar">
        <div class="multisig-wallet-tabs multisig-wallet-tabs-bottom">
          <div class="multisig-wallet-tabs-content-wrap" style="touch-action: pan-x pan-y; position: relative; left: 0%;flex-direction: column;">
            <vote-header :is-voter="isVoter" />
            <vote-proposal />
            <vote-bottom />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VoteHeader from "@/components/vote/vote-header";
import VoteProposal from "@/components/vote/vote-proposal";
import VoteBottom from "@/components/vote/vote-bottom";
import tpInfo from "@/js/tp";
import accountInfo from "@/js/account";
export default {
  name: "Vote",
  components: {
    VoteHeader,
    VoteProposal,
    VoteBottom
  },
  data() {
    return {
      isVoter: false
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
      return { isVoter };
    } catch (error) {
      console.log("get isVoter error: ", error);
    }
  }
};
</script>
