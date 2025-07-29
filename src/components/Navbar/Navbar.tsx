import Image from 'next/image';
import { useRouter } from 'next/navigation';

const Navbar = () => {
    const router=useRouter()
    const goToLogin=()=>{
        router.push("/login")
    }
    const goToRegister=() =>{
        router.push("/register")
    }
    const goToHome=()=>{
        router.push("/")
    }
    return (
        <div className="flex max-width[1366] mx-auto justify-between bg-[#222222] h-[72px] items-center">
            <div className="ml-5">
                <Image
                    src="/assets/logo/logo-dark-trainit.webp"
                    alt="logo"
                    width={151}
                    height={40}
                    className="pt-[6px] pl-[18px]"
                />
            </div>

            <div className="flex">
                <div className="flex items-center justify-center mt-2 mr-[35px]">
                    <button className="text-[16px] text-[#6a5fff] text-center w-[107px] h-[36px] mr-4" onClick={goToHome}>
                        Inicio
                    </button>
                    <button className="text-[16px] text-white text-center w-[152px] h-[36px] mr-4" onClick={goToHome}>
                        Acerca de
                    </button>
                    <button className="text-[16px] text-white text-center w-[152px] h-[36px] mr-4" onClick={goToHome}>
                        Contacto
                    </button>
                </div>

                <button className="h-[36px] rounded-full w-[200px] border border-[#6a5fff] text-[#6a5fff] text-center justify-center flex px-3 mt-1 mr-4 pt-1" onClick={goToLogin}>
                    LOGIN
                </button>

                <button className="h-[36px] rounded-full w-[200px] bg-[#6a5fff] text-white text-center justify-center flex px-3 mt-1 mr-4 pt-1" onClick={goToRegister}>
                    REGISTRARSE
                </button>
            </div>
        </div>
    );
};

export default Navbar;