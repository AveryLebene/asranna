import { Button } from "react-bootstrap";
import { useState } from "react";

// import { Link } from "react-router-dom";
import MyModal from "./Modal";

const Home = () => {
  const [modalShow, setModalShow] = useState(false);

  return (
    <div>
      <div id="home">
        <div className="heading">
          <h2>
            Don&apos;t miss holidays , events and birthdays of your loved ones
            anymore. Add events of asranna, download file and easily sync with
            your calender or share with your team.
          </h2>

          <Button
            className="button"
            size="lg"
            onClick={() => setModalShow(true)}
          >
            Create Event
          </Button>
          <MyModal show={modalShow} onHide={() => setModalShow(false)} />

          {/* <p>
            Receive gift ideas for special occasions. No time to arrange a gift?
            We got you{" "}
            <span>
              {" "}
              <Link to="/gifts">
                <a href="">covered</a>
              </Link>
              .
            </span>
          </p> */}
        </div>
      </div>
    </div>
  );
};

export default Home;
