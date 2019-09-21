<template>
  <div style="padding:0.26rem 0 0.1rem 0;">
    <div
      v-if="isVoter"
      flex="main:justify cross:center"
      style="padding:0 0.5rem;"
    >
      <button
        class="multisig-wallet-button multisig-wallet-recall-button"
        style="width: 3rem;"
        flex="main:center cross:center"
        @click="goto('/proposal/recall')"
      >
        <div
          class="multisig-wallet-icon-circle"
          flex="main:center cross:center"
          style="margin-right: 0.13rem;"
        >
          <svg class="multisig-wallet-icon" aria-hidden="true">
            <use xlink:href="#icon-recall-voter" />
          </svg>
        </div>
        {{ $t("recall_voter") }}
      </button>

      <button
        class="multisig-wallet-button multisig-wallet-vote-button"
        style="width: 3rem;min-width: 300px;"
        flex="main:center cross:center"
        @click="goto('/proposal/modifyPercent')"
      >
        <div
          class="multisig-wallet-icon-circle"
          flex="main:center cross:center"
          style="margin-right: 0.13rem;"
        >
          <svg class="multisig-wallet-icon" aria-hidden="true">
            <use xlink:href="#icon-vote-percent" />
          </svg>
        </div>
        {{ $t("vote_percent") }}
      </button>
    </div>

    <div v-else flex="main:justify cross:center" style="padding:0 0.5rem;">
      <button
        class="multisig-wallet-button multisig-wallet-apply-button"
        style="width: 100%;"
        flex="main:center cross:center"
      >
        <div
          class="multisig-wallet-icon-circle"
          flex="main:center cross:center"
          style="margin-right: 0.13rem;"
        >
          <svg class="multisig-wallet-icon" aria-hidden="true">
            <use xlink:href="#icon-recall-voter" />
          </svg>
        </div>
        {{ $t("apply_voter") }}
      </button>
    </div>

    <div
      flex="main:center cross:center"
      class="multisig-wallet-proposal-choose-container multisig-wallet-large-font-size"
    >
      <p
        :class="{ active: !isProposed }"
        style="margin-right: 1.5rem"
        @click="changeProposalType('toPropose')"
      >
        {{ $t("undetermined_proposal") }}
      </p>
      <p
        :class="{ active: isProposed }"
        @click="changeProposalType('proposed')"
      >
        {{ $t("voted_proposal") }}
      </p>
    </div>
  </div>
</template>
<script>
import bus from "@/js/bus";

export default {
  name: "VoteHeader",
  props: {
    isVoter: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      type: "toPropose"
    };
  },
  computed: {
    isProposed() {
      return this.type === "proposed";
    }
  },
  methods: {
    goto(route) {
      this.$router.push(route);
    },
    changeProposalType(type) {
      this.type = type;
      bus.$emit("changeProposalType", type);
    }
  }
};
</script>

<style lang="scss">
.multisig-wallet-proposal-choose-container {
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
