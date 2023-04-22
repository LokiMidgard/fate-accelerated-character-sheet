<script lang="ts">
	import { onMount } from 'svelte';
	import FateAcceleratedLogo from './Fate-Accelerated-Logo.svelte';
	import {
		aproaches,
		updateCharacter,
		type Character,
		loadCharacter,
		newChar,
		getAllIds
	} from './model';
	import FudgeDice from './fudgeDice.svelte';

	let dices: FudgeDice;

	let char: Character | undefined;
	let id: string | undefined;
	let allIds: (readonly [string, string])[] = [];
	onMount(() => {
		if (window.location.hash && window.location.hash.length > 1) {
			const hasData = window.location.hash.substring(1);
			try {
				const newChar = JSON.parse(decodeURIComponent(hasData));
				id = uuidv4();
				updateCharacter(newChar, id);
			} catch (error) {
				id = hasData;
			}
		} else {
			id = uuidv4();
		}
		// if (!char) {
		// 	char = newChar();
		// 	id = uuidv4();
		// }
	});

	$: {
		updateCharacter(char, id);
		allIds = getAllIds();
	}
	$: shareLink = `#${encodeURIComponent(JSON.stringify(char))}`;

	$: {
		if (id) {
			window.location.hash = id;
			char = loadCharacter(id) ?? newChar();
		}
	}

	function AddAspect() {
		if (char) {
			char.aspects.other = [...char.aspects.other, ''];
		}
	}
	function RemoveAspect(index: number) {
		if (char) {
			const change = [...char.aspects.other];
			change.splice(index, 1);
			char.aspects.other = change;
		}
	}
	function uuidv4() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
			var r = (Math.random() * 16) | 0,
				v = c == 'x' ? r : (r & 0x3) | 0x8;
			return v.toString(16);
		});
	}

	function shareChar(id: string) {
		const char = loadCharacter(id);
		if (char) {
			navigator.share({
				url: `#${encodeURIComponent(JSON.stringify(char))}`,
				text: `Fate Accereated Charecter :${char.name ?? 'NAME NOT SET'}`
			});
		}
	}

	function capitalizeFirstLetter(string: string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}
</script>

