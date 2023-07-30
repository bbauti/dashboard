<script>
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

	function set_theme(event) {
		const select = event.target;
		const theme = select.value;
		if (themes.includes(theme)) {
			const one_year = 60 * 60 * 24 * 365;
			window.localStorage.setItem('theme', theme);
			document.cookie = `theme=${theme}; max-age=${one_year}; path=/; SameSite=Lax`;
			document.documentElement.setAttribute('data-theme', theme);
			current_theme = theme;
		}
	}

	$: if (current_theme === '') {
		current_theme = 'dark';
	}
</script>

<select
	bind:value={current_theme}
	data-choose-theme
	aria-label="select theme"
	class="select select-bordered min-h-[3rem] capitalize h-[3rem] min-w-[1rem] w-full mr-3"
	on:change={set_theme}
>
	{#each themes as theme, index}
		<option value={theme} selected={index === 1} class="capitalize">{theme}</option>
	{/each}
</select>
