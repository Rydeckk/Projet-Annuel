import React, { useState, useEffect } from 'react';
import {
    PayPalButtons,
    PayPalButtonsComponentProps,
    PayPalScriptProvider,
    ReactPayPalScriptOptions,
} from "@paypal/react-paypal-js";

interface OrderData {
    id: string;
    details?: Array<{
      issue: string;
      description: string;
    }>;
    debug_id?: string;
}

export const Paypal = () => {
    const initialOptions: ReactPayPalScriptOptions = {
        clientId: "AY7ysDu71TWaDqxTQr-OjxKah4HBJgSdlmygglkTXNM0B70NYfzp2IQI-nIUhJ96LZsu_XAgTyTwsjfo",
    }

    const styles: PayPalButtonsComponentProps["style"] = {
        shape: "rect",
        layout: "vertical",
        color: "gold",
        label: "paypal",
        tagline: false
    };

    const createOrder: PayPalButtonsComponentProps["createOrder"] = async () => {
        try {
            const response = await fetch("http://vps-1d054ff8.vps.ovh.net:3000/association/mine/donate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({montant: 120})
            });

          const orderData: OrderData = await response.json();

            if (!orderData.id) {
                const errorDetail = orderData.details && orderData.details.length > 0 ? orderData.details[0] : null
                const errorMessage = errorDetail ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})` : "Unexpected error occurred, please try again.";

                throw new Error(errorMessage);
            }

            return orderData.id;

        } catch (error) {
            console.error(error);
            throw error;
        }
    }

  return (
    <PayPalScriptProvider options={initialOptions}>
        <PayPalButtons style={styles} createOrder={createOrder}/>
    </PayPalScriptProvider>
  );
};