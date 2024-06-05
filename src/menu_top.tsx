import React from "react";
import traduction from "../traductions/traduction.json"

export function Menu_top() {
    return (
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",backgroundColor:"#333333"}}>
            <div className="div_align_item">
                <div className="div_padding10_horizontal">
                    <h1>Nom de l'association</h1>
                </div>
                <div className="div_padding10_horizontal">
                    <a id="lHome" href="/">{traduction.home}</a>
                </div>
                <div className="div_padding10_horizontal">
                    <a id="lAbout" href="/about">{traduction.about}</a>
                </div>
                <div className="div_padding10_horizontal">
                    <a id="lEvent" href="/event">{traduction.event}</a>
                </div>
                <div className="div_padding10_horizontal">
                    <a id="lCalendar" href="/calendar">{traduction.calendar}</a>
                </div>
            </div>
            
            <div className="div_align_item">
                <div className="div_padding10_horizontal">
                    <button id="btDonate">{traduction.donate}</button>
                </div>
                <div className="div_padding10_horizontal">
                    <a id="lLogin" href="/login">{traduction.login}</a>
                </div>
                <div className="div_padding10_horizontal">
                    <a id="btSignUp" href="/signup">{traduction.signup}</a>
                </div>
                <div className="div_align_item">
                    <label>Bonjour Monsieur</label>
                    <img src="/icone/test.png"></img>
                    <img src="/icone/152535.png"></img>
                </div>
            </div>
            
        </div>
    )
}