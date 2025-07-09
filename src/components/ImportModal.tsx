import React, { useState, useCallback } from 'react';
import { X, Upload, FileText, AlertCircle } from 'lucide-react';
import mammoth from 'mammoth';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (content: string) => void;
}

const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose, onImport }) => {
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sanitize HTML content to prevent XSS attacks
  const sanitizeHtml = (html: string): string => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    // Remove dangerous elements and attributes
    const dangerousElements = ['script', 'object', 'embed', 'link', 'meta', 'style'];
    const dangerousAttributes = ['onclick', 'onload', 'onerror', 'onmouseover', 'onfocus', 'onblur'];

    // Remove dangerous elements
    dangerousElements.forEach(tagName => {
      const elements = tempDiv.querySelectorAll(tagName);
      elements.forEach(el => el.remove());
    });

    // Remove dangerous attributes from all elements
    const allElements = tempDiv.querySelectorAll('*');
    allElements.forEach(el => {
      dangerousAttributes.forEach(attr => {
        if (el.hasAttribute(attr)) {
          el.removeAttribute(attr);
        }
      });
      
      // Remove javascript: protocols
      ['href', 'src'].forEach(attr => {
        const value = el.getAttribute(attr);
        if (value && value.toLowerCase().startsWith('javascript:')) {
          el.removeAttribute(attr);
        }
      });
    });

    return tempDiv.innerHTML;
  };

  // Convert Word content to clean HTML using mammoth.js
  const processDocxFile = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.convertToHtml({ arrayBuffer });
    
    if (result.messages.length > 0) {
      console.warn('Mammoth conversion warnings:', result.messages);
    }
    
    return result.value;
  };

  // Convert Word HTML content to clean HTML
  const processWordContent = (content: string): string => {
    // Remove Word-specific XML and metadata
    let cleanContent = content
      .replace(/<xml[^>]*>[\s\S]*?<\/xml>/gi, '')
      .replace(/<meta[^>]*>/gi, '')
      .replace(/<link[^>]*>/gi, '')
      .replace(/<!--\[if[^>]*>[\s\S]*?<!\[endif\]-->/gi, '')
      .replace(/mso-[^;:]+:[^;]+;?/gi, '')
      .replace(/style="[^"]*"/gi, '');

    // Convert Word list formatting to proper HTML lists
    cleanContent = cleanContent.replace(
      /<p[^>]*>(\s*<span[^>]*>)?[·•▪▫◦‣⁃]\s*(.*?)<\/p>/gi,
      '<li>$2</li>'
    );

    // Wrap consecutive list items in ul tags
    cleanContent = cleanContent.replace(
      /(<li>.*?<\/li>)(\s*<li>.*?<\/li>)*/gi,
      '<ul>$&</ul>'
    );

    // Convert numbered lists
    cleanContent = cleanContent.replace(
      /<p[^>]*>(\s*<span[^>]*>)?\d+\.\s*(.*?)<\/p>/gi,
      '<li>$2</li>'
    );

    return cleanContent;
  };

  const handleFile = useCallback(async (file: File) => {
    setLoading(true);
    setError(null);

    try {
      let processedContent = '';

      if (file.type.includes('html') || file.name.endsWith('.html')) {
        const content = await file.text();
        processedContent = sanitizeHtml(content);
      } else if (file.type.includes('wordprocessingml') || file.name.endsWith('.docx')) {
        // Use mammoth.js for proper DOCX conversion
        const htmlContent = await processDocxFile(file);
        processedContent = sanitizeHtml(htmlContent);
      } else if (file.type.includes('word') || file.name.endsWith('.doc')) {
        // For older .doc files, try to read as text and convert
        const content = await file.text();
        processedContent = sanitizeHtml(processWordContent(content));
      } else if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        // Convert plain text to HTML paragraphs
        const content = await file.text();
        processedContent = content
          .split('\n\n')
          .map(paragraph => `<p>${paragraph.replace(/\n/g, '<br>')}</p>`)
          .join('');
      } else {
        throw new Error('Unsupported file format. Please use HTML, TXT, DOC, or DOCX files.');
      }

      onImport(processedContent);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import file');
    } finally {
      setLoading(false);
    }
  }, [onImport, onClose]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleFile(e.target.files[0]);
    }
  }, [handleFile]);

  const handleClose = () => {
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Import Document</h3>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded-md transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-red-700">
            <AlertCircle size={16} />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <div
          className={`
            border-2 border-dashed rounded-lg p-8 text-center transition-colors
            ${dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
            ${loading ? 'opacity-50 pointer-events-none' : ''}
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="p-3 bg-gray-100 rounded-full">
              <Upload size={24} className="text-gray-600" />
            </div>
            
            <div>
              <h4 className="text-lg font-medium text-gray-800 mb-2">
                {loading ? 'Processing...' : 'Import your document'}
              </h4>
              <p className="text-sm text-gray-600 mb-4">
                Drag and drop or click to select a file
              </p>
              
              <div className="text-xs text-gray-500 space-y-1">
                <div className="flex items-center justify-center gap-1">
                  <FileText size={12} />
                  <span>Supported: HTML, TXT, DOC, DOCX</span>
                </div>
                <div>DOCX files converted with Mammoth.js</div>
                <div>Content sanitized for security</div>
              </div>
            </div>

            <input
              type="file"
              accept=".html,.htm,.txt,.doc,.docx"
              onChange={handleFileInput}
              className="hidden"
              id="file-input"
              disabled={loading}
            />
            
            <label
              htmlFor="file-input"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Choose File'}
            </label>
          </div>
        </div>

        <div className="mt-4 text-xs text-gray-500">
          <p className="font-medium mb-1">Security & Conversion Features:</p>
          <ul className="space-y-1 ml-4">
            <li>• DOCX files properly converted using Mammoth.js</li>
            <li>• Scripts and dangerous elements removed</li>
            <li>• Event handlers sanitized</li>
            <li>• Word formatting cleaned and optimized</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ImportModal;
