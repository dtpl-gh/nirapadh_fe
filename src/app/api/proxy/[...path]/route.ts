import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: any }) {
    const resolvedParams = await params;
    return handleRequest(request, resolvedParams.path);
}

export async function POST(request: NextRequest, { params }: { params: any }) {
    const resolvedParams = await params;
    return handleRequest(request, resolvedParams.path);
}

export async function PUT(request: NextRequest, { params }: { params: any }) {
    const resolvedParams = await params;
    return handleRequest(request, resolvedParams.path);
}

export async function DELETE(request: NextRequest, { params }: { params: any }) {
    const resolvedParams = await params;
    return handleRequest(request, resolvedParams.path);
}

export async function PATCH(request: NextRequest, { params }: { params: any }) {
    const resolvedParams = await params;
    return handleRequest(request, resolvedParams.path);
}

async function handleRequest(request: NextRequest, pathSegments: string[]) {
    const backendUrl = process.env.BACKEND_URL || 'http://host.docker.internal:8000';
    const apiKey = process.env.API_KEY || '';

    const path = pathSegments.join('/');
    const searchParams = request.nextUrl.search;
    const targetUrl = `${backendUrl}/${path}${searchParams}`;

    const headers = new Headers(request.headers);

    // Inject the X-API-Key header
    if (apiKey) {
        headers.set('X-API-Key', apiKey);
    }

    // Next.js headers include host which might cause issues with some backends if not matching
    headers.delete('host');

    const method = request.method;
    const body = ['GET', 'HEAD'].includes(method) ? undefined : await request.blob();

    try {
        const response = await fetch(targetUrl, {
            method,
            headers,
            body,
            // @ts-ignore - duplex is required for streaming bodies in some versions of node
            duplex: body ? 'half' : undefined,
        });

        const responseData = await response.blob();

        return new NextResponse(responseData, {
            status: response.status,
            headers: response.headers,
        });
    } catch (error) {
        console.error('Proxy error:', error);
        return NextResponse.json({ error: 'Failed to proxy request' }, { status: 500 });
    }
}
