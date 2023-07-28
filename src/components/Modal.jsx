import React, { useEffect } from 'react';

const Modal = ({ children, closeModal }) => {
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.keyCode === 27) {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [closeModal]);

  const handleModalClose = () => {
    closeModal();
  };

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white w-80 p-4 rounded-lg">
        {children}
        <div className="mt-4 flex justify-end">
        </div>
      </div>
    </div>
  );
};

export default Modal;
