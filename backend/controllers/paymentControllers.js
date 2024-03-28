import catchAsynchErrors from "../middlewares/catchAsynchErrors.js";
/* import Order from "../models/order.js"; */

import Stripe from "stripe";
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Create stripe checkout session   =>  /api/v1/payment/checkout_session
export const stripeCheckoutSession = catchAsynchErrors(
    async (req, res, next) => {

        const body = req?.body;

        const shipping_rate =
      body?.itemsPrice >= 200
        ? "shr_1OysNIRxyv7IaaRNF3i2W4z7"
        : "shr_1OysO7Rxyv7IaaRNKUGqqQOf";

        const line_items = body?.orderItems?.map((item) => {
            return {
              price_data: {
                currency: "usd",
                product_data: {
                  name: item?.name,
                  images: [item?.image],
                  metadata: { productId: item?.product },
                },
                unit_amount: item?.price * 100,
              },
              tax_rates: ["txr_1OysXpRxyv7IaaRNHtZPoG9n"],
              quantity: item?.quantity,
            };
          });

          const shippingInfo = body?.shippingInfo;


          const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            success_url: `${process.env.FRONTEND_URL}/me/orders`,
            cancel_url: `${process.env.FRONTEND_URL}`,
            customer_email: req?.user?.email,
            client_reference_id: req?.user?._id?.toString(),
            mode: "payment",
            metadata: { ...shippingInfo, itemsPrice: body?.itemsPrice },
            shipping_options: [
              {
                shipping_rate,
              },
            ],
            line_items,
          });

          console.log("===================");
          console.log(session);
          console.log("===================");
      
          res.status(200).json({
            url: session.url,
          });
       


    

    });

    
    