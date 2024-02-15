/* My profile Page */

import Collection from "@/components/shared/Collection";
import { Button } from "@/components/ui/button";
import { getEventsByUser } from "@/lib/actions/event.actions";
import { getOrdersByUser } from "@/lib/actions/order.actions";
import { IOrder } from "@/lib/database/models/order.model";
import { SearchParamProps } from "@/types";
import { auth } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";



//Pagination, we simply get access to the searchParams throught props. Onces you get it , you're gonna expose wherever you put in the url.
const ProfilePage = async ( { searchParams }: SearchParamProps) => {
  // We have to fetch de events both from events and events organized.
  // Get the ID of the specific user:
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;

  const ordersPage = Number(searchParams?.ordersPage) || 1;
  const eventsPage = Number(searchParams?.eventsPage) || 1; 

  const orders = await getOrdersByUser({ userId, page:ordersPage })

  const orderedEvents = orders?.data.map((order: IOrder) => order.event) || [];
  const organizedEvents = await getEventsByUser({ userId, page: eventsPage });

  return (
    <>
      {/* My Tickets */}
      <section className="pg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        {" "}
        {/* Background */}
        <div className="wrapper flex flex-items justify-center sm:justify-between">
          <h3 className="h3-bold text-center sm:text-left">My Tickets</h3>
          <Button asChild className="button hidden sm:flex">
            <Link href="/#events">Explore More Events</Link>
          </Button>
        </div>
      </section>

      <section className="wrapper my-8">
        <Collection
          data={orderedEvents}
          emptyTitle="No events tickets purchased yet"
          emptyStateSubtext="No worries - plenty of exciting events to explore!"
          collectionType="All_Events"
          limit={3}
          page={ordersPage}
          urlParamName="ordersPage"
          totalPages={orders?.totalPages}
        />
      </section> 

      {/* EVENTS ORGANIZED */}

      <section className="pg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        {" "}
        {/* Background */}
        <div className="wrapper flex flex-items justify-center sm:justify-between">
          <h3 className="h3-bold text-center sm:text-left">Events Organized</h3>
          <Button asChild className="button hidden sm:flex">
            <Link href="/events/create">Create New Event</Link>
          </Button>
        </div>
      </section>

      <section className="wrapper my-8">
        <Collection
          data={organizedEvents?.data}
          emptyTitle="No events have been created yet"
          emptyStateSubtext="Go create some now"
          collectionType="Events_Organized"
          limit={3}
          page={eventsPage}
          urlParamName="eventsPage"
          totalPages={organizedEvents?.totalPages}
        />
      </section>
    </>
  );
};

export default ProfilePage;
