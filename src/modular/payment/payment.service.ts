
import Stripe from "stripe";
import { prisma } from "../../lib/prisma";
import { ICreatePaymentPayload } from "./payment.interface";
import config from "../../config";
import { get } from "node:http";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const createPayment = async (
  userId: string,
  payload:ICreatePaymentPayload
) => {
    const {rentalId} = payload
//     console.log("Payload:", payload);
// console.log("Rental ID:", rentalId);
  const result = await prisma.$transaction(async (tx) => {

    // 1. Rental খুঁজে বের করা
    const rental = await tx.rental.findUniqueOrThrow({
      where: {
        id: rentalId,
      },
      include: {
        gear: true,
      },
    });

    // 2. এই rental কার?
    // console.log("Rental Customer ID:", rental.customerId);
// console.log("Logged In User ID:", userId);
    if (rental.customerId !== userId) {
      throw new Error("You can pay only for your own rental");
    }

    // 3. আগে payment করা হয়েছে কিনা
    const existingPayment = await tx.payment.findUnique({
      where: {
        rentalId,
      },
    });

    if (existingPayment) {
      throw new Error("Payment already exists for this rental");
    }

    // 4. Stripe Checkout Session
 const session = await stripe.checkout.sessions.create({
  line_items: [
    {
      price_data: {
        currency: "usd",

        product_data: {
          name: "Gear Rental",
        },

        // unit_amount: 100,
        unit_amount: Number(rental.totalPrice) * 100,
      },

      quantity: 1,
    },
  ],

  mode: "payment",

  payment_method_types: ["card"],

  success_url: `${config.app_url}/payment-success`,

  cancel_url: `${config.app_url}/payment-cancel`,

  metadata: {
    rentalId: rental.id,
    userId,
  },
});
    // 5. Database-এ payment create
    const payment = await tx.payment.create({
      data: {
        rentalId: rental.id,
        amount: rental.totalPrice,
        currency: "usd",
        status: "PENDING",
        paymentMethod: "STRIPE",
        transactionId: session.id
      },
    });

    return {
      payment,
      paymentUrl: session.url,
    };
  });

  return result;
};




const confirmPayment = async (sessionId: string) => {
  // Stripe থেকে session retrieve
  // console.log(sessionId , "sessionid");
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  // console.log(session, "service");

  // Payment complete কিনা check
  if (session.payment_status !== "paid") {
    throw new Error("Payment is not completed");
  }

  // Database-এর payment খুঁজে বের করা
  const payment = await prisma.payment.findUniqueOrThrow({
    where: {
      transactionId: sessionId,
    },
  });

  // Already paid কিনা
  if (payment.status === "PAID") {
    throw new Error("Payment already confirmed");
  }

  const result = await prisma.$transaction(async (tx) => {
    // Payment status update
    const updatedPayment = await tx.payment.update({
      where: {
        id: payment.id,
      },
      data: {
        status: "PAID",
      },
    });

    // Rental status update
    await tx.rental.update({
      where: {
        id: payment.rentalId,
      },
      data: {
        status: "CONFIRMED",
      },
    });

    return updatedPayment;
  });
  return result
};




const getPayment = async(userId:string)=>{
  const payments = await prisma.payment.findMany({
    where: {
      rental: {
        customerId: userId,
      },
    },
    include: {
      rental: {
        include: {
          gear: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return payments;
}




  const getPaymentById = async (
  paymentId: string,
  userId: string
) => {
  const payment = await prisma.payment.findFirstOrThrow({
    where: {
      id: paymentId,

      rental: {
        customerId: userId,
      },
    },

    include: {
      rental: {
        include: {
          gear: true,
        },
      },
    },
  });

  return payment;
};






export const paymentService = {
  createPayment,
  confirmPayment,
  getPayment,
  getPaymentById
};

