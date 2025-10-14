function Qrgen({ qrCodeDataUrl, qrContainerRef }) {

    if (!qrCodeDataUrl) return null;
    return (
        <div ref={qrContainerRef} className="relative flex flex-col items-center">
            <img
                src={qrCodeDataUrl}
                alt="QR"
                className="user-select-all h-64 w-64 object-contain"
            />
        </div>
    );
}

export default Qrgen;
