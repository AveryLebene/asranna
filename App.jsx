import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./src/components/Home";
const App = () => {
  return (
    <BrowserRouter>
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
