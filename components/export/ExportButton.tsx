'use client'

import React, { useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import { Button } from '@/components/ui/button'
import Preview from '@/components/preview/Preview'

interface ExportButtonProps {
  filename?: string
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link'
  children?: React.ReactNode
  onExportStart?: () => void
  onExportComplete?: () => void
}

export function ExportButton({ 
  filename = 'cv.pdf', 
  variant = 'default',
  children,
  onExportStart,
  onExportComplete
}: ExportButtonProps) {
  const componentRef = useRef<HTMLDivElement>(null)
  
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: filename.replace('.pdf', ''),
    onBeforePrint: async () => {
      onExportStart?.()
    },
    onAfterPrint: () => {
      console.log('PDF exported successfully!')
      onExportComplete?.()
    },
    pageStyle: `
      @page {
        size: A4;
        margin: 0;
      }
      @media print {
        body { 
          margin: 0;
          padding: 0;
          background: white !important;
        }
        .cv-preview-container {
          box-shadow: none !important;
          background: white !important;
          padding: 0 !important;
        }
        .cv-page {
          transform: none !important;
          box-shadow: none !important;
          max-width: none !important;
          width: 210mm !important;
          min-height: 297mm !important;
        }
      }
    `
  })

  return (
    <>
      <div style={{ display: 'none' }}>
        <div ref={componentRef}>
          <Preview />
        </div>
      </div>
      
      <Button onClick={handlePrint} variant={variant}>
        {children || (
          <>
            <i className="bi bi-file-earmark-arrow-down"></i>
            Download PDF
          </>
        )}
      </Button>
    </>
  )
}