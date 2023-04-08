import { React, useEffect, useState, useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

import { EventListingDetails } from "./eventListingDetails";

import {
  BrowserRouter as Router,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  Button,
  Modal,
  ModalContent,
  ModalOverlay,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";

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

console.log("events: ", events);
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
  function getDate(dayString) {
    const today = new Date();
    const year = today.getFullYear().toString();
    let month = (today.getMonth() + 1).toString();

    if (month.length === 1) {
      month = "0" + month;
    }

    return dayString.replace("YEAR", year).replace("MONTH", month);
  }

  const navigate = useNavigate();

  // Fetch this seller details
  const [seller, setSeller] = useState(null);
  const [sellerName, setSellerName] = useState("Log In");
  const [sellerId, setSellerId] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const fetchedSeller = localStorage.getItem("seller");
      if (!fetchedSeller) {
        console.log("navbar", "no seller");
        navigate("/login");
      } else {
        console.log("navbar", "has seller");
        try {
          const parsedUser = JSON.parse(fetchedSeller);
          setSeller(parsedUser);
          console.log("parsedUser: ", parsedUser);
          console.log("parsedUser.name: ", parsedUser.name);
          setSellerName(parsedUser.name);
          console.log("parsedUser.id: ", parsedUser.sellerId);
          setSellerId(parsedUser.sellerId);
        } catch (error) {
          console.log(error);
        }
      }
    }
    fetchData();
  }, []);

  // fetch orders
  const [orders, setOrders] = useState([]);
  console.log("sellerId:", sellerId);

  /*
  useEffect(() => {
    fetch(
      `http://localhost:8080/BakeItEasy-war/webresources/sellers/${sellerId}/orders`,
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => setOrders(data));
  }, []);
*/

  useEffect(() => {
    const fetchData = async () => {
      try {
        // fetch array of orders as objects
        let sellerId = null;
        const fetchedSeller = localStorage.getItem("seller");
        if (!fetchedSeller) {
          console.log("calendar", "no seller");
          navigate("/login");
        } else {
          const parsedUser = JSON.parse(fetchedSeller);
          sellerId = parsedUser.sellerId;
          console.log("buyerId to get orders", sellerId);
        }

        const response = await fetch(
          `http://localhost:8080/BakeItEasy-war/webresources/sellers/${sellerId}/orders`,
          {
            method: "GET",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();

        // set list of orders
        setOrders(data);
        console.log("orders: ", orders);
        console.log(`HTTP Response Code: ${response?.status}`);

        // process array of orders as objects
        const processedData = data.map((obj) => {
          return {
            title: "Order #" + obj.orderId.toString(),
            start: obj.dateOfCollection.substring(0, 10),
            orderId: obj.orderId,
          };
        });
        setOrders(processedData);

        console.log("processedData: ", processedData);
      } catch (error) {
        if (error instanceof SyntaxError) {
          // Unexpected token < in JSON
          console.log("There was a SyntaxError", error);
        }
      }
    };
    fetchData();
  }, []);

  const [state, setState] = useState({
    event: {
      title: "",
      start: new Date(),
      orderId: "",
    },
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleEventClick = ({ event, el }) => {
    setState({ event });
    onOpen();
  };

  const titleToId = (title) => {
    console.log("converted titleToId: ", title.substring(7));
    return title.substring(7);
  };

  console.log("orders: ", orders);
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
        events={orders}
        selectable={true}
        eventClick={handleEventClick}
      />
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{state.event.title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div>
              <p>{state.event.start.toDateString()}</p>
              <EventListingDetails oId={titleToId(state.event.title)} />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

/*
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
*/

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
