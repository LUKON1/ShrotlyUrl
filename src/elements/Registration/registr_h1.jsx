import { useTranslation } from 'react-i18next';

function Regh1() {
  const { t } = useTranslation();

  return (
    <h1
      className="text-5xl md:text-7xl mb-16 md:w-full w-72 
        lg:text-8xl transition-all duration-200
         ease-out"
      style={{
        fontFamily: "AmazeDoom , sans-serif",
      }}
    >
      {t('registration.title')}
    </h1>
  );
}

export default Regh1;

