import { useTranslation } from "react-i18next";

function H1() {
  const {t} = useTranslation()
  return (
    <h1
      className="H1 text-5xl mb-16 md:w-full w-72 
        lg:text-7xl transition-all duration-200
         ease-out"
      style={{
            fontFamily: "AmazeDoom , sans-serif"
          }}  
    >
      {t('homepage.title')}
    </h1>
  );
}
export default H1;
