"use client";

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Upload, 
  FileText, 
  File, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Settings,
  Eye,
  Save
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { MemoryService } from '@/services/memory.service';
import { apiClient } from '@/lib/api-client';
import type { DocumentChunk, ProcessingStats } from 'persistq-sdk';

interface DocumentUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (chunks: number) => void;
}

interface ProcessingOptions {
  chunkSize: number;
  chunkOverlap: number;
  processingMethod: 'recursive' | 'semantic' | 'fixed';
  project: string;
}

export function DocumentUploadModal({ open, onOpenChange, onSuccess }: DocumentUploadModalProps) {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [chunks, setChunks] = useState<DocumentChunk[]>([]);
  const [stats, setStats] = useState<ProcessingStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('upload');
  const [options, setOptions] = useState<ProcessingOptions>({
    chunkSize: 2000,
    chunkOverlap: 200,
    processingMethod: 'recursive',
    project: '',
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const uploadedFile = acceptedFiles[0];
    if (uploadedFile) {
      // Validate file type
      const fileType = uploadedFile.name.toLowerCase().split('.').pop();
      if (!fileType || !['pdf', 'docx'].includes(fileType)) {
        toast({
          title: "Invalid file type",
          description: "Only PDF and DOCX files are supported.",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (10MB)
      if (uploadedFile.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Maximum file size is 10MB.",
          variant: "destructive",
        });
        return;
      }

      setFile(uploadedFile);
      setError(null);
      setChunks([]);
      setStats(null);
      setActiveTab('configure');
    }
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    multiple: false,
    disabled: uploading || processing,
  });

  const handleProcess = async () => {
    if (!file) return;

    setUploading(true);
    setProcessing(true);
    setProgress(0);
    setError(null);

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const response = await apiClient.processDocument({
        file: file,
        chunkSize: options.chunkSize,
        chunkOverlap: options.chunkOverlap,
        processingMethod: options.processingMethod,
        project: options.project || undefined,
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (response.error) {
        throw new Error(response.error || 'Failed to process document');
      }

      setChunks(response.chunks);
      setStats(response.stats);
      setActiveTab('preview');

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process document';
      setError(errorMessage);
      toast({
        title: "Processing failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setProcessing(false);
      setProgress(0);
    }
  };

  const handleSave = async () => {
    if (chunks.length === 0) return;

    try {
      let savedCount = 0;
      
    for (const chunk of chunks) {
      const success = await MemoryService.create({
        content: chunk.content,
        project: options.project || undefined,
        metadata: {
          ...chunk.metadata,
          tags: ['document', chunk.metadata.fileType],
        },
      });
      
      if (success) {
        savedCount++;
      }
    }

      if (savedCount === chunks.length) {
        toast({
          title: "Success!",
          description: `Saved ${savedCount} memories from ${file?.name}`,
        });
        onSuccess?.(savedCount);
        onOpenChange(false);
        resetForm();
      } else {
        throw new Error(`Only ${savedCount} out of ${chunks.length} chunks were saved`);
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save memories';
      toast({
        title: "Save failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFile(null);
    setChunks([]);
    setStats(null);
    setError(null);
    setActiveTab('upload');
    setProgress(0);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatProcessingTime = (ms: number) => {
    return (ms / 1000).toFixed(2) + 's';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-screen-2xl h-[85vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Document
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 min-h-0 px-6 overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="configure" disabled={!file}>
              Configure
            </TabsTrigger>
            <TabsTrigger value="preview" disabled={chunks.length === 0}>
              Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-4 space-y-4">
            <div className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                      isDragActive
                        ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-950/20'
                        : 'border-gray-300 dark:border-gray-600 hover:border-cyan-400'
                    } ${(uploading || processing) ? 'pointer-events-none opacity-50' : ''}`}
                  >
                    <input {...getInputProps()} />
                    <div className="space-y-4">
                      <div className="mx-auto w-12 h-12 bg-cyan-100 dark:bg-cyan-900 rounded-full flex items-center justify-center">
                        <Upload className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
                      </div>
                      <div>
                        <p className="text-lg font-medium">
                          {isDragActive ? 'Drop the file here' : 'Drop your document here'}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          or click to browse
                        </p>
                      </div>
                      <div className="text-xs text-gray-400">
                        Supports PDF and DOCX files up to 10MB
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {file && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <File className="h-8 w-8 text-blue-500" />
                      <div className="flex-1">
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                      </div>
                      <Badge variant="secondary">
                        {file.name.toLowerCase().endsWith('.pdf') ? 'PDF' : 'DOCX'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="configure" className="mt-4 space-y-4">
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Processing Options
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="chunkSize">Chunk Size</Label>
                      <Input
                        id="chunkSize"
                        type="number"
                        min="100"
                        max="5000"
                        value={options.chunkSize}
                        onChange={(e) => setOptions(prev => ({ ...prev, chunkSize: parseInt(e.target.value) || 2000 }))}
                      />
                      <p className="text-xs text-gray-500">Characters per chunk (100-5000)</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="chunkOverlap">Chunk Overlap</Label>
                      <Input
                        id="chunkOverlap"
                        type="number"
                        min="0"
                        max="500"
                        value={options.chunkOverlap}
                        onChange={(e) => setOptions(prev => ({ ...prev, chunkOverlap: parseInt(e.target.value) || 200 }))}
                      />
                      <p className="text-xs text-gray-500">Overlap between chunks (0-500)</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="processingMethod">Processing Method</Label>
                      <Select
                        value={options.processingMethod}
                        onValueChange={(value: 'recursive' | 'semantic' | 'fixed') => 
                          setOptions(prev => ({ ...prev, processingMethod: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="recursive">Recursive (Recommended)</SelectItem>
                          <SelectItem value="fixed">Fixed Size</SelectItem>
                          <SelectItem value="semantic" disabled>Semantic (Coming Soon)</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-500">How to split the document</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="project">Project (Optional)</Label>
                      <Input
                        id="project"
                        placeholder="Enter project name"
                        value={options.project}
                        onChange={(e) => setOptions(prev => ({ ...prev, project: e.target.value }))}
                      />
                      <p className="text-xs text-gray-500">Group memories under a project</p>
                    </div>
                  </div>

                  <div className="flex justify-end mt-6">
                    <Button 
                      onClick={handleProcess} 
                      disabled={processing || !file}
                      className="min-w-32"
                    >
                      {processing ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <FileText className="h-4 w-4 mr-2" />
                          Process Document
                        </>
                      )}
                    </Button>
                  </div>

                  {processing && (
                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Processing document...</span>
                        <span>{progress}%</span>
                      </div>
                      <Progress value={progress} className="w-full" />
                    </div>
                  )}
                </CardContent>
              </Card>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>
          </TabsContent>

          <TabsContent value="preview" className="mt-4 space-y-4">
            <div className="space-y-4">
              {stats && (
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-3">Processing Results</h3>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Chunks</p>
                        <p className="font-medium">{stats.totalChunks}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Characters</p>
                        <p className="font-medium">{stats.totalCharacters.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Processing Time</p>
                        <p className="font-medium">{formatProcessingTime(stats.processingTime)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">File Type</p>
                        <p className="font-medium uppercase">{stats.fileType}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Preview Chunks
                    </h3>
                    <Badge variant="outline">{chunks.length} chunks</Badge>
                  </div>
                  
                  <div className="space-y-4">
                    {chunks.map((chunk, index) => (
                      <div key={index} className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="secondary" className="text-xs">
                            Chunk {chunk.metadata.chunkIndex + 1} of {chunk.metadata.totalChunks}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {chunk.content.length} characters
                          </span>
                          {chunk.metadata.project && (
                            <Badge variant="outline" className="text-xs">
                              {chunk.metadata.project}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm whitespace-pre-wrap">{chunk.content}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

            </div>
          </TabsContent>
        </Tabs>
        </div>

        {/* Fixed action buttons at the bottom */}
        {activeTab === 'preview' && (
          <div className="flex justify-end gap-2 pt-4 pb-6 px-6 border-t bg-background">
            <Button variant="outline" onClick={() => setActiveTab('configure')}>
              Back
            </Button>
            <Button onClick={handleSave} className="min-w-32">
              <Save className="h-4 w-4 mr-2" />
              Save to Memories
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}