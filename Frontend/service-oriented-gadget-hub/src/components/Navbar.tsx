import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Sun, Moon, LogOut, Package, User as UserIcon, Menu, X } from 'lucide-react';
import { Button } from './Button';
import { cn } from './Button';

export const Navbar: React.FC = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const { cartItems } = useCart();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    const navLinks = [
        { name: 'Home', path: '/', roles: ['customer', 'admin', 'distributor'] },
        { name: 'Products', path: '/products', roles: ['customer'] },
        { name: 'Dashboard', path: '/admin', roles: ['admin'] },
        { name: 'Products', path: '/admin/products', roles: ['admin'] },
        { name: 'Orders', path: '/admin/orders', roles: ['admin'] },
        { name: 'Staff', path: '/admin/staff', roles: ['admin'] },
        { name: 'Distributor Panel', path: '/distributor', roles: ['distributor'] },
        { name: 'My Orders', path: '/orders', roles: ['customer'] },
        { name: 'Quotations', path: '/quotations', roles: ['customer'] },
    ];

    const filteredLinks = navLinks.filter(link =>
        !link.roles || (user && link.roles.includes(user.role))
    );

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary-600 dark:text-primary-400">
                            <Package className="w-6 h-6" />
                            <span>GadgetHub</span>
                        </Link>

                        <div className="hidden md:flex items-center gap-1">
                            {filteredLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={cn(
                                        'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                                        isActive(link.path)
                                            ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white'
                                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800'
                                    )}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={toggleTheme} className="rounded-full w-9 h-9 p-0">
                            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                        </Button>

                        {user && user.role === 'customer' && (
                            <Link to="/cart">
                                <Button variant="ghost" size="sm" className="relative rounded-full w-9 h-9 p-0">
                                    <ShoppingCart className="w-4 h-4" />
                                    {cartCount > 0 && (
                                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary-600 text-[10px] font-bold text-white">
                                            {cartCount}
                                        </span>
                                    )}
                                </Button>
                            </Link>
                        )}

                        {user ? (
                            <div className="flex items-center gap-2 ml-2">
                                <span className="hidden sm:inline-block text-sm font-medium text-slate-700 dark:text-slate-300">
                                    {user.name}
                                </span>
                                <Link to="/profile">
                                    <Button variant="ghost" size="sm" title="Profile">
                                        <UserIcon className="w-4 h-4" />
                                    </Button>
                                </Link>
                                <Button variant="ghost" size="sm" onClick={handleLogout} title="Logout">
                                    <LogOut className="w-4 h-4" />
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link to="/login">
                                    <Button variant="ghost" size="sm">Login</Button>
                                </Link>
                                <Link to="/register">
                                    <Button variant="primary" size="sm">Register</Button>
                                </Link>
                            </div>
                        )}

                        <div className="md:hidden ml-2">
                            <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <div className="space-y-1 p-4">
                        {filteredLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsMenuOpen(false)}
                                className={cn(
                                    'flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                                    isActive(link.path)
                                        ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800'
                                )}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
};
