import { useEffect, useState, useRef, useReducer, createContext } from "react";

import { createEvents } from "ics";
import FileSaver from "file-saver";
import { v4 as uuidv4 } from "uuid";

// import moment from "moment";

import { IoAddCircleOutline } from "react-icons/io5";
import { IoSettingsOutline } from "react-icons/io5";
import { FiDownload } from "react-icons/fi";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import Dropdown from "react-bootstrap/Dropdown";
import Popover from "react-bootstrap/Popover";
import Overlay from "react-bootstrap/Overlay";

import {
  formattedEvents,
  formattedDate,
  formattedTime,
} from "./helpers/DateFormats";

// import { formatDate, formatTime } from "./helpers/dateFormats";

const EventContext = createContext();

const initialState = {
  events: [],
  showModal: false,
  editEvent: null,
};

const ADD_EVENT = "ADD_EVENT";
const DELETE_EVENT = "DELETE_EVENT";
const EDIT_EVENT = "EDIT_EVENT";
const SET_SHOW_MODAL = "SET_SHOW_MODAL";
const SET_EDIT_EVENT = "SET_EDIT_EVENT";

function reducer(state, action) {
  switch (action.type) {
    case ADD_EVENT:
      return {
        ...state,
        events: [...state.events, action.payload],
      };
    case DELETE_EVENT:
      console.log("states=", state.events);
      console.log("payload=", action.payload);
      return {
        ...state,
        events: state.events.filter((id) => id !== action.payload),
      };
    case EDIT_EVENT:
      return {
        ...state,
        events: state.events.map((event) =>
          event.id === action.payload.id ? action.payload : event
        ),
      };
    case SET_SHOW_MODAL:
      return {
        ...state,
        showModal: action.payload,
      };
    case SET_EDIT_EVENT:
      return {
        ...state,
        editEvent: action.payload,
      };
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
  const [events, setEvents] = useState([]);
  const [showEvents, setShowEvents] = useState(false);
  const [editEvent, setEditEvent] = useState("");

  const [updatedEventsArray, setUpdatedEventsArray] = useState([]);

  const clearInputs = () => {
    setTitle("");
    setStart("");
    setEnd("");
    setDescription("");
    setLocation("");
  };

  //   const [showPop, setShowPop] = useState(false);
  //   const [target, setTarget] = useState(null);

  const popRef = useRef(null);
  const formRef = useRef(null);

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

    setEvents((prevEvents) => {
      const updatedEvents = [...prevEvents, newEvent];
      console.log("events=", updatedEvents);
      setUpdatedEventsArray(updatedEvents);
      return updatedEvents;
    });
    clearInputs();
  };

  useEffect(() => {
    console.log(updatedEventsArray);
  }, [updatedEventsArray]);

  const handleEditEvent = (e) => {
    e.preventDefault();

    let newEvents = events;

    if (editEvent) {
      newEvents = events.map((event) => {
        if (event.id === editEvent.id) {
          return editEvent;
        } else {
          return event;
        }
      });
      console.log("updatedEvents=", newEvents);
    }
    setUpdatedEventsArray(newEvents);

    dispatch({ type: EDIT_EVENT, payload: newEvents });
    setEvents(newEvents);
    setEditEvent(null);
    clearInputs();
  };

  const handleDeleteEvent = (event) => {
    let eventId = "";
    eventId = event.target.dataset.id;
    console.log("id=del=", eventId);
    // const eventDel = id.target.dataset;
    dispatch({ type: DELETE_EVENT, payload: eventId });
  };

  const handleDownload = async () => {
    const formatted = formattedEvents(events);
    setEvents(formatted);
  };

  useEffect(() => {
    if (events.length > 0) {
      console.log("formadrr=", events);
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
    }
  }, [events]);

  function handleEditClick() {
    formRef.current.focus();
  }

  //   const deleteClick = (event) => {
  //     setShowPop(!showPop);
  //     setTarget(event.target);
  //   };

  //   const dateArr = [2000, 11, 24, 19, 49];
  // const date = new Date(...dateArr);
  //   const formattedDate = formatDateBack(dateArr);
  //   console.log(formattedDate);

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
                {events && events.length > 0 ? (
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
                      {(updatedEventsArray.length > 0
                        ? updatedEventsArray
                        : events
                      ).map((event, id) => (
                        <tr key={id}>
                          <td> {event.title}</td>
                          <td>{formattedDate(event.start)}</td>
                          {/* <td>{event.start} </td> */}
                          <td>{formattedTime(event.start)}</td>
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

                                <Dropdown.Item
                                  data-id={event.id}
                                  onClick={(e) => handleDeleteEvent(e)}
                                >
                                  Delete
                                </Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>
                            <Overlay
                              //   show={showPop}
                              //   target={target}
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
