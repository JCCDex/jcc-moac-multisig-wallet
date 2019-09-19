<template>
  <div
    flex="main:justify cross:center"
    class="multisig-wallet-vote-bottom-container"
  >
    <div flex="main:justify cross:center">
      <svg
        class="multisig-wallet-icon"
        aria-hidden="true"
        style="margin-right: 0.2rem"
      >
        <use xlink:href="#icon-unselected" />
      </svg>
      <span>全选</span>
    </div>

    <div flex="main:center cross:center">
      <button
        class="multisig-wallet-button"
        style="width: 1.4rem;border-radius: 0.4rem;background-color: #476EEA;height:0.7rem;line-height:0.7rem"
        flex="main:center cross:center"
      >
        <svg
          class="multisig-wallet-icon multisig-wallet-icon-smaller"
          aria-hidden="true"
          style="margin-right: 0.05rem;"
        >
          <use xlink:href="#icon-agree" />
        </svg>
        赞成
      </button>
      <button
        class="multisig-wallet-button"
        style="margin-left:0.3rem;width: 1.4rem;border-radius: 0.4rem;background-color: #F87272;height:0.7rem;line-height:0.7rem"
        flex="main:center cross:center"
      >
        <svg
          class="multisig-wallet-icon multisig-wallet-icon-smaller"
          aria-hidden="true"
          style="margin-right: 0.05rem;margin-top:0.04rem;"
        >
          <use xlink:href="#icon-against" />
        </svg>
        反对
      </button>
    </div>
  </div>
</template>
<script>
export default {};
</script>
<style lang="scss">
.multisig-wallet-vote-bottom-container {
  background-color: #fff;
  height: 1.2rem;
  padding: 0 0.3rem 0 0.5rem;
}
</style>
