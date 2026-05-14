import React from 'react';
import Link from "next/link";
import './simple-navbar.css';

export function Navbar(){
  return(
    <header className='simple-header'>
      <nav className='navbar'>
        <Link href ='/' className='simple-logo'>VRUNDAVAN</Link>
      <ul className='simple-nav-links'>
        <li><Link href='#about'>About</Link></li>
        <li><Link href='/menu'>Menu</Link>
        </li>
        <li><Link href='#location'>contact</Link></li>
      </ul>
      <Link href='/login' className='simple-login-btn'>Login</Link>
      </nav>
    </header>
  )
}