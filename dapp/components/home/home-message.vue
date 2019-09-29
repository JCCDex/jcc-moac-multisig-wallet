<template>
  <div class="multisig-wallet-home-message-container">
    <slot />
    <message-cell v-for="(message, index) in messages" :key="index" :proposal="message" />
  </div>
</template>
<script>
import MessageCell from "@/components/message/message-cell";
import multisigContractInstance from "@/js/contract";
import tpInfo from "@/js/tp";

export default {
  components: {
    MessageCell
  },
  data() {
    return {
      messages: []
    };
  },
  created() {
    this.requestVotingProposals();
  },
  methods: {
    async requestVotingProposals() {
      try {
        const node = await tpInfo.getNode();
        const instance = multisigContractInstance.init(node);
        let proposalIds = await instance.getAllVotingTopicIds();
        const props = [];
        if (proposalIds.length > 10) {
          // show max length is 10
          proposalIds = proposalIds.slice(0, 10);
        }
        for (const id of proposalIds) {
          props.push(instance.getTopic(id));
        }
        const responses = await Promise.all(props);
        this.messages = responses;
      } catch (error) {
        console.log("reqeust voting proposal error: ", error);
      }
    }
  }
};
</script>
<style lang="scss">
.multisig-wallet-home-message-container {
  background-color: #fff;
}
</style>
