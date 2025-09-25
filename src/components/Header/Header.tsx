import Background from './Background';
import HeaderContent from './HeaderContent';
import HeaderImages from './HeaderImages';
import Footer from 'components/Footer/Footer';

const Header = () => {
  return (
    <header className="w-full h-[4212px] bg-background-body text-text-default relative overflow-hidden">
      {/* Fondo */}
      <div className="absolute inset-0 z-0">
        <Background />
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 w-full pt-[100px]">
        <div className="max-w-[1366px] mx-auto px-6 grid grid-cols-12 gap-x-6 items-start">
          {/* Contenido textual */}
          <div className="col-start-2 col-span-6 mt-1">
            <HeaderContent />
          </div>

          {/* Imágenes: columna derecha */}
          <div className="overflow-visible col-start-8 col-span-4 mt-[150px] relative translate-x-[-125px] w-[661px] h-[661px]">
            <HeaderImages />
          </div>
        </div>
      </div>
      {/* Footer */}
      <div className="absolute bottom-0 w-full z-10">
        <Footer />
      </div>

    </header>
  );
};

export default Header;
