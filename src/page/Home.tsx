import React from "react";
import { NavLink } from 'react-router-dom';
import traduction from "../../traductions/traduction.json"
import "../css/home.css"
import Chatbot from "../../chatbot/Chatbot"

const links = [
    { id: 'lHome', path: "", description: "Accueil", translation: traduction.home },
    { id: 'lAbout', path: "about", description: "À propos", translation: traduction.about },
    { id: 'lEvent', path: "event", description: "Événements", translation: traduction.event },
    { id: 'lSondage', path: "sondage", description: "Sondage", translation: traduction.sondage },
    { id: 'lCalendar', path: "assemblee", description: "Assemblée", translation: traduction.assemblee },
    { id: 'btDonate', path: "donate", description: "Faire un don", translation: traduction.donate },

]

export function Home() {
    return (
        <div>
            <h1 className="title_section">{traduction.home}</h1>
            <div className="grid">
                {links.map(link => (
                    <div key={link.id} className="card"> 
                        <NavLink id={link.id} to={`/monAsso2/${link.path}`}
                            className="link" style={{color: "#002f86"}}>
                            <div className="content-card">
                                <h2>{link.translation}</h2>
                                <p>{link.description}</p>
                            </div>      
                        </NavLink>
                    </div>
                ))}
            </div>
            <Chatbot/>    
        </div>
        
    )
}