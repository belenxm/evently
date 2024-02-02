import EventForm from "@/components/shared/EventForm";
import { auth } from "@clerk/nextjs";

// there are to things we're gonna do 1) pass the id is currently interacting with the form. (with clerk is very easy)


const CreateEvent = () => {
  //we've got the userId for the sessionClaims, and we can do the same on the update page.
  const { sessionClaims } = auth();

  const userId = sessionClaims?.userId as string;

  /* console.log(userId); */

  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <h3 className="wrapper h3-bold text-center sm:text-left">
          Create Event
        </h3>
      </section>

      <div className="wrapper my-8">
        <EventForm userId={userId} type="Create" />
      </div>
    </>
  );
};

export default CreateEvent;
