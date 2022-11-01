import { Client } from 'twitter-api-sdk';

const twitterAppClient = new Client(process.env.TWITTER_BEARER_TOKEN);

export { twitterAppClient };
