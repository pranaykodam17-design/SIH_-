import React from 'react';
import { Outlet, Link, useLocation, useParams } from 'react-router-dom';
import { Upload, Cpu, Layers, BarChart2, SplitSquareVertical, Info, Satellite } from 'lucide-react';
import { useSrmStore } from '../store/useSrmStore';
import { Badge } from '../components/ui/Badge';

export const AppLayout: React.FC = () => {
  const location = useLocation();
  const { jobId } = useParams<{ jobId?: string }>();
  const { activeJob } = useSrmStore();

  const currentJobId = jobId || activeJob?.jobId || 'SRM-NTRO-DEMO-01';

  const subNavItems = [
    { label: 'Upload Console', path: '/app/upload', icon: Upload },
    { label: 'Processing', path: `/app/process/${currentJobId}`, icon: Cpu },
    { label: 'Results & GIS', path: `/app/results/${currentJobId}`, icon: Layers },
    { label: 'Before / After', path: `/app/compare/${currentJobId}`, icon: SplitSquareVertical },
    { label: 'Validation Suite', path: `/app/validation/${currentJobId}`, icon: BarChart2 },
    { label: 'System Architecture', path: '/app/about', icon: Info },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      
      {/* Sub-Header Mission Navigation Bar */}
      <div className="border-b border-blue-100 bg-white/80 backdrop-blur-sm sticky top-16 z-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between overflow-x-auto py-2.5 gap-4">
          
          <div className="flex items-center gap-1 sm:gap-2">
            {subNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all shrink-0 ${
                    isActive
                      ? 'bg-[#1677FF]/20 text-cyan-700 border border-cyan-200 shadow-sm'
                      : 'text-[#526A82] hover:text-blue-700 hover:bg-white'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-2 font-mono text-xs shrink-0">
            <span className="text-[#6B7F95]">ACTIVE TARGET:</span>
            <span className="text-cyan-700 font-bold">{currentJobId}</span>
          </div>

        </div>
      </div>

      {/* Main Workspace Area */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>

    </div>
  );
};
