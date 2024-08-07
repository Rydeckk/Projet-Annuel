import React from "react";
import traduction from "../../traductions/traduction.json"
import { NavLink } from "react-router-dom";
import { useAssoContext } from "../main";

export function MenuLeft() {
    const asso = useAssoContext()

    return (
        <nav className="div_menu_left">
            <NavLink to={"/" + asso.asso?.domainName} className="link_return">
                <img src='/icone/returnWhite.png' className='taille_icone50'></img>
            </NavLink>
            <div className="div_inner_menu">
                <div className="div_padding10">
                    <NavLink to={"myinfo"} className={({ isActive }) => (isActive ? "link link_active" : "link")} end>{traduction.myinfo}</NavLink>
                </div>
                <div className="div_padding10">
                    <NavLink to={"mymembership"} className={({ isActive }) => (isActive ? "link link_active" : "link")} end>{traduction.myMemberShip}</NavLink>
                </div>
                <div className="div_padding10">
                    <NavLink to={"mytransaction"} className={({ isActive }) => (isActive ? "link link_active" : "link")} end>{traduction.mytransactions}</NavLink>
                </div>
                <div className="div_padding10">
                    <NavLink to={"myged"} className={({ isActive }) => (isActive ? "link link_active" : "link")} end>{traduction.myged}</NavLink>
                </div>
            </div>
        </nav>
    )
}