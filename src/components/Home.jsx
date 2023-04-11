import { Button } from "react-bootstrap";
import { Navbar } from "react-bootstrap";
import { useState } from "react";
import Footer from "./Footer";

import MyModal from "./Modal";

const Home = () => {
  const [modalShow, setModalShow] = useState(false);

  return (
    <>
      <Navbar className="navbar fixed-top bg-white">
        <Navbar.Brand href="/">asranna</Navbar.Brand>
      </Navbar>
      <div>
        <div id="home">
          <div className="heading">
            <h2>
              Don&apos;t miss holidays , events and birthdays. Add important
              dates to asranna, download file and easily sync with your calender
              or share with your team.
            </h2>

            <Button
              className="button"
              size="lg"
              onClick={() => setModalShow(true)}
            >
              Create Event
            </Button>
            <MyModal show={modalShow} onHide={() => setModalShow(false)} />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;
