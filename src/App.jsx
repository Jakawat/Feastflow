import React, { useState, useEffect } from 'react';
import './App.css';
import CustomerSide from './components/CustomerSide';
import KitchenSide from './components/KitchenSide';
import AdminSide from './components/AdminSide';

function App() {
  const [role, setRole] = useState('customer');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#/kitchen') setRole('kitchen');
      else if (hash === '#/admin') setRole('admin');
      else setRole('customer');
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const [menu, setMenu] = useState(() => {
    const saved = localStorage.getItem('ff_menu');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'Cheese Burger', price: 12.00, category: 'Main Dishes', desc: 'Beef, cheddar, and brioche.' },
      { id: 2, name: 'French Fries', price: 5.00, category: 'Appetizers', desc: 'Sea salt and rosemary.' }
    ];
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('ff_orders');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('ff_menu', JSON.stringify(menu));
    localStorage.setItem('ff_orders', JSON.stringify(orders));
  }, [menu, orders]);

  const handleOrder = (items, total, tableNum) => {
    const tableId = `Table ${tableNum}`;
    const existingIndex = orders.findIndex(o => o.id === tableId && o.status !== 'Fulfilled');

    if (existingIndex !== -1) {
      const updatedOrders = [...orders];
      const targetOrder = { ...updatedOrders[existingIndex] };
      const newItemsList = [...targetOrder.items];

      items.forEach(newItem => {
        const existingItem = newItemsList.find(i => i.id === newItem.id);
        if (existingItem) {
          existingItem.quantity += newItem.quantity;
        } else {
          newItemsList.push({ ...newItem });
        }
      });

      targetOrder.items = newItemsList;
      targetOrder.total = (parseFloat(targetOrder.total) + parseFloat(total)).toFixed(2);
      targetOrder.status = 'New'; 
      updatedOrders[existingIndex] = targetOrder;
      setOrders(updatedOrders);
    } else {
      const newOrder = {
        id: tableId,
        items: [...items],
        total,
        status: 'New',
        time: new Date().toLocaleTimeString(),
        orderKey: Date.now()
      };
      setOrders([...orders, newOrder]);
    }
  };

  const handleUpdate = (id, s) => setOrders(orders.map(o => o.id === id ? {...o, status: s} : o));
  const handleAdd = (item) => setMenu([...menu, { ...item, id: Date.now() }]);
  const handleReset = () => { if(window.confirm("Clear all sales data?")) setOrders([]); };

  return (
    <div className="App">
      <nav className="navbar">
        <div className="logo" onClick={() => window.location.hash = ''} style={{cursor: 'pointer'}}>FEASTFLOW</div>
        <div className="status-indicator">
          <span className="status-badge">
            {role === 'customer' ? 'Public Menu' : `${role.toUpperCase()} MODE`}
          </span>
        </div>
      </nav>
      
      <main className="container">
        {role === 'customer' && (
          <CustomerSide 
            menu={menu} 
            onOrder={handleOrder} 
            // SECURITY: Only show orders for the current stored table session
            history={orders.filter(o => o.id === `Table ${localStorage.getItem('ff_table_session')}`)} 
          />
        )}
        {role === 'kitchen' && <KitchenSide orders={orders} onUpdateStatus={handleUpdate} />}
        {role === 'admin' && <AdminSide menu={menu} setMenu={setMenu} orders={orders} onAddItem={handleAdd} onReset={handleReset} />}
      </main>
    </div>
  );
}

export default App;