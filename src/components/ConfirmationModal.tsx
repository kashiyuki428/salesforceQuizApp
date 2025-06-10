import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  message: string;
  title?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  message,
  title = '確認',
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h3 className="text-lg font-medium mb-4">{title}</h3>
        <p className="mb-6">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="btn btn-outline"
          >
            いいえ
          </button>
          <button
            onClick={onConfirm}
            className="btn btn-primary"
          >
            はい
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
