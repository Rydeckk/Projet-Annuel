import React from "react";
import traduction from "../traductions/traduction.json"

async function get_name(): Promise<string> {
    await fetch("")
    return ""
}

export function Menu_top() {
    return (
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",backgroundColor:"#333333"}}>
            <div className="div_align_item">
                <div className="div_padding10_horizontal">
                    <h1>Nom de l'association</h1>
                </div>
                <div className="div_padding10_horizontal">
                    <a id="lHome" href="/" className="link">{traduction.home}</a>
                </div>
                <div className="div_padding10_horizontal">
                    <a id="lAbout" href="/about" className="link">{traduction.about}</a>
                </div>
                <div className="div_padding10_horizontal">
                    <a id="lEvent" href="/event" className="link">{traduction.event}</a>
                </div>
                <div className="div_padding10_horizontal">
                    <a id="lCalendar" href="/calendar" className="link">{traduction.calendar}</a>
                </div>
            </div>
            
            <div className="div_align_item">
                <div className="div_padding10_horizontal">
                    <a id="btDonate" className="link_button" href="/donate">{traduction.donate}</a>
                </div>
                <div className="div_padding10_horizontal">
                    <a id="lLogin" href="/login" className="link_button">{traduction.login}</a>
                </div>
                <div className="div_padding10_horizontal">
                    <a id="lSignUp" href="/signup" className="link_button">{traduction.signup}</a>
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