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
	let fullname = profile?.full_name ?? '';
	let avatarUrl = profile?.avatar_url ?? '';

	let stockNotifications = profile?.stockNotifications.toString();

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
		let fullname = document.getElementById('fullname').value;
		if (editingPersonal === true) {
			editingPersonal = 'loading';
			const data = new FormData();
			data.append('fullname', fullname);
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

	async function editProfile() {
		if (editingProfile === true) {
			let select = document.getElementById('avatarUpload');
			let file = select.files[0];
			editingProfile = 'loading';
			const data = new FormData();
			data.append('avatar', file);
			const res = await fetch('?/editProfile', {
				method: 'POST',
				body: data
			}).then((response) => {
				editingProfile = false;
				toast.success(
					'Avatar actualizado correctamente! Los cambios pueden tardar un tiempo en tomar efecto...'
				);
			});
		} else if (editingProfile === false) {
			editingProfile = true;
		}
	}

	async function editSettings() {
		let stockNotifications = document.getElementById('stockNotifications');
		let notificationsValue = stockNotifications.value;
		let notifications =
			notificationsValue === 'true' ? true : notificationsValue === 'false' ? false : null;
		if (notificationsValue !== null) {
			const data = new FormData();
			data.append('notifications', notificationsValue);
			const res = await fetch('?/editSettings', {
				method: 'POST',
				body: data
			}).then((response) => {
				if (notifications) {
					toast.success('Toasts activados! Recarga la pagina para que tome efecto.');
				} else {
					toast.success('Toasts desactivados! Recarga la pagina para que tome efecto.');
				}
			});
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

{#if fullname == "" || fullname == null}
	 {fullname="Cambie su nombre uwu"}
{/if} 

<svelte:head>
	<title>Ajustes de cuenta</title>
</svelte:head>

<section class="bg-neutral w-full p-5 min-h-screen">
	<div
		class="bg-base-100 rounded-box flex-col lg:flex-row min-h-[calc(100vh-6rem)] overflow-hidden flex shadow-2xl shadow-primary/5"
	>
		<ul
			class="prose menu menu-horizontal lg:menu-vertical m-0 h-max lg:w-56 flex justify-evenly mx-auto lg:mx-0 w-full"
		>
			<li class="mt-[0.5rem]">
				<button
					class={current === 'profile' ? 'active' : ''}
					on:click={() => (current = 'profile')}
					name="profile">Perfil</button
				>
			</li>
			<li>
				<button
					class={current === 'settings' ? 'active' : ''}
					on:click={() => (current = 'settings')}
					name="settings">Ajustes</button
				>
			</li>
			<li>
				<button
					class={current === 'security' ? 'active' : ''}
					on:click={() => (current = 'security')}
					name="security">Seguridad</button
				>
			</li>
			<li>
				<button
					class="text-error hover:text-error lg:mt-5 {current === 'delete' ? 'active' : ''}"
					on:click={() => (current = 'delete')}
					name="delete">Borrar cuenta</button
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
								<span class="text-3xl">{fullname.charAt(0)}</span>
							</div>
						</div>
					{/if}
					<div class="flex flex-col justify-center lg:ml-16 text-center lg:text-start">
						<h3 class="m-0">{fullname}</h3>
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
							<button
								class="btn btn-xs btn-error text-right"
								on:click={() => editProfile()}
								name="editProfile"
							>
								Editar
								<iconify-icon icon="mingcute:pencil-2-fill" class="text-base" />
							</button>
						{:else if editingProfile === 'loading'}
							<button
								class="btn btn-xs btn-info text-right"
								name="loadingProfile"
								aria-label="Loading"
							>
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
							<button
								class="btn btn-xs btn-success text-right"
								on:click={() => editPersonal()}
								name="editPersonal"
							>
								Enviar
								<iconify-icon icon="mingcute:send-fill" class="text-base" />
							</button>
						{:else if editingPersonal === false}
							<button
								class="btn btn-xs btn-error text-right"
								on:click={() => editPersonal()}
								name="savePersonal"
							>
								Editar
								<iconify-icon icon="mingcute:pencil-2-fill" class="text-base" />
							</button>
						{:else if editingPersonal === 'loading'}
							<button
								class="btn btn-xs btn-info text-right"
								name="loadingPersonal"
								aria-label="Loading"
							>
								Cargando...
								<span class="loading loading-spinner loading-xs" />
							</button>
						{/if}
					</div>
					<form class="flex flex-col gap-5">
						<div class="flex gap-5 flex-col">
							<div class="flex flex-col lg:flex-row gap-5">
								<div class="form-control w-fit">
									<label class="label" for="fullname">
										<span class="label-text pl-[0.8rem]">Nombre</span>
									</label>
									<input
										class="input input-bordered {!editingPersonal ? 'input-ghost ' : ''}"
										type="text"
										name="fullname"
										id="fullname"
										value={fullname}
										disabled={!editingPersonal}
										placeholder="Nombre"
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
			{:else if current === 'settings'}
				<h3 class="mb-8 text-2xl font-bold leading-none tracking-tight">Ajustes</h3>
				<div class="border-2 border-secondary rounded-box w-full p-5">
					<h2 class="mt-0 lg:text-start text-center">Toasts</h2>
					<div class="flex items-center lg:items-start flex-col gap-5 mt-5">
						<select
							bind:value={stockNotifications}
							on:change={() => editSettings()}
							name="stockNotifications"
							id="stockNotifications"
							class="select select-primary w-full max-w-xs"
						>
							<option value="true" selected={stockNotifications === true}>Activadas</option>
							<option value="false" selected={stockNotifications === false}>Desactivadas</option>
						</select>
					</div>
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
								<button
									class="btn btn-info lg:mx-0 mx-auto"
									name="loadingPassword"
									aria-label="Loading"
								>
									Cargando...
									<span class="loading loading-spinner loading-xs" />
								</button>
							{:else}
								<button
									class="btn btn-success lg:mx-0 mx-auto"
									on:click={() => changePassword()}
									name="savePassword">Enviar</button
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
					<button
						class="btn btn-error"
						onclick="deleteConfirm.showModal()"
						name="deleteAccount1"
						aria-label="Delete"
					>
						<iconify-icon icon="heroicons:trash-20-solid" class="text-lg" />
						Borrar
					</button>
					<dialog id="deleteConfirm" class="modal">
						<div class="modal-box w-fit">
							<form method="dialog">
								<button
									class="btn btn-sm btn-square btn-ghost absolute right-2 top-2"
									name="closeModal1"><iconify-icon icon="lucide:x" class="closeModalIcon" /></button
								>
							</form>
							<h2 class="mt-0 text-error">Borrar cuenta</h2>
							<p>Confirma la accion.</p>
							<button class="btn btn-error" name="delete" on:click={() => deleteAccount()}
								>Borrar</button
							>
						</div>
						<form method="dialog" class="modal-backdrop">
							<button name="closemodal1">close</button>
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
