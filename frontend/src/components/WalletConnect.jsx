import { useContext } from 'react';
import { Wallet } from 'lucide-react';
import { WalletContext } from '../context/WalletContext';

export default function WalletConnect({ fullWidth = true }) {
  const { address, isConnecting, connectWallet } = useContext(WalletContext);

  const formatAddress = (addr) => {
    if (!addr) return null;
    return addr.substring(0, 6) + '...' + addr.substring(38);
  };

  return (
    <button
      onClick={address ? null : connectWallet}
      disabled={isConnecting}
      className={`btn-primary ${fullWidth ? 'w-full' : ''}`}
    >
      <Wallet className="w-4 h-4" />
      <span className="text-sm font-bold">
        {isConnecting ? 'Connecting...' : address ? formatAddress(address) : 'Connect Wallet'}
      </span>
    </button>
  );
}
