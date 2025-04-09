
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')('sk_test_dummy');
const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/stripe/connection_token', async (req, res) => {
  const connectionToken = await stripe.terminal.connectionTokens.create();
  res.json({ secret: connectionToken.secret });
});

app.post('/api/stripe/create_payment_intent', async (req, res) => {
  const { amount } = req.body;
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: 'usd',
    payment_method_types: ['card_present'],
    capture_method: 'manual',
  });
  res.json({ client_secret: paymentIntent.client_secret });
});

app.get('/', (req, res) => {
  res.send('Shopify POS Stripe App is running.');
});

app.listen(3000, () => console.log('Server running on port 3000'));
