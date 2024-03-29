import React from "react";
import EventForm from "@/components/shared/EventForm";
import { getEventById } from "@/lib/actions/event.actions";
import { auth } from "@clerk/nextjs";



type UpdateEventProps = {
  params: {
    id: string
    }
}

const UpdateEvent = async ({ params: { id } }: UpdateEventProps ) => {
  const { sessionClaims } = auth();

  //We can pass the userID as a dinamic parameter.
  const userId = sessionClaims?.userId as string;

  const event = await getEventById(id);

  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <h3 className="wrapper h3-bold text-center sm:text-left ">
          Update Event
        </h3>
      </section>

      <div className="wrapper my-8">
        {/* we have to pass this props and accept it in EventForm  */}
        <EventForm 
        type="Update" 
        event={event} 
        eventId={event._id} 
        userId={userId} />
      </div>
    </>
  );
};

export default UpdateEvent;
