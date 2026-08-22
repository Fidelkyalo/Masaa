import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// POST /api/v1/payments/mpesa/stkpush
router.post('/mpesa/stkpush', (req, res) => {
  const { phone, amount, accountRef } = req.body;
  if (!phone || !amount) {
    return res.status(400).json({ success: false, error: 'Phone number and amount required' });
  }

  const checkoutRequestId = `ws_CO_REQ_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

  // Record pending payment
  const newPayment = db.insert('payments', {
    user_id: req.user?.id || 'usr_1',
    amount: parseFloat(amount),
    currency: 'KES',
    provider: 'M-Pesa',
    phone,
    transaction_ref: checkoutRequestId,
    status: 'Pending',
    created_at: new Date().toISOString()
  });

  res.json({
    success: true,
    CheckoutRequestID: checkoutRequestId,
    CustomerMessage: `Success. Prompt sent to ${phone}. Enter M-Pesa PIN to complete payment.`,
    payment: newPayment
  });
});

// POST /api/v1/payments/mpesa/callback (Safaricom Webhook)
router.post('/mpesa/callback', (req, res) => {
  const { CheckoutRequestID, ResultCode, MpesaReceiptNumber } = req.body;

  if (ResultCode === 0 || ResultCode === '0') {
    db.update('payments', p => p.transaction_ref === CheckoutRequestID, {
      status: 'Completed',
      receipt: MpesaReceiptNumber || `LHK${Math.floor(Math.random() * 900000)}`
    });
  }

  res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
});

// POST /api/v1/payments/stripe/checkout
router.post('/stripe/checkout', (req, res) => {
  const { planId, amount } = req.body;
  const sessionId = `cs_test_${Math.random().toString(36).substring(2, 15)}`;

  const newPayment = db.insert('payments', {
    user_id: req.user?.id || 'usr_1',
    amount: parseFloat(amount || 12),
    currency: 'USD',
    provider: 'Stripe',
    transaction_ref: sessionId,
    status: 'Completed',
    created_at: new Date().toISOString()
  });

  res.json({
    success: true,
    sessionId,
    url: `https://checkout.stripe.com/pay/${sessionId}`,
    payment: newPayment
  });
});

export default router;
