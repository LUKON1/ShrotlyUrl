import { useTranslation } from "react-i18next";
import PageWrapper from "../shared/wrapper_home";
import Registrform from "../Registration/registr_form";
import H1 from "../shared/h1";


function Registrpage(){
    const {t} = useTranslation();
    return(
        <PageWrapper>
            <H1>{t('registration.title')}</H1>
            <Registrform />
        </PageWrapper>
    )
}
export default Registrpage;