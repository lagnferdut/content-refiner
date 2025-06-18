import React from 'react';
import { APP_TITLE } from '../constants';
import { EditIcon } from './icons';

const Header: React.FC = () => {
  return (
    <header className="py-6 px-4 sm:px-6 lg:px-8 bg-slate-900/80 backdrop-blur-md shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-center">
        <EditIcon className="h-10 w-10 text-sky-400 mr-4" />
        <h1 className="text-4xl font-extrabold tracking-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300">{APP_TITLE}</span>
        </h1>
      </div>
    </header>
  );
};

export default Header;