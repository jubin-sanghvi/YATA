<script>
  import { fly } from 'svelte/transition';
  import { formatDue } from './buckets.js';
  import { store } from './store.svelte.js';

  let { task } = $props();

  let dragX = $state(0);
  let dragging = $state(false);
  let startX = 0;
  let editing = $state(false);
  let editText = $state('');

  const SWIPE_THRESHOLD = 80;

  function onPointerDown(e) {
    if (editing) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    if (e.target.closest('.check, .edit')) return;
    dragging = true;
    startX = e.clientX;
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e) {
    if (!dragging) return;
    const dx = e.clientX - startX;
    dragX = Math.max(-160, Math.min(160, dx));
  }

  function onPointerUp() {
    if (!dragging) return;
    dragging = false;
    if (dragX > SWIPE_THRESHOLD) {
      store.toggle(task.id);
    } else if (dragX < -SWIPE_THRESHOLD) {
      store.remove(task.id);
      return;
    }
    dragX = 0;
  }

  function startEdit() {
    if (task.done) return;
    editText = task.text;
    editing = true;
  }

  function commitEdit() {
    const next = editText.trim();
    if (next && next !== task.text) {
      store.update(task.id, { text: next });
    }
    editing = false;
  }

  function onEditKey(e) {
    if (e.key === 'Enter') { e.preventDefault(); commitEdit(); }
    if (e.key === 'Escape') { editing = false; }
  }

  let bgHint = $derived(
    dragX > 20 ? 'complete' : dragX < -20 ? 'delete' : null,
  );

  function focusOnMount(node) {
    node.focus();
    node.select();
  }
</script>

<div class="row" transition:fly={{ y: -8, duration: 180 }}>
  <div class="bg" class:complete={bgHint === 'complete'} class:delete={bgHint === 'delete'}>
    <span class="hint left">✓ Done</span>
    <span class="hint right">Delete</span>
  </div>

  <div
    class="card"
    class:done={task.done}
    class:dragging
    role="group"
    style:transform="translateX({dragX}px)"
    onpointerdown={onPointerDown}
    onpointermove={onPointerMove}
    onpointerup={onPointerUp}
    onpointercancel={onPointerUp}
  >
    <button
      class="check"
      class:checked={task.done}
      onclick={(e) => { e.stopPropagation(); store.toggle(task.id); }}
      aria-label={task.done ? 'Mark as not done' : 'Mark as done'}
    >
      {#if task.done}✓{/if}
    </button>

    <div class="body">
      {#if editing}
        <input
          class="edit"
          bind:value={editText}
          onblur={commitEdit}
          onkeydown={onEditKey}
          use:focusOnMount
        />
      {:else}
        <button class="text" onclick={startEdit} ondblclick={startEdit}>
          {task.text}
        </button>
      {/if}
      {#if task.dueAt}
        <span class="due">{formatDue(task.dueAt)}</span>
      {/if}
    </div>
  </div>
</div>

<style>
  .row {
    position: relative;
    margin: 6px 0;
    user-select: none;
  }
  .bg {
    position: absolute;
    inset: 0;
    border-radius: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 18px;
    color: white;
    font-weight: 500;
    font-size: 0.9rem;
    background: var(--bg-elevated);
    transition: background 120ms;
  }
  .bg.complete { background: var(--success); }
  .bg.delete   { background: var(--danger); }
  .hint { opacity: 0.95; }
  .hint.right { margin-left: auto; }

  .card {
    position: relative;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 14px;
    background: var(--surface);
    border-radius: 12px;
    box-shadow: 0 1px 2px rgba(0,0,0,0.04), 0 1px 1px rgba(0,0,0,0.02);
    touch-action: pan-y;
    transition: transform 200ms cubic-bezier(.2,.7,.2,1), box-shadow 120ms;
    cursor: grab;
  }
  .card.dragging {
    transition: none;
    cursor: grabbing;
    box-shadow: 0 4px 14px rgba(0,0,0,0.10);
  }
  .card.done .text { color: var(--text-muted); text-decoration: line-through; }

  .check {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    border: 2px solid var(--border);
    background: transparent;
    display: grid;
    place-items: center;
    color: white;
    font-size: 0.8rem;
    cursor: pointer;
    flex-shrink: 0;
    transition: background 150ms, border-color 150ms;
  }
  .check.checked {
    background: var(--accent);
    border-color: var(--accent);
  }

  .body {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
  }
  .text {
    background: none;
    border: none;
    padding: 0;
    text-align: left;
    color: var(--text);
    font-size: 0.98rem;
    cursor: text;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .edit {
    background: transparent;
    border: none;
    outline: none;
    color: var(--text);
    font-size: 0.98rem;
    padding: 0;
    width: 100%;
  }
  .due {
    margin-top: 2px;
    font-size: 0.78rem;
    color: var(--text-muted);
  }
</style>
