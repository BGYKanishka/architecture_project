import { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { XMarkIcon, QrCodeIcon } from "@heroicons/react/24/outline";

const QRScannerModal = ({ isOpen, onClose, onScanSuccess }) => {
    const scannerRef = useRef(null);
    const html5QrCode = useRef(null);

    useEffect(() => {
        if (isOpen) {
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
                            () => {}
                        )
                        .catch((err) => {
                            console.error("Error starting scanner", err);
                        });
                }
            }, 100);
        } else {
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
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="bg-[#0f1422] border border-slate-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-[#0b0f19]">
                    <div className="flex items-center gap-2">
                        <QrCodeIcon className="w-5 h-5 text-indigo-400" />
                        <h2 className="font-semibold text-white text-base">Scan Attendee QR Pass</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                    >
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-5 bg-[#0b0f19]">
                    <div id="reader" ref={scannerRef} className="w-full text-white overflow-hidden rounded-lg border border-slate-700"></div>
                    <p className="text-center text-slate-400 text-xs mt-4">
                        Center the QR ticket code inside the frame to scan automatically.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default QRScannerModal;
