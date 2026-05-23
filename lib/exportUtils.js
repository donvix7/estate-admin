/**
 * Universal CSV Export Utility
 * Converts an array of objects into a CSV file and triggers a browser download.
 */
export const exportToCSV = (data, filename) => {
    if (!data || data.length === 0) return;

    // Extract headers
    const headers = Object.keys(data[0]);
    
    // Create CSV rows
    const csvRows = [
        headers.join(','), // Header row
        ...data.map(row => 
            headers.map(fieldName => {
                const value = row[fieldName] === null || row[fieldName] === undefined ? '' : row[fieldName];
                // Escape commas and wrap in quotes
                const escaped = ('' + value).replace(/"/g, '""');
                return `"${escaped}"`;
            }).join(',')
        )
    ];

    // Create Blob
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // Trigger download
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};

/**
 * Print Utility (for Receipts/PDFs)
 */
export const triggerPrint = () => {
    window.print();
};
