import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { IoAddCircle } from "react-icons/io5";
import { useState } from "react";
import FileSaver from "file-saver";
import { createEvent } from "ics";
import moment from "moment";

function MyModal(props) {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  //   const [type, setType] = useState("");
  //   const [date, setDate] = useState("");

  //   const startTime = "19740108T054400";
  //   const formattedTime = moment(startTime, "YYYYMMDDTHHmmss")
  //     .toArray()
  //     .slice(0, 3);

  //   console.log(formattedTime);
  const handleSubmit = (e) => {
    e.preventDefault();

    const event = {
      title,
      start: moment(start, "YYYYMMDDTHHmmss").toArray().slice(0, 3),
      end: moment(end, "YYYYMMDDTHHmmss").toArray().slice(0, 3),
      description,
      location,
    };

    createEvent(event, (error, value) => {
      if (error) {
        console.log(error);
      } else {
        const blob = new Blob([value], { type: "text/calendar;charset=utf-8" });
        // console.log(blob);
        FileSaver.saveAs(blob, "asranna.ics");
        console.log("filesaved");
      }
    });
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
        <form className="new-event" onSubmit={handleSubmit}>
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
              <label htmlFor="start">Start Date and Time</label>
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

          <button type="submit">Download</button>
          {/* <button>
            <IoAddCircle /> Add new Event
          </button> */}
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default MyModal;
