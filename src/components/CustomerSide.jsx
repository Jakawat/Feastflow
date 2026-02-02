import React, { useState } from 'react';

export default function CustomerSide({ menu, onOrder, history }) {
  const [tray, setTray] = useState([]);
  const [activeCat, setActiveCat] = useState('Appetizers');
  
  // Persistence logic for the table session
  const [tableNumber, setTableNumber] = useState(localStorage.getItem('ff_table_session') || '');
  const [tempTable, setTempTable] = useState('');

  const total = tray.reduce((sum, i) => sum + (i.price * i.quantity), 0).toFixed(2);
  const filtered = menu.filter(item => item.category === activeCat);

  const handleSetTable = () => {
    if (tempTable.trim()) {
      localStorage.setItem('ff_table_session', tempTable);
      setTableNumber(tempTable);
      // Optional: Refresh history view by forcing a state sync if needed
      window.location.reload(); 
    }
  };

  const handlePlaceOrder = () => {
    onOrder(tray, total, tableNumber);
    setTray([]);
  };

  // 1. WELCOME SCREEN
  if (!tableNumber) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '60vh' }}>
        <div className="card" style={{ textAlign: 'center', padding: '40px', maxWidth: '400px', width: '100%' }}>
          <h1 style={{ color: 'var(--primary)', marginBottom: '10px' }}>FEASTFLOW</h1>
          <p style={{ color: '#666', marginBottom: '30px' }}>Enter your table number to view the menu.</p>
          <input 
            type="number" 
            placeholder="Table No." 
            value={tempTable} 
            onChange={(e) => setTempTable(e.target.value)}
            style={{ width: '100%', padding: '15px', fontSize: '1.2rem', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '20px', textAlign: 'center', boxSizing: 'border-box' }}
          />
          <button className="btn-primary" onClick={handleSetTable} disabled={!tempTable}>
            Start Ordering
          </button>
        </div>
      </div>
    );
  }

  // 2. MAIN MENU SCREEN
  return (
    <div className="customer-layout" style={{ display: 'flex', width: '100%', gap: '30px' }}>
      <div className="menu-section" style={{ flex: 3 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            {['Appetizers', 'Main Dishes', 'Drinks'].map(c => (
              <button key={c} onClick={() => setActiveCat(c)}
                style={{ 
                  padding: '10px 20px', 
                  borderRadius: '20px', 
                  border: 'none', 
                  cursor: 'pointer', 
                  backgroundColor: activeCat === c ? '#4a90e2' : '#eee', 
                  color: activeCat === c ? 'white' : '#666', 
                  fontWeight: '600' 
                }}>
                {c}
              </button>
            ))}
          </div>
          <div style={{ background: '#e1f5fe', padding: '5px 15px', borderRadius: '15px', fontWeight: 'bold', color: '#01579b' }}>
            TABLE {tableNumber}
          </div>
        </div>
        
        <div className="menu-grid">
          {filtered.map(item => (
            <div key={item.id} className="card" style={{padding: '0', overflow: 'hidden'}}>
              <div style={{height: '160px', width: '100%', background: '#f0f0f0'}}>
                {item.imageUrl && <img src={item.imageUrl} alt={item.name} style={{width: '100%', height: '100%', objectFit: 'cover'}} />}
              </div>
              <div style={{padding: '15px'}}>
                <h3 style={{marginTop: 0}}>{item.name}</h3>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <span style={{fontWeight: 'bold', color: '#4a90e2'}}>${item.price.toFixed(2)}</span>
                  <button className="btn-primary" style={{width: 'auto', padding: '8px 15px'}} 
                    onClick={() => {
                      const exists = tray.find(t => t.id === item.id);
                      if (exists) setTray(tray.map(t => t.id === item.id ? { ...t, quantity: t.quantity + 1 } : t));
                      else setTray([...tray, { ...item, quantity: 1 }]);
                    }}>
                    + Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '40px' }}>
          <h3>Order Tracker (Table {tableNumber})</h3>
          <div className="card">
            {history.length === 0 ? <p style={{color: '#999'}}>No active orders for this table.</p> : history.slice().reverse().map(o => (
              <div key={o.orderKey} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #eee' }}>
                <div>
                  <strong>{o.id}</strong>: {o.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                  <div style={{fontSize: '0.8rem', color: '#999'}}>{o.time}</div>
                </div>
                <span className="status-badge">{o.status}</span>
              </div>
            ))}
          </div>
          <button 
            onClick={() => { if(window.confirm("Switch table?")) { localStorage.removeItem('ff_table_session'); window.location.reload(); }}} 
            style={{ marginTop: '20px', background: 'none', border: 'none', color: '#999', cursor: 'pointer', fontSize: '0.8rem' }}
          >
            Wrong table? Reset Session
          </button>
        </div>
      </div>

      <aside className="sidebar">
        <h2>My Tray</h2>
        <div style={{ minHeight: '150px' }}>
          {tray.length === 0 ? <p style={{color: '#999', textAlign: 'center', marginTop: '40px'}}>Tray is empty</p> : tray.map(i => (
            <div key={i.id} style={{ display: 'flex', flexDirection: 'column', marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{fontWeight: '600'}}>{i.name}</span>
                <button onClick={() => setTray(tray.filter(t => t.id !== i.id))} style={{background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer'}}>🗑️</button>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '5px', alignItems: 'center'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                  <button className="btn-qty" onClick={() => {
                    if (i.quantity > 1) setTray(tray.map(t => t.id === i.id ? {...t, quantity: t.quantity - 1} : t));
                    else setTray(tray.filter(t => t.id !== i.id));
                  }}>-</button>
                  <strong>{i.quantity}</strong>
                  <button className="btn-qty" onClick={() => setTray(tray.map(t => t.id === i.id ? {...t, quantity: t.quantity + 1} : t))}>+</button>
                </div>
                <span style={{fontWeight: 'bold'}}>${(i.price * i.quantity).toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
        
        <div style={{ borderTop: '2px solid #f4f4f4', paddingTop: '20px', marginTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold' }}>
            <span>Total</span><span>${total}</span>
          </div>
          <button className="btn-primary" style={{marginTop: '20px'}} disabled={tray.length === 0} onClick={handlePlaceOrder}>
            Confirm Order
          </button>
        </div>
      </aside>
    </div>
  );
}