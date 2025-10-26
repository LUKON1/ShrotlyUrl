import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import useAxiosPrivate from "../../utils/useAxiosPrivate";
import Logout from "../Myurls/logout";
import Urlslist from "../Myurls/myurlslist";
import Notifications from "../shared/messagewindow";
import H1 from "../shared/h1";

function Myurlspage() {
    const API_MYURLS = "/myurls/geturls";
    const { t } = useTranslation();
    const axiosPrivate = useAxiosPrivate();
    const [urls, setUrls] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const notificationRef = useRef();

    const getMyUrls = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await axiosPrivate.get(API_MYURLS);
            setUrls(response.data);
        } catch (err) {
            console.error("Failed to fetch user URLs:", err);
            setError(t("myurls.loaderr"));
            notificationRef.current?.addNotification(t("myurls.loaderr"), 3000);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getMyUrls();
    }, []);


    return (
        <div className="flex w-full flex-col items-center">
            <Notifications ref={notificationRef} />
            <Logout />
            <H1>{t("myurls.myurls")}</H1>
            <Urlslist urls={urls} getMyUrls={getMyUrls} notificationRef={notificationRef} isLoading={isLoading}/>
        </div>
    );
}

export default Myurlspage;
