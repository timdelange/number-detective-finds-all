
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckIcon, XIcon } from 'lucide-react';
import { OcrResult } from '../services/ocrService';

interface ResultDisplayProps {
  result: OcrResult | null;
  isLoading: boolean;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="w-full mt-6">
        <CardHeader>
          <CardTitle className="text-center">Processing Document</CardTitle>
          <CardDescription className="text-center">
            Extracting text and searching for the number...
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center pb-6">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </CardContent>
      </Card>
    );
  }

  if (!result) return null;

  return (
    <Card className={`w-full mt-6 ${result.success ? 'border-green-500' : 'border-red-500'}`}>
      <CardHeader>
        <CardTitle className={`text-center ${result.success ? 'text-green-600' : 'text-red-600'}`}>
          {result.success ? (
            <div className="flex items-center justify-center gap-2">
              <CheckIcon className="h-6 w-6" />
              <span>Successfully Confirmed</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <XIcon className="h-6 w-6" />
              <span>Cannot Confirm</span>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground">
          Processing completed in {result.processingTime.toFixed(2)} seconds
        </div>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        {result.success 
          ? "The specified number was found in the document." 
          : "The specified number was not found in the document."}
      </CardFooter>
    </Card>
  );
};

export default ResultDisplay;
