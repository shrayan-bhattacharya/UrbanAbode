import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
      <div className="bg-white bg-opacity-90 p-6 rounded-lg max-w-lg w-full shadow-lg" onClick={(e) => e.stopPropagation()}>
        {children}
        <button onClick={onClose} className="mt-4 bg-[#00032e] text-[#edbf6d] py-2 px-4 rounded">Close</button>
      </div>
    </div>
  );
};

export default Modal;