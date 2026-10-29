'use client';

import { useState } from 'react';
import { useAccount, useConnect, useDisconnect, useBalance, useChainId, useSwitchChain } from 'wagmi';
import { mainnet, optimism, arbitrum, base, polygon } from 'wagmi/chains';

const CHAINS = [
  { id: mainnet.id, name: 'Ethereum', symbol: 'ETH', color: 'bg-blue-500' },
  { id: polygon.id, name: 'Polygon', symbol: 'MATIC', color: 'bg-purple-500' },
  { id: 0, name: 'Tron', symbol: 'TRX', color: 'bg-red-600' },
  { id: 56, name: 'BNB Chain', symbol: 'BNB', color: 'bg-yellow-500' },
  { id: arbitrum.id, name: 'Arbitrum', symbol: 'ETH', color: 'bg-blue-400' },
  { id: 43114, name: 'Avalanche', symbol: 'AVAX', color: 'bg-red-500' },
  { id: 0, name: 'Solana', symbol: 'SOL', color: 'bg-purple-400' },
  { id: 59144, name: 'Linea', symbol: 'ETH', color: 'bg-white' },
  { id: optimism.id, name: 'Optimism', symbol: 'ETH', color: 'bg-red-500' },
  { id: base.id, name: 'Base', symbol: 'ETH', color: 'bg-blue-600' },
  { id: 0, name: 'Hyperliquid', symbol: 'HYPE', color: 'bg-green-500' },
  { id: 0, name: 'HyperEVM', symbol: 'ETH', color: 'bg-teal-500' },
  { id: 0, name: 'DATA Network', symbol: 'DATA', color: 'bg-gray-500' },
  { id: 0, name: 'Injective', symbol: 'INJ', color: 'bg-white' },
  { id: 0, name: 'Monad', symbol: 'MON', color: 'bg-purple-600' },
  { id: 0, name: 'MegaETH', symbol: 'ETH', color: 'bg-gray-400' },
  { id: 25, name: 'Cronos', symbol: 'CRO', color: 'bg-blue-300' },
  { id: 0, name: 'Robinhood', symbol: 'ETH', color: 'bg-green-400' },
];

const WALLETS = [
  { name: 'Anchorage Wallet', icon: '▶', bg: 'bg-black', color: 'text-white' },
  { name: 'Metamask', icon: '🦊', bg: 'bg-orange-500', color: 'text-white' },
  { name: 'Rabby', icon: '🐰', bg: 'bg-blue-500', color: 'text-white' },
  { name: 'Phantom', icon: '👻', bg: 'bg-purple-500', color: 'text-white' },
  { name: 'Bitget Wallet', icon: '▶', bg: 'bg-cyan-500', color: 'text-white' },
  { name: 'OKX Wallet', icon: '✕', bg: 'bg-black', color: 'text-white' },
  { name: 'Browser Wallet', icon: '💳', bg: 'bg-white/10', color: 'text-white' },
  { name: 'Coinbase', icon: '●', bg: 'bg-blue-600', color: 'text-white' },
  { name: 'WalletConnect', icon: 'W', bg: 'bg-blue-400', color: 'text-white' },
  { name: 'Trust', icon: '🛡️', bg: 'bg-blue-700', color: 'text-white' },
  { name: 'Backpack', icon: '🎒', bg: 'bg-red-600', color: 'text-white' },
  { name: 'Core', icon: '◆', bg: 'bg-white/10', color: 'text-white' },
  { name: 'Fordefi', icon: 'F', bg: 'bg-blue-500', color: 'text-white' },
  { name: 'Brave', icon: '🦁', bg: 'bg-red-500', color: 'text-white' },
  { name: 'Gnosis', icon: 'G', bg: 'bg-white/10', color: 'text-white' },
  { name: 'Unstoppable', icon: 'U', bg: 'bg-blue-500', color: 'text-white' },
  { name: 'Zerion', icon: 'Z', bg: 'bg-blue-600', color: 'text-white' },
  { name: '1inch Wallet', icon: '1"', bg: 'bg-white', color: 'text-black' },
];

