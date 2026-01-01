import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../../components/Card';
import { Send, ArrowLeft } from 'lucide-react';

export const DistributorResponse: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        unitPrice: '',
        stock: '',
        deliveryDays: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            navigate('/distributor');
        }, 1000);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6 animate-slide-up">
            <Button variant="ghost" className="pl-0" onClick={() => navigate(-1)}>
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
            </Button>

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle>Submit Quotation Response</CardTitle>
                            <p className="text-slate-500">Request #{id}</p>
                        </div>
                        <div className="text-right">
                            <p className="font-semibold">iPhone 14 Pro Max</p>
                            <p className="text-sm text-slate-500">Qty: 50</p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="Unit Price ($)"
                            type="number"
                            placeholder="e.g. 1050"
                            value={formData.unitPrice}
                            onChange={e => setFormData({ ...formData, unitPrice: e.target.value })}
                            required
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Available Stock"
                                type="number"
                                placeholder="e.g. 50"
                                value={formData.stock}
                                onChange={e => setFormData({ ...formData, stock: e.target.value })}
                                required
                            />
                            <Input
                                label="Delivery Time (Days)"
                                type="number"
                                placeholder="e.g. 3"
                                value={formData.deliveryDays}
                                onChange={e => setFormData({ ...formData, deliveryDays: e.target.value })}
                                required
                            />
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
                            <h4 className="font-semibold text-sm mb-2">Summary</h4>
                            <div className="flex justify-between text-sm">
                                <span>Total Quote Value:</span>
                                <span className="font-bold">
                                    ${(Number(formData.unitPrice) * 50).toLocaleString()}
                                </span>
                            </div>
                        </div>

                        <Button type="submit" className="w-full" isLoading={loading}>
                            <Send className="w-4 h-4 mr-2" /> Send Quotation
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};
