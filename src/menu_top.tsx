import React, { useEffect, useState } from "react";
import traduction from "../traductions/traduction.json"
import { Association, logout } from "./request";
import { useNavigate } from "react-router-dom";
import { useAssoContext } from "./main";

export function Menu_top() {
    const [isConnected, setIsConnected] = useState(false)
    const navigate = useNavigate()
    const asso = useAssoContext()

    if(asso.asso !== null){
        useEffect(() => {
            if(asso.asso !== null) {
                if(localStorage.getItem(asso.asso.domainName + '-token') !== null) {
                        setIsConnected(true)
                } else {
                    setIsConnected(false)
                }
            }
        })

        const handleLogout = async () => {
            if(asso.asso !== null){
                await logout(asso.asso.domainName)
                navigate("/"+asso.asso.domainName)
            }
        }

        return (
            <div className="div_menu">
                <div className="div_align_item">
                    <div className="div_padding10_horizontal">
                        <h1 className="title_asso">{asso.asso.name}</h1>
                    </div>
                    <div className="div_padding10_horizontal">
                        <a id="lHome" href={"/" + asso.asso.domainName} className="link">{traduction.home}</a>
                    </div>
                    <div className="div_padding10_horizontal">
                        <a id="lAbout" href={"/" + asso.asso.domainName + "/about"} className="link">{traduction.about}</a>
                    </div>
                    <div className="div_padding10_horizontal">
                        <a id="lEvent" href={"/" + asso.asso.domainName + "/event"} className="link">{traduction.event}</a>
                    </div>
                    <div className="div_padding10_horizontal">
                        <a id="lCalendar" href={"/" + asso.asso.domainName + "/calendar"} className="link">{traduction.calendar}</a>
                    </div>
                </div>
                
                <div className="div_align_item">
                    <div className="div_padding10_horizontal">
                        <a id="btDonate" className="link_button" href={"/" + asso.asso.domainName + "/donate"}>{traduction.donate}</a>
                    </div>
                    {!isConnected &&
                    (<div className="div_padding10_horizontal">
                        <a id="lLogin" href={"/" + asso.asso.domainName + "/login"} className="link_button">{traduction.login}</a>
                    </div>)}
                    {!isConnected && (
                    <div className="div_padding10_horizontal">
                        <a id="lSignUp" href={"/" + asso.asso.domainName + "/signup"} className="link_button">{traduction.signup}</a>
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
}