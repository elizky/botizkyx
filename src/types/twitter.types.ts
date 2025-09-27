// src/types/twitter.types.ts

export interface TwitterCredentials {
  appKey: string;
  appSecret: string;
  accessToken: string;
  accessSecret: string;
}

export interface TwitterUser {
  id: string;
  username: string;
  name: string;
  public_metrics?: {
    followers_count: number;
    following_count: number;
    tweet_count: number;
  };
}

export interface TwitterTweet {
  id: string;
  text: string;
  created_at?: string;
  public_metrics?: {
    retweet_count?: number;
    like_count?: number;
    reply_count?: number;
    quote_count?: number;
  };
}

export interface TwitterResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface TweetResult {
  success: boolean;
  tweetId: string;
  text: string;
}

export interface ConnectionResult {
  success: boolean;
  username: string;
  userId: string;
}

export interface TimelineResult {
  success: boolean;
  tweets: TwitterTweet[];
}
