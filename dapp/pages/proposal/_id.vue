<template>
  <div class="multisig-wallet-container">
    <div style="position: fixed; height: 100%; width: 100%; top: 0;">
      <div class="multisig-wallet-tab-bar">
        <div class="multisig-wallet-tabs multisig-wallet-tabs-bottom">
          <div class="multisig-wallet-tabs-content-wrap" style="touch-action: pan-x pan-y; position: relative; left: 0%;flex-direction: column">
            <wallet-header :title="$t('proposal_detail')" />
            <div class="scroll-wrapper" style="height: calc(100% - 0.8rem);">
              <div flex="dir:top cross: center" class="multisig-wallet-proposal-detail-container">
                <Scroll ref="scroll">
                  <p>{{ $t("proposal.content") + proposalWholeContent }}</p>
                  <p>{{ $t("proposal.type") + proposalType }}</p>
                  <p>{{ $t("proposal.sponsor") + proposal.sponsor }}</p>
                  <p>{{ $t("proposal.start") + startTime }}</p>
                  <p>{{ $t("proposal.end") + endTime }}</p>
                  <p>
                    <span>{{ $t("proposal.state") }}</span>
                    <span style="color: #375CCF">{{ voteState }}</span>
                  </p>
                  <p v-if="proposal.flag">
                    {{ $t("proposal.percent") + percent + "%" }}
                  </p>
                  <p v-if="proposal.flag">
                    {{ $t("proposal.result") + voteResult }}
                  </p>
                  <p>
                    {{ $t("proposal.voters") + votersCount }}
                  </p>
                  <div style="height: 0.06rem;border-radius:0.06rem;margin-bottom:0.32rem;" flex>
                    <div style="background-color: #476EEA;height:100%;" :style="{ width: (agreePercent * 100).toFixed(2) + '%' }" />
                    <div style="background-color: #F87272;height:100%;" :style="{ width: (againstPercent * 100).toFixed(2) + '%' }" />
                    <div style="background-color: #94A5D7;height:100%;" :style="{ width: (unVotedPercent * 100).toFixed(2) + '%' }" />
                  </div>
                  <div flex>
                    <button class="multisig-wallet-button multisig-wallet-small-button" style="position:relative; width:50%; background-color: #476EEA;border-radius:0;" @click="currentVoters = agreeVoters">
                      {{ $t("approval") }}
                      <div style="position:absolute;height:0.6rem;top:0;right:0.2rem" flex="main:center cross:center">
                        <svg class="multisig-wallet-icon multisig-wallet-icon-smaller" aria-hidden="true" style="margin-right: 0.05rem;">
                          <use xlink:href="#icon-agree" />
                        </svg>
                        {{ agreeVoters.length }}
                      </div>
                    </button>
                    <button class="multisig-wallet-button multisig-wallet-small-button" style="position:relative; width:50%; background-color: #F87272;border-radius:0;" @click="currentVoters = aganistVoters">
                      {{ $t("against") }}
                      <div style="position:absolute;height:0.6rem;top:0;right:0.2rem" flex="main:center cross:center">
                        <svg class="multisig-wallet-icon multisig-wallet-icon-smaller" aria-hidden="true" style="margin-right: 0.05rem;margin-top:0.04rem;">
                          <use xlink:href="#icon-against" />
                        </svg>
                        {{ aganistVoters.length }}
                      </div>
                    </button>
                  </div>

                  <div style="background-color: #fff;">
                    <div v-for="(item, index) in currentVoters" :key="index" style="padding:0.2rem 0.3rem 0.2rem 0.2rem">
                      <p style="color:#181C24">
                        {{ item.voter }}
                      </p>
                      <p class="multisig-wallet-small-font-size" style="color: #6B6E73;margin-left:0.16rem;">
                        {{ formatTime(item.timestamp) }}
                      </p>
                    </div>
                  </div>
                </Scroll>
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
import proposalMixin from "@/mixins/proposal";
import accountInfo from "@/js/account";
import multisigContractInstance from "@/js/contract";
import tinydate from "tinydate";
import tpInfo from "@/js/tp";
import scrollMixin from "@/mixins/scroll";
import BigNumber from "bignumber.js";

export default {
  name: "ProposalDetail",
  components: {
    WalletHeader
  },
  mixins: [proposalMixin, scrollMixin],
  data() {
    return {
      proposal: {},
      voteDetails: [],
      allVoters: [],
      currentVoters: []
    };
  },
  computed: {
    agreeVoters() {
      return this.voteDetails.filter(data => data.flag);
    },
    aganistVoters() {
      return this.voteDetails.filter(data => !data.flag);
    },
    votersCount() {
      if (this.proposal.flag) {
        return parseInt(this.proposal.voters);
      }
      return this.allVoters.length;
    },
    agreePercent() {
      return this.agreeVoters.length / this.votersCount;
    },
    againstPercent() {
      return this.aganistVoters.length / this.votersCount;
    },
    unVotedPercent() {
      return 1 - this.agreePercent - this.againstPercent;
    },
    percent() {
      if (this.proposal.flag) {
        return this.proposal.percent;
      }
      return 0;
    },
    voteResult() {
      if (!this.proposal.flag) {
        return "";
      }

      if (new BigNumber(this.againstPercent).multipliedBy(100).isGreaterThanOrEqualTo(this.percent)) {
        return this.$t("proposal_cell.reject");
      }
      if (new BigNumber(this.agreePercent).multipliedBy(100).isGreaterThanOrEqualTo(this.percent)) {
        return this.$t("proposal_cell.pass");
      }
      return this.$t("proposal_cell.timeout");
    }
  },
  async asyncData({ params }) {
    try {
      const node = await tpInfo.getNode();
      const inst = multisigContractInstance.init(node);
      const proposal = await inst.getTopic(params.id);
      let voteDetails = [];
      if (proposal.yesCount !== "0" || proposal.noCount !== "0") {
        voteDetails = await inst.getVoteDetailsByTopic(params.id);
      }
      const allVoters = await accountInfo.getVoters();
      return { proposal, voteDetails, allVoters };
    } catch (error) {
      console.log("request topic detail error: ", error);
    }
  },
  mounted() {
    this.currentVoters = this.agreeVoters;
  },
  updated() {
    this.$refs.scroll && this.$refs.scroll.refresh();
  },
  deactivated() {
    this.$destroy();
  },
  methods: {
    formatTime(timestamp) {
      return tinydate("{YYYY}-{MM}-{DD} {HH}:{mm}:{ss}")(new Date(parseInt(timestamp)));
    }
  }
};
</script>
<style lang="scss">
.multisig-wallet-proposal-detail-container {
  padding: 0.24rem 0.3rem 0 0.3rem;
  height: 100%;

  p {
    text-align: left;
    margin-bottom: 0.2rem;
  }
}
</style>
