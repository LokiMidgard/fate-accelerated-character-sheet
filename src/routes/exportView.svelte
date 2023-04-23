<script lang="ts">
	export let exportText: string | undefined;

	let copiedLable: HTMLElement;

	let animate = false;

	$: focusOn(undefined, exportText);

	async function focusOn(
		e:
			| (FocusEvent & {
					currentTarget: EventTarget & HTMLTextAreaElement;
			  })
			| undefined,
		text: string | undefined
	) {
		e?.currentTarget.select();
		console.log('click');
		if (exportText) {
			await navigator.clipboard.writeText(exportText);

			copiedLable.addEventListener('animationend', () => {
				animate = false;
			});
			animate = true;
		}
	}
</script>

<dialog open={exportText !== undefined}>
	<form>
		<div style="position: relative;">
			<textarea
				bind:value={exportText}
				on:click={(e) => focusOn(e, exportText)}
				style="height: calc(100vh - 10rem); width: calc(100vw -  2 * 5rem)"
				readonly
			/>
			<ins class="instrted" class:animate bind:this={copiedLable}>Text Copied ✔</ins>
		</div>
		<button on:click={() => (exportText = undefined)}>Close</button>
	</form>
</dialog>

<style lang="scss">
	dialog {
     display: none;
     
    }
    dialog[open] {
    display: flex;
		z-index: 999;
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		align-items: center;
		justify-content: center;
		width: inherit;
		min-width: 100%;
		height: inherit;
		min-height: 100%;
		padding: 0.3rem;
		border: 0;
		-webkit-backdrop-filter: blur(0.25rem);
		backdrop-filter: blur(0.25rem);
		background-color: rgba(36, 51, 62, 0.8);
		// color: var(--color);
	}
	dialog textarea {
		width: 100%;
		// max-height: 20rem;
		// max-height: 20rem;
		overflow: auto;
	}
	ins {
		position: absolute;
		padding: 0.1rem 0.9rem;
		margin: 1rem;
		border-radius: 1rem;
		color: white;
		background-color: green;
		bottom: 0px;

		text-decoration: none;
		max-width: 0rem;
		// width: 0%;
		display: block;
		overflow: hidden;
		// height: 3rem;
		white-space: nowrap;
		opacity: 0;
	}
	ins.animate {
		animation: show 2.5s ease-in-out;
	}
	@keyframes show {
		0% {
			max-width: 0%;
			opacity: 0;
		}
		10% {
			opacity: 1;
		}
		50% {
			max-width: 100%;
		}
		51% {
			max-width: 100%;
		}
		100% {
			max-width: 100%;
			opacity: 0;
		}
	}
</style>
