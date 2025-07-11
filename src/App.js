// Updated frontend/src/App.js with theme toggle and better styling
import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import rocket from './rocket.png';

function App() {
  const [wallet, setWallet] = useState('');
  const [portfolio, setPortfolio] = useState(null);
  const [history, setHistory] = useState([]);
  const [theme, setTheme] = useState('dark');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/track', { wallet });
      setPortfolio(response.data);
      fetchHistory(wallet);
    } catch (error) {
      alert(error.response?.data?.error || 'Error fetching data');
    }
  };

  const fetchHistory = async (wallet) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/history/${wallet}`);
      setHistory(res.data);
    } catch (error) {
      console.error('History fetch failed', error);
    }
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    document.body.className = theme === 'dark' ? 'light-theme' : 'dark-theme';
  };

  return (
    <div className="app-container">
      <header className="header">
        <div className="title-bar">
          <img src={rocket} alt="Rocket Icon" className="rocket" />
          <h1 className="glow">Real-Time Crypto Portfolio Tracker</h1>
        </div>
        <p className="subtitle">Track your Ethereum wallet in real-time with on-chain data</p>
        <button className="theme-toggle" onClick={toggleTheme}>
          Toggle {theme === 'dark' ? 'Light' : 'Dark'} Mode
        </button>
      </header>

      <form className="wallet-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter Ethereum wallet address"
          value={wallet}
          onChange={(e) => setWallet(e.target.value)}
        />
        <button type="submit">Track Wallet</button>
      </form>

      {portfolio && (
        <div className="results">
          <h3>Current ETH Balance: {portfolio.eth_balance}</h3>
          <ul>
            {portfolio.tokens.map((token, idx) => (
              <li key={idx}>{token.symbol}: {token.balance}</li>
            ))}
          </ul>
        </div>
      )}

      {history.length > 0 && (
        <div className="history">
          <h3>Wallet History</h3>
          <ul>
            {history.map((entry, idx) => (
              <li key={idx}>
                {entry.timestamp}: ETH = {entry.eth_balance}
                <ul>
                  {entry.tokens.map((token, i) => (
                    <li key={i}>{token.symbol}: {token.balance}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="features">
        <h2>📊 Features</h2>
        <ul>
          <li>✅ Live ETH and token balances</li>
          <li>✅ Wallet history viewer</li>
          <li>✅ Real-time blockchain data</li>
        </ul>
      </div>
    </div>
  );
}

export default App;