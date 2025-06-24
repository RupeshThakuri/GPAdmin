/**
 * Utility functions for exporting data to CSV/Excel
 */

/**
 * Convert an array of objects to CSV format
 * @param data Array of objects to convert
 * @param headers Optional custom headers (if not provided, will use object keys)
 * @returns CSV string
 */
export function convertToCSV(data: any[], headers?: string[]) {
    if (data.length === 0) return ""
  
    // Use provided headers or extract from first object
    const csvHeaders = headers || Object.keys(data[0])
  
    // Create header row
    let csv = csvHeaders.join(",") + "\n"
  
    // Add data rows
    data.forEach((item) => {
      const row = csvHeaders.map((header) => {
        // Get the value (handle nested properties with dot notation)
        const value = header.split(".").reduce((obj, key) => obj?.[key], item)
  
        // Format the value for CSV
        const formatted = value === null || value === undefined ? "" : String(value)
  
        // Escape quotes and wrap in quotes if contains comma, newline or quote
        if (formatted.includes(",") || formatted.includes("\n") || formatted.includes('"')) {
          return `"${formatted.replace(/"/g, '""')}"`
        }
        return formatted
      })
  
      csv += row.join(",") + "\n"
    })
  
    return csv
  }
  
  /**
   * Download data as a CSV file
   * @param data Array of objects to export
   * @param filename Filename without extension
   * @param headers Optional custom headers
   */
  export function downloadCSV(data: any[], filename: string, headers?: string[]) {
    const csv = convertToCSV(data, headers)
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
  
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `${filename}.csv`)
    link.style.visibility = "hidden"
  
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  
  /**
   * Format a date for export
   * @param date Date to format
   * @returns Formatted date string
   */
  export function formatDateForExport(date: string | Date): string {
    if (!date) return ""
    const d = typeof date === "string" ? new Date(date) : date
    return d.toISOString().split("T")[0]
  }
  
  