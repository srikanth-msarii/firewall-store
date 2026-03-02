import React from 'react';
import { TopBar } from './TopBar';
import { MainHeader } from './MainHeader';
import { NavBar } from './NavBar';

export const Header = ({ onQuoteClick }) => {
  return (
    // The `sticky` and `top-0` are now on the NavBar, 
    // but we wrap everything in a <header> tag for semantics.
    <header className="z-50">
      {/* <TopBar /> */}
      <MainHeader onQuoteClick={onQuoteClick} />
      <NavBar />
    </header>
  );
};