export default function Home() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { data: balance } = useBalance({ address });

  const [selectedChainName, setSelectedChainName] = useState('Ethereum');
  const [fromAmount, setFromAmount] = useState('');
  const [activeTab, setActiveTab] = useState('Market');
  const [showCookie, setShowCookie] = useState(true);
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [tokenSide, setTokenSide] = useState<'pay' | 'receive'>('pay');
  const [chainSearch, setChainSearch] = useState('');
  const [tokenSearch, setTokenSearch] = useState('');

  const currentChain = CHAINS.find(c => c.name === selectedChainName) || CHAINS[0];
  const receiveAmount = fromAmount ? (parseFloat(fromAmount) * 0.995).toFixed(4) : '0';

  const handleConnect = (walletName: string) => {
    let connector;
    const name = walletName.toLowerCase();

    if (name.includes('metamask') || name.includes('browser')) {
      connector = connectors.find(c => c.id === 'metaMask' || c.name === 'MetaMask');
    } else if (name.includes('coinbase')) {
      connector = connectors.find(c => c.id === 'coinbaseWallet' || c.name?.includes('Coinbase'));
    } else {
      // Try injected for other browser wallets (Rabby, Phantom, Brave, etc.)
      connector = connectors.find(c => c.id === 'injected' || c.type === 'injected');
    }

    if (connector) {
      connect({ connector });
    } else {
      alert(`Could not find a connector for ${walletName}. Try MetaMask, Coinbase, or Browser Wallet.`);
    }
    setShowWalletModal(false);
  };

  const openTokenModal = (side: 'pay' | 'receive') => {
    setTokenSide(side);
    setShowTokenModal(true);
    setChainSearch('');
    setTokenSearch('');
  };

  const filteredChains = CHAINS.filter(c =>
    c.name.toLowerCase().includes(chainSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-white/10">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#F5C518] flex items-center justify-center text-black text-xs font-bold">☀</div>
            <span className="text-lg font-semibold">deBridge</span>
          </div>
          <nav className="hidden md:flex items-center gap-5 text-sm text-white/70">
            <a href="https://debridge.com/develop" target="_blank" rel="noopener noreferrer" className="hover:text-white">Developers</a>
            <div className="relative group">
              <button className="hover:text-white flex items-center gap-1">
                deExplorer ▾
              </button>
              <div className="absolute top-full left-0 mt-1 w-40 bg-[#1a1a1a] border border-white/10 rounded-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <a href="https://app.debridge.com/statistic" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 hover:bg-white/5 text-white">Statistics</a>
                <a href="https://app.debridge.com/" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 hover:bg-white/5 text-white">Orders</a>
              </div>
            </div>
            <div className="relative group">
              <button className="hover:text-white flex items-center gap-1">
                Learn ▾
              </button>
              <div className="absolute top-full left-0 mt-1 w-36 bg-[#1a1a1a] border border-white/10 rounded-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <a href="https://debridge.com/learn/blog/" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 hover:bg-white/5 text-white">Blog</a>
                <a href="https://debridge.com/learn/guides/" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 hover:bg-white/5 text-white">Guides</a>
                <a href="https://debridge.com/learn/glossary/" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 hover:bg-white/5 text-white">Glossary</a>
              </div>
            </div>
            <a href="https://debridge.foundation/" target="_blank" rel="noopener noreferrer" className="hover:text-white flex items-center gap-1">
              <span className="w-4 h-4 rounded-full bg-yellow-500" /> DBR
            </a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <a href="#" className="text-sm text-white/70 hover:text-white hidden sm:block">Refer</a>
          <span className="text-yellow-400">🏆</span>
          {isConnected ? (
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-lg bg-white/10 text-sm">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
              <button
                onClick={() => disconnect()}
                className="px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowWalletModal(true)}
              className="px-4 py-2 rounded-lg bg-[#C8F542] hover:bg-[#b8e532] text-black font-medium text-sm flex items-center gap-2"
            >
              <span>⊞</span> Connect wallet
            </button>
          )}
          <button className="text-white/50">⋮</button>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-[440px]">
          {/* Tabs + icons */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex bg-white/5 rounded-lg p-1">
              {['Market', 'Limit', 'P2P'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 text-sm rounded-md ${activeTab === tab ? 'bg-white/10 text-white' : 'text-white/50'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="flex gap-2 text-white/40">
              <button className="p-2 hover:text-white">⚡</button>
              <button className="p-2 hover:text-white">↻</button>
              <button className="p-2 hover:text-white">⚙</button>
            </div>
          </div>

          {/* Swap Card */}
          <div className="bg-[#0c0c0c] border border-white/10 rounded-2xl p-4">
            {/* You pay */}
            <div className="mb-1">
              <div className="flex justify-between text-xs text-white/50 mb-2 px-1">
                <span>You pay</span>
                <span>Balance: {balance ? parseFloat(balance.formatted).toFixed(4) : '0'} {currentChain.symbol}</span>
              </div>
              <div className="flex items-center bg-black border border-white/10 rounded-xl p-3">
                <button
                  onClick={() => openTokenModal('pay')}
                  className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-3 py-2 rounded-lg text-sm"
                >
                  <div className={`w-6 h-6 rounded-full ${currentChain.color}`} />
                  <span className="font-medium">ETH</span>
                  <span className="text-white/40">▾</span>
                </button>
                <input
                  type="number"
                  placeholder="0"
                  value={fromAmount}
                  onChange={(e) => setFromAmount(e.target.value)}
                  className="flex-1 bg-transparent text-right text-2xl font-medium outline-none ml-3"
                />
              </div>
            </div>

            {/* Swap arrow */}
            <div className="flex justify-center -my-1 relative z-10">
              <div className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-white/10 flex items-center justify-center text-sm">⇅</div>
            </div>

            {/* You receive */}
            <div className="mb-3">
              <div className="flex justify-between text-xs text-white/50 mb-2 px-1">
                <span>You receive</span>
                <span>Balance: 0 {currentChain.symbol}</span>
              </div>
              <div className="flex items-center bg-black border border-white/10 rounded-xl p-3">
                <button
                  onClick={() => openTokenModal('receive')}
                  className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-3 py-2 rounded-lg text-sm"
                >
                  <div className={`w-6 h-6 rounded-full ${currentChain.color}`} />
                  <span className="font-medium">ETH</span>
                  <span className="text-white/40">▾</span>
                </button>
                <div className="flex-1 text-right text-2xl font-medium ml-3">{receiveAmount}</div>
              </div>
            </div>

            {/* Points + ETA */}
            <div className="flex justify-between items-center mb-3 text-xs">
              <span className="px-2 py-1 rounded bg-[#C8F542]/20 text-[#C8F542]">+ 0 POINTS</span>
              <span className="text-white/50">ETA: 2m ▾</span>
            </div>

            {/* Bottom row */}
            <div className="flex justify-between items-center text-sm text-white/60 border-t border-white/10 pt-3">
              <span>Trade and Send to Another Address</span>
              <span className="flex items-center gap-1">Routing ▾</span>
            </div>
          </div>

          {/* Action button */}
          <button
            onClick={isConnected ? () => alert('Swap simulated') : () => setShowWalletModal(true)}
            className="w-full mt-4 py-3.5 rounded-xl bg-[#C8F542] hover:bg-[#b8e532] text-black font-semibold text-base transition"
          >
            {isConnected ? 'Swap' : 'Connect wallet'}
          </button>
        </div>
      </main>

      {/* Footer / Cookie */}
      {showCookie && (
        <div className="fixed bottom-0 left-0 right-0 bg-black/90 border-t border-[#C8F542]/40 px-6 py-3 flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-white/70">
            <span>🍪</span>
            <span>We use performance and analytics cookies to improve your experience.</span>
          </div>
          <button onClick={() => setShowCookie(false)} className="text-white/50 hover:text-white">✕</button>
        </div>
      )}

      {/* Token Modal */}
      {showTokenModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setShowTokenModal(false)}>
          <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 p-4 border-b border-white/10">
              <button onClick={() => setShowTokenModal(false)} className="text-white/50">←</button>
              <h2 className="font-medium">Select a token you {tokenSide}</h2>
            </div>
            <div className="p-4">
              <input
                placeholder="Search by chain name"
                value={chainSearch}
                onChange={e => setChainSearch(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm mb-4 outline-none"
              />
              <div className="grid grid-cols-3 gap-2 mb-4 max-h-64 overflow-y-auto">
                {filteredChains.map(c => (
                  <button
                    key={c.name}
                    onClick={() => {
                      setSelectedChainName(c.name);
                      if (c.id === mainnet.id || c.id === polygon.id || c.id === arbitrum.id || c.id === optimism.id || c.id === base.id) {
                        switchChain({ chainId: c.id as 1 | 137 | 42161 | 10 | 8453 });
                      }
                      setShowTokenModal(false);
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm ${selectedChainName === c.name ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
                  >
                    <div className={`w-5 h-5 rounded-full ${c.color}`} />
                    {c.name}
                  </button>
                ))}
              </div>
              <input
                placeholder="Search by name or paste address"
                value={tokenSearch}
                onChange={e => setTokenSearch(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Wallet Modal */}
      {showWalletModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setShowWalletModal(false)}>
          <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h2 className="font-medium">Connect Ethereum wallet</h2>
              <button onClick={() => setShowWalletModal(false)} className="text-white/50">✕</button>
            </div>
            <div className="p-4 grid grid-cols-3 gap-3 max-h-[70vh] overflow-y-auto">
              {WALLETS.map(w => (
                <button
                  key={w.name}
                  onClick={() => handleConnect(w.name)}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl border border-white/10 hover:bg-white/5 text-xs text-center"
                >
                  <div className={`w-12 h-12 rounded-full ${w.bg} flex items-center justify-center text-xl font-bold ${w.color}`}>
                    {w.icon}
                  </div>
                  {w.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
