var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { FileController } from "./controllers/file.controller.js";
import { renderTable } from "./controllers/table.controller.js";
import { filterData } from "./controllers/filter.controller.js";
import { convertCsv, downloadCSV } from "./controllers/downloader.controller.js";
//---------------------------------------- Getting elements from HTML -----------------------
const csvForm = document.querySelector("#csvForm");
const csvFile = document.querySelector("#csvFile");
const contentArea = document.querySelector("#contentArea");
const searchInput = document.querySelector("#searchInput");
const downloadButton = document.querySelector("#downloadCSV");
const paginationControlsNav = document.querySelector('#paginationControls');
//---------------------------------------- Variables ---------------------------------------- 
const recordsPerPage = 15;
let currentPage = 1;
let finalValues = [];
let columnNames = [];
//---------------------------------------- Functions for rendering pagination controls ----------------------------------
function pagination(totalRecords, currentPage, recordsPerPage) {
    const totalOfPages = Math.ceil(totalRecords / recordsPerPage);
    const maxButtons = 10;
    let paginationHTML = `<ul class="pagination rounded">`;
    // Start
    if (currentPage > 1) {
        paginationHTML += `
            <li class="page-item">
                <a class="page-link border border-dark-subtle" data-page="1" href="#">Start</a>
            </li>`;
    }
    // Previous
    if (currentPage > 1) {
        paginationHTML += `
            <li class="page-item">
                <a class="page-link border border-dark-subtle" data-page="${currentPage - 1}" href="#">Previous</a>
            </li>`;
    }
    // Buttons
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let finalPage = Math.min(totalOfPages, currentPage + Math.floor(maxButtons / 2));
    // Adjust range
    if (finalPage - startPage < maxButtons - 1) {
        if (startPage === 1) {
            finalPage = Math.min(totalOfPages, startPage + maxButtons - 1);
        }
        else if (finalPage === totalOfPages) {
            startPage = Math.max(1, finalPage - maxButtons + 1);
        }
    }
    // Page Numbers
    for (let i = startPage; i <= finalPage; i++) {
        paginationHTML += `
                <li class="page-item ${i === currentPage ? "active" : ''}">
                    <a class="page-link border border-dark-subtle" href='#' data-page="${i}">${i}</a>
                </li>
                `;
    }
    // Next
    if (currentPage < totalOfPages) {
        paginationHTML += `
            <li class="page-item">
                <a class="page-link border border-dark-subtle" data-page="${currentPage + 1}" href="#">Next</a>
            </li>`;
    }
    // End
    if (currentPage < totalOfPages) {
        paginationHTML += `
            <li class="page-item">
                <a class="page-link border border-dark-subtle" data-page="${totalOfPages}" href="#">End</a>
            </li>`;
    }
    paginationHTML += `</ul>`;
    return paginationHTML;
}
//---------------------------------------- addEvfor rendering the table and downloading ----------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    //----------------------------- Uploading the file ----------------------------->
    csvForm.addEventListener("submit", (ev) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        ev.preventDefault();
        const csvReader = new FileReader();
        // '!' : Not null
        // '?' : Not undefined
        //We need the file extension, so we get the file name, then we split it
        //by the '.' character, and with pop() method we select the file extension
        //and save it in another variable
        const input = csvFile.files[0];
        const fileName = input.name;
        const fileExtension = (_a = fileName.split(".").pop()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
        if (fileExtension !== 'csv' && fileExtension !== 'txt') {
            alert("Invalid file format. Please select a .csv or .txt file.");
            return;
        }
        csvReader.onload = function (event) {
            return __awaiter(this, void 0, void 0, function* () {
                var _a;
                const text = (_a = event.target) === null || _a === void 0 ? void 0 : _a.result;
                const fileController = new FileController(text);
                finalValues = fileController.getData();
                columnNames = fileController.getColumnNames();
                yield renderTableControls();
            });
        };
        csvReader.readAsText(input);
    }));
    //----------------------------- Downloading the file ----------------------------->
    downloadButton.addEventListener('click', (ev) => __awaiter(void 0, void 0, void 0, function* () {
        ev.preventDefault();
        //Filtered data
        const searchTerm = searchInput.value;
        const dataFilteredValues = filterData(finalValues, searchTerm);
        const csvContent = yield convertCsv(dataFilteredValues, columnNames);
        yield downloadCSV(csvContent, 'filtered_data.csv');
    }));
    //------------------------------ Searching ---------------------------------------->
    searchInput.addEventListener('input', (ev) => __awaiter(void 0, void 0, void 0, function* () {
        ev.preventDefault();
        yield renderTableControls();
    }));
});
//---------------------------------------- Rendering table with its controls ----------------
function renderTableControls() {
    return __awaiter(this, void 0, void 0, function* () {
        const searchTerm = searchInput.value;
        const filteredValues = filterData(finalValues, searchTerm);
        //Render filtered values
        const tableHTML = yield renderTable(filteredValues, currentPage, recordsPerPage);
        contentArea.innerHTML = tableHTML;
        //Pagination nav
        const paginationControls = pagination(filteredValues.length, currentPage, recordsPerPage);
        paginationControlsNav.innerHTML = paginationControls;
        // Re-select pagination links after rendering
        const paginationLinks = document.querySelectorAll('.page-link');
        //Current Page and Number of Pagination Links
        paginationLinks.forEach(link => {
            link.addEventListener('click', (ev) => {
                ev.preventDefault();
                const targetPage = Number(ev.target.dataset.page);
                if (targetPage) {
                    currentPage = targetPage;
                    renderTableControls();
                }
            });
        });
    });
}
