import React from "react";
import { ExclamationTriangleIcon, XMarkIcon } from "@heroicons/react/24/outline";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  isAlert = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-[320px] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative p-6 text-center">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>

          {/* Content */}
          <h3 className="text-xl font-black text-slate-800 mb-1 leading-tight mt-2">
            {title}
          </h3>
          <p className="text-sm text-slate-500 font-bold leading-relaxed px-2">
            {message}
          </p>

          {/* Actions */}
          <div className="flex flex-col gap-2 mt-6">
            <button
              onClick={onConfirm || onClose}
              className="w-full py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-2xl font-bold transition-all shadow-lg shadow-blue-200 active:scale-[0.98] text-sm"
            >
              {confirmText || (isAlert ? "Got it" : "Confirm")}
            </button>
            {!isAlert && (
              <button
                onClick={onClose}
                className="w-full py-3 bg-slate-50 text-slate-500 rounded-2xl font-bold hover:bg-slate-100 transition-all active:scale-[0.98] text-sm"
              >
                {cancelText || "Cancel"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
