import React, { useState } from "react";
import traduction from "../../traductions/traduction.json"
import { MenuLeft } from "../component/menu_left";
import { Routes, Route } from "react-router-dom";
import { useAssoContext } from "../main";
import { Info } from "./Info";
import { MemberShip } from "./MemberShip";
import { Transaction } from "./Transaction";
import { MyEvents } from "./MyEvents";
import { Ged } from "./Ged";

export function Profile() {
    const asso = useAssoContext()
    
    return (
        <div className="div_profile">
            <MenuLeft></MenuLeft>
            <div className="div_inner_profile">
                <div style={{color: "#002f86"}}>
                    <h1>{traduction.welcomeMySpace}</h1>
                </div>
                <div className="div_profile_content">
                    <Routes>
                        <Route path={""} />
                        <Route path={"myinfo"} element={<Info />} />
                        <Route path={"mymembership"} element={<MemberShip />}/>
                        <Route path={"mytransaction"} element={<Transaction />}/>
                        <Route path={"myevents"} element={<MyEvents />}/>
                        <Route path={"myged"} element={<Ged />}/>
                    </Routes>
                </div>
            </div>
            
        </div>
    )
}