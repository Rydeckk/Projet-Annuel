import React, { FormEvent, useState } from "react";
import traduction from "../../traductions/traduction.json"
import { Association, login, signUp } from "../request/request";
import { useNavigate } from "react-router-dom";
import { useAssoContext, useUserContext } from "../main";
import { getUser } from "../request/requestUser";


export function SignUp() {
    const [password, setPassword] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [firstName, setFirstName] = useState<string>("")
    const [lastName, setLastName] = useState<string>("")
    const [address, setAddress] = useState<string>("")
    const navigate = useNavigate()
    const asso = useAssoContext()
    const userContext = useUserContext()

    const handleSignUp = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if(asso.asso !== null) {
            await signUp(asso.asso.domainName, {email,password,firstName,lastName,address})
            await login(asso.asso.domainName, {email, password})
            const user = await getUser(asso.asso.domainName)
            userContext.setUser(user)
            navigate("/" + asso.asso.domainName)
        }
        
    }
    
    return (
        <div className="div_center div_background_black">
            <h1 className="title_section">{traduction.signup_title}</h1>
            <form onSubmit={handleSignUp} className="div_background_black_degrade">
                <div className="div_column">
                    <label className="label_form">{traduction.firstName}</label>
                    <input inputMode="text" placeholder="Rentrez votre prénom" className="input" onChange={(e) => {setFirstName(e.target.value)}} required></input>
                </div>
                <div className="div_column">
                    <label className="label_form">{traduction.lastName}</label>
                    <input inputMode="text" placeholder="Rentrez votre nom" className="input" onChange={(e) => {setLastName(e.target.value)}} required></input>
                </div>
                <div className="div_column">
                    <label className="label_form">{traduction.address}</label>
                    <input inputMode="text" placeholder="Rentrez votre adresse" className="input" onChange={(e) => {setAddress(e.target.value)}} required></input>
                </div>
                <div className="div_column">
                    <label className="label_form">{traduction.mail}</label>
                    <input inputMode="text" placeholder={traduction.enter_mail} className="input" onChange={(e) => {setEmail(e.target.value)}} required></input>
                </div>
                <div className="div_column">
                    <label className="label_form">{traduction.password}</label>
                    <input inputMode="text" placeholder={traduction.enter_password} className="input" onChange={(e) => {setPassword(e.target.value)}} required></input>
                </div>
                <div className="div_column" style={{alignItems:"center"}}>
                    <button className="button_class" type="submit">{traduction.signup_form}</button>
                </div>
            </form>
        </div>
    )
}