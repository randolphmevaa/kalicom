import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck } from 'react-icons/fi';

interface NotificationProps {
  message: string;
  visible: boolean;
}

const Notification: React.FC<NotificationProps> = ({ message, visible }) => {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-24 right-4 z-50 bg-emerald-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center"
        >
          <FiCheck className="mr-2" />
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Notification;