import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import Header from './song-analysis/Header';
import UploadSection from './song-analysis/UploadSection';
import AnalysisResults from './song-analysis/AnalysisResults';

interface AnalysisResult {
  lyrics: string;
  emotional_aspects: {
    overall_emotion: string;
    vocal_delivery?: string;
    mood: string;
    feeling: string;
  };
}

const SongAnalysis = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.type.startsWith('audio/')) {
      setFile(droppedFile);
      setAnalysis(null);
    } else {
      toast({
        title: 'Invalid file type',
        description: 'Please upload an audio file',
        variant: 'destructive',
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setAnalysis(null);
    }
  };

  const clearAnalysis = () => {
    setFile(null);
    setAnalysis(null);
  };

  const analyzeSong = async () => {
    if (!file) return;

    setIsAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      // Call Fastify API endpoint
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/analyze-song`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze song');
      }

      // Access the correct nested properties from the API response
      const { lyrics, emotional_aspects } = data.analysis;

      // Create a new object with the correct structure
      const transformedAnalysis: AnalysisResult = {
        lyrics: lyrics,
        emotional_aspects: {
          overall_emotion: emotional_aspects.overall_emotion,
          mood: emotional_aspects.mood,
          feeling: emotional_aspects.feeling,
          vocal_delivery: emotional_aspects.vocal_delivery,
        },
      };
      setAnalysis(transformedAnalysis);
      toast({
        title: 'Analysis Complete',
        description: 'Your song has been analyzed successfully!',
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: 'Analysis Failed',
        description: 'There was an error analyzing your song',
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1F2C] to-[#6E59A5] p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Header />
        <UploadSection
          onDrop={handleDrop}
          onFileChange={handleFileChange}
          file={file}
        />

        {file && (
          <div className="text-center animate-fade-in space-x-4">
            <Button
              onClick={analyzeSong}
              disabled={isAnalyzing}
              className="bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] hover:from-[#8B5CF6] hover:to-[#6E59A5] 
                       text-white font-semibold px-8 py-6 text-lg transform transition-all duration-300 
                       hover:scale-105 hover:shadow-lg hover:shadow-[#9b87f5]/20">
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Analyze Song'
              )}
            </Button>
            <Button
              onClick={clearAnalysis}
              variant="outline"
              className="border-[#9b87f5] text-[#E5DEFF] hover:bg-[#1A1F2C]/80 
                       transform transition-all duration-300 hover:scale-105">
              Clear
            </Button>
          </div>
        )}

        {analysis && <AnalysisResults analysis={analysis} />}
      </div>
    </div>
  );
};

export default SongAnalysis;
