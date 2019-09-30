<template>
  <div class="multisig-wallet-home-message-container">
    <slot />
    <message-cell v-for="(message, index) in messages" :key="index" :proposal="message" />
    <div v-if="messages.length === 0" style="background-color:  #f2f4fb">
      <empty-content />
    </div>
  </div>
</template>
<script>
import MessageCell from "@/components/message/message-cell";
import emptyContent from "@/components/empty";

export default {
  components: {
    MessageCell,
    emptyContent
  },
  props: {
    messages: {
      default() {
        return [];
      },
      type: Array
    }
  }
};
</script>
<style lang="scss">
.multisig-wallet-home-message-container {
  background-color: #fff;
}
</style>
