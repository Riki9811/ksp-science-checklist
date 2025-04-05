import { jest } from "@jest/globals";
import { promises as fs } from "node:fs";
import { join } from "node:path";
import fileSystem from "./fileSystem";

jest.mock("node:fs/promises");

describe("getRawFolders", () => {
	const kspInstallDir = "mock/ksp";

	beforeEach(() => {
		jest.resetAllMocks();
		fs.constants = { R_OK: 4 }; // Ensure constants are mocked
		fs.access = jest.fn(); // Explicitly mock fs.access
		fs.readdir = jest.fn(); // Explicitly mock fs.readdir
	});

	test("should return folders and code 0 for a valid directory", async () => {
		const mockSavePath = join("mock", "ksp", "saves");
		const mockItems = [
			{ name: "career", isDirectory: () => true },
			{ name: "sandbox", isDirectory: () => true },
			{ name: "training", isDirectory: () => true }
		];
		const expectedResult = {
			folders: [
				{ name: "career", path: join(mockSavePath, "career") },
				{ name: "sandbox", path: join(mockSavePath, "sandbox") }
			],
			code: 0
		};

		fs.access.mockResolvedValue(); // Mock successful access
		fs.readdir.mockResolvedValue(mockItems); // Mock directory contents

		const result = await fileSystem.getRawFolders(kspInstallDir);

		expect(result).toEqual(expectedResult);
		expect(fs.access).toHaveBeenCalledWith(mockSavePath, fs.constants.R_OK);
		expect(fs.readdir).toHaveBeenCalledWith(mockSavePath, { withFileTypes: true });
	});

	test("should return code 1 if the directory does not exist", async () => {
		fs.access.mockRejectedValue({ code: "ENOENT" });

		const result = await fileSystem.getRawFolders(kspInstallDir);

		expect(result).toEqual({ folders: [], code: 1 });
	});

	test("should return code 2 if there is no read access", async () => {
		fs.access.mockRejectedValue({ code: "EACCES" });

		const result = await fileSystem.getRawFolders(kspInstallDir);

		expect(result).toEqual({ folders: [], code: 2 });
	});

	test("should return code 3 if the path is not a directory", async () => {
		fs.readdir.mockRejectedValue({ code: "ENOTDIR" });

		const result = await fileSystem.getRawFolders(kspInstallDir);

		expect(result).toEqual({ folders: [], code: 3 });
	});

	test("should return code -1 for an unknown error on fs.access", async () => {
		fs.access.mockRejectedValue(new Error("Unknown error"));

		const result = await fileSystem.getRawFolders(kspInstallDir);

		expect(result).toEqual({ folders: [], code: -1 });
	});

	test("should return code -1 for an unknown error on fs.readdir", async () => {
		fs.readdir.mockRejectedValue(new Error("Unknown error"));

		const result = await fileSystem.getRawFolders(kspInstallDir);

		expect(result).toEqual({ folders: [], code: -1 });
	});
});

describe("hasPersistentFile", () => {
	const mockSaveFolderPath = join("mock", "ksp", "saves", "TestSave");
	const mockPersistentFilePath = join(mockSaveFolderPath, "persistent.sfs");

	beforeEach(() => {
		jest.resetAllMocks();
	});

	it("should return true if the 'persistent.sfs' file exists and is readable", async () => {
		// Mock fs.access to resolve successfully
		fs.access.mockResolvedValueOnce();

		const result = await fileSystem.hasPersistentFile(mockSaveFolderPath);

		expect(fs.access).toHaveBeenCalledWith(mockPersistentFilePath, fs.constants.R_OK);
		expect(result).toBe(true);
	});

	it("should return false if the 'persistent.sfs' file does not exist", async () => {
		// Mock fs.access to reject with an error
		fs.access.mockRejectedValueOnce({ code: "ENOENT" });

		const result = await fileSystem.hasPersistentFile(mockSaveFolderPath);

		expect(fs.access).toHaveBeenCalledWith(mockPersistentFilePath, fs.constants.R_OK);
		expect(result).toBe(false);
	});

	it("should return false if the 'persistent.sfs' file is inaccessible", async () => {
		// Mock fs.access to reject with a permission error
		fs.access.mockRejectedValueOnce({ code: "EACCES" });

		const result = await fileSystem.hasPersistentFile(mockSaveFolderPath);

		expect(fs.access).toHaveBeenCalledWith(mockPersistentFilePath, fs.constants.R_OK);
		expect(result).toBe(false);
	});

	it("should return false for any other error", async () => {
		// Mock fs.access to reject with a generic error
		fs.access.mockRejectedValueOnce(new Error("Unknown error"));

		const result = await fileSystem.hasPersistentFile(mockSaveFolderPath);

		expect(fs.access).toHaveBeenCalledWith(mockPersistentFilePath, fs.constants.R_OK);
		expect(result).toBe(false);
	});
});

