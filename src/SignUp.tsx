import React, { useState } from "react";
import traduction from "../traductions/traduction.json"
import { Association, signUp } from "./request";
import { useNavigate } from "react-router-dom";

export interface SignUpProps {
    asso: Association
}

export function SignUp(props: SignUpProps) {
    const [password, setPassword] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [firstName, setFirstName] = useState<string>("")
    const [lastName, setLastName] = useState<string>("")
    const [address, setAddress] = useState<string>("")
    const navigate = useNavigate()

    const handleSignUp = async () => {
        await signUp(props.asso.domainName, {email,password,firstName,lastName,address})
        navigate("/" + props.asso.domainName)
    }
    
    return (
        <div className="div_center div_background_black">
            <div className="div_background_black_degrade">
                <div className="div_column">
                    <label className="label_form">{traduction.firstName}</label>
                    <input inputMode="text" placeholder="Rentrez votre prénom" className="input"></input>
                </div>
                <div className="div_column">
                    <label className="label_form">{traduction.lastName}</label>
                    <input inputMode="text" placeholder="Rentrez votre nom" className="input"></input>
                </div>
                <div className="div_column">
                    <label className="label_form">{traduction.address}</label>
                    <input inputMode="text" placeholder="Rentrez votre adresse" className="input"></input>
                </div>
                <div className="div_column">
                    <label className="label_form">{traduction.mail}</label>
                    <input inputMode="text" placeholder={traduction.enter_mail} className="input"></input>
                </div>
                <div className="div_column">
                    <label className="label_form">{traduction.password}</label>
                    <input inputMode="text" placeholder={traduction.enter_password} className="input"></input>
                </div>
                <div className="div_column" style={{alignItems:"center"}}>
                    <button className="button_class">{traduction.signup_form}</button>
                </div>
            </div>
        </div>
    )
}