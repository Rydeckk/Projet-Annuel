import React, { useEffect, useState } from "react";
import traduction from "../../traductions/traduction.json"
import { logout } from "../request/request";
import { NavLink, useNavigate } from "react-router-dom";
import { useAssoContext, useUserContext } from "../main";

export function Menu_top() {
    const [isConnected, setIsConnected] = useState(false)
    const navigate = useNavigate()
    const asso = useAssoContext()
    const userContext = useUserContext()

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
            <nav className="div_menu">
                <div className="div_align_item">
                    <div className="div_padding10_horizontal">
                        <h1 className="title_asso">{asso.asso.name}</h1>
                    </div>
                    <div className="div_padding10_horizontal">
                        <NavLink id="lHome" to={"/" + asso.asso.domainName} className={({ isActive }) => (isActive ? "link link_active" : "link")} end>{traduction.home}</NavLink>
                    </div>
                    <div className="div_padding10_horizontal">
                        <NavLink id="lAbout" to={"/" + asso.asso.domainName + "/about"} className={({ isActive }) => (isActive ? "link link_active" : "link")} end>{traduction.about}</NavLink>
                    </div>
                    <div className="div_padding10_horizontal">
                        <NavLink id="lEvent" to={"/" + asso.asso.domainName + "/event"} className={({ isActive }) => (isActive ? "link link_active" : "link")} end>{traduction.event}</NavLink>
                    </div>
                    <div className="div_padding10_horizontal">
                        <NavLink id="lSondage" to={"/" + asso.asso.domainName + "/sondage"} className={({ isActive }) => (isActive ? "link link_active" : "link")} end>{traduction.sondage}</NavLink>
                    </div>
                    <div className="div_padding10_horizontal">
                        <NavLink id="lCalendar" to={"/" + asso.asso.domainName + "/assemblee"} className={({ isActive }) => (isActive ? "link link_active" : "link")} end>{traduction.assemblee}</NavLink>
                    </div>
                    <div className="div_padding10_horizontal">
                        <NavLink id="btDonate" className={({ isActive }) => (isActive ? "link link_active" : "link")} to={"/" + asso.asso.domainName + "/donate"} end>{traduction.donate}</NavLink>
                    </div>
                </div>
                
                <div className="div_align_item">
                    {!isConnected &&
                    (<div className="div_padding10_horizontal">
                        <NavLink id="lLogin" to={"/" + asso.asso.domainName + "/login"} className="link_button" end>{traduction.login}</NavLink>
                    </div>)}
                    {!isConnected && (
                    <div className="div_padding10_horizontal">
                        <NavLink id="lSignUp" to={"/" + asso.asso.domainName + "/signup"} className="link_button" end>{traduction.signup}</NavLink>
                    </div>)}
                    {isConnected && 
                    (<div className="div_align_item">
                        <label className="label_hello">{traduction.hello} <br/> {userContext.user?.lastname} {userContext.user?.firstname}</label>
                        <NavLink style={{padding: "0px 20px"}} id="lMyProfile" to={"/"+asso.asso?.domainName+"/myprofile"} className={"tooltip"} end>
                            <img src="/icone/user.png" className="taille_icone30" alt={traduction.my_profile}></img>
                            <span className="tooltiptext">{traduction.my_profile}</span>
                        </NavLink>
                        <NavLink style={{padding: "0px 20px"}} id="lMyProfile" to={"/"+asso.asso?.domainName+"/master"} className={"tooltip"} end>
                            <img src="/icone/gearWhite.png" className="taille_icone30" alt={traduction.my_profile}></img>
                            <span className="tooltiptext">{traduction.settings}</span>
                        </NavLink>
                        <div className="tooltip">
                            <img src="/icone/logoutWhite.png" onClick={handleLogout} className="clickable-image taille_icone30" alt={traduction.logout}></img>
                            <span className="tooltiptext">{traduction.logout}</span>
                        </div>
                    </div>)}
                </div>
                
            </nav>
        )
    }
}