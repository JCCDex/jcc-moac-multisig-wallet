import accountInfo from "@/js/account";

accountInfo.isVoter().then(isVoter => {
  console.log("is voter: ", isVoter);
});
