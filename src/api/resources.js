const SERVER_URL = "https://api.coingecko.com/api/v3"

export async function request(url, method="GET", body=null) {
    let response = await fetch(url, {
        method: method,
        headers: {
            "Content-Type": "application/json",
        },
        body: body
    })
    return response.json()
}

export async function getHistoricalMarketData(id, vs_currency="usd", days="max") {
    let response = await request(SERVER_URL + `/coins/${id}/market_chart?vs_currency=${vs_currency}&days=${days}&interval=daily`)
    return response
}