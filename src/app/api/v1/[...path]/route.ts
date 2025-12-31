import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getApiKey } from '../../lib/api-key-loader';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080'; // Fallback for dev

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    const { path } = await params;
    return handleProxy(request, path);
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    const { path } = await params;
    return handleProxy(request, path);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    const { path } = await params;
    return handleProxy(request, path);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    const { path } = await params;
    return handleProxy(request, path);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    const { path } = await params;
    return handleProxy(request, path);
}

async function handleProxy(request: NextRequest, pathSegments: string[]) {
    const path = pathSegments.join('/');
    const isLogin = path === 'auth/login' || path === 'login'; // Adjust based on actual backend login path
    const url = `${BACKEND_URL}/api/v1/${path}${request.nextUrl.search}`;

    const headers = new Headers(request.headers);

    // Inject X-API-Key
    const apiKey = await getApiKey();
    if (apiKey) {
        headers.set('X-API-Key', apiKey);
    }

    // Inject Bearer Token from Cookie if present
    const token = request.cookies.get('token')?.value;
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    // Remove host header to avoid conflicts
    headers.delete('host');

    try {
        let body: ReadableStream | null = null;
        let bodyText: string | null = null;

        if (request.body) {
            const clonedBody = request.body.tee(); // Clone the body stream
            body = clonedBody[0]; // Use one clone for the fetch
            bodyText = await new Response(clonedBody[1]).text(); // Use the other clone for logging
        }

        // Log the URL and payload
        console.log('Proxying request to URL:', url);
        console.log('Payload:', bodyText || 'None');

        // If it's a GET/HEAD request, body should be undefined/null
        const init: RequestInit = {
            method: request.method,
            headers,
            body: (request.method !== 'GET' && request.method !== 'HEAD') ? body : undefined,
            // @ts-ignore - duplexy stuff
            duplex: 'half'
        };

        const response = await fetch(url, init);

        // Provide CORS headers if needed or just pass through
        const newHeaders = new Headers(response.headers);

        // If login is successful, set the cookie
        if (isLogin && response.ok) {
            const data = await response.json();
            // Assuming the token is in data.token or similar. Adjust strict structure as needed.
            // For this example, let's assume the backend returns { token: "..." }
            // If the structure is different, we need to know.
            const authToken = data.token || data.access_token;


            if (authToken) {
                try {
                    const decoded = jwt.decode(authToken);
                    console.log('Decoded Login Token:', decoded);
                } catch (error) {
                    console.error('Failed to decode token:', error);
                }

                const res = NextResponse.json({ message: 'Login successful', success: true, ...data }, { status: 200 });
                res.cookies.set('token', authToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    path: '/',
                    sameSite: 'lax',
                    // maxAge: 60 * 60 * 24 // 1 day
                });
                return res;
            }
        }

        // Return the response as is (streaming)
        return new NextResponse(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: newHeaders,
        });

    } catch (error: any) {
        console.error('Proxy Error:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
