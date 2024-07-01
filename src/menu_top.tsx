import React, { useEffect, useState } from "react";
import traduction from "../traductions/traduction.json"
import { Association, logout } from "./request";
import { useNavigate } from "react-router-dom";

export interface MenuTopProps {
    asso: Association
}

export function Menu_top(props: MenuTopProps) {
    const [isConnected, setIsConnected] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        if(localStorage.getItem(props.asso.domainName + '-token') !== null) {
        setIsConnected(true)
        } else {
        setIsConnected(false)
        }
        
    })

    const handleLogout = async () => {
        await logout(props.asso.domainName)
        navigate("/"+props.asso.domainName)
    }

    return (
        <div className="div_menu">
            <div className="div_align_item">
                <div className="div_padding10_horizontal">
                    <h1 className="title_asso">{props.asso.name}</h1>
                </div>
                <div className="div_padding10_horizontal">
                    <a id="lHome" href={"/" + props.asso.domainName} className="link">{traduction.home}</a>
                </div>
                <div className="div_padding10_horizontal">
                    <a id="lAbout" href={"/" + props.asso.domainName + "/about"} className="link">{traduction.about}</a>
                </div>
                <div className="div_padding10_horizontal">
                    <a id="lEvent" href={"/" + props.asso.domainName + "/event"} className="link">{traduction.event}</a>
                </div>
                <div className="div_padding10_horizontal">
                    <a id="lCalendar" href={"/" + props.asso.domainName + "/calendar"} className="link">{traduction.calendar}</a>
                </div>
            </div>
            
            <div className="div_align_item">
                <div className="div_padding10_horizontal">
                    <a id="btDonate" className="link_button" href={"/" + props.asso.domainName + "/donate"}>{traduction.donate}</a>
                </div>
                {!isConnected &&
                (<div className="div_padding10_horizontal">
                    <a id="lLogin" href={"/" + props.asso.domainName + "/login"} className="link_button">{traduction.login}</a>
                </div>)}
                {!isConnected && (
                <div className="div_padding10_horizontal">
                    <a id="lSignUp" href={"/" + props.asso.domainName + "/signup"} className="link_button">{traduction.signup}</a>
                </div>)}
                {isConnected && 
                (<div className="div_align_item">
                    <label>Bonjour Monsieur</label>
                    <img src="/icone/test.png"></img>
                    <img src="/icone/152535.png" onClick={handleLogout}></img>
                </div>)}
            </div>
            
        </div>
    )
}