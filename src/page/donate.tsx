import React from "react";
import traduction from "../../traductions/traduction.json"
import { Association } from "../request/request";
import { Paypal } from "../component/Paypal";


export function Donate() {
    return (
        <div>
            <h1 className="title_section">{traduction.donate}</h1>
            <h1>Payment Options</h1>
            <h2>Pay with PayPal</h2>
            <Paypal />
        </div>
    )
}