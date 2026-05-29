<script>
  import QuickAdd from './lib/QuickAdd.svelte';
  import Bucket from './lib/Bucket.svelte';
  import DataMenu from './lib/DataMenu.svelte';
  import { store } from './lib/store.svelte.js';
  import { BUCKETS, groupByBucket } from './lib/buckets.js';

  // Re-evaluate buckets when the day rolls over (every 5 min).
  let now = $state(new Date());
  setInterval(() => { now = new Date(); }, 5 * 60 * 1000);

  let groups = $derived(groupByBucket(store.tasks, now));
</script>

<main>
  <header>
    <h1>YATA</h1>
    <DataMenu />
  </header>

  <QuickAdd />

  {#each BUCKETS as { key, label }}
    <Bucket bucketKey={key} {label} tasks={groups[key]} />
  {/each}

  <footer>
    Tap to edit · Swipe right to complete · Swipe left to delete · Drag to reorder
  </footer>
</main>

<style>
  main {
    max-width: 560px;
    margin: 0 auto;
    padding: 32px 20px 80px;
  }
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
  }
  h1 {
    margin: 0;
    font-size: 1.6rem;
    font-weight: 700;
    letter-spacing: -0.02em;
  }
  footer {
    margin-top: 40px;
    text-align: center;
    color: var(--text-muted);
    font-size: 0.75rem;
    opacity: 0.7;
  }
</style>
