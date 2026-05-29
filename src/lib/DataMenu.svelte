<script>
  import { store } from './store.svelte.js';

  let open = $state(false);
  let fileInput;

  function toggle() { open = !open; }

  function exportData() {
    const data = store.exportJSON();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `yata-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    open = false;
  }

  function pickFile() { fileInput?.click(); }

  async function importData(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      const ok = store.importJSON(data);
      if (!ok) alert('That file does not look like a YATA export.');
    } catch {
      alert('Could not read that file.');
    }
    e.target.value = '';
    open = false;
  }

  function clearCompleted() {
    if (confirm('Remove all completed tasks?')) store.clearCompleted();
    open = false;
  }
</script>

<div class="wrap">
  <button class="trigger" onclick={toggle} aria-label="Menu">⋯</button>
  {#if open}
    <button class="backdrop" onclick={() => open = false} aria-label="Close menu"></button>
    <div class="menu">
      <button onclick={exportData}>Export tasks</button>
      <button onclick={pickFile}>Import tasks</button>
      <button onclick={clearCompleted}>Clear completed</button>
    </div>
  {/if}
  <input
    bind:this={fileInput}
    type="file"
    accept="application/json"
    onchange={importData}
    style="display:none"
  />
</div>

<style>
  .wrap { position: relative; }
  .trigger {
    background: transparent;
    border: none;
    color: var(--text-muted);
    font-size: 1.4rem;
    cursor: pointer;
    padding: 4px 10px;
    border-radius: 8px;
    line-height: 1;
  }
  .trigger:hover { background: var(--bg-elevated); }
  .backdrop {
    position: fixed; inset: 0; z-index: 5;
    background: transparent; border: none; cursor: default; padding: 0;
  }
  .menu {
    position: absolute;
    right: 0;
    top: calc(100% + 6px);
    background: var(--surface);
    border-radius: 10px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.06);
    padding: 4px;
    min-width: 160px;
    z-index: 10;
    display: flex;
    flex-direction: column;
  }
  .menu button {
    background: transparent;
    border: none;
    text-align: left;
    padding: 9px 12px;
    font-size: 0.9rem;
    color: var(--text);
    border-radius: 6px;
    cursor: pointer;
  }
  .menu button:hover { background: var(--bg-elevated); }
</style>
