"use client"

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation'
import { AiOutlinePoweroff, AiOutlineClose } from 'react-icons/ai';
import { links } from '@/dummy';
import { useNavContext, useHomeContext } from '@/context';
import styles from './styles';
import Image from 'next/image';
import Logo from '@/assets/images/logo.png';
import { logoutApi } from '@/API/APIS/authApi';

const Sidebar = ({ mobile }: { mobile?: boolean}) => {
  const { isNavOpen, setIsNavOpen } = useNavContext();
  const { setFormLoading } = useHomeContext();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    setIsNavOpen(false);
    await logoutApi({router, setFormLoading });
  };

  return (
    <div className={styles.container(mobile)}>
      <div className='flex justify-between items-end'>
        <Link href="/dashboard" className=''>
          <Image 
            src={Logo} 
            alt='Expendit Logo' 
            width={85}
            className='ml-5 mt-6' 
          />
        </Link>

       {isNavOpen && <button className='mr-4'
          onClick={() => setIsNavOpen(false)}>
          <AiOutlineClose fontSize={25} />
        </button>}
      </div>
  
      <div className='relative mt-10'>
        {links.map((link, index) => (
          <Link
            href={link.url}
            key={link.name}
            onClick={() => setIsNavOpen(false)}
            className={styles.link(pathname, link.url)}
          >
            <span className='text-xl'>{link.icon}</span>
            <span>{link.name}</span> 
          </Link>
        ))}
      </div>
      <div className={styles.logout} 
        onClick={handleLogout}>
        <AiOutlinePoweroff className='mr-3'/>
        <span>Logout</span>
      </div>
    </div>
  )
}

export default Sidebar