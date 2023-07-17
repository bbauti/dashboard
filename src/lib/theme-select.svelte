<script lang="ts">
	import { onMount } from 'svelte';
	import { themes } from './themes';

	let current_theme = '';

	onMount(() => {
		if (typeof window !== 'undefined') {
			const theme = window.localStorage.getItem('theme');
			if (theme && themes.includes(theme)) {
				document.documentElement.setAttribute('data-theme', theme);
				current_theme = theme;
			}
		}
	});

	function set_theme(event: Event) {
		const select = event.target as HTMLSelectElement;
		const theme = select.value;
		if (themes.includes(theme)) {
			const one_year = 60 * 60 * 24 * 365;
			window.localStorage.setItem('theme', theme);
			document.cookie = `theme=${theme}; max-age=${one_year}; path=/; SameSite=Lax`;
			document.documentElement.setAttribute('data-theme', theme);
			current_theme = theme;
		}
	}
</script>

<select
	bind:value={current_theme}
	data-choose-theme
	class="select select-bordered min-h-[2rem] capitalize h-[2rem] min-w-[1rem] w-[15ch] mr-3"
	on:change={set_theme}
>
	{#each themes as theme}
		<option value={theme} class="capitalize">{theme}</option>
	{/each}
</select>
