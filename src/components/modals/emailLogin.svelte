<script>
	import { closeModal } from 'svelte-modals';
	import { fly } from 'svelte/transition';

	// provided by <Modals />
	export let isOpen;

	export let title;
	export let message;
</script>

{#if isOpen}
	<div role="dialog" class="modal" transition:fly|global={{ y: 50, duration: 300 }}>
		<div class="contents">
			<form>
				<div class="input">
					<label for="username">Usuario</label>
					<input type="text" name="username" id="username" placeholder="Usuario" />
				</div>
				<div class="input">
					<label for="email">Correo</label>
					<input type="email" name="email" id="email" placeholder="Correo" />
				</div>
			</form>
			<div class="actions">
				<button id="submitModal" class="button">
					<iconify-icon icon="ic:round-email" id="submitIcon" class="icon" />
					Crear cuenta
				</button>
				<button id="closeModal" class="button" on:click={closeModal}>
					<iconify-icon icon="gg:close" id="closeIcon" class="icon" />
					Cancelar
				</button>
			</div>
		</div>
	</div>
{/if}

<style lang="scss">
	.modal {
		position: fixed;
		top: 0;
		bottom: 0;
		right: 0;
		left: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		pointer-events: none;
	}

	.contents {
		min-width: 240px;
		font-family: 'Inter Variable', sans-serif;
		font-weight: 600;
		border-radius: 10px;
		padding: 16px;
		background: $text-color;
		color: $background-color;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		pointer-events: auto;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	input {
		padding: 1rem;
		border: 1px solid white;
		background-color: $background-color;
		border-radius: 10px;
		color: $text-color;
	}

	.input {
		display: flex;
		flex-direction: column;
	}

	::placeholder {
		font-family: 'Inter Variable', sans-serif;
		font-weight: 500;
	}

	label {
		margin-left: 0.5rem;
		margin-bottom: 0.5rem;
	}

	.actions {
		margin-top: 32px;
		display: flex;
		gap: 10px;
		justify-content: flex-end;
	}

	#closeModal {
		background-color: #ff3a20;
		max-width: 7.5rem;
		font-weight: 700;
	}

	#submitModal {
		background-color: #181818;
		color: $text-color;
		max-width: 10rem;
		font-weight: 500;
	}

	#submitIcon {
		color: $text-color;
	}
</style>
