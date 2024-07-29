# CSVFileReader

CSV File Reader is a web application that allows users to upload, display, filter and sort .CSV files. Also, users will be able to download a .CSV file with the data they searched for.

## Production

- July 25th, 2024 to July 29th, 2024

- David Francisco Blandón Mena (@franccoina) 
- Riwi, Be a Coder: Clan Gates

## Features

- Upload .CSV files
- Display uploaded file data in a table format
- Filter data by a searched term
- Sort table columns in ascending or descending order
- Download the filtered and sorted data as a .CSV file

## Technologies Used

- TypeScript
- Bootstrap
- HTML
- CSS

## How to install it?

1. Clone the repository:
    ```bash
    git clone https://github.com/franccoina/CSVFileReader.git
    ```
2. Globally install TypeScript:
    ```bash
    npm install -g typescript
    ```

## How to use it?

1. Start transpilating the TypeScript project:
    ```bash
   tsc --watch```
3. Open in your browser using Live Server Extension in Visual Studio Code.

## Project Structure

- `dist/`
    - `assets/`
        - `icons/`
            - `favicon.ico`: The webpage icon in a favicon.ico format.
    - `components/`
        - `controllers/`: Contains the classes or controllers for the project in JavaScript format, when you transpilate it.
        - `models/`: Contains the interfaces/types or models for the project in JavaScript format, when you transpilate it.
        - `index.js`: Main file in JavaScript format for the application logic, when you transpilate it.
    - `views/`
        - `home/`
            - `index.html`: Main HTML file for the application.
        - `styles/`
            - `style.css`: Our CSS styling sheet.
- `src/`
    - `controllers/`
        - `downloaderCSV.controller.ts`: Contains the function for converting array data to CSV format downloading CSV files.
        - `filter.controller.ts`: Contains the function to filter the data based on a search term.
        - `tableTemplate.controller.ts`: Contains the function to generate the HTML table with pagination and sorting.
        - `file.controller.ts`: Contains the function to for processing uploaded CSV files data.
    - `models/`
        - `file.model.ts`: Defines the TypeScript interfaces and types for the data structure.
    - `index.ts`: Main TypeScript file for the application logic.

## How does it work?

1. **Upload CSV File**: At first, the user must select a CSV file to upload using the file input.
2. **Display Data**: Then, the uploaded CSV data will be parsed and displayed in a table format.
3. **Filter Data**: Now, the user can filter the displayed data by entering a search term in the search input.
4. **Sort Columns**: Also, the user can sort the table columns in ascending or descending order by clicking on the column headers.
5. **Download CSV**: Finally, the user just downloads the filtered and sorted data as a CSV file by clicking the download button.

## Acknowledgements

- [Bootstrap](https://getbootstrap.com/)
- [TypeScript](https://www.typescriptlang.org/)


