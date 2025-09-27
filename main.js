// main.js
require('dotenv').config();
const { TwitterApi } = require('twitter-api-v2');

const client = new TwitterApi({
  appKey: process.env.TWITTER_APP_KEY,
  appSecret: process.env.TWITTER_APP_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET,
});

async function main() {
  try {
    const texto = `Probando el bot — ${new Date().toISOString()} 🤖`;
    const res = await client.v2.tweet(texto);
    console.log('✅ Publicado. tweet id:', res.data.id);
  } catch (err) {
    console.error('❌ Error publicando:', err);
    process.exit(1);
  }
}

main();