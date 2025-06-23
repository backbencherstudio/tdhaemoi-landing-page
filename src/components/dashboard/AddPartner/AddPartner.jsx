import React, { useState, useEffect } from 'react';
// import { Input } from '@/components/ui/input';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { toast } from 'react-hot-toast';
import { addPartner, updatePartner, getPartnerById } from '../../../apis/authApis';
import { Eye, EyeOff } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "../../../components/ui/dialog"

export default function PartnerModal({ open, onOpenChange, onSuccess, partnerId = null }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoadingPartner, setIsLoadingPartner] = useState(false);
    const [partnerData, setPartnerData] = useState(null);

    const isEditMode = !!partnerId;

    useEffect(() => {
        if (!open) {
            setEmail('');
            setPassword('');
            setPartnerData(null);
        }
    }, [open]);

    useEffect(() => {
        const fetchPartnerData = async () => {
            if (!partnerId || !open) return;

            try {
                setIsLoadingPartner(true);
                const response = await getPartnerById(partnerId);
                const partner = response?.partner || response?.data?.partner || response?.data;

                if (partner) {
                    setPartnerData(partner);
                    setEmail(partner.email || '');
                } else {
                    toast.error('Invalid partner data structure');
                }
            } catch (error) {
                toast.error(error.message || 'Failed to fetch partner details');
            } finally {
                setIsLoadingPartner(false);
            }
        };

        if (partnerId && open) {
            fetchPartnerData();
        }
    }, [partnerId, open]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            toast.error('Email is required');
            return;
        }

        setIsLoading(true);

        try {
            const data = { email };
            if (password) {
                data.password = password;
            }

            let response;
            if (isEditMode) {
                response = await updatePartner(partnerId, data);
                if (response?.success || response?.data) {
                    toast.success('Partner updated successfully!');
                    onOpenChange(false);
                    if (onSuccess) await onSuccess();
                } else {
                    throw new Error('Update failed');
                }
            } else {
                if (!password) {
                    throw new Error('Password is required for new partners');
                }
                response = await addPartner(data);
                if (response?.success || response?.data) {
                    toast.success('Partner added successfully!');
                    onOpenChange(false);
                    if (onSuccess) await onSuccess();
                } else {
                    throw new Error('Add failed');
                }
            }
        } catch (error) {
            console.error('Operation error:', error);
            toast.error(error.message || `Failed to ${isEditMode ? 'update' : 'add'} partner`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {isEditMode ? `Update Partner` : 'Add New Partner'}
                    </DialogTitle>
                </DialogHeader>

                {isLoadingPartner ? (
                    <div className="flex justify-center py-8">
                        <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter partner's email"
                                className="w-full"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                {isEditMode ? 'New Password (optional)' : 'Password'}
                            </label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder={isEditMode ? "************" : "Enter password"}
                                    className="w-full pr-10"
                                    required={!isEditMode}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute cursor-pointer inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <DialogFooter className="flex gap-2 mt-6">
                            <Button
                                type="button"
                                className="cursor-pointer"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isLoading || isLoadingPartner}
                                className="bg-green-600 cursor-pointer text-white hover:bg-green-700"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                        {isEditMode ? 'Updating...' : 'Adding...'}
                                    </>
                                ) : (
                                    isEditMode ? 'Update Partner' : 'Add Partner'
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
