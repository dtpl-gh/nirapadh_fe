
'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import { ButtonProps, buttonVariants } from '@/components/ui/button';

interface PaginationProps extends React.HTMLAttributes<HTMLDivElement> {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    showFirstLast?: boolean;
}

const Pagination = ({
    className,
    currentPage,
    totalPages,
    onPageChange,
    showFirstLast = true,
    ...props
}: PaginationProps) => {
    return (
        <div className={cn('flex items-center justify-center space-x-2', className)} {...props}>
            <div className="flex items-center space-x-2">
                {showFirstLast && (
                    <button
                        className={cn(buttonVariants({ variant: 'outline', size: 'icon' }), 'h-8 w-8')}
                        onClick={() => onPageChange(0)}
                        disabled={currentPage === 0}
                        aria-label="Go to first page"
                    >
                        <ChevronsLeft className="h-4 w-4" />
                    </button>
                )}
                <button
                    className={cn(buttonVariants({ variant: 'outline', size: 'icon' }), 'h-8 w-8')}
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                    aria-label="Go to previous page"
                >
                    <ChevronLeft className="h-4 w-4" />
                </button>

                <div className="flex items-center justify-center text-sm font-medium">
                    Page {currentPage + 1} of {totalPages}
                </div>

                <button
                    className={cn(buttonVariants({ variant: 'outline', size: 'icon' }), 'h-8 w-8')}
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages - 1}
                    aria-label="Go to next page"
                >
                    <ChevronRight className="h-4 w-4" />
                </button>
                {showFirstLast && (
                    <button
                        className={cn(buttonVariants({ variant: 'outline', size: 'icon' }), 'h-8 w-8')}
                        onClick={() => onPageChange(totalPages - 1)}
                        disabled={currentPage >= totalPages - 1}
                        aria-label="Go to last page"
                    >
                        <ChevronsRight className="h-4 w-4" />
                    </button>
                )}
            </div>
        </div>
    );
};

export { Pagination };
