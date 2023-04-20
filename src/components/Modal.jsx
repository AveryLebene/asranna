import { useState, useRef, useReducer, createContext } from "react";

import { createEvents } from "ics";
import FileSaver from "file-saver";
import { v4 as uuidv4 } from "uuid";

// import { IoAddCircleOutline } from "react-icons/io5";
import { IoSettingsOutline } from "react-icons/io5";
import { FiDownload } from "react-icons/fi";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import Dropdown from "react-bootstrap/Dropdown";
import Accordion from "react-bootstrap/Accordion";

import {
  formattedEvents,
  formattedDate,
  formattedTime,
} from "./helpers/Formats";

const EventContext = createContext();

const initialState = {
  events: [],
};

const ADD_EVENT = "ADD_EVENT";
const DELETE_EVENT = "DELETE_EVENT";
const EDIT_EVENT = "EDIT_EVENT";
const RESET_EVENTS = "RESET_EVENTS";

function reducer(state, action) {
  switch (action.type) {
    case ADD_EVENT: {
      const newEvent = action.payload;
      const updatedEvents = [...state.events, newEvent];
      return {
        ...state,
        events: updatedEvents,
      };
    }

    case EDIT_EVENT: {
      const updatedEvent = action.payload;
      const updatedEvents = state.events.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event
      );
      return {
        ...state,
        events: updatedEvents,
      };
    }

    case DELETE_EVENT: {
      const deletedEvent = action.payload;
      const updatedEvents = state.events.filter(
        (event) => event.id !== deletedEvent.id
      );
      return {
        ...state,
        events: updatedEvents,
      };
    }

    case RESET_EVENTS: {
      return { events: [] };
    }

    default:
      // throw new Error(`Invalid action type: ${action.type}`);
      return state;
  }
}

