import Signinform from "../Registration/signin_form";
import PageWrapper from "../shared/wrapper_home";
import H1 from "../shared/h1";
import { useTranslation } from "react-i18next";
function Signuppage(){
    const {t} = useTranslation();
    return(
        <PageWrapper>
            <H1>{t("registration.login")}</H1>
            <Signinform />
        </PageWrapper>
    );
}
export default Signuppage;