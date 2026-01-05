'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/components/UserContext';
import { fetchClientByAppUserId } from './lib/api';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import CreateClient from './create-client';

export default function ClientDashboard() {
    const { userId } = useUser();
    const router = useRouter();
    const [checking, setChecking] = useState(true);
    const [showCreateProfile, setShowCreateProfile] = useState(false);

    useEffect(() => {
        const checkClientStatus = async () => {
            console.log("Checking client status, userId:", userId);
            if (!userId) {
                console.log("No userId, returning...");
                return;
            }

            try {
                console.log("Fetching client for userId:", userId);
                const response = await fetchClientByAppUserId(userId);
                console.log("Client Data Response:", response);

                if (response.status === 204) {
                    console.log("Status 204 (No Content), showing create profile");
                    setShowCreateProfile(true);
                } else if (response.status === 200) {
                    console.log("Client found (Status 200), setting checking false");
                } else {
                    console.log("Unexpected status:", response.status);
                }
                setChecking(false);
            } catch (error: any) {
                console.log("Error fetching client:", error);
                if (error.response && error.response.status === 404) {
                    console.log("404 Not Found, showing create profile");
                    setShowCreateProfile(true);
                    setChecking(false);
                } else {
                    console.error("Error fetching client status:", error);
                    setChecking(false);
                }
            }
        };

        checkClientStatus();
    }, [userId, router]);

    if (checking) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                <span className="ml-2 text-gray-500">Verifying profile...</span>
            </div>
        );
    }

    if (showCreateProfile) {
        return <CreateClient onCreated={() => window.location.reload()} />;
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Client Dashboard</h1>
            <p>Welcome, Client. Here you can view your status, reports, and upcoming appointments.</p>
        </div>
    );
}
