// Mock Supabase client using localStorage

// Helper to get/set data
const getStorage = (key: string) => JSON.parse(localStorage.getItem(key) || '[]');
const setStorage = (key: string, data: any) => localStorage.setItem(key, JSON.stringify(data));

// Mock User and Session types based on Supabase
export type User = {
    id: string;
    email: string;
    created_at: string;
};

export type Session = {
    access_token: string;
    user: User;
};

type AuthChangeEvent = 'SIGNED_IN' | 'SIGNED_OUT' | 'USER_UPDATED';
type AuthChangeListener = (event: AuthChangeEvent, session: Session | null) => void;

class MockAuth {
    private listeners: Set<AuthChangeListener> = new Set();

    private getSessionFromStorage(): Session | null {
        const sessionStr = localStorage.getItem('mock_supabase_session');
        return sessionStr ? JSON.parse(sessionStr) : null;
    }

    private saveSession(session: Session | null) {
        if (session) {
            localStorage.setItem('mock_supabase_session', JSON.stringify(session));
        } else {
            localStorage.removeItem('mock_supabase_session');
        }
    }

    async signUp({ email, password }: { email: string, password?: string }) {
        await new Promise(r => setTimeout(r, 500)); // Simulate network
        const users = getStorage('mock_users');

        if (users.find((u: any) => u.email === email)) {
            return { error: new Error('User already exists') };
        }

        const newUser = { id: String(Date.now()), email, password, created_at: new Date().toISOString() };
        users.push(newUser);
        setStorage('mock_users', users);

        const session: Session = {
            access_token: 'mock_token_' + Date.now(),
            user: { id: newUser.id, email: newUser.email, created_at: newUser.created_at }
        };

        this.saveSession(session);
        this.notifyListeners('SIGNED_IN', session);

        return { data: { user: session.user, session }, error: null };
    }

    async signInWithPassword({ email, password }: { email: string, password?: string }) {
        await new Promise(r => setTimeout(r, 500));
        const users = getStorage('mock_users');
        const user = users.find((u: any) => u.email === email && u.password === password);

        if (!user) {
            return { error: new Error('Invalid login credentials') };
        }

        const session: Session = {
            access_token: 'mock_token_' + Date.now(),
            user: { id: user.id, email: user.email, created_at: user.created_at }
        };

        this.saveSession(session);
        this.notifyListeners('SIGNED_IN', session);

        return { data: { user: session.user, session }, error: null };
    }

    async signOut() {
        await new Promise(r => setTimeout(r, 200));
        this.saveSession(null);
        this.notifyListeners('SIGNED_OUT', null);
        return { error: null };
    }

    async getSession() {
        return { data: { session: this.getSessionFromStorage() }, error: null };
    }

    onAuthStateChange(listener: AuthChangeListener) {
        this.listeners.add(listener);
        return {
            data: {
                subscription: {
                    unsubscribe: () => {
                        this.listeners.delete(listener);
                    }
                }
            }
        };
    }

    private notifyListeners(event: AuthChangeEvent, session: Session | null) {
        this.listeners.forEach(listener => listener(event, session));
    }
}

class MockDB {
    from(table: string) {
        return {
            insert: async (data: any | any[]) => {
                await new Promise(r => setTimeout(r, 300));
                const records = getStorage(`mock_db_${table}`);
                const toInsert = Array.isArray(data) ? data : [data];

                const inserted = toInsert.map(item => ({
                    ...item,
                    id: String(Date.now()) + Math.random().toString(36).substring(7),
                    created_at: new Date().toISOString()
                }));

                setStorage(`mock_db_${table}`, [...records, ...inserted]);
                return { error: null, data: inserted };
            },

            select: (query?: string) => {
                // A very basic query builder mock
                let result = getStorage(`mock_db_${table}`);
                let filterCol: string | null = null;
                let filterVal: any = null;
                let orderCol: string | null = null;
                let orderAsc = true;

                const execute = async () => {
                    await new Promise(r => setTimeout(r, 300));
                    if (filterCol) {
                        result = result.filter((item: any) => item[filterCol] === filterVal);
                    }
                    if (orderCol) {
                        result.sort((a: any, b: any) => {
                            const valA = a[orderCol];
                            const valB = b[orderCol];
                            if (valA < valB) return orderAsc ? -1 : 1;
                            if (valA > valB) return orderAsc ? 1 : -1;
                            return 0;
                        });
                    }
                    return { data: result, error: null };
                };

                const qb: any = {
                    eq: (column: string, value: any) => {
                        filterCol = column;
                        filterVal = value;
                        return qb;
                    },
                    order: (column: string, options?: { ascending?: boolean }) => {
                        orderCol = column;
                        if (options?.ascending !== undefined) {
                            orderAsc = options.ascending;
                        }
                        return qb;
                    },
                    then: (onfulfilled?: ((value: any) => any) | undefined | null) => {
                        return execute().then(onfulfilled);
                    }
                };

                // Make the query builder thenable so it can be awaited
                return qb as Promise<{ data: any[], error: Error | null }> & typeof qb;
            }
        };
    }
}

export const supabase = {
    auth: new MockAuth(),
    from: new MockDB().from
};
