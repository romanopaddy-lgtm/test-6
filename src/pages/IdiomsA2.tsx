import React from 'react';
import IDIOMS_A2 from '../data/idiomsA2';

export default function IdiomsA2(): JSX.Element {
  return (
    <div style={{ padding: 16 }}>
      <h2>Idioms A2</h2>
      <p style={{ color: '#666' }}>Lista di idioms (EN) con significato in inglese.</p>
      <div style={{ marginTop: 12 }}>
        {IDIOMS_A2.map((it, idx) => (
          <div key={idx} style={{ padding: 8, borderBottom: '1px solid #eee' }}>
            <div style={{ fontWeight: 600 }}>{it.idiom}</div>
            <div style={{ color: '#444' }}>{it.meaning}</div>
          </div>
        ))}
      </div>
    </div>
  );
}