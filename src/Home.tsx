import React from "react";
import traduction from "../traductions/traduction.json"

export function Home() {
    return (
        <div style={{backgroundColor:'greenyellow'}}>
            <h1>{traduction.home}</h1>
        </div>
    )
}