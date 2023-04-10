import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Navbar } from "react-bootstrap";

import Home from "./src/components/Home";
import Footer from "./src/components/Footer";

import Gifts from "./src/components/Gifts";

const App = () => {
  return (
    <BrowserRouter>
      <Navbar className="navbar">
        <Navbar.Brand href="/">asranna</Navbar.Brand>
      </Navbar>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/gifts" element={<Gifts />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

// const container = document.getElementById("root");
// const root = createRoot(container);
// root.render(<App />);
export default App;
