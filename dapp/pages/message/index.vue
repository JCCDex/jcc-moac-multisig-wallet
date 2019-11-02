<template>
  <div class="multisig-wallet-container">
    <div style="position: fixed; height: 100%; width: 100%; top: 0;">
      <div class="multisig-wallet-tab-bar">
        <div class="multisig-wallet-tabs multisig-wallet-tabs-bottom">
          <div class="multisig-wallet-tabs-content-wrap" style="touch-action: pan-x pan-y; position: relative; left: 0%;flex-direction: column">
            <div class="scroll-wrapper" style="margin-top: 0.1rem; background-color: #fff;height: calc(100% - 0.1rem);">
              <Scroll ref="scroll" class="scroll-content" :options="options" style="position: relative;" @pulling-down="pullingDownHandler">
                <message-cell v-for="(message, index) in messages" :key="index" :proposal="message" />
                <empty-content v-if="messages.length === 0" />
              </Scroll>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MessageCell from "@/components/message/message-cell";
import emptyContent from "@/components/empty";
import scrollMixin from "@/mixins/scroll";
import votingCache from "@/js/votingProposalCache";

export default {
  name: "Messages",
  components: {
    MessageCell,
    emptyContent
  },
  mixins: [scrollMixin],
  data() {
    return {
      messages: []
    };
  },
  computed: {
    options() {
      return {
        pullDownRefresh: {
          txt: this.$t("pull_down_refresh_success")
        }
      };
    }
  },
  deactivated() {
    this.$destroy();
  },
  created() {
    this.initMessages();
  },
  methods: {
    async pullingDownHandler() {
      await this.initMessages();
      setTimeout(() => {
        this.$refs.scroll.forceUpdate(true);
      }, 2000);
    },
    async initMessages() {
      try {
        const proposals = await votingCache.get();
        this.messages = proposals;
      } catch (error) {
        console.log(error);
        this.messages = [];
      }
    }
  }
};
</script>
