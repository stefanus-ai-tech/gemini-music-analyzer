import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Music2, Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface AnalysisResult {
  technical_aspects: {
    key_signature: string;
    tonality: string;
    harmonic_structure: string;
  };
  emotional_aspects: {
    overall_emotion: string;
    vocal_delivery?: string;
    instrumentation?: string;
    mood: string;
    feeling: string;
  };
  lyrics?: string;
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
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload an audio file",
        variant: "destructive",
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const analyzeSong = async () => {
    if (!file) return;
    
    setIsAnalyzing(true);
    try {
      // Mock data for demonstration
      const mockAnalysis: AnalysisResult = {
        technical_aspects: {
          key_signature: "Major",
          tonality: "Bright and positive",
          harmonic_structure: "Simple and consonant",
        },
        emotional_aspects: {
          overall_emotion: "Tender and sweet",
          vocal_delivery: "Delicate and vulnerable",
          mood: "Intimate and gentle",
          feeling: "Warm with a touch of melancholy",
        },
        lyrics: "Sample lyrics would appear here...",
      };
      
      setAnalysis(mockAnalysis);
      toast({
        title: "Analysis Complete",
        description: "Your song has been analyzed successfully!",
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing your song",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1F2C] to-[#6E59A5] p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#D6BCFA] to-[#8B5CF6]">
            Music Analysis
          </h1>
          <p className="text-[#E5DEFF] text-lg md:text-xl">
            Upload your song and let AI analyze its essence
          </p>
        </div>

        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-[#9b87f5]/30 rounded-xl p-8 text-center transition-all duration-300 
                     hover:border-[#9b87f5] hover:shadow-lg hover:shadow-[#9b87f5]/20 bg-[#1A1F2C]/40 backdrop-blur-sm
                     transform hover:scale-[1.02] animate-fade-in"
        >
          <div className="space-y-6">
            <Music2 className="mx-auto h-16 w-16 text-[#9b87f5] animate-pulse-subtle" />
            <div className="space-y-4">
              <p className="text-[#E5DEFF] text-lg">Drag and drop your audio file here, or</p>
              <label className="cursor-pointer inline-block">
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button 
                  variant="outline" 
                  className="bg-[#1A1F2C]/60 border-[#9b87f5] text-[#E5DEFF] hover:bg-[#1A1F2C]/80 
                           transform transition-all duration-300 hover:scale-105"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Choose File
                </Button>
              </label>
            </div>
            {file && (
              <p className="text-[#C8C8C9] animate-fade-in">
                Selected: {file.name}
              </p>
            )}
          </div>
        </div>

        {file && (
          <div className="text-center animate-fade-in">
            <Button
              onClick={analyzeSong}
              disabled={isAnalyzing}
              className="bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] hover:from-[#8B5CF6] hover:to-[#6E59A5] 
                       text-white font-semibold px-8 py-6 text-lg transform transition-all duration-300 
                       hover:scale-105 hover:shadow-lg hover:shadow-[#9b87f5]/20"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Analyze Song'
              )}
            </Button>
          </div>
        )}

        {analysis && (
          <div className="space-y-6 animate-fade-in">
            <Card className="p-6 bg-[#1A1F2C]/40 backdrop-blur-sm border-[#9b87f5]/30 
                           hover:border-[#9b87f5] transition-all duration-300 hover:shadow-lg 
                           hover:shadow-[#9b87f5]/20">
              <h2 className="text-2xl font-semibold bg-clip-text text-transparent 
                           bg-gradient-to-r from-[#D6BCFA] to-[#8B5CF6] mb-4">
                Technical Analysis
              </h2>
              <div className="space-y-3 text-[#E5DEFF]">
                <p><span className="font-medium text-[#9b87f5]">Key Signature:</span> {analysis.technical_aspects.key_signature}</p>
                <p><span className="font-medium text-[#9b87f5]">Tonality:</span> {analysis.technical_aspects.tonality}</p>
                <p><span className="font-medium text-[#9b87f5]">Harmonic Structure:</span> {analysis.technical_aspects.harmonic_structure}</p>
              </div>
            </Card>

            <Card className="p-6 bg-[#1A1F2C]/40 backdrop-blur-sm border-[#9b87f5]/30 
                           hover:border-[#9b87f5] transition-all duration-300 hover:shadow-lg 
                           hover:shadow-[#9b87f5]/20">
              <h2 className="text-2xl font-semibold bg-clip-text text-transparent 
                           bg-gradient-to-r from-[#D6BCFA] to-[#8B5CF6] mb-4">
                Emotional Analysis
              </h2>
              <div className="space-y-3 text-[#E5DEFF]">
                <p><span className="font-medium text-[#9b87f5]">Overall Emotion:</span> {analysis.emotional_aspects.overall_emotion}</p>
                {analysis.emotional_aspects.vocal_delivery && (
                  <p><span className="font-medium text-[#9b87f5]">Vocal Delivery:</span> {analysis.emotional_aspects.vocal_delivery}</p>
                )}
                <p><span className="font-medium text-[#9b87f5]">Mood:</span> {analysis.emotional_aspects.mood}</p>
                <p><span className="font-medium text-[#9b87f5]">Feeling:</span> {analysis.emotional_aspects.feeling}</p>
              </div>
            </Card>

            {analysis.lyrics && (
              <Card className="p-6 bg-[#1A1F2C]/40 backdrop-blur-sm border-[#9b87f5]/30 
                             hover:border-[#9b87f5] transition-all duration-300 hover:shadow-lg 
                             hover:shadow-[#9b87f5]/20">
                <h2 className="text-2xl font-semibold bg-clip-text text-transparent 
                             bg-gradient-to-r from-[#D6BCFA] to-[#8B5CF6] mb-4">
                  Lyrics
                </h2>
                <pre className="whitespace-pre-wrap text-[#E5DEFF]">{analysis.lyrics}</pre>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SongAnalysis;