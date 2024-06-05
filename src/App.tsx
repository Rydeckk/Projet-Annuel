import React, { useState } from "react";
import { Menu_top } from "./menu_top";
import { Home } from "./Home";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { About } from "./About";
import { Calendar } from "./Calendar";
import { Events } from "./Events";
import { Login } from "./Login";
import "../class/classes.css"

export function App() {
  const [isMenuTopVisible, setIsMenuTopVisible] = useState(true)
  return (
    <div>
      {isMenuTopVisible && <Menu_top />}
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/event" element={<Events />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </div>
  );
}