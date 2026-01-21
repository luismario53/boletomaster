import dotenv from 'dotenv';
dotenv.config({ path: 'variable.env' });

// Obtener token OAuth2
async function generateAccessToken() {
    const auth = Buffer.from(process.env.PAYPAL_CLIENT_ID + ':' + process.env.PAYPAL_SECRET).toString('base64');
    
    const response = await fetch(process.env.PAYPAL_BASE_URL + '/v1/oauth2/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${auth}`
        },
        body: 'grant_type=client_credentials'
    });

    const data = await response.json();
    return data.access_token;
}

// Crear Orden
export async function createOrder(orden) {
    const accessToken = await generateAccessToken();

    const items = orden.ordenDetalle.map(item => ({
        name: item.tipoProducto || 'Producto',
        description: `ID: ${item.idProducto}`,
        quantity: item.cantidad.toString(),
        unit_amount: {
            currency_code: 'MXN',
            value: item.precioVenta.toString()
        }
    }));

    const total = parseFloat(orden.total.toFixed(2));
    
    // Enviamos el total como suma de items para evitar error de validación
    const response = await fetch(process.env.PAYPAL_BASE_URL + '/v2/checkout/orders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
        },
        body: JSON.stringify({
            intent: 'CAPTURE',
            purchase_units: [{
                reference_id: orden._id.toString(),
                items: items, 
                amount: {
                    currency_code: 'MXN',
                    value: total.toString(),
                    breakdown: {
                        item_total: { currency_code: 'MXN', value: total.toString() },
                        tax_total: { currency_code: 'MXN', value: "0.00" }
                    }
                }
            }],
            application_context: {
                brand_name: 'Sonido Lirio',
                landing_page: 'NO_PREFERENCE',
                user_action: 'PAY_NOW',
                shipping_preference: 'NO_SHIPPING',
                
                return_url: `${process.env.API_URL || 'http://localhost:5000'}/api/ordenes/paypal/capture`,
                cancel_url: `${process.env.API_URL || 'http://localhost:5000'}/api/ordenes/paypal/cancel`
            }
        })
    });

    const data = await response.json();

    if (!response.ok) {
        console.error("PayPal Error:", JSON.stringify(data, null, 2));
        throw new Error(`PayPal Error: ${response.status}`);
    }

    return data.links.find(link => link.rel === 'approve').href;
}

// Capturar Pago
export async function capturePayment(orderId) {
    const accessToken = await generateAccessToken();

    const response = await fetch(`${process.env.PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
        }
    });
    
    const data = await response.json();
    return data;
}