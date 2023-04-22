import { Button } from "react-bootstrap";
import { Navbar } from "react-bootstrap";
import { useState } from "react";
import Footer from "./Footer";

import MyModal from "./Modal";
import CountryHolidays from "./CountryHolidays";

const Home = () => {
  const [modalShow, setModalShow] = useState(false);

  return (
    <>
      <Navbar className="navbar fixed-top bg-white">
        <Navbar.Brand href="/">asranna</Navbar.Brand>
      </Navbar>
      <div className="home">
        <div className="heading">
          <h1>
            Don&apos;t miss holidays, events <br></br>and birthdays.
          </h1>
          <p>
            {" "}
            Add important dates to asranna, download and sync <br></br>with your
            calender.
          </p>

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
      <div>
        <CountryHolidays />
      </div>

      <Footer />
    </>
  );
};

export default Home;
