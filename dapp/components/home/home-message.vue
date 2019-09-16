<template>
  <div class="mutisig-wallet-home-message-container">
    <slot />
    <message-cell
      v-for="(message, index) in messages"
      :key="index"
      :message="message"
    />
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
      type: Array,
      default() {
        return [
          { type: 0 },
          { type: 1 },
          { type: 2 },
          { type: 3 },
          { type: 4 }
        ];
      }
    }
  }
};
</script>
<style lang="scss">
.mutisig-wallet-home-message-container {
  background-color: #fff;
}
</style>
