import React, { useState, useEffect } from 'react';
import { AuctionItem } from '../types';
import { GavelIcon } from './icons/IconComponents';
import Spinner from './Spinner';
import { motion } from 'framer-motion';

interface AuctionCardProps {
  item: AuctionItem;
  onBid: (itemId: string, bidAmount: number) => void;
}

const formatTimeLeft = (endDate: string): { text: string; isEnded: boolean } => {
  const now = new Date();
  const end = new Date(endDate);
  const diff = end.getTime() - now.getTime();

  if (diff <= 0) {
    return { text: 'Auction Ended', isEnded: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  let timeString = '';
  if (days > 0) timeString += `${days}d `;
  if (hours > 0 || days > 0) timeString += `${String(hours).padStart(2, '0')}h `;
  timeString += `${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;

  return { text: timeString.trim(), isEnded: false };
};

const AuctionCard: React.FC<AuctionCardProps> = ({ item, onBid }) => {
  const [timeLeft, setTimeLeft] = useState(formatTimeLeft(item.endTime));
  const [bidAmount, setBidAmount] = useState('');
  const [isBidding, setIsBidding] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(formatTimeLeft(item.endTime));
    }, 1000);

    return () => clearInterval(timer);
  }, [item.endTime]);

  const minBid = item.currentBid + 0.01;
  const handleBidSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const bidValue = parseFloat(bidAmount);
    if (!bidValue || bidValue < minBid) {
      setError(`Bid must be at least ${minBid.toFixed(2)} ${item.currency}`);
      return;
    }
    
    setIsBidding(true);
    // Simulate API call
    setTimeout(() => {
      onBid(item.id, bidValue);
      setBidAmount('');
      setIsBidding(false);
    }, 1500);
  };

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`bg-medis-light-card dark:bg-medis-secondary rounded-lg border border-medis-light-border dark:border-medis-light-gray/20 shadow-lg overflow-hidden ${timeLeft.isEnded ? 'opacity-60' : ''}`}
    >
      <img src={item.imageUrl} alt={item.title} className="w-full h-48 object-cover" />
      <div className="p-5">
        <h3 className="text-xl font-bold font-heading text-medis-light-text dark:text-medis-dark">{item.title}</h3>
        <p className="text-sm text-medis-light-muted dark:text-medis-gray mt-2 h-10">{item.description}</p>
        
        <div className="mt-4 flex justify-between items-center bg-medis-light-bg dark:bg-medis-secondary-dark p-3 rounded-md">
            <div>
                <p className="text-xs text-medis-light-muted dark:text-medis-gray uppercase font-semibold">Current Bid</p>
                <p className="text-2xl font-bold text-medis-primary">{item.currentBid.toFixed(2)} <span className="text-base font-normal">{item.currency}</span></p>
            </div>
            <div className="text-right">
                <p className="text-xs text-medis-light-muted dark:text-medis-gray uppercase font-semibold">Time Left</p>
                <p className={`text-lg font-bold ${timeLeft.isEnded ? 'text-red-500' : 'text-medis-light-text dark:text-medis-dark'}`}>{timeLeft.text}</p>
            </div>
        </div>

        {!timeLeft.isEnded && (
          <form onSubmit={handleBidSubmit} className="mt-4">
            <div className="flex items-center gap-2">
              <input 
                type="number"
                step="0.01"
                min={minBid.toFixed(2)}
                value={bidAmount}
                onChange={(e) => {
                    setBidAmount(e.target.value)
                    setError('')
                }}
                placeholder={`≥ ${minBid.toFixed(2)}`}
                className="w-full p-2 border rounded bg-medis-light-bg dark:bg-medis-secondary-dark border-medis-light-border dark:border-medis-light-gray text-medis-light-text dark:text-medis-dark focus:ring-medis-primary focus:border-medis-primary"
                disabled={isBidding}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={isBidding || !bidAmount || parseFloat(bidAmount) < minBid}
                className="px-4 py-2 bg-medis-primary text-white font-semibold rounded-md hover:bg-medis-primary-dark transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {isBidding ? <Spinner className="h-5 w-5" /> : <GavelIcon className="h-5 w-5" />}
                <span className="ml-2 hidden sm:inline">Bid</span>
              </motion.button>
            </div>
             {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
          </form>
        )}
      </div>
    </motion.div>
  );
};

export default AuctionCard;
