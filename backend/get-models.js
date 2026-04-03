const Groq = require('groq-sdk');
require('dotenv').config();

const client = new Groq();

async function main() {
  try {
    const list = await client.models.list();
    console.log(list.data.map(m => m.id).join('\n'));
  } catch (e) {
    console.error(e);
  }
}
main();
