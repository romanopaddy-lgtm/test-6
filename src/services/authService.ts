export type UserRecord = {
  id: string;
  username: string;
  email?: string;
  passwordHash: string;
  createdAt: number;
};

const USERS_KEY = 'panda.users.v1';
const CURRENT_KEY = 'panda.currentUser.v1';

async function hashPassword(password: string) {
  const enc = new TextEncoder();
  const data = await crypto.subtle.digest('SHA-256', enc.encode(password));
  return Array.from(new Uint8Array(data)).map(b => b.toString(16).padStart(2,'0')).join('');
}

function loadUsers(): UserRecord[] {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]') as UserRecord[]; } catch { return []; }
}
function saveUsers(u: UserRecord[]) { localStorage.setItem(USERS_KEY, JSON.stringify(u)); }

export async function register(username: string, email: string|undefined, password: string) {
  const users = loadUsers();
  if (users.find(x => x.username === username || (email && x.email === email))) {
    throw new Error('User already exists');
  }
  const passwordHash = await hashPassword(password);
  const rec: UserRecord = { id: 'u_' + Math.random().toString(36).slice(2,9), username, email, passwordHash, createdAt: Date.now() };
  users.push(rec);
  saveUsers(users);
  localStorage.setItem(CURRENT_KEY, JSON.stringify({ id: rec.id, username: rec.username, email: rec.email }));
  return rec;
}

export async function login(usernameOrEmail: string, password: string) {
  const users = loadUsers();
  const passwordHash = await hashPassword(password);
  const user = users.find(u => u.username === usernameOrEmail || u.email === usernameOrEmail);
  if (!user) throw new Error('User not found');
  if (user.passwordHash !== passwordHash) throw new Error('Invalid credentials');
  localStorage.setItem(CURRENT_KEY, JSON.stringify({ id: user.id, username: user.username, email: user.email }));
  return user;
}

export function logout() {
  localStorage.removeItem(CURRENT_KEY);
}

export function currentUser() {
  try { return JSON.parse(localStorage.getItem(CURRENT_KEY) || 'null'); } catch { return null; }
}

export function listUsers() {
  return loadUsers().map(u => ({ id: u.id, username: u.username, email: u.email, createdAt: u.createdAt }));
}