import fs from "fs";
import path from "path";

export async function findOriginalResources(id) {
    try {
        const createdPath = path.join("document_resources", id.toString(), "original_resources");
        const folderPath = await fs.promises.realpath(createdPath);
        if (!folderPath.startsWith(path.join(process.cwd(), "document_resources"))) {
            throw new Error("Invalid path");
        }
        const files = await fs.promises.readdir(folderPath);
        return files;
    } catch (err) {
        if (err.code === "ENOENT") {
            // Folder does not exist
            return [];
        } else {
            // Other errors
            throw err;
        }
    }
}

export async function deleteOriginalResources(id) {
    const createdPath = path.join("document_resources", id.toString(), "original_resources");
    const folderPath = await fs.promises.realpath(createdPath);
    if (!folderPath.startsWith(path.join(process.cwd(), "document_resources"))) {
        throw new Error("Invalid path");
    }

    if (fs.existsSync(folderPath)) {
        fs.rmSync(folderPath, { recursive: true });
    }
}

export async function createOriginalResources(id, files) {
    // Create directory for document resources
    const createdPath = path.join("document_resources", id.toString(), "original_resources");
    const folderPath = await fs.promises.realpath(createdPath);
    if (!folderPath.startsWith(path.join(process.cwd(), "document_resources"))) {
        throw new Error("Invalid path");
    }

    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }

    // Move uploaded files to document directory
    files.forEach((file) => {
        const targetPath = path.join(folderPath, file.originalname);
        fs.copyFileSync(file.path, targetPath);
        fs.unlinkSync(file.path);
    });
}
