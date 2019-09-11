<template>
  <div class="mutisig-wallet-container">
    <div style="position: fixed; height: 100%; width: 100%; top: 0px;">
      <div class="mutisig-wallet-tab-bar">
        <div class="mutisig-wallet-tabs mutisig-wallet-tabs-bottom">
          <div
            class="mutisig-wallet-tabs-content-wrap"
            style="touch-action: pan-x pan-y; position: relative; left: 0%;flex-direction: column"
          >
            <wallet-header :title="$t('copyright')" />
            <div style="margin-top: 50px;">
              <div class="mutisig-wallet-icon-jingchang" />
              <div style="margin-top: 12px;">
                {{ $t("company") }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import WalletHeader from "@/components/header";
export default {
  components: {
    WalletHeader
  }
};
</script>
