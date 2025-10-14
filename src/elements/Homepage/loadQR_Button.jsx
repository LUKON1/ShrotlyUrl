import { useTranslation } from "react-i18next";

function LoadQR_Button({ qrCodeDataUrl, url }) {
    const { t } = useTranslation();

    const handleLoadQR = () => {
        if (!qrCodeDataUrl) {
            return;
        }

        const urlFullDomain = new URL(url);
        const urlMainDomain = urlFullDomain.hostname;
        const domainParts = urlMainDomain.split(".");
        const baseDomain = domainParts.slice(-2).join(".");

        const link = document.createElement("a");
        link.href = qrCodeDataUrl;
        link.download = `${baseDomain}-QRcode.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div>
            <button
                onClick={handleLoadQR}
                type="button"
                className="text-1xl flex h-16 w-64 items-center justify-center rounded-md bg-rose-300 font-extrabold text-rose-950 shadow-md transition duration-300 ease-in-out hover:bg-rose-400 hover:shadow-lg active:bg-rose-500 md:text-2xl lg:h-20 lg:text-3xl"
            >
                {t("homepage.downloadqr")}
            </button>
        </div>
    );
}

export default LoadQR_Button;
