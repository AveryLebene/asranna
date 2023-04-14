import { useState, useRef, useReducer, createContext } from "react";

import { createEvents } from "ics";
import FileSaver from "file-saver";
import { v4 as uuidv4 } from "uuid";

import { IoAddCircleOutline } from "react-icons/io5";
import { IoSettingsOutline } from "react-icons/io5";
import { FiDownload } from "react-icons/fi";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import Dropdown from "react-bootstrap/Dropdown";

import {
  formattedEvents,
  formattedDate,
  formattedTime,
} from "./helpers/DateFormats";

const EventContext = createContext();

const initialState = {
  events: [],
};

const ADD_EVENT = "ADD_EVENT";
const DELETE_EVENT = "DELETE_EVENT";
const EDIT_EVENT = "EDIT_EVENT";

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

    default:
      throw new Error(`Invalid action type: ${action.type}`);
  }
}

function MyModal(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [showEvents, setShowEvents] = useState(false);

  const [editEvent, setEditEvent] = useState("");

  const clearInputs = () => {
    setEditEvent(null);
    setTitle("");
    setStart("");
    setEnd("");
    setDescription("");
    setLocation("");
  };

  const formRef = useRef(null);

  //   adding events

  const handleAddEvent = (e) => {
    e.preventDefault();
    const newEvent = {
      id: uuidv4(),
      title,
      start,
      end,
      description,
      location,
    };
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
      }
      state.events = [];
      console.log("state.events=", state.events);
    }
  };

  function handleEditClick() {
    formRef.current.focus();
  }

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
              <input
                type="text"
                id="title"
                name="title"
                list="events"
                value={editEvent ? editEvent.title : title || ""}
                onChange={(e) => {
                  editEvent
                    ? setEditEvent({ ...editEvent, title: e.target.value })
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
                    required
                  />
                </div>
              </div>
              <input
                type="text"
                id="description"
                name="description"
                placeholder="Event Description"
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
              <input
                type="text"
                id="location"
                name="location"
                placeholder="Location"
                value={editEvent ? editEvent.location : location || ""}
                onChange={(e) =>
                  editEvent
                    ? setEditEvent({ ...editEvent, location: e.target.value })
                    : setLocation(e.target.value)
                }
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
                {state.events && state.events.length > 0 ? (
                  <button type="button" onClick={handleDownload}>
                    <FiDownload /> Download ics
                  </button>
                ) : (
                  <button>Add To Download</button>
                )}
              </div>
            </form>
          </div>

          <div className="events-table">
            {showEvents && (
              <div className="added-events">
                {state.events < 1 ? (
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
                )}
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          {/* <Button onClick={props.onHide}>Close</Button>
           */}
          <button
            onClick={() => setShowEvents(!showEvents)}
            className="showtable-btn"
          >
            {showEvents ? "Hide Events" : "View all Events"}
          </button>
        </Modal.Footer>
      </Modal>
    </EventContext.Provider>
  );
}

export default MyModal;
