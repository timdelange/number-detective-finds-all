
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { UploadIcon, SearchIcon } from 'lucide-react';
import { on } from 'events';

interface FileUploadFormProps {
  onSubmit: (file: File, number: string) => void;
  onFileChange?: (file: File | null) => void;
  isProcessing: boolean;
}

const FileUploadForm: React.FC<FileUploadFormProps> = ({ onSubmit, onFileChange, isProcessing }) => {
  const [file, setFile] = useState<File | null>(null);
  const [number, setNumber] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const fileType = selectedFile.type;
      
      // Check if file type is supported
      if (
        fileType === 'application/pdf' || 
        fileType === 'image/jpeg' || 
        fileType === 'image/jpg' || 
        fileType === 'image/png'
      ) {
        setFile(selectedFile);
        onFileChange && onFileChange(selectedFile);
      } else {
        toast.error('Unsupported file type. Please upload a PDF, JPG, or PNG file.');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNumber(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast.error('Please select a file to upload.');
      return;
    }
    
    if (!number) {
      toast.error('Please enter a number to search for.');
      return;
    }
    
    onSubmit(file, number);
  };

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Card className="w-full">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Document Verification</CardTitle>
          <CardDescription>
            Upload a document and enter a number to verify if it appears in the text.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="file">Upload Document (PDF, JPG, PNG)</Label>
            <div className="flex items-center gap-2">
              <Input 
                ref={fileInputRef}
                id="file" 
                type="file" 
                accept=".pdf,.jpg,.jpeg,.png" 
                onChange={handleFileChange}
                className="hidden"
              />
              <Button 
                type="button" 
                variant="outline" 
                className="w-full h-24 flex flex-col items-center justify-center border-dashed gap-2"
                onClick={handleBrowseClick}
              >
                <UploadIcon className="h-6 w-6" />
                <span>{file ? file.name : 'Click to browse files'}</span>
              </Button>
            </div>
            {file && (
              <p className="text-xs text-muted-foreground mt-1">
                File size: {(file.size / 1024).toFixed(2)} KB
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="number">Number to Find</Label>
            <Input 
              id="number" 
              placeholder="Enter the number to search for" 
              value={number} 
              onChange={handleNumberChange}
            />
          </div>
        </CardContent>
        
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isProcessing || !file || !number}
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                <span>Processing...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <SearchIcon className="h-4 w-4" />
                <span>Verify Document</span>
              </div>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default FileUploadForm;
