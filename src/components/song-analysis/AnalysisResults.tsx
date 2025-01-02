import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface AnalysisResultsProps {
  analysis: {
    emotional_aspects: {
      overall_emotion: string;
      vocal_delivery?: string;
      mood: string;
      feeling: string;
    };
  };
}

const AnalysisResults = ({ analysis }: AnalysisResultsProps) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-[#D6BCFA] to-[#8B5CF6] bg-clip-text text-transparent">
            Emotional Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2 transition-colors duration-200 hover:bg-card/50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-[#E5DEFF]">
              Overall Emotion
            </h3>
            <p className="text-muted-foreground">
              {' '}
              {analysis.emotional_aspects.overall_emotion}
            </p>
          </div>
          <div className="space-y-2 transition-colors duration-200 hover:bg-card/50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-[#E5DEFF]">Mood</h3>
            <p className="text-muted-foreground">
              {analysis.emotional_aspects.mood}
            </p>
          </div>
          <div className="space-y-2 transition-colors duration-200 hover:bg-card/50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-[#E5DEFF]">Feeling</h3>
            <p className="text-muted-foreground">
              {analysis.emotional_aspects.feeling}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalysisResults;
