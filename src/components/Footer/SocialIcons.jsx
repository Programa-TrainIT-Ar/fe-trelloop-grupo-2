import Image from 'next/image';

export default function SocialIcons() {
  return (
    <div className="flex space-x-4">
      <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className='flex items-center justify-center'>
        <Image src="/assets/icons/discord.webp" alt="Discord" width={35} height={35} />
      </a>
      <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
        <Image src="/assets/icons/linkedin.webp" alt="LinkedIn" width={30} height={30} />
      </a>
      <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
        <Image src="/assets/icons/facebook.webp" alt="Facebook" width={30} height={30} />
      </a>
    </div>
  );
}