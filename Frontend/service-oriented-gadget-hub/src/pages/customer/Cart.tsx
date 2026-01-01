import React from 'react';
import { useCart } from '../../context/CartContext';
import { Button } from '../../components/Button';
import { Card, CardContent } from '../../components/Card';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Cart: React.FC = () => {
    const { cartItems, removeFromCart, updateQuantity, total } = useCart();

    if (cartItems.length === 0) {
        return (
            <div className="text-center py-20 animate-fade-in">
                <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
                <p className="text-slate-500 mb-8">Looks like you haven't added anything yet.</p>
                <Link to="/">
                    <Button variant="primary">Start Shopping</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
            <h1 className="text-3xl font-bold mb-8">Shopping Cart ({cartItems.length})</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    {cartItems.map((item) => (
                        <Card key={item.id} className="flex gap-4 p-4 items-center">
                            <div className="w-24 h-24 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-lg">{item.name}</h3>
                                <p className="text-slate-500 text-sm">{item.category}</p>
                                <div className="mt-2 text-primary-600 font-bold">${item.price}</div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <Button variant="ghost" size="sm" onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                                <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        className="p-1 hover:bg-white dark:hover:bg-slate-700 rounded-md transition-colors"
                                    >
                                        <Minus className="w-3 h-3" />
                                    </button>
                                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        className="p-1 hover:bg-white dark:hover:bg-slate-700 rounded-md transition-colors"
                                    >
                                        <Plus className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                <div className="lg:col-span-1">
                    <Card className="sticky top-24">
                        <CardContent className="p-6 space-y-6">
                            <h3 className="text-xl font-bold">Order Summary</h3>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Subtotal</span>
                                    <span className="font-medium">${total.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Shipping</span>
                                    <span className="font-medium">Free</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Tax</span>
                                    <span className="font-medium">${(total * 0.1).toFixed(2)}</span>
                                </div>
                                <div className="border-t border-slate-200 dark:border-slate-700 pt-3 flex justify-between text-lg font-bold">
                                    <span>Total</span>
                                    <span>${(total * 1.1).toFixed(2)}</span>
                                </div>
                            </div>

                            <Link to="/checkout" className="block">
                                <Button className="w-full text-lg py-6">
                                    Checkout <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};
