import { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { XMarkIcon } from "@heroicons/react/24/outline";

const QRScannerModal = ({ isOpen, onClose, onScanSuccess }) => {
    const scannerRef = useRef(null);
    const html5QrCode = useRef(null);

    useEffect(() => {
        if (isOpen) {
            // Small timeout to ensure DOM is ready
            setTimeout(() => {
                if (!html5QrCode.current && scannerRef.current) {
                    html5QrCode.current = new Html5Qrcode("reader");

                    html5QrCode.current
                        .start(
                            { facingMode: "environment" },
                            {
                                fps: 10,
                                qrbox: { width: 250, height: 250 },
                            },
                            (decodedText) => {
                                // Ignore "-C-" cancelled ones if they happen to scan them by accident or just let backend handle it
                                if (html5QrCode.current) {
                                    html5QrCode.current.stop()
                                        .then(() => {
                                            html5QrCode.current.clear();
                                            html5QrCode.current = null;
                                            onScanSuccess(decodedText);
                                        })
                                        .catch(err => console.error("Failed to stop scanner", err));
                                }
                            },
                            (errorMessage) => {
                                // Ignore scan errors, it throws them constantly when no QR is in frame
                            }
                        )
                        .catch((err) => {
                            console.error("Error starting scanner", err);
                            // Handle permission denied or no camera
                        });
                }
            }, 100);
        } else {
            // Cleanup on close
            if (html5QrCode.current) {
                html5QrCode.current
                    .stop()
                    .then(() => {
                        html5QrCode.current.clear();
                        html5QrCode.current = null;
                    })
                    .catch((err) => console.error(err));
            }
        }

        return () => {
            if (html5QrCode.current) {
                html5QrCode.current.stop().then(() => html5QrCode.current.clear()).catch(() => { });
            }
        };
    }, [isOpen, onScanSuccess]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h2 className="font-bold text-slate-800 text-lg">Scan QR Code</h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition"
                    >
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-4 bg-black">
                    <div id="reader" ref={scannerRef} className="w-full text-white overflow-hidden rounded-xl border-2 border-slate-700"></div>
                    <p className="text-center text-slate-400 text-sm mt-4">
                        Position the QR code within the frame to scan.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default QRScannerModal;
