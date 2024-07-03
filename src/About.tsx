import React from "react";
import traduction from "../traductions/traduction.json"
import { useAssoContext } from "./main";

export function About() {
    const asso = useAssoContext()

    return (
        <div>
            <h1>{traduction.about}</h1>
            <div>
                <p className="paragraphe_description">{asso.asso?.description}</p>
            </div>
        </div>
    )
}