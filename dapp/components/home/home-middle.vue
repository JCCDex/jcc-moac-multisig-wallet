<template>
  <div flex="main:justify cross:center" style="padding:0.26rem 0.5rem;">
    <button
      class="mutisig-wallet-button mutisig-wallet-lock-button"
      style="width: 3rem;"
      flex="main:center cross:center"
      @click="goto('/locked')"
    >
      <div
        class="mutisig-wallet-icon-circle"
        flex="main:center cross:center"
        style="margin-right: 0.3rem;"
      >
        <svg class="mutisig-wallet-icon" aria-hidden="true">
          <use xlink:href="#icon-locked" />
        </svg>
      </div>
      {{ $t("to_lock") }}
    </button>

    <button
      class="mutisig-wallet-button mutisig-wallet-withdraw-button"
      style="width: 3rem;"
      flex="main:center cross:center"
      @click="goto('/withdraw')"
    >
      <div
        class="mutisig-wallet-icon-circle"
        flex="main:center cross:center"
        style="margin-right: 0.3rem;"
      >
        <svg class="mutisig-wallet-icon" aria-hidden="true">
          <use xlink:href="#icon-withdraw" />
        </svg>
      </div>
      {{ $t("to_withdraw") }}
    </button>
  </div>
</template>
<script>
export default {
  name: "HomeMiddle",
  methods: {
    goto(route) {
      this.$router.push(route);
    }
  }
};
</script>
