import React from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';

interface EmptyStateProps {
  onUploadCSV: (file: File) => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onUploadCSV }) => {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUploadCSV(file);
    }
  };

  return (
    <div className="flex items-center justify-center h-full p-8">
      <div className="max-w-lg w-full bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <FileText className="w-8 h-8 text-blue-600" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Încarcă date pentru început
        </h2>
        
        <p className="text-gray-600 mb-6">
          Pentru a utiliza dashboard-ul, încarcă un fișier CSV cu datele despre angajații IT din județul României (2008-2024).
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
          <div className="flex gap-2">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Structura așteptată CSV:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Coloana <code className="bg-blue-100 px-1 rounded">Judet</code>: Numele județului</li>
                <li>Coloane <code className="bg-blue-100 px-1 rounded">2008-2024</code>: Angajați IT (mii)</li>
                <li>Coloana <code className="bg-blue-100 px-1 rounded">Populatie</code>: Populație rezidentă</li>
              </ul>
            </div>
          </div>
        </div>

        <label className="cursor-pointer">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
          />
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg">
            <Upload className="w-5 h-5" />
            <span className="font-medium">Selectează fișier CSV</span>
          </div>
        </label>

        <p className="text-xs text-gray-500 mt-4">
          Sau contactează API-ul INS pentru date în timp real (vezi documentația)
        </p>
      </div>
    </div>
  );
};

export default EmptyState;
