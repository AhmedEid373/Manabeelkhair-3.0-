// ─────────────────────────────────────────────────────────────────────────────
// API-backed database client — all data persists in MySQL via the backend.
// Replaces the previous localStorage-only implementation.
// Admin credentials: admin@manabeaalkhair.org / Admin@2024
// ─────────────────────────────────────────────────────────────────────────────

// ── Types ────────────────────────────────────────────────────────────────────

export type Contact = {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: 'donation' | 'volunteer' | 'inquiry' | 'partnership' | 'helper' | 'needer';
  message: string | null;
  location: string | null;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type DonationRequest = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  amount: string;
  donation_method: string;
  allocation: string | null;
  privacy_agreed: boolean;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  admin_notes: string | null;
  created_at: string;
};

export type VolunteerRequest = {
  id: string;
  full_name: string;
  age: string;
  email: string;
  phone: string;
  region: string;
  skills: string;
  availability: string;
  volunteer_type: string;
  notes: string;
  terms_agreed: boolean;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  admin_notes: string | null;
  created_at: string;
};

export type SiteContent = {
  id: string;
  section_key: string;
  content_ar: string;
  content_en: string;
  content_type: string;
  section_group: string;
  updated_at: string;
  updated_by: string | null;
};

type DbRow = Record<string, unknown>;

// ── API helpers ──────────────────────────────────────────────────────────────

async function apiFetch(path: string, opts?: RequestInit): Promise<Response> {
  return fetch(path, { credentials: 'include', ...opts });
}

async function apiJson<T = unknown>(path: string, opts?: RequestInit): Promise<{ data: T | null; error: Error | null }> {
  try {
    const res = await apiFetch(path, opts);
    if (!res.ok) {
      const body = await res.json().catch(() => ({ error: res.statusText }));
      return { data: null, error: new Error(body.error || res.statusText) };
    }
    const data = await res.json();
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err : new Error(String(err)) };
  }
}

// ── Query builder ─────────────────────────────────────────────────────────────

class SelectQuery implements PromiseLike<{ data: DbRow[]; error: Error | null }> {
  private _orderField: string | null = null;
  private _orderAsc = true;
  private _filters: Array<{ field: string; value: unknown }> = [];

  constructor(private tableName: string) {}

  order(field: string, opts?: { ascending?: boolean }) {
    this._orderField = field;
    this._orderAsc = opts?.ascending ?? true;
    return this;
  }

  eq(field: string, value: unknown) {
    this._filters.push({ field, value });
    return this;
  }

  then<T>(
    resolve: (v: { data: DbRow[]; error: Error | null }) => T,
    _reject?: (reason: unknown) => T
  ): Promise<T> {
    return (async () => {
      const { data, error } = await apiJson<DbRow[]>(`/api/tables/${this.tableName}`);
      if (error || !data) {
        return { data: [] as DbRow[], error };
      }

      let rows = data;

      // Apply client-side filters
      for (const f of this._filters) {
        rows = rows.filter((r) => r[f.field] === f.value);
      }

      // Apply client-side ordering
      if (this._orderField) {
        const field = this._orderField;
        const asc = this._orderAsc;
        rows = [...rows].sort((a, b) => {
          const av = String(a[field] ?? '');
          const bv = String(b[field] ?? '');
          return asc ? av.localeCompare(bv) : bv.localeCompare(av);
        });
      }

      return { data: rows, error: null };
    })().then(resolve);
  }
}

class TableRef {
  constructor(private name: string) {}

  select(_fields = '*') {
    return new SelectQuery(this.name);
  }

  async insert(rows: DbRow[]): Promise<{ data: DbRow[]; error: Error | null }> {
    const results: DbRow[] = [];
    for (const row of rows) {
      const { data, error } = await apiJson<DbRow>(`/api/tables/${this.name}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: crypto.randomUUID(), ...row }),
      });
      if (error) return { data: [], error };
      if (data) results.push(data);
    }
    return { data: results, error: null };
  }

  update(updates: DbRow) {
    const name = this.name;
    return {
      async eq(field: string, value: unknown): Promise<{ data: DbRow | null; error: Error | null }> {
        if (field !== 'id') {
          return { data: null, error: new Error('Only eq("id", ...) is supported for updates') };
        }
        return apiJson<DbRow>(`/api/tables/${name}/${value}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        });
      },
    };
  }

  delete() {
    const name = this.name;
    return {
      async eq(field: string, value: unknown): Promise<{ data: null; error: Error | null }> {
        if (field !== 'id') {
          return { data: null, error: new Error('Only eq("id", ...) is supported for deletes') };
        }
        const { error } = await apiJson(`/api/tables/${name}/${value}`, {
          method: 'DELETE',
        });
        return { data: null, error };
      },
    };
  }
}

// ── Auth ──────────────────────────────────────────────────────────────────────

type LocalUser = { id: string; email: string };
type AuthChangeCallback = (event: string, session: { user: LocalUser } | null) => void;

const authListeners: AuthChangeCallback[] = [];
let cachedUser: LocalUser | null = null;

function notifyListeners(event: string, session: { user: LocalUser } | null) {
  cachedUser = session?.user ?? null;
  authListeners.forEach((cb) => cb(event, session));
}

const apiAuth = {
  async getSession(): Promise<{ data: { session: { user: LocalUser } | null } }> {
    try {
      const res = await apiFetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        const user: LocalUser = { id: data.id || 'admin', email: data.email };
        cachedUser = user;
        return { data: { session: { user } } };
      }
    } catch {
      // Not authenticated
    }
    cachedUser = null;
    return { data: { session: null } };
  },

  async signInWithPassword({ email, password }: { email: string; password: string }): Promise<{ error: Error | null }> {
    try {
      const res = await apiFetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        const data = await res.json();
        const user: LocalUser = { id: 'admin', email: data.email || email };
        notifyListeners('SIGNED_IN', { user });
        return { error: null };
      }
      const body = await res.json().catch(() => ({ error: 'Invalid credentials' }));
      return { error: new Error(body.error || 'Invalid credentials') };
    } catch (err) {
      return { error: err instanceof Error ? err : new Error(String(err)) };
    }
  },

  async signOut(): Promise<void> {
    try {
      await apiFetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // Best-effort
    }
    notifyListeners('SIGNED_OUT', null);
  },

  onAuthStateChange(callback: AuthChangeCallback): { data: { subscription: { unsubscribe: () => void } } } {
    authListeners.push(callback);
    return {
      data: {
        subscription: {
          unsubscribe() {
            const idx = authListeners.indexOf(callback);
            if (idx !== -1) authListeners.splice(idx, 1);
          },
        },
      },
    };
  },
};

// ── Public client ─────────────────────────────────────────────────────────────

export const supabase = {
  from(table: string) {
    return new TableRef(table);
  },
  auth: apiAuth,
};
