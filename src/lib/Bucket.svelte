<script>
  import { flip } from 'svelte/animate';
  import { dragHandleZone } from 'svelte-dnd-action';
  import TaskRow from './TaskRow.svelte';
  import { store } from './store.svelte.js';

  let { bucketKey, label, tasks } = $props();

  const flipDuration = 220;

  function handleConsider(e) {
    // Local visual update only — items prop drives display during drag
    items = e.detail.items;
  }

  function handleFinalize(e) {
    items = e.detail.items;
    store.reorderBucket(bucketKey, items.map(t => t.id));
  }

  let items = $state([]);
  $effect(() => { items = tasks; });
</script>

<section class="bucket">
  <h2>
    {label}
    {#if items.length > 0}<span class="count">{items.length}</span>{/if}
  </h2>

  {#if items.length === 0}
    <p class="empty">Nothing here.</p>
  {:else}
    <div
      class="list"
      use:dragHandleZone={{ items, flipDurationMs: flipDuration, dropTargetStyle: {} }}
      onconsider={handleConsider}
      onfinalize={handleFinalize}
    >
      {#each items as task (task.id)}
        <div animate:flip={{ duration: flipDuration }}>
          <TaskRow {task} />
        </div>
      {/each}
    </div>
  {/if}
</section>

<style>
  .bucket {
    margin-bottom: 28px;
  }
  h2 {
    font-size: 0.78rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--text-muted);
    margin: 0 0 8px 4px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .count {
    background: var(--bg-elevated);
    color: var(--text-muted);
    padding: 1px 8px;
    border-radius: 999px;
    font-size: 0.7rem;
    letter-spacing: 0;
    text-transform: none;
  }
  .empty {
    color: var(--text-muted);
    font-size: 0.85rem;
    margin: 0 0 0 4px;
    opacity: 0.6;
  }
</style>
