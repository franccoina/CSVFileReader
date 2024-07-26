var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//---------------------------------- Function for rendering our Table ----------------------------------
export function renderTable(tableArray, currentPage, recordsPerPage) {
    return __awaiter(this, void 0, void 0, function* () {
        // Index start and end
        const startIndex = (currentPage - 1) * recordsPerPage;
        const endIndex = startIndex + recordsPerPage;
        const paginatedData = tableArray.slice(startIndex, endIndex);
        // Column names from the first record or row. If atleast one of these exist, let's go on
        const columnName = tableArray.length > 0 ? Object.keys(tableArray[0]) : [];
        // Building our table HTML content
        const tableContent = `
                        <table class="table table-responsive table-bordered border-dark-subtle">
                            <thead>
                                ${columnName.map((value) => `
                                    <th scope="col">${value}</th>
                                    `).join("")}
                            </thead>
                            <tbody>
                                ${paginatedData.map((row) => `
                                    <tr>
                                        ${columnName.map((columnName) => `
                                            <td scope="col">
                                                ${row[columnName || ""]}
                                            </td>
                                            `).join("")}
                                    </tr>
                                    `).join("")}
                            </body>
                        </table>
                        `;
        return tableContent;
    });
}
