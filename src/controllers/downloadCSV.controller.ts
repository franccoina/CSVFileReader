export async function downloadCSV(csvContent: string, fileName: string) {
    //Blob object with unalterable data and binary
    const blob = new Blob([csvContent], { type: 'text/csv; charset=UTF-8' });

    //Downloading the Blob as a file
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    //Trigger
    link.click();
    //Deletes the link
    document.body.removeChild(link);
}