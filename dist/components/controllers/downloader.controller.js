var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export function convertCsv(data, columnNames) {
    return __awaiter(this, void 0, void 0, function* () {
        const csvRows = [];
        //Add headers 
        csvRows.push(columnNames.join(","));
        //Add data
        data.forEach(row => {
            const values = columnNames.map(column => row[column] || "");
            csvRows.push(values.join(""));
        });
        return csvRows.join("\n");
    });
}
export function downloadCSV(csvContent, fileName) {
    return __awaiter(this, void 0, void 0, function* () {
        //Blob object with unalterable data and binary
        const blob = new Blob([csvContent], { type: 'text/csv; charset=UTF-8' });
        //Downloading the blob as a file
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        document.body.appendChild(link);
        //Trigger
        link.click();
        //Deletes the link
        document.body.removeChild(link);
    });
}
