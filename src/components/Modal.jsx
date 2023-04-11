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

  //   const handleSubmit = (e) => {
  //     e.preventDefault();

  //     const newEvent = {
  //       title,
  //       start: moment(start, "YYYYMMDDTHHmmss").toArray().slice(0, 3),
  //       end: moment(end, "YYYYMMDDTHHmmss").toArray().slice(0, 3),
  //       description,
  //       location,
  //     };

  // createEvent(event, (error, value) => {
  //   if (error) {
  //     console.log(error);
  //   } else {
  //     const blob = new Blob([value], { type: "text/calendar;charset=utf-8" });
  //     // console.log(blob);
  //     FileSaver.saveAs(blob, "asranna.ics");
  //     console.log("filesaved");
  //   }
  // });

  //     setEvents([...events, newEvent]);
  //     setTitle("");
  //     setStart("");
  //     setEnd("");
  //     setDescription("");
  //     setLocation("");
  //     console.log(events);
  //   };

  //   const timeString = "19740108T054400";
  //   const formattedTime = moment(timeString, "YYYYMMDDTHHmmss")
  //     .toArray()
  //     .slice(0, 3);

  //   console.log(formattedTime);

  const handleAddEvent = (e) => {
    e.preventDefault();
    const newEvent = {
      title,
      start: moment(String(start), "YYYYMMDDTHHmmss").toArray().slice(0, 3),
      end: moment(String(end), "YYYYMMDDTHHmmss").toArray().slice(0, 3),
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
      FileSaver.saveAs(blob, "events.ics");
      console.log("filesaved");
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
        </form>
      </Modal.Body>
      <Modal.Footer>
        {/* <Button onClick={props.onHide}>Close</Button> */}
      </Modal.Footer>
    </Modal>
  );
}

export default MyModal;
