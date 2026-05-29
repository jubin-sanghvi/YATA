const STORAGE_KEY = 'yata-v1';
const SCHEMA_VERSION = 1;

function loadInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (parsed?.version === SCHEMA_VERSION && Array.isArray(parsed.tasks)) {
      return parsed.tasks;
    }
  } catch {}
  return [];
}

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function createStore() {
  let tasks = $state(loadInitial());

  $effect.root(() => {
    $effect(() => {
      const payload = JSON.stringify({ version: SCHEMA_VERSION, tasks });
      try { localStorage.setItem(STORAGE_KEY, payload); } catch {}
    });
  });

  return {
    get tasks() { return tasks; },
    set tasks(next) { tasks = next; },

    add({ text, dueAt }) {
      tasks = [
        ...tasks,
        {
          id: uid(),
          text,
          dueAt: dueAt ?? null,
          done: false,
          doneAt: null,
          createdAt: new Date().toISOString(),
          order: tasks.length,
        },
      ];
    },

    toggle(id) {
      tasks = tasks.map(t =>
        t.id === id
          ? { ...t, done: !t.done, doneAt: !t.done ? new Date().toISOString() : null }
          : t,
      );
    },

    remove(id) {
      tasks = tasks.filter(t => t.id !== id);
    },

    update(id, patch) {
      tasks = tasks.map(t => (t.id === id ? { ...t, ...patch } : t));
    },

    reorderBucket(bucketKey, idsInOrder) {
      const idSet = new Set(idsInOrder);
      const indexById = new Map(idsInOrder.map((id, i) => [id, i]));
      tasks = tasks.map(t =>
        idSet.has(t.id) ? { ...t, order: indexById.get(t.id) } : t,
      );
    },

    clearCompleted() {
      tasks = tasks.filter(t => !t.done);
    },

    importJSON(data) {
      if (data?.version === SCHEMA_VERSION && Array.isArray(data.tasks)) {
        tasks = data.tasks;
        return true;
      }
      return false;
    },

    exportJSON() {
      return { version: SCHEMA_VERSION, tasks, exportedAt: new Date().toISOString() };
    },
  };
}

export const store = createStore();
