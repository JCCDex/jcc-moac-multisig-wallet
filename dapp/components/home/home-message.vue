<template>
  <div class="multisig-wallet-home-message-container">
    <slot />
    <message-cell v-for="(message, index) in messages" :key="index" :proposal="message" />
  </div>
</template>
<script>
import MessageCell from "@/components/message/message-cell";

export default {
  components: {
    MessageCell
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
