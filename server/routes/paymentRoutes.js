const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
require('dotenv').config();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

router.post('/create-checkout-session', async (req, res) => {
    try {
        const { courseName, coursePrice, courseId, userId } = req.body;

        // 1. Define the Base URL safely (Fallback to localhost:5173 if env is missing)
        const baseUrl = process.env.CLIENT_URL || 'http://localhost:5173';

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: courseName,
                        },
                        unit_amount: Math.round(coursePrice * 100), // Ensure integer
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            // 2. Use the safe baseUrl variable here
            success_url: `${baseUrl}/payment-success?courseId=${courseId}&userId=${userId}`,
            cancel_url: `${baseUrl}/course-details/${courseId}`,
            
            metadata: { userId, courseId }
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error("Stripe Error:", error); // Print error to terminal
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;