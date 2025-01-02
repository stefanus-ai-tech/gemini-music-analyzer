import React from 'react';
import { Button } from '@/components/ui/button';
import { Music2, Upload } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface UploadSectionProps {
  onDrop: (e: React.DragEvent) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  file: File | null;
}

const UploadSection = ({ onDrop, onFileChange, file }: UploadSectionProps) => {
  return (
    <div
      onDrop={onDrop}
      onDragOver={(e) => e.preventDefault()}
      className="border-2 border-dashed border-[#9b87f5]/30 rounded-xl p-8 text-center transition-all duration-300 
                 hover:border-[#9b87f5] hover:shadow-lg hover:shadow-[#9b87f5]/20 bg-[#1A1F2C]/40 backdrop-blur-sm
                 transform hover:scale-[1.02] animate-fade-in">
      <div className="space-y-6">
        <Music2 className="mx-auto h-16 w-16 text-[#9b87f5] animate-pulse-subtle" />
        <div className="space-y-4">
          <p className="text-[#E5DEFF] text-lg">
            Drag and drop your audio file here, or
          </p>
          <div className="inline-block">
            <Button
              variant="outline"
              onClick={() => document.getElementById('file-upload')?.click()}
              className="bg-[#1A1F2C]/60 border-[#9b87f5] text-[#E5DEFF] hover:bg-[#1A1F2C]/80 
                       transform transition-all duration-300 hover:scale-105">
              <Upload className="mr-2 h-4 w-4" />
              Choose File
            </Button>
            <input
              id="file-upload"
              type="file"
              accept="audio/*"
              onChange={onFileChange}
              className="hidden"
            />
          </div>
        </div>
        {file && (
          <p className="text-[#C8C8C9] animate-fade-in">
            Selected: {file.name}
          </p>
        )}
      </div>
    </div>
  );
};

export default UploadSection;
