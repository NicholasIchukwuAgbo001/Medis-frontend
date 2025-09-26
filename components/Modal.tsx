import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloseIcon } from './icons/IconComponents';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-80 z-50 flex justify-center items-center p-4"
          aria-modal="true"
          role="dialog"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="bg-medis-light-card dark:bg-medis-secondary rounded-lg shadow-xl w-full max-w-2xl border border-medis-light-border dark:border-medis-light-gray/20"
            onClick={e => e.stopPropagation()}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {title && (
              <div className="flex justify-between items-center p-4 border-b border-medis-light-border dark:border-medis-light-gray/20">
                <h3 className="text-xl font-semibold text-medis-light-text dark:text-medis-dark">{title}</h3>
                <button
                  onClick={onClose}
                  className="text-medis-light-muted dark:text-medis-gray hover:text-medis-light-text dark:hover:text-white focus:outline-none"
                  aria-label="Close modal"
                >
                  <CloseIcon className="h-6 w-6" />
                </button>
              </div>
            )}
            <div className="p-0 sm:p-0">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;