<nav>
	<button style="grid-column: 1;" on:click={() => (id = uuidv4())}>New Char</button>
	{#if allIds.length > 0}
		<select style="grid-column: 2;" bind:value={id}>
			{#each allIds as [id, name]}
				<option value={id}>{name} ({id})</option>
			{/each}
		</select>
	{/if}

	<button style="grid-column: 3;" disabled={!id} on:click={() => shareChar(id ?? '')}
		>Share Character</button
	>
</nav>
<div
	style="position: fixed; border: 1px solid black; padding:1rem; top:0px; background-color: white;"
>
	<FudgeDice bind:this={dices} />
</div>
<main>
	{#if char}
		<article>
			<div style="display: grid; grid-template-columns: 1fr 15rem; gap: 1rem;">
				<div class="group" style="grid-template-rows: min-content auto 1fr;">
					<lable>Id</lable>
					<input type="text" bind:value={char.name} placeholder="Name" />
					<textarea bind:value={char.description} placeholder="Description" />
				</div>
				<div class="group" style="display: grid; gap: 1rem; grid-template-columns: 1fr 1fr;">
					<div
						style="grid-column: span 2;  overflow: hidden; display: grid; justify-items: center;"
					>
						<FateAcceleratedLogo />
					</div>

					<div class="group">
						<lable class="center">Refresh</lable>
						<input
							style="min-width: 1rem; text-align: center;"
							type="number"
							bind:value={char.refresh}
							placeholder="Refresh"
						/>
					</div>
					<div class="group">
						<lable class="center">FP</lable>
						<input
							style="min-width: 1rem; text-align: center;"
							type="number"
							bind:value={char.fatePoints}
							placeholder="Fate Points"
						/>
					</div>
				</div>
				<div class="group" style=" grid-template-columns: 1fr min-content;">
					<lable style="grid-column: span 2;"
						>Aspects <button on:click={() => AddAspect()}>+</button>
					</lable>
					<input
						style="grid-column: span 2;"
						type="text"
						bind:value={char.aspects.high}
						placeholder="High Concept"
					/>
					<input
						style="grid-column: span 2;"
						type="text"
						bind:value={char.aspects.trouble}
						placeholder="Trouble"
					/>
					{#each char.aspects.other as a, i}
						<input
							style="margin-top: 8px;"
							type="text"
							bind:value={char.aspects.other[i]}
							placeholder="Aspect"
						/>
						<button style="margin-top: 8px; margin-left: 8px" on:click={() => RemoveAspect(i)}
							>-</button
						>
					{/each}
				</div>
				<div>
					<div class="group">
						<lable>Approaches </lable>
						{#each aproaches as a, i}
							<label style="margin-top: 8px;">
								<input
									type="number"
									style="min-width: 3rem; width: 3rem;"
									bind:value={char.aproaches[a]}
									placeholder="Description"
								/>
								<button
									style="border: 0px; font-size: larger; font-weight: bolder;"
									on:click={() => {
										dices.setMdifire(char?.aproaches[a]), dices.role();
									}}
								>
									{capitalizeFirstLetter(a)}
								</button>
							</label>
						{/each}
					</div>
				</div>
			</div>
			<div style="display: grid; grid-template-columns: 1fr 1fr; gap:1rem;">
				<div class="group">
					<lable>Stunts</lable>
					<textarea bind:value={char.stunts} placeholder="Stunts" />
				</div>
				<div class="group">
					<lable>Extras</lable>
					<textarea bind:value={char.extras} placeholder="Extras" />
				</div>
			</div>
			<div style="display: grid; grid-template-columns: 1fr 1fr; gap:1rem;">
				<div class="group">
					<lable style="grid-column: span 3 ;">Stress</lable>
					{#each Array.from({ length: 3 }) as _, i}
						<div class="check" style="grid-column: {i + 1}; margin-top: 8px;">
							<input
								bind:checked={char.stress[i]}
								id="check{i}"
								class="checkbox-flip"
								type="checkbox"
							/>
							<label for="check{i}">{i + 1}<span /></label>
						</div>
					{/each}
				</div>
				<div class="group">
					<lable>Consequences</lable>
					<div style="display: grid;">
						<span style="grid-column: 1; margin-top: 8px;">2</span>
						<input
							style="grid-column: 2; margin-top: 8px;"
							type="text"
							bind:value={char.consequences.mild}
							placeholder="Mild"
						/>
						<span style="grid-column: 1; margin-top: 8px;">4</span>
						<input
							style="grid-column: 2; margin-top: 8px;"
							type="text"
							bind:value={char.consequences.moderate}
							placeholder="Moderate"
						/>
						<span style="grid-column: 1; margin-top: 8px;">6</span>
						<input
							style="grid-column: 2; margin-top: 8px;"
							type="text"
							bind:value={char.consequences.server}
							placeholder="Server"
						/>
					</div>
				</div>
			</div>
		</article>
	{/if}
</main>
<footer>
	Code available on <a
		href="https://github.com/LokiMidgard/fate-accelerated-character-sheet"
		target="_blank">GitHub</a
	>.
</footer>

<style lang="scss">
	:global(*) {
		box-sizing: border-box;
		font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode',
			Geneva, Verdana, sans-serif;
	}

	nav {
		display: grid;
		grid-template-columns: 10rem auto 10rem;
		gap: 1rem;
		justify-content: center;
		height: 4rem;
		padding-top: 2rem;
	}

	main,
	:global(body) {
		padding: 0px;
		margin: 0px !important;
	}

	footer {
		padding: 1rem;
		margin: 0px;
		background-color: black;
		color: white;

		a {
			color: white;
			&:hover {
				color: lightgray;
			}
		}
	}
	article {
		padding: 1rem;
		margin: 1rem auto;
		max-width: 20cm;
		display: grid;
		gap: 1rem;
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.6), inset 0 0 3px rgba(0, 0, 0, 0.6);
	}

	@media (max-width: 1400px) {
		nav,
		main {
			margin-left: 19rem !important;
			margin-right: unset !important;
		}
		nav {
			justify-content: left;
		}

		article {
			margin-left: 0px;
		}
	}

	select,
	input {
		background-color: white;
		border: 1px solid lightgray;
	}
	button {
		background-color: white;
		border: 1px solid lightgray;
		&:hover {
			border-color: black;
		}
		&:active {
			background-color: lightgray;
			border-color: black;
		}
	}

	.group {
		display: grid;
		grid-template-rows: min-content auto;
		align-content: start;
		lable {
			font-weight: bold;
			padding: 0.5rem;
			background-color: black;
			color: white;
			width: 100%;

			display: grid;
			button {
				border: 0px;
				color: white;
				background-color: transparent;
				grid-column: 2;
				align-self: center;
				justify-self: right;
				&:hover {
					color: lightgrey;
				}
				&:active {
					margin: 0px;
					color: black;
					background-color: lightgrey;
				}
			}
		}

		& > input,
		& > textarea {
			border: 1px solid lightgray;
			padding: 0.5rem;
			margin-top: 0.5rem;
		}
	}
	.center {
		text-align: center;
	}

	input {
		padding: 8px;
		// height: 18px;
	}

	.check {
		display: flex;
		justify-items: center;
		justify-content: center;
		white-space: nowrap;

		&:last-child {
			// margin-right: 2rem;
		}
		&:first-child {
			// margin-left: 2rem;
		}

		$border-color: black;
		// $border-color: #ff4040;
		$checkbox-size: 3rem;
		$checkedbox-size: 1.2rem;

		$dark: #15171e;
		$white: mix($dark, white, 20%);

		label {
			font-family: Helvetica;
			letter-spacing: 1px;
			// font-variant: small-caps;
			// text-transform: uppercase;
		}

		// checkbox styles start

		@keyframes pull {
			0% {
				height: 0;
			}
			100% {
				height: 1.2rem;
			}
		}

		@keyframes pop {
			0% {
				opacity: 0;
			}
			75% {
				opacity: 1;
			}
			100% {
				transform: scale(1.2);
			}
		}

		.checkbox-flip,
		.checkbox-pop,
		.checkbox-pull,
		.checkbox-spin {
			display: none;
		}

		.checkbox-flip + label span,
		.checkbox-pop + label span,
		.checkbox-pull + label span,
		.checkbox-spin + label span {
			display: inline-block;
			width: calc($checkbox-size);
			height: calc($checkbox-size / 2 + 0.8em);
			margin: 0 5px -4px 5px; /*layout relationship between check and label*/
			&:before,
			&:after {
				transition: all 0.3s ease-in-out;
				content: '';
				position: absolute;
				z-index: 1;
				width: $checkbox-size;
				height: $checkbox-size;
				background: transparent;
				border: 2px solid $border-color;
			}
			&:after {
				z-index: 0;
				border: none;
			}
		}

		.checkbox-flip:checked + label span {
			&:before {
				transform: rotateY(180deg);
				background: $border-color;
			}
		}

		.checkbox-pop:checked + label span {
			&:before {
				animation: pop 0.3s ease;
				z-index: 100;
				background: $border-color;
			}
		}

		.checkbox-pull:checked + label span {
			&:after {
				width: $checkedbox-size;
				height: $checkedbox-size;
				background: $border-color;
				animation: pull 0.4s linear;
			}
		}

		.checkbox-spin:checked + label span {
			&:before {
				transform: rotateZ(180deg);
				background: $border-color;
			}
		}
	}
</style>
