<template>
  <div class="multisig-wallet-container">
    <div style="position: fixed; height: 100%; width: 100%; top: 0;">
      <div class="multisig-wallet-tab-bar">
        <div class="multisig-wallet-tabs multisig-wallet-tabs-bottom">
          <div
            class="multisig-wallet-tabs-content-wrap"
            style="touch-action: pan-x pan-y; position: relative; left: 0%;flex-direction: column"
          >
            <wallet-header :title="$t('copyright')" />
            <div style="margin-top: 1rem;">
              <div class="multisig-wallet-icon-jingchang" />
              <div style="margin-top: 0.24rem;">
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
