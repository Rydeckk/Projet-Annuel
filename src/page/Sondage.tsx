import React from "react";
import traduction from "../../traductions/traduction.json"
import { Association } from "../request/request";

export function Sondage() {
    return (
        <div>
            <h1 className="title_section">{traduction.sondage}</h1>
        </div>
    )
}