import React from "react";
import traduction from "../traductions/traduction.json"
import { Association } from "./request";

export interface AboutProps {
    asso: Association | null
}

export function About(props: AboutProps) {
    return (
        <div>
            <h1>{traduction.about}</h1>
            <div>
                <p className="paragraphe_description">{props.asso?.description}</p>
            </div>
        </div>
    )
}