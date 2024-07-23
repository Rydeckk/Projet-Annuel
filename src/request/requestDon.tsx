interface OrderData {
    id: string;
}

export async function donate(domainName: string, amount: number): Promise<string> {
    try {
        const response = await fetch("http://vps-1d054ff8.vps.ovh.net:3000/association/mine/donate", {
            method: "POST",
            headers: { "Content-Type": "application/json", 'Authorization': 'Bearer '+ localStorage.getItem(domainName+"-token")},
            body: JSON.stringify({ montant: amount })
        });

        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        const orderData: OrderData = {id: await response.text()}
        
        return orderData.id;
    } catch (error: any) {
        console.error("Error creating order:", error);
        alert(`Error creating order: ${error.message}`);
        throw error;
    }
}