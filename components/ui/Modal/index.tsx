const Modal = ({isOpen, onClose, title, children, modalClass}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto">
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      <div
        className={`relative z-50 w-full transform overflow-hidden rounded-lg bg-white p-6 shadow-xl transition-all ${modalClass}`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <span className="text-2xl">&times;</span>
          </button>
        </div>
        <div className="mt-2">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
