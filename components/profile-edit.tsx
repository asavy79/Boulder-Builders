"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Pencil, X, Check } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { User } from "@supabase/supabase-js";
import AddSkill from "./add-skill";




export default function ProfileEdit({user}: {user: User}) {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: user?.user_metadata?.first_name || '',
        lastName: user?.user_metadata?.last_name || '',
        email: user?.email || '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSubmit = async () => {
        setError('');
        setSuccess('');

        if(formData.firstName === user?.user_metadata?.first_name && formData.lastName === user?.user_metadata?.last_name) {
            setIsEditing(false);
            return;
        }

        try {
            // TODO: Implement your update logic here
            if(formData.password !== formData.confirmPassword) {
                console.error('Passwords do not match');
                setError('Passwords do not match');
                return;
            }
            const result = await fetch('/api/users', {
                method: 'PUT',
                body: JSON.stringify(formData),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if(!result.ok) {
                throw new Error('Failed to update profile');
            }

            // Refresh the auth state
            const supabase = createClient();
            await supabase.auth.refreshSession();
            setSuccess('Profile updated successfully');

            setIsEditing(false);
        } catch (error) {
            console.error('Failed to update profile:', error);
            setError('Failed to update profile');
        }
    };

    const handleCancel = () => {
        // Reset form data to original values
        setFormData({
            firstName: user?.user_metadata?.first_name || '',
            lastName: user?.user_metadata?.last_name || '',
            email: user?.email || '',
            password: '',
            confirmPassword: ''
        });
        setIsEditing(false);
    };

    return (


        <div className="flex flex-col items-center gap-4 max-w-md mx-auto w-full px-4">
            <div className="flex items-center justify-between w-full">
                <h1 className="text-2xl font-bold">Profile Information</h1>
                {!isEditing && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsEditing(true)}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                    </Button>
                )}
            </div>
            <div className="w-full space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                    id="email" 
                    type="email" 
                    placeholder="Email" 
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full" 
                    disabled={true}
                />
            </div>
            
            
            <div className="w-full space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input 
                    id="firstName" 
                    type="text" 
                    placeholder="First Name" 
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full" 
                    disabled={!isEditing}
                />
            </div>
            <div className="w-full space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input 
                    id="lastName" 
                    type="text" 
                    placeholder="Last Name" 
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full" 
                    disabled={!isEditing}
                />
            </div>
            {isEditing ? (
                <div className="flex gap-2 w-full">
                    <Button
                        variant="outline"
                        className="w-full border-red-200 text-red-700 hover:bg-red-50"
                        onClick={handleCancel}
                    >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                    </Button>
                    <Button
                        variant="outline"
                        className="w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                        onClick={handleSubmit}
                    >
                        <Check className="h-4 w-4 mr-2" />
                        Save Changes
                    </Button>
                </div>
            ) : null}
            {error && <div className="mt-4 text-red-500">{error}</div>}
            {success && <div className="mt-4 text-emerald-500 flex items-center gap-2"> <Check className="h-4 w-4 mr-2" />{success}</div>}

            <Link href="/protected/reset-password">
            <Button variant="outline" className="w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                Reset Password
            </Button>
            </Link>
            <AddSkill />
        </div>
    );
}