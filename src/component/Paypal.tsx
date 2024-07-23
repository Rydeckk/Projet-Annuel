import React, { useCallback, useEffect, useState } from 'react';
import { PayPalButtons, PayPalButtonsComponentProps, PayPalScriptProvider, ReactPayPalScriptOptions } from "@paypal/react-paypal-js";
import { useAssoContext } from '../main';
import { donate } from '../request/requestDon';

type PaypalProps = {
    amount: number
}

export function Paypal ({amount}: PaypalProps) {
    const asso = useAssoContext()
    
    const initialOptions: ReactPayPalScriptOptions = {
        clientId: "AY7ysDu71TWaDqxTQr-OjxKah4HBJgSdlmygglkTXNM0B70NYfzp2IQI-nIUhJ96LZsu_XAgTyTwsjfo",
        currency: "EUR"
    }

    const styles: PayPalButtonsComponentProps["style"] = {
        shape: "rect",
        layout: "vertical",
        color: "gold",
        label: "paypal",
        tagline: false,
        
    };   

    const createOrder: PayPalButtonsComponentProps["createOrder"] = async (data, actions) => {
        if(asso.asso) {
            const order = await donate(asso.asso?.domainName, amount)
            return order
        }
        return ""
    }

    const onApprove: PayPalButtonsComponentProps["onApprove"] = async (data, actions) => {
        return actions.order?.capture().then((details) => {
            alert(`Transaction complétée`);
        }).catch(error => {
            console.error('Error capturing the order:', error);
        });
    };


    return (
        <PayPalScriptProvider options={initialOptions}>
            <PayPalButtons style={styles} createOrder={createOrder} onApprove={onApprove}/>
        </PayPalScriptProvider>
    );
};