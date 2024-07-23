import React, { useEffect, useState } from "react";
import traduction from "../../traductions/traduction.json"
import { logout } from "../request/request";
import {  NavLink, useNavigate } from "react-router-dom";
import { useAssoContext } from "../main";

export function MenuLeftMaster() {
    const asso = useAssoContext()

    return (
        <nav className="div_menu_left">
            <NavLink to={"/" + asso.asso?.domainName} className="link_return">
                <img src='/icone/returnWhite.png' className='taille_icone50'></img>
            </NavLink>
            <div className="div_inner_menu">
                <div className="div_padding10">
                    <NavLink to={"association"} className={({ isActive }) => (isActive ? "link link_active" : "link")} end>{traduction.association}</NavLink>
                </div>
                <div className="div_padding10">
                    <NavLink to={"users"} className={({ isActive }) => (isActive ? "link link_active" : "link")} end>{traduction.users}</NavLink>
                </div>
                <div className="div_padding10">
                    <NavLink to={"cotisations"} className={({ isActive }) => (isActive ? "link link_active" : "link")} end>{traduction.cotisation_title}</NavLink>
                </div>
                <div className="div_padding10">
                    <NavLink to={"transactions"} className={({ isActive }) => (isActive ? "link link_active" : "link")} end>{traduction.transactions}</NavLink>
                </div>
            </div>
        </nav>
    )
}