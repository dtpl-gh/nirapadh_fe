import React, { ReactNode } from 'react';

import {
  ResizablePanel,
  ResizablePanelGroup,
  ResizableHandle,
} from '../../components/ui/resizable';

import Sidebar from '../../components/Sidebar';
import Headeradmin from '../../components/Headeradmin';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Headeradmin />
      <div className="flex flex-1">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel
            defaultSize={15}
            className="min-h-screen bg-secondary border-r border-gray-200"
          >
            <Sidebar />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={85}>{children}</ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
