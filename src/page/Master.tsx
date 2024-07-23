import React, { FormEvent, useState } from "react";
import traduction from "../../traductions/traduction.json"
import { MenuLeftMaster } from "../component/menu_left_master";
import { Route, Routes } from "react-router-dom";
import { Association } from "../component/Association";
import { Users } from "../component/Users";
import { Transactions } from "./Transactions";
import { Cotisations } from "./Cotisations";

export function Master() {
    return (
        <div className="div_profile">
            <MenuLeftMaster></MenuLeftMaster>
            <div className="div_inner_profile">
                <div>
                    <h1 className="title_section">{traduction.welcome_settings}</h1>
                </div>
                <div className="div_profile_content">
                    <Routes>
                        <Route path={""} />
                        <Route path={"association"} element={<Association/>}/>
                        <Route path={"users"} element={<Users/>}/>
                        <Route path={"cotisations"} element={<Cotisations/>}/>
                        <Route path={"transactions"} element={<Transactions/>}/>
                    </Routes>
                </div>
            </div>
            
        </div>
    )
}