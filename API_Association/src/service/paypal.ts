import jwt from "jsonwebtoken"


  const clientId = process.env.PAYPAL_CLIENT_ID ? process.env.PAYPAL_CLIENT_ID : ""
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET
  const sellerPayerId = "romainguiffant@gmail.com"


  const getAuthToken = (): string => {
    const payload = {
        iss: clientId,
    };
    if(process.env.JWT_SECRET) {
      return jwt.sign(payload, process.env.JWT_SECRET, { algorithm: 'HS256' });
    } else {
      return ""
    }
    
};

export const createPayPalOrder = async (montant: number): Promise<string> => {
    const authResponse = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
        },
        body: 'grant_type=client_credentials'
    });

    if (!authResponse.ok) {
        throw new Error('Failed to get access token');
    }

    const authData = await authResponse.json();
    const accessToken = authData.access_token;

    const orderResponse = await fetch('https://api-m.sandbox.paypal.com/v2/checkout/orders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
            intent: 'CAPTURE',
            purchase_units: [{
                amount: {
                    currency_code: 'EUR',
                    value: montant
                }
            }]
        })
    });

    if (!orderResponse.ok) {
        throw new Error('Failed to create PayPal order');
    }

    const orderData = await orderResponse.json();
    return orderData.id;
}