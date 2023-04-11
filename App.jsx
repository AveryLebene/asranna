import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Navbar } from "react-bootstrap";

import Home from "./src/components/Home";

const App = () => {
  return (
    <BrowserRouter>
      <Navbar className="navbar">
        <Navbar.Brand href="/">asranna</Navbar.Brand>
      </Navbar>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
};

// const container = document.getElementById("root");
// const root = createRoot(container);
// root.render(<App />);
export default App;
