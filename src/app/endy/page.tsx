'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Copy } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api/v1';

export default function EncryptionPage() {
    const { toast } = useToast();
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');

    const handleEncrypt = async () => {
        if (!input) {
            toast({ title: "Input required", variant: "destructive" });
            return;
        }
        try {
            const response = await axios.post(`${API_BASE_URL}/ende/encrypt`, {
                text: input
            });
            // Assuming response structure based on Postman request pattern and common practices
            // If request is { text: "..." }, response likely { encryptedText: "..." }
            // But we'll fallback to a generic data display if uncertain, or check user prompt again.
            // User prompt says request body for decrypt is { encryptedText: "..." }, so response of encrypt is likely that key.
            const result = response.data.encryptedText || JSON.stringify(response.data);
            setOutput(result);
            toast({ title: "Encrypted", description: "Result copied to output." });
        } catch (error) {
            console.error('Encryption failed', error);
            toast({ title: "Encryption Failed", description: "Check console for details.", variant: "destructive" });
            setOutput("Error: " + (error as any).message);
        }
    };

    const handleDecrypt = async () => {
        if (!input) {
            toast({ title: "Input required", variant: "destructive" });
            return;
        }
        try {
            const response = await axios.post(`${API_BASE_URL}/ende/decrypt`, {
                encryptedText: input
            });
            // Assuming response for decrypt is { text: "..." }
            const result = response.data.text || JSON.stringify(response.data);
            setOutput(result);
            toast({ title: "Decrypted", description: "Result copied to output." });
        } catch (error) {
            console.error('Decryption failed', error);
            toast({ title: "Decryption Failed", description: "Check console for details.", variant: "destructive" });
            setOutput("Error: " + (error as any).message);
        }
    };

    const copyToClipboard = () => {
        if (output) {
            navigator.clipboard.writeText(output);
            toast({ title: "Copied to clipboard" });
        }
    };

    return (
        <div className="container mx-auto py-10 max-w-2xl">
            <Card>
                <CardHeader>
                    <CardTitle>Encryption Testing (Backend API)</CardTitle>
                    <CardDescription>
                        Use this tool to test backend encryption and decryption endpoints.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Input Text</label>
                        <Textarea
                            placeholder="Enter text (plain for encrypt, encrypted string for decrypt)..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            rows={5}
                        />
                    </div>

                    <div className="flex space-x-4">
                        <Button onClick={handleEncrypt} className="flex-1">Encrypt</Button>
                        <Button onClick={handleDecrypt} className="flex-1" variant="secondary">Decrypt</Button>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">Output</label>
                            <Button variant="ghost" size="sm" onClick={copyToClipboard} disabled={!output}>
                                <Copy className="w-4 h-4 mr-2" />
                                Copy
                            </Button>
                        </div>
                        <div className="p-4 bg-slate-100 rounded-md break-all min-h-[100px] text-sm font-mono border">
                            {output || <span className="text-gray-400">Result will appear here...</span>}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
