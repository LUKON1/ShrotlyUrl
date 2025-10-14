import { http, HttpResponse } from "msw";
export const handlers = [
    http.post("http://localhost:3000/api/registr", () => {
        return HttpResponse.json(
            { accesToken: "as2g24hgadsgej", user: "LUKONDEV" },
            { status: 201 }
        );
    }),
    http.post("http://localhost:3000/api/signin", () => {
        return HttpResponse.json(
            { accesToken: "as2g24hgadsgej", user: "LUKONDEV" },
            { status: 201 }
        );
    }),
    http.get("http://localhost:3000/api/myurls", () => {
        return HttpResponse.json([
            {
                shortUrl: "https://ele.com/sfh79",
                longUrl: "https://tube.com",
                createdAt: "2024-01-15T10:30:00Z",
                expiredAt: "2024-03-10T14:00:00Z",
                urlClicks: 124,
                id: 1,
            },
            {
                shortUrl: "https://examom/satq3t821",
                longUrl: "https://gooe.com",
                createdAt: "2024-02-01T09:00:00Z",
                expiredAt: "2024-03-05T17:00:00Z",
                urlClicks: 132,
                id: 2,
            },
            {
                shortUrl: "https://exa.com/satq3t82",
                longUrl: "https://google.com",
                createdAt: "2025-09-14T08:00:00Z",
                expiredAt: "2025-09-15T12:00:00Z",
                urlClicks: 10,
                id: 3,
            },
            {
                shortUrl: "https://xamlcom/satq3t82",
                longUrl: "h#fff1f2ttps://googcom",
                createdAt: "2025-09-13T16:00:00Z",
                expiredAt: "2025-09-25T16:00:00Z",
                urlClicks: 5757,
                id: 4,
            },
            {
                shortUrl: "https://exacom/satq3t8",
                longUrl: "https://google.com",
                createdAt: "2025-09-12T09:30:00Z",
                expiredAt: "2025-09-22T09:30:00Z",
                urlClicks: 10240,
                id: 5,
            },
            {
                shortUrl: "https://examle.com/satq3",
                longUrl: "https://messanger.max",
                createdAt: "2025-09-05T00:00:00Z",
                expiredAt: "2025-09-28T00:00:00Z",
                urlClicks: 100000,
                id: 6,
            },
            {
                shortUrl: "https://xamlcom/satq3t82",
                longUrl: "https://tumtum.goo",
                createdAt: "2025-09-13T16:00:00Z",
                expiredAt: "2025-09-25T16:00:00Z",
                urlClicks: 5757,
                id: 7,
            },

            ,
            { status: 200 },
        ]);
    }),
    http.post("http://localhost:3000/api/cut/shorter", () => {
        const mockQrCodeDataUrl = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAAAklEQVR4AewaftIAAAeuSURBVO3B0Y0d2w1FwS3iRsJcGBNjYEzMhTlICYy/DcwBrEa7X8/jqvr19fvPlwCsZAKwlgnAWiYAa5kArGUCsJYJwFomAGuZAKxlArCWCcBaJgBrmQCsZQKwlgnAWiYAa5kArGUCsJYJwFomAGuZAKxlArCWCcBaJgBrmQCsZQKwlgnAWiYAa330sPLQT5fTOikP3SmndVIeuiKndVIeOslpnZSHrshpnZSHvpPTOikP/XQ5raeYAKxlArCWCcBaJgBrmQCsZQKw1kcvktN6i/LQG5SHnpTTuiKndVIeuiKndaec1luUh97ABGAtE4C1TADWMgFYywRgLROAtT76IcpDd8tp3S2n9Z3y0N1yWrhHeehuOa23MwFYywRgLROAtUwA1jIBWMsEYK2PcKvy0HdyWm9RHjrJad0tp3VSHjrJaeH/ywRgLROAtUwA1jIBWMsEYC0TgLU+wq1yWn+rPHS3nNYV5aErclpX5LTwzzEBWMsEYC0TgLVMANYyAVjLBGCtj36InNZPVh46yWmdlIeuKA+d5LSuKA+dlIeektO6W05rIxOAtUwA1jIBWMsEYC0TgLVMANb66EXKQz9deeg7Oa2T8tBJTuukPHSS0zopD53ktK7IaZ2Uh05yWifloTuVh/DfTADWMgFYywRgLROAtUwA1jIBWOujh+W08L8rD90tp3VSHjrJaZ2Uh05yWlfktP5WTgv/OxOAtUwA1jIBWMsEYC0TgLVMANb66GHloZOc1kl56Iqc1kl56G45rTvltK4oD53ktE5yWk8qD/2tnNZJeegkp3VFeegkp3VSHroip/UUE4C1TADWMgFYywRgLROAtT56WE7rpDx0ktM6KQ9dkdO6ojx0p5zWk8pDJzmtk/LQSU7ripzWSXnoTuWhK3JaV+S0TspDb2ACsJYJwFomAGuZAKxlArCWCcBaHz2sPHSS07pbeehuOa2/VR46yWmdlIfultO6W3noJKd1p/LQSU7rpDx0ktO6ojx0RU7rDUwA1jIBWMsEYC0TgLVMANYyAVjr19fvP1/6AcpDV+S03q48dJLTOikPneS03qI89AY5rZPy0ElO627loZOc1lNMANYyAVjLBGAtE4C1TADWMgFY69fX7z9felB56Iqc1pPKQyc5rZPy0HdyWm9RHvoJclpvUB66Iqf1diYAa5kArGUCsJYJwFomAGuZAKz10YvktE7KQ0/KaT2lPHSS03pSTuukPHSS03qD8tBJTuuKnNZJeeikPHRFTuspJgBrmQCsZQKwlgnAWiYAa5kArPXRw3JaV+S0nlQeOslpneS0vlMeult56Iqc1hU5rZPy0FNyWriHCcBaJgBrmQCsZQKwlgnAWiYAa/36+v3nSy9RHjrJaV1RHjrJaV1RHjrJad2pPHRFTuukPHRFTutu5aG3y2ldUR46yWm9gQnAWiYAa5kArGUCsJYJwFomAGt99LDy0JNyWiflobuVh76T07oip3VSHnpSeegNclp3Kw+dlIdOclo/mQnAWiYAa5kArGUCsJYJwFomAGv9+vr950svUR66Iqf1FuWh7+S03qI8dEVO64ry0ElO6ynloZOc1kl56G45rTcwAVjLBGAtE4C1TADWMgFYywRgrY8eVh46yWmdlIdOykNPymmd5LSeUh56i/LQ3cpD38lpnZSHrigPneS0TspDJzmttzMBWMsEYC0TgLVMANYyAVjLBGCtjx6W07oip3VSHroip3VFeegkp/Wd8tBJTustclon5aEn5bTw/2UCsJYJwFomAGuZAKxlArCWCcBaH71IeeiKnNbdykNXlIfuVB46yWmdlIeuKA+9RXnoDcpD/1YmAGuZAKxlArCWCcBaJgBr/fr6/edLuE156A1yWncrD90tp3VSHvpOTutu5aG3yGk9xQRgLROAtUwA1jIBWMsEYC0TgLU+elh56KfLaf2tnNZblIdOclonOa2T8tBJTuukPHSn8tBJTutuOa2T8tBJTusNTADWMgFYywRgLROAtUwA1jIBWOujF8lpvUV56O3KQ2+R07oip3VSHvpbOa23yGmdlIdOclpPMQFYywRgLROAtUwA1jIBWMsEYK2Pfojy0N1yWnfLaX2nPHS3nNbdykN3y2ndqTz0pJzWSXnoJKd1ktN6AxOAtUwA1jIBWMsEYC0TgLVMANb6CLcqD/2tnNZJeeikPHRFTutJ5aErclrfKQ+d5LROykNXlIdOclpXlIdOclpPMQFYywRgLROAtUwA1jIBWMsEYK2P8I8rD90tp3VFTuuK8tBJTuuK8tB3clp3y2ldUR46yWm9nQnAWiYAa5kArGUCsJYJwFomAGt99EPktH6CnNZTykMn5aGTnNYV5aGTnNZJeegkp/W3ykMnOa27lYdOclon5aGTnNYbmACsZQKwlgnAWiYAa5kArGUCsNZHL1Ie+unKQ9/JaZ2Uh+6W0zopD12R07pbeehO5aGTnNYVOa1/KxOAtUwA1jIBWMsEYC0TgLVMANb69fX7z5cArGQCsJYJwFomAGuZAKxlArCWCcBaJgBrmQCsZQKwlgnAWiYAa5kArGUCsJYJwFomAGuZAKxlArCWCcBaJgBrmQCsZQKwlgnAWiYAa5kArGUCsJYJwFr/AdJSJS8BUVhIAAAAAElFTkSuQmCC`
        return HttpResponse.json(
            {
                shortCode: "Hw81kOM",
                qrCodeDataUrl: mockQrCodeDataUrl,
            },
            { status: 201 }
        );
    }),
];
