export function createOrder(amount: number) {

    const clientId = process.env.PAYPAL_CLIENT_ID ? process.env.PAYPAL_CLIENT_ID : ""
    const sellerPayerId = "romainguiffant@gmail.com"
    const jwt = getAuthAssertionValue(clientId, sellerPayerId);


    function getAuthAssertionValue(clientId: string, sellerPayerId: string) {
        const header = {
            "alg": "none"
        };
        const encodedHeader = base64url(header);
        const payload = {
            "iss": clientId,
            "payer_id": sellerPayerId
        };
        const encodedPayload = base64url(payload);
        return `${encodedHeader}.${encodedPayload}.`;
    }

    function base64url(json: {}) {
        return btoa(JSON.stringify(json))
            .replace(/=+$/, '')
            .replace(/\+/g, '-')
            .replace(/\//g, '_');
    }

    const accessToken = jwt;
    return fetch ("https://api-m.sandbox.paypal.com/v2/checkout/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        "purchase_units": [
          {
            "amount": {
              "currency_code": "USD",
              "value": amount
            },
            "reference_id": "d9f80740-38f0-11e8-b467-0ed5f89f718b"
          }
        ],
        "intent": "CAPTURE",
        "payment_source": {
          "paypal": {
            "experience_context": {
              "payment_method_preference": "IMMEDIATE_PAYMENT_REQUIRED",
              "payment_method_selected": "PAYPAL",
              "brand_name": "EXAMPLE INC",
              "locale": "en-US",
              "landing_page": "LOGIN",
              "shipping_preference": "GET_FROM_FILE",
              "user_action": "PAY_NOW",
              "return_url": "https://example.com/returnUrl",
              "cancel_url": "https://example.com/cancelUrl"
            }
          }
        }
      })
    })
    .then((response) => response.json());
  }