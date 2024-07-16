import React from "react";
import { useAssoContext } from "../main";

export function Ged() {
    const asso = useAssoContext()

    return (
        <div className="div_ged">
            <div className="div_ged_header">
                <img className="clickable-image"></img>
                <img className="clickable-image"></img>
            </div>
            <div className="div_ged_content">

            </div>
        </div>
    )
}