import { motion } from 'framer-motion';
import { FiCheck } from 'react-icons/fi';
import { NotificationToastProps } from '../../types';

const NotificationToast = ({ message }: NotificationToastProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed top-24 right-4 z-50 bg-emerald-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center"
    >
      <FiCheck className="mr-2" />
      {message}
    </motion.div>
  );
};

export default NotificationToast;