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
import tpInfo from "@/js/tp";
import multisigContractInstance from "@/js/contract";
import emptyContent from "@/components/empty";
import accountInfo from "@/js/account";
import scrollMixin from "@/mixins/scroll";

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
  async asyncData() {
    try {
      const node = await tpInfo.getNode();
      const instance = multisigContractInstance.init(node);
      const isVoter = await accountInfo.isVoter();

      let proposalIds;
      if (isVoter) {
        proposalIds = await instance.getAllVotingTopicIds();
      } else {
        const address = await tpInfo.getAddress();
        proposalIds = await instance.getAllMyVotingTopicIds(address);
      }

      const props = [];
      for (const id of proposalIds) {
        props.push(instance.getTopic(id));
      }
      const proposals = await Promise.all(props);
      return { messages: proposals };
    } catch (error) {
      console.log("init messages data error: ", error);
    }
  },
  deactivated() {
    this.$destroy();
  },
  methods: {
    async pullingDownHandler() {
      await this.requestData();
      setTimeout(() => {
        this.$refs.scroll.forceUpdate(true);
      }, 2000);
    },
    async requestData() {
      try {
        const node = await tpInfo.getNode();
        const instance = multisigContractInstance.init(node);
        const isVoter = await accountInfo.isVoter();

        let proposalIds;
        if (isVoter) {
          proposalIds = await instance.getAllVotingTopicIds();
        } else {
          const address = await tpInfo.getAddress();
          proposalIds = await instance.getAllMyVotingTopicIds(address);
        }

        const props = [];
        for (const id of proposalIds) {
          props.push(instance.getTopic(id));
        }
        const proposals = await Promise.all(props);
        this.messages = proposals;
      } catch (error) {
        console.log("init messages data error: ", error);
      }
    }
  }
};
</script>
