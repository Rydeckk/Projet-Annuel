import React, { FormEvent, useState } from "react";
import traduction from "../../traductions/traduction.json"
import { login } from "../request/request";
import { useNavigate } from "react-router-dom";
import { useAssoContext, useUserContext } from "../main";
import { getUser } from "../request/requestUser";

export function Login() {
    const [password, setPassword] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const navigate = useNavigate()
    const asso = useAssoContext()
    const userContext = useUserContext()

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if(asso.asso !== null) {
            await login(asso.asso.domainName, {email,password})
            const user = await getUser(asso.asso.domainName)
            userContext.setUser(user)
            navigate("/" + asso.asso.domainName)
        }
    }
        

    return (
        <div className="div_center div_background_black">
            <h1 className="title_section">{traduction.login_title}</h1>
            <form onSubmit={handleLogin} className="div_background_black_degrade">
                <div className="div_column">
                    <label className="label_form">{traduction.mail}</label>
                    <input id="inMail" inputMode="email" placeholder={traduction.enter_mail} className="input" onChange={(e) => setEmail(e.target.value)} required></input>
                </div>
                <div className="div_column">
                    <label className="label_form">{traduction.password}</label>
                    <input id="inPassword" type="password" placeholder={traduction.enter_password} className="input" onChange={(e) => setPassword(e.target.value)} required></input>
                </div>
                <div className="div_column" style={{alignItems:"center"}}>
                    <button className="button_class" type="submit">{traduction.connect}</button>
                </div>
            </form>
        </div>
    )
}