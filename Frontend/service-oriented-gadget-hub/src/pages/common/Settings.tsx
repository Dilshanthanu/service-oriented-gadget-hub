import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/Card';
import { Moon, Sun, Bell, Shield, Smartphone } from 'lucide-react';
import { Button } from '../../components/Button';

export const Settings: React.FC = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
            <h1 className="text-3xl font-bold">Settings</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Appearance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                                {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                            </div>
                            <div>
                                <p className="font-medium">Theme Preference</p>
                                <p className="text-sm text-slate-500">Switch between light and dark mode</p>
                            </div>
                        </div>
                        <Button variant="outline" onClick={toggleTheme}>
                            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                                <Bell className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-medium">Push Notifications</p>
                                <p className="text-sm text-slate-500">Receive updates about your orders</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                        </label>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Security</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                                <Shield className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-medium">Two-Factor Authentication</p>
                                <p className="text-sm text-slate-500">Add an extra layer of security</p>
                            </div>
                        </div>
                        <Button variant="outline" disabled>Configure</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
