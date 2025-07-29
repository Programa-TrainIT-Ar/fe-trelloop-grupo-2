'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const HeaderContent = () => {
  const router = useRouter();

  const goToRegister = () => {
    router.push('/register');
  };

  return (
    <div>
      {/* Make it + icono */}
      <div className="flex gap-2">
        <h1 className="font-poppins text-[74px] leading-[117%] font-normal text-text-default">
          Make it
        </h1>
        <div className="flex items-center justify-center translate-x-3 w-[175px] h-[100px]">
          <Image
            src="/assets/icons/symbol.svg"
            alt="symbol"
            width={175}
            height={100}
            className="object-contain"
          />
        </div>
      </div>

      {/* Icono inferior + Happen */}
      <div className="flex items-center w-[557px] h-[92px] ml-3">
        <Image
          className="w-[88px] h-[75px] mb-5"
          src="/assets/icons/symbol1.webp"
          alt="symbol"
          width={88}
          height={75}
        />
        <h2 className="font-ppvalve italic text-[70px] leading-[117%] text-text-default ml-5 tracking-wider">
          Happen
        </h2>

      </div>

      {/* Descripción */}
      <p className="font-poppins text-[20px] leading-[175%] max-w-md text-text-default mt-3 ml-12 tracking-wide">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </p>

      {/* Botón */}
      <button
        onClick={goToRegister}
        className="h-[54px] w-[247px] bg-state-default text-text-default text-xl rounded-full mt-4 ml-[85px]"
      >
        Crear cuenta
      </button>
    </div>
  );
};

export default HeaderContent;

