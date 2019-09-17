<template>
  <div style="padding:0.26rem 0 0.1rem 0;">
    <div flex="main:justify cross:center" style="padding:0 0.5rem;">
      <button
        class="mutisig-wallet-button mutisig-wallet-recall-button"
        style="width: 3rem;"
        flex="main:center cross:center"
      >
        <div
          class="mutisig-wallet-icon-circle"
          flex="main:center cross:center"
          style="margin-right: 0.13rem;"
        >
          <svg class="mutisig-wallet-icon" aria-hidden="true">
            <use xlink:href="#icon-recall-voter" />
          </svg>
        </div>
        {{ $t("recall-voter") }}
      </button>

      <button
        class="mutisig-wallet-button mutisig-wallet-vote-button"
        style="width: 3rem;min-width: 300px;"
        flex="main:center cross:center"
        @click="goto('/proposal/modifyPercent')"
      >
        <div
          class="mutisig-wallet-icon-circle"
          flex="main:center cross:center"
          style="margin-right: 0.13rem;"
        >
          <svg class="mutisig-wallet-icon" aria-hidden="true">
            <use xlink:href="#icon-vote-percent" />
          </svg>
        </div>
        {{ $t("vote_percent") }}
      </button>
    </div>

    <div
      flex="main:center cross:center"
      class="mutisig-wallet-proposal-choose-container mutisig-wallet-large-font-size"
    >
      <p class="active" style="margin-right: 1.5rem">
        待决提案
      </p>
      <p>已决提案</p>
    </div>
  </div>
</template>
<script>
export default {
  name: "VoteHeader",
  methods: {
    goto(route) {
      this.$router.push(route);
    }
  }
};
</script>

<style lang="scss">
.mutisig-wallet-proposal-choose-container {
  height: 0.8rem;
  line-height: 0.8rem;
  background-color: #fff;
  margin-top: 0.26rem;
  > p {
    height: 100%;
    color: #5d637f;

    &.active {
      color: #0b1f5d;
      border-bottom: 0.02rem solid #0b1f5d;
    }
  }
}
</style>
