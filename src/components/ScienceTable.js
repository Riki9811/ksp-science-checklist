import ScienceCell from "./ScienceCell.js";

export default class ScienceTable {
	/**
	 * Creates an instance of ScienceTable.
	 * @param {HTMLElement} container - The container element where the table will be appended.
	 * @param {Array<string>} rowHeaders - The rows of the table (e.g., biomes or a single row for recovery bonuses).
	 * @param {Array<string>} columnHeaders - The columns of the table (e.g., experiments or recovery types).
	 * @param {Object} columns - An object containing the data for each cell. Keys should be in the format `[row]@[column]` and values should be `{ collected, total }` or `null` for empty cells.
	 * @param {boolean} [isSmallTable=false] - Indicates wether the table is small and doesn't need to be as wide as possible. DEFAULT = false
	 */
	constructor(container, rowHeaders, columnHeaders, columns, isSmallTable = false) {
		this.container = container;
		this.rowHeaders = rowHeaders;
		this.columnHeaders = columnHeaders;
		this.columns = columns;
		this.isSmallTable = isSmallTable;

		// List to store all ScienceCell instances
		this.scienceCells = [];

		this.grid = document.createElement("div");
		this.grid.classList.add("science-grid");
		this.grid.classList.toggle("science-grid-small", this.isSmallTable);
		this.container.appendChild(this.grid);

		this.#buildGrid();
	}

	/**
	 * Builds the entire grid layout.
	 */
	#buildGrid() {
		this.#setGridTemplate();
		this.#addEmptyCorner();
		this.#addColumnHeaders();
		this.#addRowsAndCells();
	}

	/**
	 * Sets the grid template rows and columns based on the headers.
	 */
	#setGridTemplate() {
		this.grid.style.gridTemplateRows = `repeat(${this.rowHeaders.length + 1}, 1fr)`;
		this.grid.style.gridTemplateColumns = `auto repeat(${this.columnHeaders.length}, minmax(0, auto))`;
	}

	/**
	 * Adds an empty cell in the top-left corner of the grid.
	 */
	#addEmptyCorner() {
		const emptyCorner = document.createElement("div");
		emptyCorner.classList.add("empty-corner");
		this.grid.appendChild(emptyCorner);
	}

	/**
	 * Adds the column headers to the grid.
	 */
	#addColumnHeaders() {
		this.columnHeaders.forEach((header) => {
			const headerDiv = document.createElement("div");
			headerDiv.classList.add("grid-header");
			const nameP = document.createElement("p");
			nameP.textContent = header;
			headerDiv.appendChild(nameP);
			this.grid.appendChild(headerDiv);
		});
	}

	/**
	 * Adds the rows and their corresponding cells to the grid.
	 */
	#addRowsAndCells() {
		this.rowHeaders.forEach((rowHeader, rowIndex) => {
			this.#addRowHeader(rowHeader);
			this.#addCellsForRow(rowIndex);
		});
	}

	/**
	 * Adds a row header to the grid.
	 * @param {string} rowHeader - The text for the row header.
	 */
	#addRowHeader(rowHeader) {
		const rowHeaderDiv = document.createElement("div");
		rowHeaderDiv.classList.add("grid-row-header");
		const rowHeaderP = document.createElement("p");
		rowHeaderP.textContent = rowHeader;
		rowHeaderDiv.appendChild(rowHeaderP);
		this.grid.appendChild(rowHeaderDiv);
	}

	/**
	 * Adds cells for a specific row based on the column data.
	 * @param {number} rowIndex - The index of the current row.
	 */
	#addCellsForRow(rowIndex) {
		this.columnHeaders.forEach((_, colIndex) => {
			const cellData = this.columns[colIndex];
			if (cellData === null) {
				this.#addEmptyCell();
			} else if (cellData.length === 1 && this.rowHeaders.length > 1) {
				this.#addSpanningCell(cellData[0], rowIndex);
			} else if (cellData.length === this.rowHeaders.length) {
				this.#addRegularCell(cellData[rowIndex]);
			}
		});
	}

	/**
	 * Adds an empty cell to the grid.
	 */
	#addEmptyCell() {
		const emptyCell = document.createElement("div");
		emptyCell.classList.add("grid-cell", "empty-cell");
		this.grid.appendChild(emptyCell);
	}

	/**
	 * Adds a cell that spans all rows for a specific column.
	 * @param {Object} spanningCellData - The data for the spanning cell.
	 * @param {number} rowIndex - The index of the current row.
	 */
	#addSpanningCell(spanningCellData, rowIndex) {
		if (rowIndex === 0) {
			const cellDiv = document.createElement("div");
			cellDiv.classList.add("grid-cell");

			if (spanningCellData.total === 0) {
				cellDiv.classList.add("grid-cell-uncollected");
			} else {
				cellDiv.classList.add("grid-cell-spanning");
				const spanningCell = new ScienceCell(spanningCellData.id, spanningCellData.collected, spanningCellData.total);
				this.scienceCells.push(spanningCell);
				cellDiv.appendChild(spanningCell.element);
			}

			cellDiv.style.gridRow = `span ${this.rowHeaders.length}`;
			this.grid.appendChild(cellDiv);
		}
	}

	/**
	 * Adds a regular cell to the grid for a specific row-column intersection.
	 * @param {Object|null} cellData - The data for the cell, or null if the cell is empty.
	 */
	#addRegularCell(cellData) {
		if (cellData) {
			const cellDiv = document.createElement("div");
			cellDiv.classList.add("grid-cell");

			if (cellData.total === 0) {
				cellDiv.classList.add("grid-cell-uncollected");
			} else {
				const scienceCell = new ScienceCell(cellData.id, cellData.collected, cellData.total);
				this.scienceCells.push(scienceCell);
				cellDiv.appendChild(scienceCell.element);
			}

			this.grid.appendChild(cellDiv);
		} else {
			this.#addEmptyCell();
		}
	}
}
