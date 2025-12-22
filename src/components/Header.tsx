import React from 'react';
import { BarChart3, Download, RefreshCw } from 'lucide-react';

interface HeaderProps {
  onUploadCSV: (file: File) => void;
  onExportData: () => void;
  onRefreshData: () => void;
  isLoading?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  onExportData,
  onRefreshData,
  isLoading = false,
}) => {

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo & Titlu */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Dashboard IT&C România
              </h1>
              <p className="text-sm text-gray-600">
                Analiza disparităților regionale 2008-2024
              </p>
            </div>
          </div>

          {/* Acțiuni */}
          <div className="flex items-center gap-3">
            {/* Export */}
            <button
              onClick={onExportData}
              className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span className="text-sm font-medium">Export</span>
            </button>

            {/* Refresh */}
            <button
              onClick={onRefreshData}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="text-sm font-medium">Actualizează</span>
            </button>
          </div>
        </div>
      </div>

      {/* Indicator loading */}
      {isLoading && (
        <div className="h-1 bg-blue-600 animate-pulse"></div>
      )}
    </header>
  );
};

export default Header;
