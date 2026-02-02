import React from 'react';

export default function KitchenSide({ orders, onUpdateStatus }) {
  const active = orders.filter(o => o.status !== 'Fulfilled');

  return (
    <div className="kitchen-grid" style={{ width: '100%' }}>
      {active.length === 0 ? (
        <div className="card" style={{gridColumn: '1/-1', textAlign: 'center', padding: '40px'}}>
          <h3>Kitchen Clear! 🎉</h3>
          <p style={{color: '#999'}}>No orders currently in the queue.</p>
        </div>
      ) : active.map(o => (
        <div key={o.id} className="card" style={{borderTop: '5px solid #4a90e2'}}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
            <span style={{fontWeight: 'bold', fontSize: '1.1rem'}}>{o.id}</span>
            <span className="status-badge">{o.status}</span>
          </div>
          <div style={{marginBottom: '20px'}}>
            {o.items.map((i, idx) => (
              <div key={idx} style={{padding: '8px 0', borderBottom: '1px solid #f9f9f9', display: 'flex', alignItems: 'center'}}>
                <span style={{background: '#4a90e2', color: 'white', padding: '2px 8px', borderRadius: '4px', marginRight: '10px', fontWeight: 'bold', fontSize: '0.9rem'}}>
                  x{i.quantity}
                </span>
                <span style={{fontWeight: '500'}}>{i.name}</span>
              </div>
            ))}
          </div>
          <button className="btn-primary" onClick={() => onUpdateStatus(o.id, o.status === 'New' ? 'In Progress' : 'Fulfilled')}>
            {o.status === 'New' ? 'Start Preparation' : 'Ready for Pickup'}
          </button>
        </div>
      ))}
    </div>
  );
}