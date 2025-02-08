'use client'
import { useState } from 'react'
import { Document, Page } from 'react-pdf'
import { pdfjs } from './PDFWorkerInit.js'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import 'react-pdf/dist/esm/Page/TextLayer.css'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function BasicPDFRenderer() {
  const [pdfFile, setPdfFile] = useState(null)
  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [searchText, setSearchText] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async () => {
    if (!searchText || !pdfFile) return

    setIsSearching(true)
    setSearchResults([])

    try {
      const pdf = await pdfjs.getDocument(pdfFile).promise
      const results = []

      // Search through all pages
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const textContent = await page.getTextContent()
        const text = textContent.items.map(item => item.str).join(' ')

        if (text.toLowerCase().includes(searchText.toLowerCase())) {
          results.push({
            page: i,
            text: text
          })
        }
      }

      console.log('Search results:', results)
      setSearchResults(results)
      
      // If results found, go to the first matching page
      if (results.length > 0) {
        setPageNumber(results[0].page)
      }
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-6">
        {/* File Input */}
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => {
            const file = e.target.files[0]
            if (file) setPdfFile(URL.createObjectURL(file))
          }}
          className="mb-4"
        />

        {/* Search Bar */}
        <div className="flex gap-2 mb-4">
          <Input
            type="text"
            placeholder="Search in PDF..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch()
            }}
            className="flex-1"
          />
          <Button 
            onClick={handleSearch}
            disabled={isSearching || !searchText}
          >
            {isSearching ? 'Searching...' : 'Search'}
          </Button>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mb-4 p-4 bg-gray-100 rounded-lg">
            <h3 className="font-semibold mb-2">
              Found in {searchResults.length} page(s):
            </h3>
            <ul className="space-y-2">
              {searchResults.map((result, index) => (
                <li 
                  key={index}
                  className="flex items-center gap-2"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPageNumber(result.page)}
                  >
                    Go to Page {result.page}
                  </Button>
                  <span className="text-sm text-gray-600">
                    {result.text.substring(0, 100)}...
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* PDF Viewer */}
        {pdfFile && (
          <div className="border rounded-lg shadow-lg">
            <Document
              file={pdfFile}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              className="flex justify-center"
            >
              <Page
                pageNumber={pageNumber}
                renderTextLayer={true}
                scale={1.2}
                className="relative"
              />
            </Document>
          </div>
        )}

        {/* Page Navigation */}
        {numPages && (
          <div className="flex gap-4 mt-4 justify-center">
            <Button
              onClick={() => setPageNumber(p => Math.max(1, p - 1))}
              disabled={pageNumber <= 1}
            >
              Previous
            </Button>
            <span>
              Page {pageNumber} of {numPages}
            </span>
            <Button
              onClick={() => setPageNumber(p => Math.min(numPages, p + 1))}
              disabled={pageNumber >= numPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}