 import React, { useEffect } from "react";

import { loadStripe } from "@stripe/stripe-js";
import { IEvent } from "@/lib/database/models/event.model";
import { Button } from "../ui/button";
import { checkoutOrder } from "@/lib/actions/order.actions";
/* import { checkoutOrder } from "@/lib/actions/order.actions"; */



loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!); 

/*  We're gonna call it in CheckoutButton Fyle component  */

 const Checkout = ({ event, userId }: { event: IEvent; userId: string }) => {
  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);
    if (query.get("success")) {
      console.log("Order placed! You will receive an email confirmation.");
    }

    if (query.get("canceled")) {
      console.log(
        "Order canceled -- continue to shop around and checkout when you’re ready."
      );
    }
  }, []);
 
 
  const onCheckout = async () => { 

 /*  Here we want to form our order  */
     const order = {
      eventTitle: event.title,
      eventId: event._id,
      price: event.price,
      isFree: event.isFree,
      buyerId: userId
    }  // -> Now we have our order, we need to pass it into new server action, that we've to create.

     await checkoutOrder(order);  // Is a server action,into lib folder.
    
   };
  return (
    <form action={onCheckout} method="post">
      <Button
        type="submit"
        role="link"
        size="lg"
        className="button sm:w-fit"
      >
        {event.isFree ? "Get Ticket" : "Buy Ticket"}
      </Button>
    </form>
  );
};

export default Checkout; 

