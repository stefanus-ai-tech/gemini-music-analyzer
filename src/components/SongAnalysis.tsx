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
      // Here we would integrate with Gemini API
      // For now, showing mock data
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
    <div className="min-h-screen p-8 bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-music-primary">Song Analysis</h1>
          <p className="text-gray-600">Upload your song and get detailed analysis powered by Gemini AI</p>
        </div>

        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-music-accent rounded-lg p-8 text-center transition-colors hover:border-music-primary"
        >
          <div className="space-y-4">
            <Music2 className="mx-auto h-12 w-12 text-music-primary animate-pulse-subtle" />
            <div className="space-y-2">
              <p className="text-gray-600">Drag and drop your audio file here, or</p>
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button variant="outline" className="bg-white">
                  <Upload className="mr-2 h-4 w-4" />
                  Choose File
                </Button>
              </label>
            </div>
            {file && (
              <p className="text-sm text-gray-500">
                Selected: {file.name}
              </p>
            )}
          </div>
        </div>

        {file && (
          <div className="text-center">
            <Button
              onClick={analyzeSong}
              disabled={isAnalyzing}
              className="bg-music-primary hover:bg-music-secondary text-white"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Analyze Song'
              )}
            </Button>
          </div>
        )}

        {analysis && (
          <div className="space-y-6 animate-in fade-in-50">
            <Card className="p-6 bg-white/50 backdrop-blur">
              <h2 className="text-2xl font-semibold text-music-primary mb-4">Technical Analysis</h2>
              <div className="space-y-2">
                <p><span className="font-medium">Key Signature:</span> {analysis.technical_aspects.key_signature}</p>
                <p><span className="font-medium">Tonality:</span> {analysis.technical_aspects.tonality}</p>
                <p><span className="font-medium">Harmonic Structure:</span> {analysis.technical_aspects.harmonic_structure}</p>
              </div>
            </Card>

            <Card className="p-6 bg-white/50 backdrop-blur">
              <h2 className="text-2xl font-semibold text-music-primary mb-4">Emotional Analysis</h2>
              <div className="space-y-2">
                <p><span className="font-medium">Overall Emotion:</span> {analysis.emotional_aspects.overall_emotion}</p>
                {analysis.emotional_aspects.vocal_delivery && (
                  <p><span className="font-medium">Vocal Delivery:</span> {analysis.emotional_aspects.vocal_delivery}</p>
                )}
                <p><span className="font-medium">Mood:</span> {analysis.emotional_aspects.mood}</p>
                <p><span className="font-medium">Feeling:</span> {analysis.emotional_aspects.feeling}</p>
              </div>
            </Card>

            {analysis.lyrics && (
              <Card className="p-6 bg-white/50 backdrop-blur">
                <h2 className="text-2xl font-semibold text-music-primary mb-4">Lyrics</h2>
                <pre className="whitespace-pre-wrap text-gray-700">{analysis.lyrics}</pre>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SongAnalysis;