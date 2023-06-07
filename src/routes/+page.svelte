<script lang="ts">
    import 'chart.js/auto';
	import { Bar, Line } from 'svelte-chartjs'
	import { getHistoricalMarketData } from '../api/resources';
	import type { GraphData } from '../utils/interfaces';
    import Spinner from '../components/Spinner.svelte';
    import ErrorComponent from '../components/Error.svelte'
	
	const coins = ['ethereum', 'bitcoin', 'binancecoin', 'cardano', 'dogecoin']
	const currencies = ["usd", "eur", "ars"]
	let currentCoin = coins[0];
	let currentCurrency = currencies[0];
	let days = 30;

	function buildGraphData(title: string, labels: string[], data: number[]): GraphData {
		const graphData = {
			labels: labels, 
			datasets: [
				{
					label: title,
					data: data,
					fill: true,
					backgroundColor: 'rgb(227, 121, 68)',
					borderColor: 'rgb(66, 34, 17)',
					tension: 0.3
				},
			]
		};
		return graphData;
	}

    async function fetchData(coin: string, currency: string, days: number | "max") {
        let response = await getHistoricalMarketData(coin, currency, days);
        // throw new Error("An error ocurred")
        return {
            prices: response.prices.map((p: number[]) => p[1]),
            volume: response.total_volumes.map((v: number[]) => v[1]),
            labels: response.prices.map((p: number[]) => new Date(p[0]).toLocaleDateString("en-US")),
        };
    }

    $: dataPromise = fetchData(currentCoin, currentCurrency, 'max');
	
</script>

<main class="main">
	<h1>COIN <span class="coloured-title">TRACKER</span></h1>
	<div>
		<div class="inputs-container">
			<div class="input-item">
				<label for="days-input">Days</label>
				<input class="days-input" type="number" bind:value={days} name="days-input">
			</div>
			<div class="input-item">
				<label for="coin-input">Coin</label>
				<select name="coin-select" id="coin-select" bind:value={currentCoin}>
					{#each coins as coin}
						<option value={coin}>{coin}</option>
					{/each}
				</select>
			</div>
			<div class="input-item">
				<label for="currency-input">Currency</label>
				<select class="currency-select" name="currency-select" id="currency-select" bind:value={currentCurrency}>
					{#each currencies as currency}
						<option value={currency}>{currency}</option>
					{/each}
				</select>
			</div>
		</div>
	</div>
	<div class="graphs-section">
		<div class="graph-container">
            {#await dataPromise}
                <Spinner />
            {:then data}
                <Line
                    data={buildGraphData("Price", data.labels.slice(-days), data.prices.slice(-days))}
                    width={100}
                    height={50}
                    options={{ animation: false, elements: { point: { radius: 0 }}}}
                />
            {:catch error}
                <ErrorComponent error={error.message} />
            {/await}
			
		</div>
		<div class="graph-container">
            {#await dataPromise}
                <Spinner />
            {:then data}
                <Bar
                    data={buildGraphData("Traded Volume", data.labels.slice(-days), data.volume.slice(-days))}
                    width={100}
                    height={50}
                    options={{ animation: false, elements: { point: { radius: 0 }}}}
                />
            {:catch error}
                <ErrorComponent error={error.message}/>
            {/await}
			
		</div>
	</div>
</main>

<style>
	.main {
		text-align: center;
		padding: 20px;
		max-width: 1100px;
		margin: 0 auto;
		font-family: Orbitron;
		height: 100%;
	}

	h1 {
		font-size: 60px;
	}

	.coloured-title {
		background-image: linear-gradient(45deg, rgb(177, 148, 133), rgb(22, 24, 19) );
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent; 
		-moz-background-clip: text;
		-moz-text-fill-color: transparent;
	}

	.inputs-container {
		display: flex;
		justify-content: center;
		margin-bottom: 40px;
	}

	label {
		margin-bottom: 6px;
	}
	
	.input-item {
		margin: 0 10px
	}

	.input-item > input, select {
		width: 140px;
	}

	.graphs-section {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
	}

	.graph-container {
        display: flex;
        justify-content: center;
        align-items: center;
		width: 500px;
        height: 250px;
		margin: 20px;
	}

</style>