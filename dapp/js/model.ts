declare interface ITopic {
  topicId: string;
  timestamp: string;
  endtime: string;
  voteType: string;
  origin: string;
  value: string;
  yesCount: string;
  noCount: string;
  idx: string;
  target: string;
  sponsor: string;
  flag: boolean;
  voters: string;
  percent: string;
}

declare interface IVote {
  topicId: string;
  timestamp: string;
  idx: string;
  flag: boolean;
  voter: string;
}
