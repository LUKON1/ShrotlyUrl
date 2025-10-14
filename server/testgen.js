const QRCode = require("qrcode");

const dataToEncode = "https://github.com/LUKON1/ShrotlyUrl";
const options = {
    errorCorrectionLevel: "M",
    type: "image/png",
    width: 256,
    color: {
        dark: "#881337",
        light: "#fff1f2",
    },
};

QRCode.toDataURL(dataToEncode, options, (err, url) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log("--- QR CODE DATA URL ---");
    console.log(url);
    console.log("------------------------");
});
