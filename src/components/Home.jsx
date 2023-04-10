import { Button } from "react-bootstrap";

import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <div id="home">
        <div className="heading">
          <h2>
            Don&apos;t miss holidays , events and birthdays of your loved ones
            anymore. Use <span>asranna</span>
          </h2>
          <Link to="/add-date">
            <Button className="button" size="lg">
              Create Event
            </Button>
          </Link>

          <p>
            Receive gift ideas for special occasions and Oh no! No time to
            arrange a gift? We got you{" "}
            <span>
              {" "}
              <Link to="/gifts">
                <a href="">covered</a>
              </Link>
              .
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
