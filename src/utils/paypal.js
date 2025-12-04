
async function generateAccessToken() {
    const response = await fetch(process.env.PAYPAL_BASE_URL + '/v1/oauth2/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + Buffer.from(
                `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
            ).toString('base64')
        },
        body: 'grant_type=client_credentials'
    })

    const data = await response.json()
    return data.access_token
}

export async function createOrder(orden) {
    const accessToken = await generateAccessToken()

    // mapeamos ordenDetalle a items de PayPal
    const items = orden.ordenDetalle.map(item => ({
        name: `${item.tipoProducto}`,
        description: `${item.tipoProducto}`,
        quantity: item.cantidad.toString(),
        unit_amount: {
            currency_code: 'MXN',
            value: Math.round(item.precioVenta * 100)
        }
    }))


    const total = Math.round((orden.total + orden.iva) * 100)
    const totalSinIva = Math.round(orden.total * 100)
    const iva = Math.round(orden.iva * 100)

    const response = await fetch(process.env.PAYPAL_BASE_URL + '/v2/checkout/orders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
        },
        body: JSON.stringify({
            intent: 'CAPTURE',
            purchase_units: [
                {
                    items: items,
                    amount: {
                        currency_code: 'MXN',
                        value: total,
                        breakdown: {
                            item_total: {
                                currency_code: 'MXN',
                                value: totalSinIva
                            },
                            tax_total: {
                                currency_code: 'MXN',
                                value: iva
                            }
                        }
                    }
                }
            ],
            application_context: {
                return_url: `${process.env.BASE_URL}/api/ordenes/paypal/capture?ordenId=${orden._id}`,
                cancel_url: `${process.env.BASE_URL}/api/ordenes/paypal/cancel?ordenId=${orden._id}`,
                shipping_preference: 'NO_SHIPPING',
                user_action: 'PAY_NOW',
                brand_name: 'Sonido Lirio'
            }
        })
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(`PayPal Error: ${response.status} - ${JSON.stringify(error)}`)
    }

    const data = await response.json()
    return data.links.find(link => link.rel === 'approve').href

}

export async function capturePayment(orderId) {
    const accessToken = await generateAccessToken()

    const response = await fetch(`${process.env.PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
        }
    })
    
    const data = await response.json()
    return data
}