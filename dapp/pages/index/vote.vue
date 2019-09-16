<template>
  <div class="mutisig-wallet-container">
    <div style="position: fixed; height: 100%; width: 100%; top: 0;">
      <div class="mutisig-wallet-tab-bar">
        <div class="mutisig-wallet-tabs mutisig-wallet-tabs-bottom">
          <div
            class="mutisig-wallet-tabs-content-wrap"
            style="touch-action: pan-x pan-y; position: relative; left: 0%;flex-direction: column;"
          >
            <vote-header />
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

export default {
  components: {
    VoteHeader,
    VoteProposal,
    VoteBottom
  }
};
</script>
