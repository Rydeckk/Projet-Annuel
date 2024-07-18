import React, { useEffect, useState } from "react";
import { Menu_top } from "./component/menu_top";
import { Home } from "./page/Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { About } from "./page/About";
import { Calendar } from "./page/Calendar";
import { Events } from "./page/Events";
import { Login } from "./page/Login";
import "../class/classes.css"
import { SignUp } from "./page/SignUp";
import { Donate } from "./page/donate";
import { useAssoContext } from "./main";
import { Profile } from "./page/Profile";

export function App() {
  const [isMenuTopVisible, setIsMenuTopVisible] = useState(true)
  const asso = useAssoContext()

  useEffect(() => {
    if(asso.asso !== null) {
      const pathsWithMenu = [
        asso.asso.domainName
        , asso.asso.domainName + 'about'
        , asso.asso.domainName + 'event'
        , asso.asso.domainName + 'calendar'
        , asso.asso.domainName + 'donate'];
      setIsMenuTopVisible(pathsWithMenu.includes(location.pathname.replace(/\//g,"")));
    }
  }, [location.pathname, asso.asso]);

  if (asso.asso !== null) {
    return (
      <div className="div_root">
        {isMenuTopVisible && <Menu_top />}
        <Routes>
          <Route path={"/"+asso.asso.domainName} element={<Home />}/>
          <Route path={"/"+asso.asso.domainName + "/about"} element={<About />} />
          <Route path={"/"+asso.asso.domainName + "/event"} element={<Events />} />
          <Route path={"/"+asso.asso.domainName + "/calendar"} element={<Calendar />} />
          <Route path={"/"+asso.asso.domainName + "/login"} element={<Login />} />
          <Route path={"/"+asso.asso.domainName + "/signup"} element={<SignUp />} />
          <Route path={"/"+asso.asso.domainName + "/donate"} element={<Donate />} />
          <Route path={"/"+asso.asso.domainName + "/myprofile/*"} element={<Profile />} />
          <Route path={"/"+asso.asso.domainName + "/master"} />
        </Routes>
      </div>
    );
  }
}

export default function AppWrapper() {
  const asso = useAssoContext()

  if(asso.asso !== null) {
    return (
      <App/>
    );
  } else {
    return (
      <div>
        <p style={{backgroundColor: "white"}}>Error 404</p>
        <p style={{backgroundColor: "white"}}>Bad domain Name</p>
      </div>
    )
  }
  
}