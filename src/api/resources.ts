import type { HistoricalMarketData } from './api_interfaces';

const SERVER_URL = 'https://api.coingecko.com/api/v3';

export async function request(
	url: string,
	method: string = 'GET',
	body: BodyInit | null | undefined = null
): Promise<any> {
	let response = await fetch(url, {
		method: method,
		headers: {
			'Content-Type': 'application/json'
		},
		body: body
	});
	let status = response.status;
	if (status < 200 || status > 299) throw new Error('Api Error: ' + status);
	return response.json();
}

export async function getHistoricalMarketData(
	id: string,
	vs_currency: string = 'usd',
	days: 'max' | number = 'max'
): Promise<HistoricalMarketData> {
	let response = await request(
		SERVER_URL + `/coins/${id}/market_chart?vs_currency=${vs_currency}&days=${days}&interval=daily`
	);
	return response;
}
