import React from 'react';
import { listUsers } from '@/services/authService';

export default function UsersPage(){
  const users = listUsers();
  return (
    <div className="card">
      <h3>Registered users</h3>
      {users.length === 0 ? <div className="muted">No users yet</div> : (
        <table>
          <thead><tr><th>Id</th><th>Username</th><th>Email</th><th>Created</th></tr></thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td style={{fontSize:12}}>{u.id}</td>
                <td>{u.username}</td>
                <td>{u.email || '-'}</td>
                <td>{new Date(u.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}