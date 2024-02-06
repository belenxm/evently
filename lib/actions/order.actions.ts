"use server";

import Stripe from 'stripe';
import { CheckoutOrderParams, CreateOrderParams } from "@/types";
import { redirect } from 'next/navigation';
import { handleError } from '../utils';
import { connectToDatabase } from '../database';
import Order from '../database/models/order.model';

export const checkoutOrder = async (order: CheckoutOrderParams) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    
    const price = order.isFree ? 0 : Number(order.price) * 100;

    try {
    // we can start processing the stripe payment.
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
         price_data:{
            currency:'usd',
            unit_amount: price,
            product_data:{
                name:order.eventTitle
            }
         },
         quantity:1
        },
      ],
      metadata:{
        eventId:order.eventId,
        buyerId: order.buyerId,
      },
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/profile`,
      cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/`,
    });
    redirect(session.url!); 

  } catch (error) {
    throw error;
  }
};

export const createOrder = async (order: CreateOrderParams) => {
  try {
    await connectToDatabase(); //-> we're tryind to modify the database.


    const newOrder= await Order.create({
      ...order,
      event:order.eventId,
      buyer:order.buyerId,
    });

    //JSON.parse toma una cadena de texto JSON y lo convierte en un objeto javascript.
    return JSON.parse(JSON.stringify(newOrder)); //-> Esta función toma un objeto javascript(newOrder) y lo convierte en una cadena de texto javascript.
    
    // El propósito de este codigo es realizar una copia profunda del objeto 'neworder'.Al convertir el objeto 'newOrder' en una cadena JSON y luego volviendola a convertir en un objeto,se crea un nuevo objeto,copia independiente de la original. 
  } catch(error) {
    handleError(error);

  }
}