describe("readFileContents", () => {
    const mockFilePath = join("mock", "ksp", "saves", "TestSave", "persistent.sfs");

    beforeEach(() => {
		jest.resetAllMocks();
		fs.readFile = jest.fn(); // Explicitly mock fs.readFile
	});

    it("should return the file content and code 0 for a valid file", async () => {
        const mockContent = "mock file content";
        fs.readFile.mockResolvedValue(mockContent);

        const result = await fileSystem.readFileContents(mockFilePath);

        expect(fs.readFile).toHaveBeenCalledWith(mockFilePath, "utf-8");
        expect(result).toEqual({ content: mockContent, code: 0 });
    });

    it("should return code 1 if the file does not exist", async () => {
        fs.readFile.mockRejectedValue({ code: "ENOENT" });

        const result = await fileSystem.readFileContents(mockFilePath);

        expect(fs.readFile).toHaveBeenCalledWith(mockFilePath, "utf-8");
        expect(result).toEqual({ content: "", code: 1 });
    });

    it("should return code 2 if the file is inaccessible", async () => {
        fs.readFile.mockRejectedValue({ code: "EACCES" });

        const result = await fileSystem.readFileContents(mockFilePath);

        expect(fs.readFile).toHaveBeenCalledWith(mockFilePath, "utf-8");
        expect(result).toEqual({ content: "", code: 2 });
    });

    it("should return code -1 for any other error", async () => {
        fs.readFile.mockRejectedValue(new Error("Unknown error"));

        const result = await fileSystem.readFileContents(mockFilePath);

        expect(fs.readFile).toHaveBeenCalledWith(mockFilePath, "utf-8");
        expect(result).toEqual({ content: "", code: -1 });
    });
});

describe("getSfsFiles", () => {
    const mockDirectoryPath = join("mock", "ksp", "saves", "TestSave");

    beforeEach(() => {
        jest.resetAllMocks();
        fs.readdir = jest.fn(); // Explicitly mock fs.readdir
    });

    it("should return a list of .sfs file paths if they exist in the directory", async () => {
        const mockItems = [
            { name: "persistent.sfs", isFile: () => true },
            { name: "quicksave.sfs", isFile: () => true },
            { name: "not-a-save.txt", isFile: () => true },
            { name: "subfolder", isFile: () => false }
        ];
        const expectedResult = [
            join(mockDirectoryPath, "persistent.sfs"),
            join(mockDirectoryPath, "quicksave.sfs")
        ];

        fs.readdir.mockResolvedValue(mockItems);

        const result = await fileSystem.getSfsFiles(mockDirectoryPath);

        expect(fs.readdir).toHaveBeenCalledWith(mockDirectoryPath, { withFileTypes: true });
        expect(result).toEqual(expectedResult);
    });

    it("should return an empty list if no .sfs files exist in the directory", async () => {
        const mockItems = [
            { name: "not-a-save.txt", isFile: () => true },
            { name: "subfolder", isFile: () => false }
        ];

        fs.readdir.mockResolvedValue(mockItems);

        const result = await fileSystem.getSfsFiles(mockDirectoryPath);

        expect(fs.readdir).toHaveBeenCalledWith(mockDirectoryPath, { withFileTypes: true });
        expect(result).toEqual([]);
    });

    it("should return an empty list if the directory is empty", async () => {
        fs.readdir.mockResolvedValue([]);

        const result = await fileSystem.getSfsFiles(mockDirectoryPath);

        expect(fs.readdir).toHaveBeenCalledWith(mockDirectoryPath, { withFileTypes: true });
        expect(result).toEqual([]);
    });

    it("should return an empty list if an error occurs while reading the directory", async () => {
        fs.readdir.mockRejectedValue(new Error("Unknown error"));

        const result = await fileSystem.getSfsFiles(mockDirectoryPath);

        expect(fs.readdir).toHaveBeenCalledWith(mockDirectoryPath, { withFileTypes: true });
        expect(result).toEqual([]);
    });
});
