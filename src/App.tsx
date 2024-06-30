import React, { useEffect, useState } from "react";
import { Menu_top } from "./menu_top";
import { Home } from "./Home";
import { Route, BrowserRouter as Router, Routes, useLocation } from "react-router-dom";
import { About } from "./About";
import { Calendar } from "./Calendar";
import { Events } from "./Events";
import { Login } from "./Login";
import "../class/classes.css"
import { SignUp } from "./SignUp";
import { Donate } from "./donate";

export function verifDomainName(domainName: string): string | null {
  fetch("http://vps-1d054ff8.vps.ovh.net:3000/association?" + new URLSearchParams({
    domainName: domainName
  }).toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow'
  })
  .then((response) => {
    console.log(response.json())
  })
  .then((data) => {
    console.log(data)
  })
  .catch((error) => {
    console.log("error : " + error)
    return null
  })

  return null
}

export async function App() {
  const [isMenuTopVisible, setIsMenuTopVisible] = useState(true)
  const location = useLocation();
  const listUrl = location.pathname.split("/")

  const domainName = verifDomainName(listUrl[1]) 

  useEffect(() => {
    const pathsWithMenu = [domainName + '/', domainName + '/about', domainName + '/event', domainName + '/calendar',domainName + '/donate'];

    setIsMenuTopVisible(pathsWithMenu.includes(location.pathname));
  }, [location.pathname]);

  return (
    <div>
      {isMenuTopVisible && <Menu_top />}
      <Routes>
        <Route path=":domainName/" element={<Home />}/>
        <Route path=":domainName/about" element={<About />} />
        <Route path=":domainName/event" element={<Events />} />
        <Route path=":domainName/calendar" element={<Calendar />} />
        <Route path=":domainName/login" element={<Login />} />
        <Route path=":domainName/signup" element={<SignUp />} />
        <Route path=":domainName/donate" element={<Donate />} />
      </Routes>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}