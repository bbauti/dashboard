<script>
	import { enhance } from '$app/forms';
	import { last } from '@melt-ui/svelte/internal/helpers';
	import { toast } from 'svelte-sonner';

	export let data;
	export let form;

	let { session, supabase, profile } = data;
	$: ({ session, supabase, profile } = data);

	let profileForm;
	let loading = false;
	let firstName = profile?.first_name ?? '';
	let lastName = profile?.last_name ?? '';
	let avatarUrl = profile?.avatar_url ?? '';

	let email = session.user.email;

	// const handleSubmit = () => {
	// 	loading = true;
	// 	return async () => {
	// 		loading = false;
	// 	};
	// };

	let status = data.session;

	$: status = data.session;

	let editingPersonal = false;
	let editingProfile = false;

	async function editPersonal() {
		let firstName = document.getElementById('firstName').value;
		let lastName = document.getElementById('lastName').value;
		if (editingPersonal === true) {
			editingPersonal = 'loading';
			const data = new FormData();
			data.append('firstName', firstName);
			data.append('lastName', lastName);
			const res = await fetch('?/editPersonal', {
				method: 'POST',
				body: data
			}).then((response) => {
				editingPersonal = false;
				location.reload();
			});
		} else if (editingPersonal === false) {
			editingPersonal = true;
		}
	}

	async function editProfile(el) {
		if (editingProfile === true) {
			let avatar = document.getElementById('avatarUpload');
			let file = avatar.files[0];
			editingProfile = 'loading';
			const data = new FormData();
			data.append('avatar', file);
			const res = await fetch('?/editProfile', {
				method: 'POST',
				body: data
			}).then((response) => {
				editingProfile = false;
				toast(
					'Avatar actualizado correctamente! Los cambios pueden tardar un tiempo en tomar efecto...'
				);
			});
		} else if (editingProfile === false) {
			editingProfile = true;
		}
	}

	async function logoutUser() {
		const { error } = await supabase.auth.signOut();
		return error;
	}

	async function deleteAccount() {
		await supabase.auth.signOut();
		const data = new FormData();
		data.append('userId', session.user.id);
		const res = await fetch('?/deleteAccount', {
			method: 'POST',
			body: data
		});
		const resp = await res.json();
	}

	let passwordLoading;

	async function changePassword() {
		passwordLoading = true;
		let password = document.getElementById('passwordInput').value;
		let passwordConfirm = document.getElementById('confirmPassword').value;
		const data = new FormData();
		data.append('password', password);
		data.append('passwordConfirm', passwordConfirm);
		const res = await fetch('?/changePassword', {
			method: 'POST',
			body: data
		}).then((response) => {
			passwordLoading = false;
		});
	}
	let current = 'profile';
</script>

