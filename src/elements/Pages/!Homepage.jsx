import { useTranslation } from "react-i18next";
import ShortenerForm from "../Homepage/main_form.jsx";
import PageWrapper from "../shared/wrapper_home.jsx";
import H1 from "../shared/h1.jsx";

function Homepage() {
  const { t } = useTranslation();
  return (
    <PageWrapper>
      <H1>{t("homepage.title")}</H1>
      <ShortenerForm />
    </PageWrapper>
  );
}
export default Homepage;
