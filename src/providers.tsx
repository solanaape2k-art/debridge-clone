'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { mainnet, optimism, arbitrum, base, polygon } from 'wagmi/chains';
import { metaMask, coinbaseWallet, injected } from 'wagmi/connectors';
import { ReactNode, useState } from 'react';

const config = createConfig({
  chains: [mainnet, optimism, arbitrum, base, polygon],
  connectors: [
    metaMask(),
    coinbaseWallet({ appName: 'deBridge Clone' }),
    injected(),
  ],
  transports: {
    [mainnet.id]: http(),
    [optimism.id]: http(),
    [arbitrum.id]: http(),
    [base.id]: http(),
    [polygon.id]: http(),
  },
});

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
