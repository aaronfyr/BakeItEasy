import { React, useEffect, useState, useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
//import timeGridPlugin from "@fullcalendar/timegrid";

/*
import "@fullcalendar/core/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";
*/

const events = [
  { title: "All Day Event", start: getDate("YEAR-MONTH-01") },
  {
    title: "Rendezvous",
    start: getDate("YEAR-MONTH-07"),
    end: getDate("YEAR-MONTH-10"),
  },
  {
    groupId: "999",
    title: "Repeating Event",
    start: getDate("YEAR-MONTH-09T16:00:00+00:00"),
  },
  {
    groupId: "999",
    title: "Repeating Event",
    start: getDate("YEAR-MONTH-16T16:00:00+00:00"),
  },
  {
    title: "Dontiste",
    start: "YEAR-MONTH-17",
    end: getDate("YEAR-MONTH-19"),
  },
  {
    title: "Consultation",
    start: getDate("YEAR-MONTH-18T10:30:00+00:00"),
    end: getDate("YEAR-MONTH-18T12:30:00+00:00"),
  },
  { title: "Visit", start: getDate("YEAR-MONTH-18T12:00:00+00:00") },
  { title: "maladie", start: getDate("YEAR-MONTH-19T07:00:00+00:00") },
  { title: "Meeting", start: getDate("YEAR-MONTH-18T14:30:00+00:00") },
  { title: "controlle", start: getDate("YEAR-MONTH-18T17:30:00+00:00") },
  { title: "finish", start: getDate("YEAR-MONTH-18T20:00:00+00:00") },
];

function getDate(dayString) {
  const today = new Date();
  const year = today.getFullYear().toString();
  let month = (today.getMonth() + 1).toString();

  if (month.length === 1) {
    month = "0" + month;
  }

  return dayString.replace("YEAR", year).replace("MONTH", month);
}

export const SellerCalendar = () => {
  return (
    <div>
      <FullCalendar
        defaultView="dayGridMonth"
        header={{
          left: "prev,next",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        themeSystem="Simplex"
        plugins={[dayGridPlugin]}
        events={events}
      />
      <FullCalendar
        defaultView="dayGridMonth"
        // themeSystem="Simplex"
        // header={{
        //   left: "prev,next",
        //   center: "title",
        //   right: "dayGridMonth,timeGridWeek,timeGridDay",
        // }}
        plugins={[dayGridPlugin]}
        events={events}
        displayEventEnd="true"
        eventColor={"#" + Math.floor(Math.random() * 16777215).toString(16)}
      />
    </div>
  );
};
/*
import { Eventcalendar, getJson } from "@mobiscroll/react-lite";

export const SellerCalendar = () => {
  const [myEvents, setEvents] = useState([]);

  
  useEffect(() => {
    getJson(
      "https://trial.mobiscroll.com/events/?vers=5",
      (events) => {
        setEvents(events);
      },
      "jsonp"
    );
  }, []);
  

  const onEventClick = () => {
    //do something
  };

  const handleView = useMemo(() => {
    return {
      calendar: { labels: true },
    };
  }, []);

  return <div></div>;
};

buggy eventcalendar
<Eventcalendar
      theme="ios"
      themeVariant="light"
      clickToCreate={false}
      dragToCreate={false}
      dragToMove={false}
      dragToResize={false}
      eventDelete={false}
      data={myEvents}
      view={handleView}
      onEventClick={onEventClick}
    />
    */