<section class="bg-neutral w-full p-5 min-h-screen lg:rounded-tl-box">
	<h1 class="font-semibold mb-5 text-2xl">Ajustes de cuenta</h1>
	<div
		class="bg-base-100 rounded-box flex-col lg:flex-row min-h-[calc(100vh-6rem)] overflow-hidden flex"
	>
		<ul
			class="prose menu menu-horizontal lg:menu-vertical m-0 h-max lg:w-56 flex justify-evenly mx-auto lg:mx-0 w-full"
		>
			<li class="mt-[0.5rem]">
				<button class={current === 'profile' ? 'active' : ''} on:click={() => (current = 'profile')}
					>Perfil</button
				>
			</li>
			<li>
				<button
					class={current === 'security' ? 'active' : ''}
					on:click={() => (current = 'security')}>Seguridad</button
				>
			</li>
			<li>
				<button
					class="text-error hover:text-error lg:mt-5 {current === 'delete' ? 'active' : ''}"
					on:click={() => (current = 'delete')}>Borrar cuenta</button
				>
			</li>
		</ul>
		<div class="p-8 w-full border-t-2 lg:border-t-0 lg:border-l-2 border-secondary">
			{#if current === 'profile'}
				<h3 class="mb-8 text-2xl font-bold leading-none tracking-tight">Perfil</h3>
				<div class="border-2 border-secondary rounded-box p-5 flex flex-col lg:flex-row">
					{#if avatarUrl}
						<img
							src={avatarUrl}
							alt="avatar"
							class="w-24 h-24 rounded-full m-0 object-cover mx-auto lg:mx-0"
						/>
					{:else}
						<div class="avatar placeholder">
							<div class="bg-secondary text-neutral-content rounded-full w-24 mx-auto lg:mx-0">
								<span class="text-3xl">{firstName.charAt(0) + lastName.charAt(0)}</span>
							</div>
						</div>
					{/if}
					<div class="flex flex-col justify-center lg:ml-16 text-center lg:text-start">
						<h3 class="m-0">{firstName} {lastName}</h3>
						<small>{email}</small>
					</div>
					<div class="mx-auto mt-2 lg:mt-0 lg:mx-0 lg:ml-auto">
						{#if editingProfile === true}
							<!-- on:click={() => editProfile()} -->
							<label for="avatarUpload" class="btn btn-xs btn-success text-right">
								Subir avatar
								<iconify-icon icon="basil:upload-solid" class="text-lg" />
							</label>
							<input id="avatarUpload" type="file" class="hidden" on:input={() => editProfile()} />
						{:else if editingProfile === false}
							<button class="btn btn-xs btn-error text-right" on:click={() => editProfile()}>
								Editar
								<iconify-icon icon="mingcute:pencil-2-fill" class="text-base" />
							</button>
						{:else if editingProfile === 'loading'}
							<button class="btn btn-xs btn-info text-right">
								Cargando...
								<span class="loading loading-spinner loading-xs" />
							</button>
						{/if}
					</div>
				</div>
				<div class="border-2 border-secondary rounded-box mt-10 p-5">
					<div class="flex justify-between">
						<h4 class="mt-0 mb-5">Informacion personal</h4>
						{#if editingPersonal === true}
							<button class="btn btn-xs btn-success text-right" on:click={() => editPersonal()}>
								Enviar
								<iconify-icon icon="mingcute:send-fill" class="text-base" />
							</button>
						{:else if editingPersonal === false}
							<button class="btn btn-xs btn-error text-right" on:click={() => editPersonal()}>
								Editar
								<iconify-icon icon="mingcute:pencil-2-fill" class="text-base" />
							</button>
						{:else if editingPersonal === 'loading'}
							<button class="btn btn-xs btn-info text-right">
								Cargando...
								<span class="loading loading-spinner loading-xs" />
							</button>
						{/if}
					</div>
					<form class="flex flex-col gap-5">
						<div class="flex gap-5 flex-col">
							<div class="flex flex-col lg:flex-row gap-5">
								<div class="form-control w-fit">
									<label class="label" for="firstName">
										<span class="label-text pl-[0.8rem]">Nombre</span>
									</label>
									<input
										class="input input-bordered {!editingPersonal ? 'input-ghost ' : ''}"
										type="text"
										name="firstName"
										id="firstName"
										value={firstName}
										disabled={!editingPersonal}
										placeholder="Nombre"
									/>
								</div>
								<div class="form-control w-fit">
									<label class="label" for="lastName">
										<span class="label-text pl-[0.8rem]">Apellido</span>
									</label>
									<input
										class="input input-bordered {!editingPersonal ? 'input-ghost ' : ''}"
										type="text"
										name="lastName"
										id="lastName"
										value={lastName}
										disabled={!editingPersonal}
										placeholder="Apellido"
									/>
								</div>
							</div>
							<div class="form-control w-fit box-content">
								<label class="label" for="email">
									<span class="label-text pl-[0.8rem]">Correo</span>
								</label>
								<p class="disabled input input-bordered input-ghost w-fit break-words">
									{email}
								</p>
							</div>
						</div>
					</form>
				</div>
			{:else if current === 'security'}
				<h3 class="mb-8 text-2xl font-bold leading-none tracking-tight">Seguridad</h3>
				{#if session.user.app_metadata.provider === 'github'}
					<p>No podes cambiar tu contraseña ya que iniciaste sesion con GitHub.</p>
				{:else if session.user.app_metadata.provider === 'email'}
					<div class="border-2 border-secondary rounded-box w-full p-5">
						<h2 class="mt-0 lg:text-start text-center">Cambiar contraseña</h2>
						<div class="flex gap items-end flex-col lg:flex-row gap-5 mt-5">
							<div class="form-control w-fit lg:mx-0 mx-auto">
								<label class="label" for="passwordInput">
									<span class="label-text">Contraseña nueva</span>
								</label>
								<input
									class="input input-bordered"
									type="password"
									name="passwordInput"
									id="passwordInput"
									placeholder="•••••"
								/>
							</div>
							<div class="form-control w-fit lg:mx-0 mx-auto">
								<label class="label" for="confirmPassword">
									<span class="label-text">Confirmar contraseña</span>
								</label>
								<input
									class="input input-bordered"
									type="password"
									name="confirmPassword"
									id="confirmPassword"
									placeholder="•••••"
								/>
							</div>
							{#if passwordLoading}
								<button class="btn btn-info lg:mx-0 mx-auto">
									Cargando...
									<span class="loading loading-spinner loading-xs" />
								</button>
							{:else}
								<button class="btn btn-success lg:mx-0 mx-auto" on:click={() => changePassword()}
									>Enviar</button
								>
							{/if}
						</div>
					</div>
				{/if}
			{:else if current === 'delete'}
				<h3 class="mb-8 text-2xl font-bold leading-none tracking-tight">Borrar</h3>
				<div class="border-2 border-secondary rounded-box p-5">
					<p class="mt-0">Estas seguro de que deseas borrar tu cuenta?</p>
					<p class="text-error mt-2 mb-4">Esta accion no es reversible</p>
					<button class="btn btn-error" onclick="deleteConfirm.showModal()">
						<iconify-icon icon="heroicons:trash-20-solid" class="text-lg" />
						Borrar
					</button>
					<dialog id="deleteConfirm" class="modal">
						<div class="modal-box w-fit">
							<form method="dialog">
								<button class="btn btn-sm btn-square btn-ghost absolute right-2 top-2"
									><iconify-icon icon="lucide:x" class="closeModalIcon" /></button
								>
							</form>
							<h2 class="mt-0 text-error">Borrar cuenta</h2>
							<p>Confirma la accion.</p>
							<button class="btn btn-error" on:click={() => deleteAccount()}>Borrar</button>
						</div>
						<form method="dialog" class="modal-backdrop">
							<button>close</button>
						</form>
					</dialog>
				</div>
			{/if}
		</div>
	</div>
</section>

<style lang="postcss">
	li {
		padding-right: 0.375em;
	}
	input[disabled] {
		background: none;
		border-color: transparent;
		cursor: default;
	}
	input[disabled]::placeholder {
		color: var(--tw-text-opacity);
	}

	p.disabled {
		background: none;
		border-color: transparent;
		cursor: default;
		color: var(--tw-text-opacity);
	}
</style>
