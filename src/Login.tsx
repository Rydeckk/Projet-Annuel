import React from "react";
import traduction from "../traductions/traduction.json"

export function Login() {
    return (
        <div className="div_center div_background_black">
            <div className="div_background_black_degrade">
                <div className="div_column">
                    <label className="label_form">{traduction.mail}</label>
                    <input inputMode="email" placeholder={traduction.enter_mail} className="input"></input>
                </div>
                <div className="div_column">
                    <label className="label_form">{traduction.password}</label>
                    <input inputMode="text" placeholder={traduction.enter_password} className="input"></input>
                </div>
                <div className="div_column" style={{alignItems:"center"}}>
                    <button className="button_class">{traduction.connect}</button>
                </div>
            </div>
        </div>
    )
}