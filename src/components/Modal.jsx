// import ics from "ics";
// import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { IoAddCircleOutline } from "react-icons/io5";
import { FiDownload } from "react-icons/fi";
import { useEffect, useState } from "react";
import FileSaver from "file-saver";
import { createEvents } from "ics";

import moment from "moment";

function MyModal(props) {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [events, setEvents] = useState([]);
  const [showEvents, setShowEvents] = useState(false);

  //   const timeString = "19740108T054400";
  //   const formattedTime = moment(timeString, "YYYYMMDDTHHmmss")
  //     .toArray()
  //     .slice(0, 3)

  //   console.log(formattedTime);

  //   const timeString = "19740108T054400";
  //   const date = moment(timeString, "YYYYMMDDTHHmmss");
  //   const month = date.get("month") + 1;
  //   const formattedTime = [date.get("year"), month, date.get("date")];

  //   console.log(formattedTime);

  const handleAddEvent = (e) => {
    let startDate = moment(start, "YYYYMMDDTHHmmss");
    let startMonth = startDate.get("month") + 1;
    let startArray = [startDate.get("year"), startMonth, startDate.get("date")];

    let endDate = moment(end, "YYYYMMDDTHHmmss");
    let endMonth = endDate.get("month") + 1;
    let endArray = [endDate.get("year"), endMonth, endDate.get("date")];

    e.preventDefault();
    const newEvent = {
      title,
      //   start: moment(String(start), "YYYYMMDDTHHmmss").toArray().slice(0, 3),
      //   end: moment(String(end), "YYYYMMDDTHHmmss").toArray().slice(0, 3),
      start: startArray,
      end: endArray,
      description,
      location,
    };
    setEvents([...events, newEvent]);
    // console.log("events", events);
    console.log("added");

    setTitle("");
    setStart("");
    setEnd("");
    setDescription("");
    setLocation("");
  };

  useEffect(() => {
    console.log(events);
  }, [events]);

  const handleDownload = () => {
    const { error, value } = createEvents(events);
    console.log("val=", value);
    if (error) {
      console.log(error);
    } else {
      const blob = new Blob([value], { type: "text/calendar;charset=utf-8" });
      FileSaver.saveAs(blob, "asranna.ics");
      console.log("filesaved");
      setEvents([]);
    }
    console.log("val", value);
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter"></Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form className="new-event" onSubmit={handleAddEvent}>
          <input
            type="text"
            id="title"
            name="title"
            list="events"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Event Title"
            required
          />
          <datalist id="events">
            <option value="Birthday">Birthday</option>
            <option value="Anniversary">Anniversary</option>
            <option value="Wedding">Wedding</option>
            <option value="Graduation">Graduation</option>
            <option value="Meeting">Meeting</option>
          </datalist>

          <div className="time">
            <div className="">
              <label htmlFor="start">Start Date and Time</label>
              <input
                type="datetime-local"
                id="start"
                name="start"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                placeholder="Start Time"
                required
              />
            </div>
            <div>
              <label htmlFor="start">End Date and Time</label>
              <input
                type="datetime-local"
                id="end"
                name="end"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                placeholder="End Date and Time"
                required
              />
            </div>
          </div>
          <input
            type="text"
            id="description"
            name="description"
            placeholder="Event Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="text"
            id="location"
            name="location"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <div className="btns">
            <button type="submit">
              <IoAddCircleOutline /> Add Event
            </button>
            <button type="button" onClick={handleDownload}>
              <FiDownload /> Download ics
            </button>
          </div>
          <button onClick={() => setShowEvents(!showEvents)}>
            {showEvents ? "Hide Added events" : "View all Added events"}
          </button>

          {showEvents && (
            <div>
              {events < 1 ? <h3> No events added</h3> : <h3>Events</h3>}
              {/* <h2>Events</h2> */}
              <ul>
                {events.map((event, index) => (
                  <li key={index}>
                    {event.title} - {event.start.join("/")} to{" "}
                    {event.end.join("/")}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </form>
      </Modal.Body>
      <Modal.Footer>
        {/* <Button onClick={props.onHide}>Close</Button>
         */}
        {/* {events.map((event, index) => (
          <div key={index}>
            <h3>{event.title}</h3>
            <p>Start: {event.start.toString()}</p>
            <p>End: {event.end.toString()}</p>
            <p>Description: {event.description}</p>
            <p>Location: {event.location}</p>
            <hr />
          </div>
        ))} */}
      </Modal.Footer>
    </Modal>
  );
}

export default MyModal;
