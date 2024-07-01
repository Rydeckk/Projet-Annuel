import React from "react";
import traduction from "../traductions/traduction.json"
import { Association } from "./request";

export interface DonateProps {
    asso: Association
}

export function Donate(props: DonateProps) {
    return (
        <div>
            <h1>{traduction.donate}</h1>
        </div>
    )
}