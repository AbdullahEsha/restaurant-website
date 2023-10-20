import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { useRouter } from 'next/router';
export default function Layout({children}) {

  const router=useRouter();
  /**
   * Do not display footer and header in the map page
   */
  const showHeader = router.pathname === '/map' ? false : true ;
  const showFooter = router.pathname === '/map' ? false : true;
  return (
    <div>
       { showHeader && <Header/> } 
        {
          children
        }
      { showFooter && <Footer/>}
    </div>
  )
}