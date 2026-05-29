<script>
  import { parseInput } from './parse.js';
  import { formatDue } from './buckets.js';
  import { store } from './store.svelte.js';

  let value = $state('');
  let preview = $derived(value.trim() ? parseInput(value) : null);

  function submit(e) {
    e.preventDefault();
    const parsed = parseInput(value);
    if (!parsed) return;
    store.add(parsed);
    value = '';
  }
</script>

<form class="quick-add" onsubmit={submit}>
  <span class="plus">+</span>
  <input
    type="text"
    placeholder='Add a task — try "gym tomorrow 7am"'
    bind:value
    autocomplete="off"
  />
  {#if preview?.dueAt}
    <span class="chip">{formatDue(preview.dueAt)}</span>
  {/if}
</form>

<style>
  .quick-add {
    display: flex;
    align-items: center;
    gap: 10px;
    background: var(--surface);
    border-radius: 14px;
    padding: 12px 14px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    margin-bottom: 24px;
    border: 1px solid transparent;
    transition: border-color 150ms, box-shadow 150ms;
  }
  .quick-add:focus-within {
    border-color: var(--accent);
    box-shadow: 0 1px 3px rgba(0,0,0,0.05), 0 0 0 3px rgba(99,102,241,0.15);
  }
  .plus {
    color: var(--text-muted);
    font-size: 1.2rem;
    line-height: 1;
  }
  input {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    font-size: 1rem;
    color: var(--text);
  }
  .chip {
    background: var(--accent-soft);
    color: var(--accent);
    padding: 3px 10px;
    border-radius: 999px;
    font-size: 0.78rem;
    font-weight: 500;
    white-space: nowrap;
  }
</style>
