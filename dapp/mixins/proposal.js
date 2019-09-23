import { format } from "timeago.js";
import BigNumber from "bignumber.js";
import { TYPE_CONFIG_COUNT, TYPE_CONFIG_PERCENT, TYPE_WITHDRAW, TYPE_VOTE, TYPE_RECALL } from "@/js/constant";
export default {
  computed: {
    proposalTitle() {
      let voteType = this.proposal.voteType;
      if (voteType === TYPE_CONFIG_COUNT) {
        return "";
      }
      if (voteType === TYPE_CONFIG_PERCENT) {
        return this.$t("proposal_cell.modify_pass_percent_title");
      }
      if (voteType === TYPE_WITHDRAW) {
        return this.$t("proposal_cell.withdraw_title");
      }
      if (voteType === TYPE_VOTE) {
        return this.$t("proposal_cell.apply_voter_title");
      }
      if (voteType === TYPE_RECALL) {
        return this.$t("proposal_cell.recall_voter_title");
      }
    },
    proposalSimpleContent() {
      let { voteType, sponsor, target, value } = this.proposal;

      if (voteType === TYPE_CONFIG_COUNT) {
        return "";
      }
      if (voteType === TYPE_CONFIG_PERCENT) {
        return "";
      }
      if (voteType === TYPE_WITHDRAW) {
        return this.$t("proposal_cell.withdraw_content", {
          account: sponsor.substring(0, 5) + "..." + sponsor.substring(25),
          amount: new BigNumber(value).dividedBy(10 ** 18).toString(10),
          token: this.$t("moac")
        });
      }
      if (voteType === TYPE_VOTE) {
        return this.$t("proposal_cell.apply_voter_content", {
          account: sponsor.substring(0, 10) + "..." + sponsor.substring(25)
        });
      }
      if (voteType === TYPE_RECALL) {
        const account = sponsor.substring(0, 5) + "..." + sponsor.substring(37);
        const targetAccount = target.substring(0, 5) + "..." + target.substring(37);
        return this.$t("proposal_cell.recall_voter_content", {
          account,
          target: targetAccount
        });
      }
    },
    proposalWholeContent() {
      let { voteType, sponsor, target, value } = this.proposal;

      if (voteType === TYPE_CONFIG_COUNT) {
        return "";
      }
      if (voteType === TYPE_CONFIG_PERCENT) {
        return "";
      }
      if (voteType === TYPE_WITHDRAW) {
        return this.$t("proposal_cell.withdraw_content", {
          account: sponsor,
          amount: new BigNumber(value).dividedBy(10 ** 18).toString(10),
          token: this.$t("moac")
        });
      }
      if (voteType === TYPE_VOTE) {
        return this.$t("proposal_cell.apply_voter_content", {
          account: sponsor
        });
      }
      if (voteType === TYPE_RECALL) {
        const account = sponsor;
        return this.$t("proposal_cell.recall_voter_content", {
          account,
          target
        });
      }
    },
    time() {
      return format(this.proposal.timestamp, this.$i18n.locale);
    },
    voteState() {
      return this.proposal.flag ? this.$t("proposal_cell.voted") : this.$t("proposal_cell.voting");
    }
  }
};
