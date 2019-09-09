<template>
  <div class="mutisig-wallet-container">
    <div style="position: fixed; height: 100%; width: 100%; top: 0px;">
      <div class="mutisig-wallet-tab-bar">
        <div class="mutisig-wallet-tabs mutisig-wallet-tabs-bottom">
          <div
            class="mutisig-wallet-tabs-content-wrap"
            style="touch-action: pan-x pan-y; position: relative; left: 0%;"
          >
            <nuxt-child />
          </div>
          <div class="mutisig-wallet-tab-bar-wrap">
            <div class="mutisig-wallet-tab-bar-item-wrap">
              <router-link
                v-for="(item, key) in tabs"
                :key="key"
                class="mutisig-wallet-tab-bar-item"
                :to="item.componentId"
              >
                {{ $t(item.tab) }}
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Main",
  data() {
    return {
      tabs: [
        {
          componentId: "/home",
          tab: "home"
        },
        {
          componentId: "/vote",
          tab: "vote"
        },
        {
          componentId: "/mine",
          tab: "mine"
        }
      ]
    };
  }
};
</script>
