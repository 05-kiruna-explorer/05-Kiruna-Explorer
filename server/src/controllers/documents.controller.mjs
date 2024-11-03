import documentsDAO from "../dao/documents.dao.mjs";

export const getDocuments = async (req, res) => {
    try {
        const documents = await documentsDAO.getDocuments();
        res.status(200).json({ documents: documents });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getDocumentById = async (req, res) => {
    try {
        const documentId = req.params.id;

        const document = await documentsDAO.getDocumentById(documentId);

        res.status(200).json({ document: document });
    } catch (error) {
        console.error("Error in getDocument controller:", error);
        res.status(404).json({
            message: "Document not found",
            error: error.message,
        });
    }
};

export const createDocument = async (req, res) => {
    try {
        const newDocument = await documentsDAO.createDocument(req.body);
        res.status(201).json({ document: newDocument });
    } catch (error) {
        console.error("Error in createDocument controller:", error);
        res.status(500).json({
            message: "Failed to create document",
            error: error.message,
        });
    }
};

export const updateDocument = async (req, res) => {
    try {
        const documentId = req.params.id;
        const documentData = {
            title: req.body.title,
            scaleType: req.body.scaleType,
            scaleValue: req.body.scaleValue,
            issuanceDate: req.body.issuanceDate,
            type: req.body.type,
            language: req.body.language,
            pages: req.body.pages,
            description: req.body.description,
            stakeholders: req.body.stakeholders,
        };

        const updatedDocument = await documentsDAO.updateDocument(
            documentId,
            documentData
        );

        res.status(200).json({ document: updatedDocument });
    } catch (error) {
        console.error("Error in updateDocument controller:", error);
        res.status(500).json({
            message: "Failed to update document",
            error: error.message,
        });
    }
};
