<template>
  <div class="multisig-wallet-home-message-container">
    <slot />
    <message-cell
      v-for="(message, index) in messages"
      :key="index"
      :message="message"
    />
  </div>
</template>
<script>
import MessageCell from "./message-cell";
export default {
  components: {
    MessageCell
  },
  props: {
    messages: {
      type: Array,
      default() {
        return [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
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
