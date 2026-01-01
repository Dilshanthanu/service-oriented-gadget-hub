import React from 'react';
import { Navbar } from './Navbar';
import { useLocation } from 'react-router-dom';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation();
    // Hide navbar on auth pages if desired, but for now we keep it or make it minimal
    // const isAuthPage = ['/login', '/register'].includes(location.pathname);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-dark-bg text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300">
            <Navbar />
            <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
                {children}
            </main>
            <footer className="border-t border-slate-200 dark:border-slate-800 py-8 mt-auto bg-white dark:bg-slate-900">
                <div className="container mx-auto px-4 text-center text-sm text-slate-500 dark:text-slate-400">
                    © {new Date().getFullYear()} Service Oriented Gadget Hub. All rights reserved.
                </div>
            </footer>
        </div>
    );
};
