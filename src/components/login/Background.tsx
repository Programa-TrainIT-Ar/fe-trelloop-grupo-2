import Image from 'next/image';

const Background = () => {
  return (
    <div className="hidden lg:block fixed inset-0 z-0 overflow-hidden pointer-events-none">
      
      <Image
        src="/assets/images/ui-fondo-circulo-izquierda.webp"
        alt="Circle background 2"
        width={1240}
        height={1240}
        className="fixed"
        style={{
          left: "50%",
          top: "50%",
          transform: "translate(-100%, -50%)", 
        }}
      />
      <Image
        src="/assets/images/ui-fondo-circulo-derecha.webp"
        alt="Circle background 1"
        width={952}
        height={952}
        className="fixed"
        style={{
          left: "50%",
          top: "50%",
          transform: "translate(-2%, -86%)", 
        }}
      />
    </div>
  );
};

export default Background;
