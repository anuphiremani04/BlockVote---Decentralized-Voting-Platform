import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Search } from 'lucide-react';
import { ethers } from 'ethers';

// Demo ABI matching the Voting.sol contract
const CONTRACT_ADDRESS = "0xYourDeployedContractAddress";
const CONTRACT_ABI = [
  "function vote(uint256 _candidateId) public",
  "function getCandidateVoteCount(uint256 _candidateId) public view returns (uint256)",
  "function hasVoted(address) public view returns (bool)"
];

export default function Vote() {
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [voteStatus, setVoteStatus] = useState('idle'); // idle, pending, success, failed
  const [txHash, setTxHash] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [candidates, setCandidates] = useState([]);
  const [electionTitle, setElectionTitle] = useState('Loading...');

  useEffect(() => {
    fetch('/api/elections/active')
      .then(res => res.json())
      .then(data => {
        if(data.election) setElectionTitle(data.election.title);
        if(data.candidates) setCandidates(data.candidates.map(c => ({
          id: c._id, // map Mongo ID
          name: c.name,
          party: c.party
        })));
      })
      .catch(console.error);
  }, []);

  const handleVote = async () => {
    if (!window.ethereum) {
      alert("MetaMask is required to cast a vote.");
      return;
    }

    setVoteStatus('pending');
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      
      // Ensure the user is logged into MetaMask and has authorized the app
      await provider.send("eth_requestAccounts", []);
      
      const signer = await provider.getSigner();
      
      let txHashToSet = '';
      // DEMO MODE CHECK: If the contract isn't deployed yet, simulate the flow using a gas-less signature.
      // This ensures the MetaMask popup appears for your presentation without requiring ETH for gas fees!
      if (CONTRACT_ADDRESS === "0xYourDeployedContractAddress" || !CONTRACT_ADDRESS.startsWith("0x")) {
        const message = `I confirm my vote for Candidate ID: ${selectedCandidate.id}\nPlatform: BlockVote\nDate: ${new Date().toISOString()}`;
        const signature = await signer.signMessage(message);
        
        // Mock a transaction delay to simulate blockchain confirmation
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Create a fake transaction hash from the signature for the UI
        txHashToSet = "0x" + signature.substring(2, 66);
      } else {
        // REAL SMART CONTRACT CALL
        const votingContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        const tx = await votingContract.vote(selectedCandidate.id);
        
        // Wait for confirmation
        const receipt = await tx.wait();
        txHashToSet = receipt.hash || receipt.transactionHash;
      }
      
      // REAL DATA SYNC: Update the database with the real user's vote
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const userObj = JSON.parse(userStr);
        await fetch('/api/votes', { 
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            userId: userObj._id || userObj.id,
            candidateId: selectedCandidate.id, 
            transactionHash: txHashToSet 
          }) 
        });
      }

      setTxHash(txHashToSet);
      setVoteStatus('success');
      setTimeout(() => {
        setShowModal(false);
        setSelectedCandidate(null);
        setVoteStatus('idle');
      }, 5000);
      
    } catch (error) {
      console.error("Voting failed:", error);
      
      // Extract a readable error message from MetaMask
      let message = "Transaction rejected or network error.";
      if (error.info?.error?.message) message = error.info.error.message;
      else if (error.message) message = error.message.split('(')[0]; // Clean up ethers long errors
      
      setErrorMessage(message);
      setVoteStatus('failed');
      setTimeout(() => {
        setVoteStatus('idle');
        setShowModal(false);
      }, 5000);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 relative">
      <header className="border-b-2 border-black dark:border-white pb-6">
        <h1 className="text-4xl font-bold uppercase tracking-tight mb-2">Vote Now</h1>
        <p className="text-mono-600 dark:text-mono-400 font-medium">Active Election: {electionTitle}</p>
      </header>
      <div className="glass-panel">
        <div className="flex justify-between items-center mb-8 border-b border-black dark:border-white pb-4">
          <h2 className="text-2xl font-bold uppercase tracking-wide">Presidential Election 2026</h2>
          <span className="bg-black text-white dark:bg-white dark:text-black px-3 py-1 text-xs font-bold uppercase">Active</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {candidates.map((candidate) => (
            <div key={candidate.id} className={`p-6 border-2 transition-colors cursor-pointer ${selectedCandidate?.id === candidate.id ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black shadow-flat dark:shadow-flat-dark' : 'border-black dark:border-white hover:bg-mono-100 dark:hover:bg-mono-900'}`} onClick={() => setSelectedCandidate(candidate)}>
              <div className="flex flex-col items-center text-center">
                <div className={`w-24 h-24 rounded-full mb-6 border-4 flex items-center justify-center bg-mono-200 dark:bg-mono-800 ${selectedCandidate?.id === candidate.id ? 'border-white dark:border-black' : 'border-black dark:border-white'}`}>
                   <span className="text-4xl grayscale">👤</span>
                </div>
                <h3 className="text-xl font-bold uppercase mb-1">{candidate.name}</h3>
                <p className="text-sm font-medium opacity-70 mb-8">{candidate.party}</p>
                <button 
                  onClick={(e) => { e.stopPropagation(); setSelectedCandidate(candidate); setShowModal(true); }}
                  className={`w-full py-3 font-bold uppercase tracking-wide transition-colors border-2 ${selectedCandidate?.id === candidate.id ? 'border-white text-white hover:bg-white hover:text-black dark:border-black dark:text-black dark:hover:bg-black dark:hover:text-white' : 'border-black text-black hover:bg-black hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black'}`}
                >
                  Vote Candidate
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {showModal && selectedCandidate && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/90 dark:bg-black/90 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-black border-4 border-black dark:border-white p-8 max-w-md w-full shadow-flat dark:shadow-flat-dark"
            >
              {voteStatus === 'idle' && (
                <>
                  <h3 className="text-3xl font-bold uppercase mb-4 border-b-2 border-black dark:border-white pb-4">Confirm Vote</h3>
                  <p className="mb-8 font-medium text-lg leading-relaxed">
                    You are about to cryptographically sign a vote for <span className="font-bold underline">{selectedCandidate.name}</span>. This transaction is immutable.
                  </p>
                  <div className="flex gap-4">
                    <button onClick={() => setShowModal(false)} className="btn-outline flex-1 py-4">Cancel</button>
                    <button onClick={handleVote} className="btn-primary flex-1 py-4">Sign & Send</button>
                  </div>
                </>
              )}

              {voteStatus === 'pending' && (
                <div className="text-center py-10">
                  <div className="w-16 h-16 border-4 border-black dark:border-white border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                  <h3 className="text-xl font-bold uppercase mb-2">Awaiting Confirmation</h3>
                  <p className="font-mono text-sm opacity-70">Broadcasting transaction to network...</p>
                </div>
              )}

              {voteStatus === 'success' && (
                <div className="text-center py-10">
                  <div className="w-20 h-20 bg-black text-white dark:bg-white dark:text-black flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold uppercase mb-2">Vote Recorded</h3>
                  <p className="mb-6 font-medium">Your ballot has been successfully written to the ledger.</p>
                  <p className="text-xs font-mono bg-mono-100 dark:bg-mono-900 p-3 border border-black dark:border-white break-all">TX: {txHash}</p>
                </div>
              )}

              {voteStatus === 'failed' && (
                <div className="text-center py-10">
                  <div className="w-20 h-20 border-4 border-red-500 text-red-500 flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl font-bold">X</span>
                  </div>
                  <h3 className="text-2xl font-bold uppercase mb-2 text-red-500">Transaction Failed</h3>
                  <p className="font-medium text-sm">{errorMessage}</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
