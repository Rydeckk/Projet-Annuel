import React, { useState } from "react";
import traduction from "../traductions/traduction.json"
import { Association, login } from "./request/request";
import { redirect, useNavigate } from "react-router-dom";
import { useAssoContext } from "./main";

export function Login() {
    const [password, setPassword] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const navigate = useNavigate()
    const asso = useAssoContext()

    const handleLogin = async () => {
        if(asso.asso !== null) {
            await login(asso.asso.domainName, {email,password})
            navigate("/" + asso.asso.domainName)
        }
    }
        

    return (
        <div className="div_center div_background_black">
            <div className="div_background_black_degrade">
                <div className="div_column">
                    <label className="label_form">{traduction.mail}</label>
                    <input id="inMail" inputMode="email" placeholder={traduction.enter_mail} className="input" onChange={(e) => setEmail(e.target.value)}></input>
                </div>
                <div className="div_column">
                    <label className="label_form">{traduction.password}</label>
                    <input id="inPassword" type="password" placeholder={traduction.enter_password} className="input" onChange={(e) => setPassword(e.target.value)}></input>
                </div>
                <div className="div_column" style={{alignItems:"center"}}>
                    <button className="button_class" type="submit" onClick={handleLogin}>{traduction.connect}</button>
                </div>
            </div>
        </div>
    )
}