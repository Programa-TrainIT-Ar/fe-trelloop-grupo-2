import SocialIcons from './SocialIcons';

export default function Footer() {
  return (
    <footer className="bg-transparent text-text-default">
      <div className="max-w-[1366px] mx-auto pt-20 px-6 mb-20">
        {/* Grid principal */}
        <div className="grid grid-cols-12 gap-8">
          {/* Acerca de*/}
          <div className="col-start-2 col-span-2 font-poppins ">
            <h4 className="font-bold mb-4 text-[16px]">Acerca de</h4>
            <ul className="space-y-4 text-[14px] ">
              <li>Programa TrainIT</li>
              <li>Contacto</li>
            </ul>
          </div>

          {/* Legal*/}
          <div className="col-start-4 col-span-3">
            <h4 className="font-bold mb-4 text-[16px]">Legal</h4>
            <ul className="space-y-4 text-[14px]">
              <li>Política de cookies</li>
              <li>Política de privacidad</li>
              <li>Aviso legal y condiciones de uso</li>
            </ul>
          </div>

          {/* Sedes*/}
          <div className="col-start-7 col-span-3">
            <h4 className="font-bold mb-4 text-[16px]">Sedes</h4>
            <ul className="space-y-4 text-[14px]">
              <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit</li>
              <li>Ut enim ad minim veniam, quis nostrud exercitation</li>
            </ul>
          </div>

          {/* Redes sociales*/}
          <div className="col-start-10 col-span-2">
            <h4 className="font-bold mb-4 text-[16px]">Redes sociales</h4>
            <SocialIcons />
          </div>
        </div>

        {/* Créditos */}
        <div className="flex justify-center mt-20  text-[14px]">
          © 2025 Copyright | Programa TrainIT
        </div>
      </div>
    </footer>
  );
}
