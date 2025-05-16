import React, { useState } from "react";
import FileUploadForm from "@/components/FileUploadForm";
import ResultDisplay from "@/components/ResultDisplay";
import { processFile, OcrResult } from "@/services/ocrService";
import { toast } from "sonner";

const Index = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<OcrResult | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (file: File, number: string) => {
    setIsProcessing(true);
    setResult(null);
    setFile(file);
    try {
      const ocrResult = await processFile(file, number);
      setResult(ocrResult);

      // Show toast notification based on result
      if (ocrResult.success) {
        toast.success("Number found in the document!");
      } else {
        toast.error("Number not found in the document.");
      }
    } catch (error) {
      console.error("Error processing file:", error);
      toast.error("An error occurred while processing the file.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container max-w-3xl mx-auto py-8 px-4">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            OCR Document Verification
          </h1>
          <p className="text-gray-600 mt-2">
            Upload a document and verify if a specific number appears in it
          </p>
        </header>

        <div className="space-y-6">
          <FileUploadForm
            onSubmit={handleSubmit}
            isProcessing={isProcessing}
            onFileChange={(file) => {
              setFile(file);
              setResult(null);
            }}
          />
          <ResultDisplay result={result} isLoading={isProcessing} />
        </div>
      </div>
      {result && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            width: "100%",
            marginTop: "2rem",
          }}
        >
          <div
            style={{
              width: "50%",
              wordBreak: "break-word",
              background: "#fff",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              padding: "1rem",
              minHeight: 0,
            }}
          >
            <pre
              style={{
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                margin: 0,
              }}
            >
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        </div>
      )}
      {file && (
        <div style={{ padding: '200px', marginTop: "1rem", textAlign: "center" }}>
          <img
            src={URL.createObjectURL(file)}
            alt="Uploaded document"
            style={{
              maxWidth: "100%",
              maxHeight: 2000,
              borderRadius: 10,
              border: "1px solid #eaeaea",
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Index;
