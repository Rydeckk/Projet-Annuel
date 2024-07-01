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
import { Association, getAssoByDomainName } from "./request";

export interface AppProps {
  asso: Association
}

export function App(props: AppProps) {
  const [isMenuTopVisible, setIsMenuTopVisible] = useState(true)

  useEffect(() => {
    if(props.asso !== null) {
      const pathsWithMenu = [
        '/' + props.asso.domainName
        , '/' + props.asso.domainName + '/about'
        , '/' + props.asso.domainName + '/event'
        , '/' + props.asso.domainName + '/calendar'
        , '/' + props.asso.domainName + '/donate'];
      setIsMenuTopVisible(pathsWithMenu.includes(location.pathname));
    }
  }, [location.pathname, props.asso]);

  return (
    <div>
      {isMenuTopVisible && <Menu_top asso={props.asso}/>}
      <Routes>
        <Route path={"/"+props.asso.domainName} element={<Home />}/>
        <Route path={"/"+props.asso.domainName + "/about"} element={<About asso={props.asso}/>} />
        <Route path={"/"+props.asso.domainName + "/event"} element={<Events asso={props.asso}/>} />
        <Route path={"/"+props.asso.domainName + "/calendar"} element={<Calendar asso={props.asso}/>} />
        <Route path={"/"+props.asso.domainName + "/login"} element={<Login asso={props.asso}/>} />
        <Route path={"/"+props.asso.domainName + "/signup"} element={<SignUp asso={props.asso}/>} />
        <Route path={"/"+props.asso.domainName + "/donate"} element={<Donate asso={props.asso}/>} />
      </Routes>
    </div>
  );
}

export default function AppWrapper() {
  const [asso, setAsso] = useState<Association | null>(null);
  const location = useLocation();
  const listUrl = location.pathname.split("/")

  useEffect(() => {
    const verifDomain = async () => {
      const resultAsso = await getAssoByDomainName(listUrl[1])
      if(resultAsso !== null) {
        setAsso(resultAsso)
      }
    }
    
    verifDomain()
  }, [])

  if(asso !== null) {
    return (
      <App asso={asso}/>
      
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