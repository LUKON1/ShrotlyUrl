import { useTranslation } from "react-i18next";
function Footer() {
   const {t} = useTranslation()
  return (
    <footer className="transition-all duration-200 ease-out bg-rose-400 w-full md:h-[20vh] h-[35vh] relative mt-20 flex flex-col items-center">
      <div className="w-[70vw] h-full flex flex-col text-base md:text-xl lg:text-2xl justify-center items-center text-rose-50 font-bold text-left">
        {t('footer.discription')}
      </div>
      <div className="font-bold text-rose-50 mb-1.5">powered by <a href=""  className="text-blue-400">LUKON</a> & <a href=""  className="text-blue-400">KRIBZDY</a></div>
    </footer>
  );
}
export default Footer;
