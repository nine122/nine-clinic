import Stripe from "stripe";
import dotenv from "dotenv";
import appointmentModel from "../models/appointmentModel.js";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const webhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOKS_KEY
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle successful payment
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const appointmentId = session.metadata?.appointmentId;

    if (!appointmentId) {
      return res
        .status(400)
        .json({ error: "Missing appointmentId in metadata" });
    }

    // Update the appointment payment status
    try {
      const existingAppointment = await appointmentModel.findById(
        appointmentId
      );

      if (!existingAppointment) {
        return res.status(404).json({ error: "Appointment not found" });
      }

      // Update the appointment
      const result = await appointmentModel.findByIdAndUpdate(
        appointmentId,
        { payment: true },
        { new: true } // Return the updated document
      );
    } catch (err) {
      console.error(
        `Error updating payment status for ID: ${appointmentId}`,
        err
      );
      console.error("Full error details:", err.stack);

      // Don't return error to Stripe - we want to acknowledge receipt
      // but log the issue for debugging
    }
  } else {
    console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
};

export default webhook;
