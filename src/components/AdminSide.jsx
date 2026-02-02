import React, { useState } from 'react';

export default function AdminSide({ menu, setMenu, orders, onAddItem, onReset }) {
  const [form, setForm] = useState({ name: '', price: '', category: 'Main Dishes', imageUrl: '' });
  const rev = orders.reduce((s, o) => s + parseFloat(o.total), 0).toFixed(2);

  // This function converts the file into a string for LocalStorage
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, imageUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this item?")) {
      setMenu(menu.filter(m => m.id !== id));
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', gap: '30px' }}>
        <div style={{ flex: 1 }}>
          <div className="card" style={{ marginBottom: '20px' }}>
            <h3 style={{marginTop: 0}}>Add New Item</h3>
            <input placeholder="Item Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} 
              style={{display: 'block', width: '100%', padding: '10px', marginBottom: '10px', boxSizing: 'border-box'}}/>
            
            <input type="number" placeholder="Price" value={form.price} onChange={e => setForm({...form, price: e.target.value})} 
              style={{display: 'block', width: '100%', padding: '10px', marginBottom: '10px', boxSizing: 'border-box'}}/>
            
            <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} 
              style={{width: '100%', padding: '10px', marginBottom: '10px', display: 'block'}}>
              <option>Appetizers</option><option>Main Dishes</option><option>Drinks</option>
            </select>

            <label style={{display: 'block', marginBottom: '5px', fontSize: '0.8rem', color: '#666'}}>Upload Photo:</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} style={{marginBottom: '15px'}} />
            
            {form.imageUrl && (
              <img src={form.imageUrl} alt="Preview" style={{width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px'}} />
            )}

            <button className="btn-primary" onClick={() => { 
              if(!form.name || !form.price) return alert("Fill Name and Price");
              onAddItem({...form, price: parseFloat(form.price)}); 
              setForm({name:'', price:'', category:'Main Dishes', imageUrl: ''}); 
            }}>Save to Menu</button>
          </div>

          <div className="card">
            <h3 style={{marginTop: 0}}>Menu List</h3>
            {menu.map(m => (
              <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: '1px solid #eee' }}>
                <img src={m.imageUrl || 'https://via.placeholder.com/40'} alt="" style={{width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover'}} />
                <span style={{flex: 1}}>{m.name}</span>
                <button onClick={() => handleDelete(m.id)} style={{color: 'red', border: 'none', background: 'none', cursor: 'pointer'}}>Delete</button>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ flex: 1.5 }}>
          <h3>Revenue: ${rev}</h3>
          <table style={{width: '100%', textAlign: 'left', borderCollapse: 'collapse'}}>
            <thead><tr style={{borderBottom: '2px solid #eee'}}><th style={{padding: '10px'}}>Order ID</th><th style={{padding: '10px'}}>Total</th><th style={{padding: '10px'}}>Status</th></tr></thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id} style={{borderBottom: '1px solid #f9f9f9'}}><td style={{padding: '10px'}}>{o.id}</td><td style={{padding: '10px'}}>${o.total}</td><td style={{padding: '10px'}}><span className="status-badge">{o.status}</span></td></tr>
              ))}
            </tbody>
          </table>
          <button onClick={onReset} style={{marginTop: '20px', color: 'red', background: 'none', border: 'none', cursor: 'pointer'}}>Reset Sales</button>
        </div>
      </div>
    </div>
  );
}