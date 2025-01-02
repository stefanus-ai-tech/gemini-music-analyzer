import React from 'react';
import { Card } from "@/components/ui/card";

interface AnalysisResultsProps {
  analysis: {
    technical_aspects: {
      key_signature: string;
      tonality: string;
      harmonic_structure: string;
    };
    emotional_aspects: {
      overall_emotion: string;
      vocal_delivery?: string;
      mood: string;
      feeling: string;
    };
    lyrics?: string;
  };
}

const AnalysisResults = ({ analysis }: AnalysisResultsProps) => {
  return (
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
  );
};

export default AnalysisResults;