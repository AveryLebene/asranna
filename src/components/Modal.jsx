import { useEffect, useState, useRef } from "react";

import { createEvents } from "ics";
import FileSaver from "file-saver";

import { v4 as uuidv4 } from "uuid";
import moment from "moment";

import { IoAddCircleOutline } from "react-icons/io5";
import { IoSettingsOutline } from "react-icons/io5";
import { FiDownload } from "react-icons/fi";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import Dropdown from "react-bootstrap/Dropdown";
import Popover from "react-bootstrap/Popover";
import Overlay from "react-bootstrap/Overlay";

function MyModal(props) {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [events, setEvents] = useState([]);
  const [showEvents, setShowEvents] = useState(false);
  const [editEvent, setEditEvent] = useState(null);
  const [showPop, setShowPop] = useState(false);
  const [target, setTarget] = useState(null);

  const popRef = useRef(null);
  const formRef = useRef(null);

  //   const time = "19740108T054400";
  //   const formattedTime = moment(timeString, "YYYYMMDDTHHmmss")
  //     .toArray()
  //     .slice(0, 3)

  //   console.log(formattedTime);

  //   const timeString = "19740108T054400";
  //   const date = moment(timeString, "YYYYMMDDTHHmmss");
  //   const month = date.get("month") + 1;
  //   const formattedTime = [date.get("year"), month, date.get("date")];

  //   console.log(formattedTime);
  //   start: moment(String(start), "YYYYMMDDTHHmmss").toArray().slice(0, 3),
  //   end: moment(String(end), "YYYYMMDDTHHmmss").toArray().slice(0, 3),

  const handleAddEvent = (e) => {
    let startDate = moment(start, "YYYYMMDDTHHmmss");
    let startMonth = startDate.get("month") + 1;
    let startArray = [
      startDate.get("year"),
      startMonth,
      startDate.get("date"),
      startDate.get("hour"),
      startDate.get("minute"),
    ];

    let endDate = moment(end, "YYYYMMDDTHHmmss");
    let endMonth = endDate.get("month") + 1;
    let endArray = [
      endDate.get("year"),
      endMonth,
      endDate.get("date"),
      endDate.get("hour"),
      endDate.get("minute"),
    ];

    e.preventDefault();
    const newEvent = {
      id: uuidv4(),
      title,

      start: startArray,
      end: endArray,
      description,
      location,
    };
    setEvents([...events, newEvent]);
    console.log("events", events);
    // console.log("added");

    setTitle("");
    setStart("");
    setEnd("");
    setDescription("");
    setLocation("");
  };

  useEffect(() => {
    console.log(events);
  }, [events]);

  const handleEditEvent = (e, startArray, endArray) => {
    e.preventDefault();

    // formRef.current.focus();

    const updatedEvent = {
      ...editEvent,
      title,
      start: startArray,
      end: endArray,
      description,
      location,
    };

    const updatedEvents = events.map((event) => {
      if (event.id === updatedEvent.id) {
        return updatedEvent;
      } else {
        return event;
      }
    });
    setEvents(updatedEvents);

    // setEditEvent(null);

    setEvents(updatedEvents);

    setTitle("");
    setStart("");
    setEnd("");
    setDescription("");
    setLocation("");
    console.log(setEvents);
  };

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

  function formatDate(date) {
    const options = { year: "numeric", month: "short", day: "numeric" };
    const formattedDate = new Date(
      date[0],
      date[1] - 1,
      date[2],
      date[3],
      date[4]
    );
    return new Intl.DateTimeFormat("en-US", options).format(formattedDate);
  }

  function formatTime(date) {
    const formattedTime = new Date(
      date[0],
      date[1] - 1,
      date[2],
      date[3],
      date[4]
    );
    const options = { hour: "numeric", minute: "numeric", hour12: true };
    return new Intl.DateTimeFormat("en-US", options).format(formattedTime);
  }

  function handleEditClick() {
    formRef.current.focus();
  }

  const deleteClick = (event) => {
    setShowPop(!showPop);
    setTarget(event.target);
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
        <div ref={popRef}>
          <form
            className="new-event"
            onSubmit={editEvent ? handleEditEvent : handleAddEvent}
          >
            <input
              type="text"
              id="title"
              name="title"
              list="events"
              value={editEvent ? editEvent.title : title}
              onChange={(e) => {
                editEvent
                  ? setEditEvent(e.target.value)
                  : setTitle(e.target.value);
              }}
              placeholder="Event Title"
              required
              ref={formRef}
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
                  value={editEvent ? editEvent.start : start}
                  onChange={(e) =>
                    editEvent
                      ? setEditEvent(e.target.value)
                      : setStart(e.target.value)
                  }
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
                  value={editEvent ? editEvent.end : end}
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
              value={editEvent ? editEvent.description : description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <input
              type="text"
              id="location"
              name="location"
              placeholder="Location"
              value={editEvent ? editEvent.location : location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <div className="btns">
              {editEvent ? (
                <button type="submit">
                  <IoAddCircleOutline /> Save Changes
                </button>
              ) : (
                <button type="submit">
                  <IoAddCircleOutline /> Add Event
                </button>
              )}
              <button type="button" onClick={handleDownload}>
                <FiDownload /> Download ics
              </button>
            </div>
          </form>
        </div>
        <button onClick={() => setShowEvents(!showEvents)}>
          {showEvents ? "Hide Events" : "View all Events"}
        </button>

        {showEvents && (
          <div className="added-events">
            {events < 1 ? (
              <h4> No events added</h4>
            ) : (
              <Table striped>
                <thead>
                  <tr>
                    <th>Event Title </th>
                    <th>Event Date</th>
                    <th>Start Time</th>
                    {/* <th>Location</th> */}
                    <th>Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event, index) => (
                    <tr key={index}>
                      <td> {event.title}</td>
                      <td>{formatDate(event.start)}</td>
                      <td>{formatTime(event.start)}</td>
                      {/* <td>{event.location}</td> */}
                      <td>
                        <Dropdown>
                          <Dropdown.Toggle
                            className="toggle-btn"
                            id="dropdown-basic"
                            variant="outline-none"
                            size="sm"
                          >
                            <IoSettingsOutline color="#000" />
                          </Dropdown.Toggle>

                          <Dropdown.Menu>
                            <Dropdown.Item
                              onClick={() => {
                                setEditEvent(event);

                                handleEditClick();
                              }}
                            >
                              Edit
                            </Dropdown.Item>

                            <Dropdown.Item href="#" onClick={deleteClick}>
                              Delete
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                        <Overlay
                          show={showPop}
                          target={target}
                          placement="top"
                          container={popRef}
                          containerPadding={20}
                        >
                          <Popover id="popover-contained">
                            <Popover.Header as="h3">
                              Are you sure you want to delete this event?
                            </Popover.Header>
                            <Popover.Body>
                              <p>No go back</p>
                              <p>Yes delete</p>
                            </Popover.Body>
                          </Popover>
                        </Overlay>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        {/* <Button onClick={props.onHide}>Close</Button>
         */}
      </Modal.Footer>
    </Modal>
  );
}

export default MyModal;
