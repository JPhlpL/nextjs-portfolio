import React from 'react';

const Modal = ({ message, type, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Background overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>

      {/* Modal box */}
      <div className="relative z-50 w-full max-w-sm p-6 rounded-xl shadow-lg bg-secondary-light dark:bg-secondary-dark text-primary-dark dark:text-primary-light">
        <h2
          className={`text-xl font-bold ${
            type === 'success' ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {type === 'success' ? 'Success!' : 'Error'}
        </h2>

        <p className="mt-4 text-md">{message}</p>

        <button
          onClick={onClose}
          className="mt-6 w-full py-2 rounded-md bg-indigo-500 hover:bg-indigo-600 text-white transition duration-300"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
