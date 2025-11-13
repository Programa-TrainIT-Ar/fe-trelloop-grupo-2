import Image from 'next/image';

export default function SocialIcons() {
  return (
    <div className="flex space-x-4">
      <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className='flex items-center justify-center'>
        <Image src="/assets/icons/Discord.webp" alt="Discord" width={32} height={32} />
      </a>
      <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
        <Image src="/assets/icons/Linkedin.webp" alt="LinkedIn" width={32} height={32} />
      </a>
      <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
        <Image src="/assets/icons/Facebook.webp" alt="Facebook" width={32} height={32} />
      </a>
    </div>
  );
}