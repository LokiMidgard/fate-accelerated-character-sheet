<script lang="ts">
	import { base } from '$app/paths';

	const dices: [undefined | number, undefined | number, undefined | number, undefined | number] = [
		0, 0, 0, 0
	];

	let modifire = 0;

	$: sum = dices.filter((x): x is number => typeof x == 'number').reduce((p, c) => p + c, modifire);

	let isRoling = false;

	const sounds = Array.from({ length: 4 }).map((x, i) => new Audio(`${base}/dice${i + 1}.flac`));

	async function role() {
		if (isRoling) {
			return;
		}
		isRoling = true;

		for (let i = 0; i < dices.length; i++) {
			dices[i] = undefined;
		}
		for (let i = 0; i < dices.length; i++) {
			const sound = sounds[Math.floor(Math.random() * 4)];
			dices[i] = Math.floor(Math.random() * 3) - 1;

			const playing = new Promise<void>((resolve) => {
				sound.play();
				const fin = () => {
					sound.removeEventListener('ended', fin);
					resolve();
				};
				sound.addEventListener('ended', fin);
			});

			await playing;
		}
		isRoling = false;
	}
</script>

<div
	style="display: grid; justify-items: center; align-items: center; grid-template-columns: auto auto; grid-template-rows: auto auto auto auto auto; gap: 1rem; justify-content: center; align-content: center;"
>
	{#each dices as d}
		<div class="dice" class:hide={d == undefined}>
			{#if (d ?? 0) > 0}
				+
			{:else if (d ?? 0) < 0}
				-
			{/if}
		</div>
	{/each}
	<label style="grid-column: span 2;">
		Modifire
		<input type="number" bind:value={modifire} />
	</label>
	<div style="grid-column: span 2; align-self: center; text-align: center;">
		{#if !isRoling}
			{#if sum <= -2}
				Fürschterlich
			{:else if sum == -1}
				Schwach
			{:else if sum == 0}
				Mäßig
			{:else if sum == 1}
				Durschnittlich
			{:else if sum == 2}
				Ordentlich
			{:else if sum == 3}
				Gut
			{:else if sum == 4}
				Großartig
			{:else if sum == 5}
				Hervorragend
			{:else if sum == 6}
				Fantastich
			{:else if sum == 7}
				Episch
			{:else if sum >= 8}
				Legendär
			{/if}
		{:else}
			-
		{/if}
	</div>
	<button disabled={isRoling} on:click={() => role()} style="grid-column: span 2;">Roll</button>
</div>

<style lang="scss">
	.dice {
		display: grid;
		justify-items: center;
		align-items: center;
		font-weight: bolder;
		font-size: xx-large;
		width: 4rem;
		height: 4rem;

		border-radius: 1rem;

		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.6), inset 0 0 3px rgba(0, 0, 0, 0.6);
	}
	.hide {
		opacity: 0;
	}
</style>
