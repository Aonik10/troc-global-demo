<script>
	import Chart from 'chart.js/auto';
	import { Bar, Line } from 'svelte-chartjs'
	import { onMount } from 'svelte';
	import { getHistoricalMarketData } from './api/resources';
	
	let coins = ['bitcoin', 'ethereum', 'binancecoin', 'cardano', 'poligon']
	let currencies = ["usd", "eur", "ars"]
	let currentCoin = coins[0];
	let currentCurrency = currencies[0];
	let days = 90;

	// se definen estas variables y sus valores se asignan en onMount
	let prices = []; 
	let volume = [];
	let labels = [];
	let max_days; 
	
	function buildGraphData(labels, data) {
		const graphData = {
			labels: labels, 
			datasets: [
				{
					label: 'Prices',
					data: data,
					fill: true,
					backgroundColor: 'rgb(75, 192, 192)',
					borderColor: 'rgb(29, 82, 82)',
					tension: 0.3
				},
			]
		};
		return graphData;
	}

	let updateData = async () => {
		// hago el fetch de toda la md una sola vez al montar el componente
		let response = await getHistoricalMarketData(currentCoin, currentCurrency, 'max');

		// guardo la md en variables 
		prices = response.prices.map(p => p[1]);
		volume = response.total_volumes.map(p => p[1]);
		labels = response.prices.map(p => new Date(p[0]).toLocaleDateString("en-US"));
		max_days = response.prices.length;
	}

	$: labelsSlice = labels.slice(-days);
	$: pricesData = buildGraphData(labelsSlice, prices.slice(-days));
	$: volumeData = buildGraphData(labelsSlice, volume.slice(-days));

	onMount(updateData);
	
</script>

<main class="main">
	<h1>COIN TRACKER</h1>
	<div>
		<div class="inputs-container">
			<div class="input-item">
				<label for="days-input">Days back</label>
				<input type="number" bind:value={days} name="days-input" max={max_days}>
			</div>
			<div class="input-item">
				<label for="coin-input">Coin</label>
				<select name="coin-select" id="coin-select" bind:value={currentCoin} on:change={updateData}>
					{#each coins as coin}
						<option value={coin}>{coin}</option>
					{/each}
				</select>
			</div>
			<div class="input-item">
				<label for="currency-input">Currency</label>
				<select name="currency-select" id="currency-select" bind:value={currentCurrency} on:change={updateData}>
					{#each currencies as currency}
						<option value={currency}>{currency}</option>
					{/each}
				</select>
			</div>
		</div>
		<button class="btn-update" on:click={updateData}>Update</button>
	</div>
	<div class="graphs-section">
		<div class="graph-container">
			days {days}
			<Line
				data={pricesData}
				width={100}
				height={50}
				options={{ animations: false, elements: { point: { radius: 0 }}}}
			/>
		</div>
		<div class="graph-container">
			<Bar
				data={volumeData}
				width={100}
				height={50}
				options={{ animations: false, elements: { point: { radius: 0 }}}}
			/>
		</div>
	</div>
</main>

<style>
	.main {
		text-align: center;
		padding: 20px;
		width: 1100px;
		margin: 0 auto;
	}

	h1 {
		font-size: 60px;
	}

	.inputs-container {
		display: flex;
		justify-content: center;
	}

	.input-item {
		margin: 0 10px
	}

	.graphs-section {
		display: flex;
		justify-content: space-between;
	}

	.graph-container {
		width: 500px;
	}
</style>