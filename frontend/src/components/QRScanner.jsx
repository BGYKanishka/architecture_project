import { useEffect } from 'react';
import { Html5QrcodeScanner } from "html5-qrcode";


const QRScanner = ({ onScanSuccess }) => {
    useEffect(() => {
        const scanner = new Html5QrcodeScanner("reader", {
            fps: 10,
            qrbox: { width: 250, height: 250 }
        });

        scanner.render(onScanSuccess, (error) => {
            // scan කරද්දී සිදුවන errors මෙහිදී handle කළ හැක
        });

        return () => scanner.clear();
    }, []);

    return <div id="reader" style={{ width: '400px' }}></div>;
};

export default QRScanner;