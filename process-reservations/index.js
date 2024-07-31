const { BigQuery } = require('@google-cloud/bigquery');
const bigquery = new BigQuery();

/**
 * Triggered from a message on a Cloud Pub/Sub topic.
 *
 * @param {!Object} event Event payload.
 * @param {!Object} context Metadata for the event.
 */
exports.helloPubSub = async (event, context) => {
  const message = event.data
    ? Buffer.from(event.data, 'base64').toString()
    : '{}';
  
  const data = JSON.parse(message);
  console.log(`Received data: ${JSON.stringify(data)}`);

  const datasetId = 'reservations'; 
  const tableId = 'reservations';

  const rows = [{
    name: data.name,
    phone: data.phone,
    email: data.email,
    location: data.location,
    checkin: data.checkin,
    checkout: data.checkout,
    guests: data.guests,
  }];

  try {
    await bigquery.dataset(datasetId).table(tableId).insert(rows);
    console.log('Inserted data into BigQuery');
  } catch (error) {
    console.error('Error inserting data into BigQuery', error);
  }
};
