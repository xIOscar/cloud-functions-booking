const functions = require('@google-cloud/functions-framework');
const { PubSub } = require('@google-cloud/pubsub');

const client = new PubSub();

functions.http('helloHttp', (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  const name = req.query.name || req.body.name || 'World';
  const data = req.body;

  res.send(`Hello ${name}!`);
  console.log(data);
  publishMessage(data, "reservation-topic");
});

function encodeMessage(data) {
  return Buffer.from(JSON.stringify(data));
}

async function publishMessage(data, topic) {
  const message = encodeMessage(data);
  return client.topic(topic).publishMessage({ data: message });
}
