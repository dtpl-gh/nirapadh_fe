'use client';

import { useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function TestAPIPage() {
    const [response, setResponse] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const testBackend = async () => {
        setLoading(true);
        setError(null);
        setResponse(null);

        try {
            // This will hit /api/proxy/test which should forward to BACKEND_URL/test
            const res = await axiosInstance.get('/test');
            setResponse(res.data);
        } catch (err: any) {
            setError(err.response?.data?.detail || err.message || 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <Card className="max-w-2xl w-full p-8">
                <h1 className="text-2xl font-bold mb-4">API Proxy Test</h1>
                <p className="mb-4 text-gray-600">
                    This page tests the API proxy by sending a request to <code className="bg-gray-100 px-2 py-1 rounded">/api/proxy/test</code>,
                    which should forward to your backend at <code className="bg-gray-100 px-2 py-1 rounded">BACKEND_URL/test</code> with the X-API-Key header injected.
                </p>

                <Button onClick={testBackend} disabled={loading} className="mb-4">
                    {loading ? 'Testing...' : 'Test Backend Connection'}
                </Button>

                {response && (
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
                        <h2 className="font-bold text-green-800 mb-2">✓ Success!</h2>
                        <pre className="text-sm overflow-auto">
                            {JSON.stringify(response, null, 2)}
                        </pre>
                    </div>
                )}

                {error && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
                        <h2 className="font-bold text-red-800 mb-2">✗ Error</h2>
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                )}

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
                    <h3 className="font-bold text-blue-800 mb-2">How it works:</h3>
                    <ol className="text-sm text-blue-700 list-decimal list-inside space-y-1">
                        <li>Click the button to send a GET request to <code>/api/proxy/test</code></li>
                        <li>The Next.js proxy handler intercepts this request</li>
                        <li>It injects the <code>X-API-Key</code> header from Vault</li>
                        <li>The request is forwarded to <code>BACKEND_URL/test</code></li>
                        <li>The backend validates the API key and returns a response</li>
                    </ol>
                </div>
            </Card>
        </div>
    );
}
