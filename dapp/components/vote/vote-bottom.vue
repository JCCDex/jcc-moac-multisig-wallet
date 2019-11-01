<template>
  <div flex="main:justify cross:center" class="multisig-wallet-vote-bottom-container">
    <div flex="main:justify cross:center" @click="selectAll">
      <svg class="multisig-wallet-icon" aria-hidden="true" style="margin-right: 0.2rem">
        <use :xlink:href="selected ? '#icon-selected' : '#icon-unselected'" />
      </svg>
      <span>{{ $t("select_all") }}</span>
    </div>

    <div flex="main:center cross:center">
      <button class="multisig-wallet-button" :disabled="disable" style="width: 1.4rem;border-radius: 0.4rem;background-color: #476EEA;height:0.7rem;line-height:0.7rem" flex="main:center cross:center" @click="vote(true)">
        <svg class="multisig-wallet-icon multisig-wallet-icon-smaller" aria-hidden="true" style="margin-right: 0.05rem;">
          <use xlink:href="#icon-agree" />
        </svg>
        {{ $t("approval") }}
      </button>
      <button class="multisig-wallet-button" :disabled="disable" style="margin-left:0.3rem;width: 1.4rem;border-radius: 0.4rem;background-color: #F87272;height:0.7rem;line-height:0.7rem" flex="main:center cross:center" @click="vote(false)">
        <svg class="multisig-wallet-icon multisig-wallet-icon-smaller" aria-hidden="true" style="margin-right: 0.05rem;margin-top:0.04rem;">
          <use xlink:href="#icon-against" />
        </svg>
        {{ $t("against") }}
      </button>
    </div>
  </div>
</template>
<script>
import bus from "@/js/bus";

export default {
  data() {
    return {
      selected: false,
      disable: true
    };
  },
  created() {
    bus.$on("selectedProposal", this.selectedProposal);
  },
  beforeDestroy() {
    bus.$off("selectedProposal", this.selectedProposal);
  },
  methods: {
    selectAll() {
      let selected = !this.selected;
      this.selected = selected;
      bus.$emit("selectAll", selected);
      this.disable = !this.selected;
    },
    selectedProposal(isAllSelected, hasSelected) {
      this.selected = isAllSelected;
      this.disable = !hasSelected;
    },
    vote(confirm) {
      bus.$emit("voteProposal", confirm);
    }
  }
};
</script>
<style lang="scss">
.multisig-wallet-vote-bottom-container {
  background-color: #fff;
  height: 1.2rem;
  padding: 0 0.3rem 0 0.5rem;
}
</style>
