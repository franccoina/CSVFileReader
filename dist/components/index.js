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
import { renderTableTemplate } from "./controllers/tableTemplate.controller.js";
import { filterData } from "./controllers/filter.controller.js";
import { convertToCsv, downloadCSV } from "./controllers/downloaderCSV.controller.js";
//---------------------------------------- Getting elements from HTML -----------------------
const csvForm = document.querySelector("#csvForm");
const csvFile = document.querySelector("#csvFile");
const contentArea = document.querySelector("#contentArea");
const searchInput = document.querySelector("#searchInput");
const downloadFileButton = document.querySelector("#downloadCSV");
const paginationControlsNav = document.querySelector('#paginationControls');
//---------------------------------------- Variables ---------------------------------------- 
const recordsPerPage = 15;
let currentPage = 1;
let sortColumn = '';
let sortOrder = 'asc';
let data = [];
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
    // Nav links (Buttons)
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
//---------------------------------------- Rendering table with its controls ----------------
function renderTableController() {
    return __awaiter(this, void 0, void 0, function* () {
        const searchTerm = searchInput.value;
        let filteredData = filterData(data, searchTerm);
        // Sorting data
        if (sortColumn) {
            const fileController = new FileController('');
            fileController.data = filteredData;
            fileController.sortData(sortColumn, sortOrder);
            filteredData = fileController.getData();
        }
        contentArea.innerHTML = '';
        //Render filtered data
        const tableHTML = yield renderTableTemplate(filteredData, currentPage, recordsPerPage, sortColumn, sortOrder);
        contentArea.innerHTML += tableHTML;
        //Pagination nav
        const paginationControls = pagination(filteredData.length, currentPage, recordsPerPage);
        paginationControlsNav.innerHTML = paginationControls;
        // Re-select pagination links after rendering
        const paginationLinks = document.querySelectorAll('.page-link');
        paginationLinks.forEach(link => {
            link.addEventListener('click', () => {
                currentPage = parseInt(link.getAttribute('data-page'));
                renderTableController();
            });
        });
        // Re-select pagination links after rendering
        const sortingButtons = document.querySelectorAll('.sort-button');
        sortingButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const target = event.target;
                sortColumn = target.getAttribute('data-column');
                sortOrder = target.getAttribute('data-order');
                renderTableController();
            });
        });
    });
}
//---------------------------------------- addEv for rendering the table and downloading ----------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    //----------------------------- Uploading the file ----------------------------->
    csvForm.addEventListener("submit", (ev) => {
        var _a;
        ev.preventDefault();
        // '!' : Not null
        // '?' : Not undefined
        //We need the file extension, so we get the file name, then we split it
        //by the '.' character, and with pop() method we select the file extension
        //and save it in another variable
        const inputFile = csvFile.files[0];
        const fileReader = new FileReader();
        const fileName = inputFile.name;
        const fileExtension = (_a = fileName.split('.').pop()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
        if (fileExtension !== 'csv') {
            alert("Invalid file format. Please upload a .csv file.");
            return;
        }
        fileReader.onload = (event) => __awaiter(void 0, void 0, void 0, function* () {
            const fileContent = event.target.result;
            const fileController = new FileController(fileContent);
            fileController.processFile();
            data = fileController.getData();
            columnNames = fileController.getColumnNames();
            yield renderTableController();
        });
        fileReader.readAsText(inputFile);
    });
    //----------------------------- Downloading the file ----------------------------->
    downloadFileButton.addEventListener('click', (ev) => __awaiter(void 0, void 0, void 0, function* () {
        ev.preventDefault();
        //Filtered data
        let searchTerm = searchInput.value;
        const filteredData = filterData(data, searchTerm);
        const fileContent = yield convertToCsv(filteredData, columnNames);
        yield downloadCSV(fileContent, 'filtered_data.csv');
    }));
    //------------------------------ Searching ---------------------------------------->
    searchInput.addEventListener('input', (ev) => __awaiter(void 0, void 0, void 0, function* () {
        ev.preventDefault();
        yield renderTableController();
    }));
});
