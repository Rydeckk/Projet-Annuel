import React from "react";
import traduction from "../../traductions/traduction.json"
import { Association } from "../request/request";


export function Donate() {
    return (
        <div>
            <h1 className="title_section">{traduction.donate}</h1>
        </div>
    )
}