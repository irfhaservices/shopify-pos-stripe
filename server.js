require('dotenv').config(); // Load .env file

const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const app = express();

app.use(cors());
app.use(express.json());

// Stripe Terminal: Connection Token
app.post('/api/stripe/connection_token', async (req, res) => {
  try {
    const connectionToken = await stripe.terminal.connectionTokens.create();
    res.json({ secret: connectionToken.secret });
  } catch (error) {
    console.error('Error generating connection token:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Create PaymentIntent for card_present
app.post('/api/stripe/create_payment_intent', async (req, res) => {
  try {
    const { amount } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      payment_method_types: ['card_present'],
      capture_method: 'manual', // recommended for Stripe Terminal
    });

    res.json({ client_secret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating payment intent:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Test route
app.get('/', (req, res) => {
  res.send('✅ Shopify POS Stripe App backend is running.');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
