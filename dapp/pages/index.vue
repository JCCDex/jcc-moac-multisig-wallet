<template>
  <div class="mutisig-wallet-container">
    <div style="position: fixed; height: 100%; width: 100%; top: 0;">
      <div class="mutisig-wallet-tab-bar">
        <div class="mutisig-wallet-tabs mutisig-wallet-tabs-bottom">
          <div
            class="mutisig-wallet-tabs-content-wrap"
            style="touch-action: pan-x pan-y; position: relative; left: 0%;"
          >
            <nuxt-child keep-alive />
          </div>
          <div
            class="mutisig-wallet-tab-bar-wrap"
            style="background-color: #fff;"
          >
            <div class="mutisig-wallet-tab-bar-item-wrap">
              <div
                v-for="(tab, key) in tabs"
                :key="key"
                flex="main:center cross:center"
                class="mutisig-wallet-tab-bar-item"
                @click="goto(tab)"
              >
                <svg class="mutisig-wallet-icon" aria-hidden="true">
                  <use
                    :xlink:href="
                      tab.to === currentRoute ? tab.activeIcon : tab.icon
                    "
                  />
                </svg>
                <div
                  style="margin-top: 0.05rem;"
                  class="mutisig-wallet-small-font-size"
                  :style="{ color: tab.to === currentRoute ? '#0B1F5D' : '' }"
                >
                  {{ $t(tab.name) }}
                </div>
              </div>
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
          to: "/home",
          name: "home",
          activeIcon: "#icon-home-selected",
          icon: "#icon-home"
        },
        {
          to: "/vote",
          name: "vote",
          activeIcon: "#icon-vote-selected",
          icon: "#icon-vote"
        },
        {
          to: "/mine",
          name: "mine",
          activeIcon: "#icon-mine-selected",
          icon: "#icon-mine"
        }
      ]
    };
  },
  computed: {
    currentRoute() {
      return this.$route.path;
    }
  },
  methods: {
    goto(cell) {
      this.$router.push(cell.to);
    }
  }
};
</script>
