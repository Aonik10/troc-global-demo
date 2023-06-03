<script>
	import Chart from 'chart.js/auto';
	import { afterUpdate, onMount } from 'svelte';
	import { getHistoricalMarketData } from './api/resources';
	
	let coins = ['bitcoin', 'ethereum', 'binancecoin', 'cardano', 'poligon']
	let currencies = ["usd", "eur", "ars"]
	let currentCoin = coins[0];
	let currentCurrency = currencies[0];
	let days = 90;

	// se definen estas variables y sus valores se asignan en onMount
	let prices; 
	let volume;
	let labels;
	let max_days; 

	let pricesData;
	let volumeData;
	let currentLabels;
	let pricesChart;
	let pricesCanvas;
	let volumeCanvas;
	let volumeChart;

	function setConfig(type, data) {
		const config = {
			type: type,
			data: data,
			options: {
				animations: false,
				elements: {
                    point:{
                        radius: 0
					}
				}
			}
		};
		return config
	}
	
	function buildGraphData(labels, data) {
		const graphData = {
			labels: labels, 
			datasets: [
				{
					label: 'Prices',
					data: data.slice(-days),
					fill: true,
					backgroundColor: 'rgb(75, 192, 192)',
					borderColor: 'rgb(29, 82, 82)',
					tension: 0.3
				},
			]
		};
		return graphData
	}

	afterUpdate(() => {
		console.log(currentCoin)
		if (pricesChart) {
			pricesChart.destroy()
		}
		if (volumeChart) {
			volumeChart.destroy()
		}
		currentLabels = labels.slice(-days)
		pricesData = buildGraphData(currentLabels, prices)
		pricesChart = new Chart(pricesCanvas, setConfig('line', pricesData));
		volumeData = buildGraphData(currentLabels, volume)
		volumeChart = new Chart(volumeCanvas, setConfig('bar', volumeData));
		console.log("after")
	})

	onMount(async ()=> {
		// hago el fetch de toda la md una sola vez al montar el componente
		let response = await getHistoricalMarketData(currentCoin, currentCurrency, 'max')
		console.log(response)

		// guardo la md en variables 
		prices = response.prices.map(p => p[1])
		volume = response.total_volumes.map(p => p[1])
		labels = response.prices.map(p => new Date(p[0]).toLocaleDateString("en-US"))
		max_days = response.prices.length

		// proceso la información que deseo mostrar
		currentLabels = labels.slice(-days)
		pricesData = buildGraphData(currentLabels, prices)
		volumeData = buildGraphData(currentLabels, volume)

		pricesCanvas.getContext("2d")
		volumeCanvas.getContext("2d")
		pricesChart = new Chart(pricesCanvas, setConfig('line', pricesData));
		volumeChart = new Chart(volumeCanvas, setConfig('bar', volumeData));
	})

</script>

<main class="main">
	<h1>COIN TRAKER</h1>
	<div>
		<div class="inputs-container">
			<div class="input-item">
				<label for="days-input">Days back</label>
				<input type="number" bind:value={days} name="days-input" max={max_days}>
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
				<label for="currency-input">Coin</label>
				<select name="coin-select" id="coin-select" bind:value={currentCurrency}>
					{#each currencies as currency}
						<option value={currency}>{currency}</option>
					{/each}
				</select>
			</div>
		</div>
		<button class="btn-update">Update</button>
	</div>
	<div class="graphs-section">
		
		<div class="graph-container">
			<p>days {days}</p>
			<canvas bind:this={pricesCanvas} id="pricesGraph" width={4} height={2} />
		</div>
		<div class="graph-container">
			<p>days {days}</p>
			<canvas bind:this={volumeCanvas} id="pricesGraph" width={4} height={2} />
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