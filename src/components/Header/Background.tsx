import Image from 'next/image';

const Background = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-visible pointer-events-none">
      <div className="absolute w-full h-full">
        {/* Círculo izquierdo */}
         <div
          className="absolute"
          style={{
            left: 'calc(50% - 1366px / 2 - 428px - ((100vw - 1366px) * 0.70))',
            top: '375px',
            width: 'calc(1240px + (100vw - 1366px) * 0.65)',
            height: 'calc(1240px + (100vw - 1366px) * 0.65)',

          }}
        >
          <Image
            src="/assets/images/circle2.webp"
            alt="Circle background 2"
            fill
       
          />
        </div>

        {/* Círculo derecho */}
         <div
          className="absolute"
          style={{
            left: 'calc(50% + 683px - 952px + 420px)',
            top: '100px',
            width: 'calc(952px + (100vw - 1366px) * 0.65)',
            height: 'calc(952px + (100vw - 1366px) * 0.65)',

          }}
        >
          <Image
            src="/assets/images/circle1.webp"
            alt="Circle background 1"
            fill
        
          />
        </div>
      </div>
    </div>
  );
};

export default Background;

