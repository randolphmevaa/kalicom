import React, { memo } from 'react';
import { FiInfo } from 'react-icons/fi';

interface InfoAlertProps {
  title: string;
  message: string;
}

const InfoAlert: React.FC<InfoAlertProps> = ({ title, message }) => {
  return (
    <div className="mb-6 flex items-start space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex-shrink-0 pt-0.5">
        <FiInfo className="h-5 w-5 text-blue-600" />
      </div>
      <div>
        <h3 className="text-sm font-medium text-blue-800">{title}</h3>
        <p className="mt-1 text-sm text-blue-700">{message}</p>
      </div>
    </div>
  );
};

export default memo(InfoAlert);