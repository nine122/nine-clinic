import Stripe from "stripe";
import appointmentModel from "../models/appointmentModel.js";
import dotenv from "dotenv";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const payment = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Appointment with ${appointment.docData.name}`,
              description: `Patient: ${appointment.userData.name}`,
            },
            unit_amount: appointment.amount * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/payment-success?appointmentId=${appointment._id}`,
      cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
      metadata: {
        appointmentId: appointment._id.toString(),
      },
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error("Stripe Checkout Error:", error);
    res.status(500).json({ error: "Failed to create Stripe session" });
  }
};

export default payment;
