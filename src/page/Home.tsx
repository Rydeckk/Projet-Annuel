import React from "react";
import traduction from "../../traductions/traduction.json"

export function Home() {
    return (
        <div>
            <h1 className="title_section">{traduction.home}</h1>
        </div>
    )
}