function MyModal(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [url, setUrl] = useState("");
  // const [showEvents, setShowEvents] = useState(false);
  const [recurrence, setRecurrence] = useState(null);
  const [editEvent, setEditEvent] = useState("");
  const [reminder, setReminder] = useState("");
  const [repeat, setRepeat] = useState("");

  const clearInputs = () => {
    setEditEvent(null);
    setTitle("");
    setStart("");
    setEnd("");
    setDescription("");
    setLocation("");
    setUrl("");
    setRepeat("");
    setRecurrence(null);
    resetForm();
  };

  const formRef = useRef(null);

  //   adding events to state

  const handleAddEvent = (e) => {
    e.preventDefault();
    const newEvent = {
      id: uuidv4(),

      title,
      start,
      end,
      description,
      location,
      url,
      recurrence,
      reminder,
      repeat,
    };
    // console.log("newEvent=", newEvent);
    dispatch({ type: ADD_EVENT, payload: newEvent });
    clearInputs();
  };

  const handleEditEvent = (e) => {
    e.preventDefault();

    dispatch({ type: EDIT_EVENT, payload: editEvent });
    clearInputs();
  };

  const handleDeleteEvent = (e) => {
    const eventId = e.target.id;

    const updatedEvents = state.events;
    const eventIndex = updatedEvents.findIndex((event) => event.id === eventId);
    updatedEvents.splice(eventIndex, 1);
    dispatch({ type: DELETE_EVENT, payload: updatedEvents });
  };

  const handleDownload = async () => {
    const formatted = formattedEvents(state.events);

    if (state.events.length > 0) {
      const { error, value } = createEvents(formatted);

      if (error) {
        console.log(error);
      } else {
        const blob = new Blob([value], { type: "text/calendar;charset=utf-8" });
        FileSaver.saveAs(blob, "asranna.ics");
        console.log("value=", value);
      }
      dispatch({ type: "RESET_EVENTS" });
    }
  };

  function handleEditClick() {
    formRef.current.focus();
  }

  const resetForm = () => {
    const recurrences = document.querySelectorAll('input[name="recurrence"]');
    recurrences.forEach((recurrence) => {
      recurrence.checked = false;
    });
    setRecurrence("");
    const reminders = document.querySelectorAll('input[name="reminder"]');
    reminders.forEach((reminder) => {
      reminder.checked = false;
    });
    setReminder("");
  };

  return (
    <EventContext.Provider value={{ state, dispatch }}>
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
          <div>
            <form
              className="new-event"
              onSubmit={editEvent ? handleEditEvent : handleAddEvent}
            >
              <label htmlFor="title">Event Title</label>
              <input
                type="text"
                id="title"
                name="title"
                // list="events"
                value={editEvent ? editEvent.title : title || ""}
                onChange={(e) => {
                  editEvent
                    ? setEditEvent({ ...editEvent, title: e.target.value })
                    : setTitle(e.target.value);
                }}
                placeholder="Enter Event Title"
                required
                ref={formRef}
              />

              <div className="time">
                <div className="">
                  <label htmlFor="start">Start Date and Time</label>
                  <input
                    type="datetime-local"
                    id="start"
                    name="start"
                    value={editEvent ? editEvent.start : start || ""}
                    onChange={(e) =>
                      editEvent
                        ? setEditEvent({ ...editEvent, start: e.target.value })
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
                    value={editEvent ? editEvent.end : end || ""}
                    onChange={(e) =>
                      editEvent
                        ? setEditEvent({ ...editEvent, end: e.target.value })
                        : setEnd(e.target.value)
                    }
                    placeholder="End Date and Time"
                    // required
                  />
                </div>
              </div>
              <label htmlFor="description">Event Description</label>
              <input
                type="text"
                id="description"
                name="description"
                placeholder="Enter Description"
                value={editEvent ? editEvent.description : description || ""}
                onChange={(e) =>
                  editEvent
                    ? setEditEvent({
                        ...editEvent,
                        description: e.target.value,
                      })
                    : setDescription(e.target.value)
                }
              />
              <label htmlFor="recurrence">Repeat</label>
              <div className="recurrence">
                <label>
                  <input
                    type="radio"
                    id="recurrence"
                    name="recurrence"
                    checked={
                      (editEvent
                        ? editEvent.recurrence === "DAILY"
                        : recurrence === "DAILY") || ""
                    }
                    value="DAILY"
                    onChange={(e) =>
                      editEvent
                        ? setEditEvent({
                            ...editEvent,
                            recurrence: e.target.value,
                          })
                        : setRecurrence(e.target.value)
                    }
                  />
                  Daily
                </label>
                <label>
                  <input
                    type="radio"
                    id="recurrence"
                    name="recurrence"
                    placeholder="recurrence"
                    checked={
                      (editEvent
                        ? editEvent.recurrence === "WEEKLY"
                        : recurrence === "WEEKLY") || ""
                    }
                    value="WEEKLY"
                    onChange={(e) =>
                      editEvent
                        ? setEditEvent({
                            ...editEvent,
                            recurrence: e.target.value,
                          })
                        : setRecurrence(e.target.value)
                    }
                  />
                  Weekly
                </label>
                <label>
                  <input
                    type="radio"
                    id="recurrence"
                    name="recurrence"
                    checked={
                      (editEvent
                        ? editEvent.recurrence === "MONTHLY"
                        : recurrence === "MONTHLY") || ""
                    }
                    value="MONTHLY"
                    onChange={(e) =>
                      editEvent
                        ? setEditEvent({
                            ...editEvent,
                            recurrence: e.target.value,
                          })
                        : setRecurrence(e.target.value)
                    }
                  />
                  Monthly
                </label>
                <label>
                  <input
                    type="radio"
                    id="recurrence"
                    name="recurrence"
                    checked={
                      (editEvent
                        ? editEvent.recurrence === "YEARLY"
                        : recurrence === "YEARLY") || ""
                    }
                    value="YEARLY"
                    onChange={(e) =>
                      editEvent
                        ? setEditEvent({
                            ...editEvent,
                            recurrence: e.target.value,
                          })
                        : setRecurrence(e.target.value)
                    }
                  />
                  Yearly
                </label>
              </div>
              <label htmlFor="repeat">Number of repeat time</label>
              <div className="repeat">
                <label htmlFor="repeat"> </label>
                <input
                  type="number"
                  id="repeat"
                  name="repeat"
                  value={editEvent ? editEvent.repeat : repeat || ""}
                  onChange={(e) =>
                    editEvent
                      ? setEditEvent({
                          ...editEvent,
                          repeat: e.target.value,
                        })
                      : setRepeat(e.target.value)
                  }
                />
              </div>
              <label htmlFor="reminder">Set Alert Before Event</label>
              <div className="alert">
                <label>
                  <input
                    type="radio"
                    id="reminder"
                    name="reminder"
                    value="15M"
                    checked={
                      (editEvent
                        ? editEvent.reminder === "15M"
                        : reminder === "15M") || ""
                    }
                    onChange={(e) =>
                      editEvent
                        ? setEditEvent({
                            ...editEvent,
                            reminder: e.target.value,
                          })
                        : setReminder(e.target.value)
                    }
                  />
                  15 mins
                </label>
                <label>
                  <input
                    type="radio"
                    id="reminder"
                    name="reminder"
                    checked={
                      (editEvent
                        ? editEvent.reminder === "30M"
                        : reminder === "30M") || ""
                    }
                    value="30M"
                    onChange={(e) =>
                      editEvent
                        ? setEditEvent({
                            ...editEvent,
                            reminder: e.target.value,
                          })
                        : setReminder(e.target.value)
                    }
                  />
                  30 mins
                </label>
                <label>
                  <input
                    type="radio"
                    id="reminder"
                    name="reminder"
                    checked={
                      (editEvent
                        ? editEvent.reminder === "1H"
                        : reminder === "1H") || ""
                    }
                    value="1H"
                    onChange={(e) =>
                      editEvent
                        ? setEditEvent({
                            ...editEvent,
                            reminder: e.target.value,
                          })
                        : setReminder(e.target.value)
                    }
                  />
                  1 hour
                </label>
              </div>
              <label htmlFor="location">Location of Event</label>
              <input
                type="text"
                id="location"
                name="location"
                placeholder="Enter Location"
                value={editEvent ? editEvent.location : location || ""}
                onChange={(e) =>
                  editEvent
                    ? setEditEvent({ ...editEvent, location: e.target.value })
                    : setLocation(e.target.value)
                }
              />
              <label htmlFor="url">Event URL</label>
              <input
                type="url"
                id="url"
                name="url"
                placeholder="Enter URL"
                value={editEvent ? editEvent.url : url || ""}
                onChange={(e) =>
                  editEvent
                    ? setEditEvent({ ...editEvent, url: e.target.value })
                    : setUrl(e.target.value)
                }
              />

              {editEvent ? (
                <input type="submit" value="Save Changes" />
              ) : (
                <input type="submit" value="Add Event" className="add-btn" />
              )}

              <div className="added-events">
                <Accordion flush>
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>View Events </Accordion.Header>
                    <Accordion.Body>
                      {state.events < 1 ? (
                        <h6> Add to view and download</h6>
                      ) : (
                        <>
                          <Table striped>
                            <thead>
                              <tr>
                                <th>Event Title </th>
                                <th>Event Date</th>
                                <th>Start Time</th>
                                <th>Edit</th>
                              </tr>
                            </thead>
                            <tbody className="t-body">
                              {state.events.map((event, id) => (
                                <tr key={id}>
                                  <td> {event.title}</td>
                                  <td>{formattedDate(event.start)}</td>

                                  <td>{formattedTime(event.start)}</td>

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

                                        <Dropdown.Item
                                          id={event.id}
                                          onClick={(e) => handleDeleteEvent(e)}
                                        >
                                          Delete
                                        </Dropdown.Item>
                                      </Dropdown.Menu>
                                    </Dropdown>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                          <button
                            type="button"
                            className="download-btn"
                            onClick={handleDownload}
                          >
                            <FiDownload /> Download ics
                          </button>
                        </>
                      )}
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </div>
            </form>
          </div>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </EventContext.Provider>
  );
}

export default MyModal;
