import React from 'react'
export default function Index(){
  return (
    <div className="card">
      <h2>Welcome</h2>
      <p className="muted">This is the Step 1 package: Translations ENG↔ITA (A1 dataset).</p>
      <div style={{marginTop:12}}>
        <button onClick={() => window.location.href = '/translations/a1'}>Start A1 Translations</button>
        <button style={{marginLeft:8}} onClick={() => window.location.href = '/translations'}>Start Adaptive Translations</button>
        <button style={{marginLeft:8}} onClick={() => window.location.href = '/conjugations'}>Conjugations</button>
        <button style={{marginLeft:8}} onClick={() => window.location.href = '/auth'}>Login</button>
        <button style={{marginLeft:8}} onClick={() => window.location.href = '/errors/rewrite'}>Rewrite Errors</button>
      </div>
    </div>
  )
}
