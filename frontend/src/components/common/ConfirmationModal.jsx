import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-[#0f1422] border border-slate-800 rounded-xl shadow-xl w-full max-w-[360px] overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative p-6 text-center">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>

          {/* Content */}
          <h3 className="text-lg font-bold text-white mb-2 leading-tight mt-2">
            {title}
          </h3>
          <p className="text-xs text-slate-400 font-normal leading-relaxed px-2">
            {message}
          </p>

          {/* Actions */}
          <div className="flex flex-col gap-2.5 mt-6">
            <button
              onClick={onConfirm || onClose}
              className="w-full py-2.5 text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg font-medium transition-colors text-sm"
            >
              {confirmText || (isAlert ? "Got it" : "Confirm")}
            </button>
            {!isAlert && (
              <button
                onClick={onClose}
                className="w-full py-2 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white rounded-lg font-medium hover:bg-slate-800 transition-colors text-sm"
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
