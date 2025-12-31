'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function Unauthorized() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-50 to-white">
      <Card className="max-w-md p-8 text-center rounded-lg shadow-lg">
        <div className="mb-6">
          <h1 className="text-6xl font-bold text-red-600">401</h1>
          <h2 className="text-2xl font-bold text-gray-800 mt-4">Unauthorized</h2>
        </div>

        <p className="text-gray-600 mb-6">
          You don&apos;t have permission to access this resource. Please log in to continue.
        </p>

        <div className="flex gap-4">
          <Link href="/login" className="flex-1">
            <Button className="w-full">Login</Button>
          </Link>
          <Link href="/" className="flex-1">
            <Button variant="outline" className="w-full">
              Back Home
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}

