import React, { useEffect, useState } from "react";
import traduction from "../../traductions/traduction.json"
import { Association } from "../request/request";
import { Paypal } from "../component/Paypal";


export function Donate() {
    const [amount, setAmount] = useState<number>()
    const [isVisible, setIsVisible] = useState<boolean>(false)

    useEffect(() => {
        setIsVisible(true)
    }, [amount])

    return (
        <div>
            <h1 className="title_section">{traduction.donate}</h1>
            <div className="item_card">
                <button onClick={() => {setIsVisible(false); setAmount(10);}}>10</button>
                <button onClick={() => {setIsVisible(false); setAmount(50);}}>50</button>
                <button onClick={() => {setIsVisible(false); setAmount(100);}}>100</button>
                <button onClick={() => {setIsVisible(false); setAmount(500);}}>500</button>
                {isVisible && amount && (<Paypal amount={amount}/>)}
            </div>  
        </div>
    )
}