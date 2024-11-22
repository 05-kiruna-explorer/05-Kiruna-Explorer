import React, { useState, useEffect } from "react";
import API from "../API/API.mjs";
import DetailsPanel from "./DetailsPanel";
import { useLocation } from "react-router-dom";

const List = ({ condition, isLoggedIn }) => {
    const [documentsToShow, setDocumentsToShow] = useState([]);
    const [hoveredItem, setHoveredItem] = useState(null);
    const [selectedDocument, setSelectedDocument] = useState(null);

    const location = useLocation();

    useEffect(() => {
        const fetchDocuments = async () => {
            const response = await API.getDocuments();
            if (condition === "true") {
                setDocumentsToShow(
                    response.documents.filter((document) => document.allMunicipality == true)
                );
            } else {
                setDocumentsToShow(response.documents);
            }
        };

        fetchDocuments();
    }, [location.pathname]);

    return (
        <div
            className="d-flex"
            style={{
                height: "100vh",
                backgroundColor: "#f8f9fa",
                alignItems: "flex-start",
            }}
        >
            <div
                className={"container position-relative "}
                style={{
                    padding: "20px",
                    width: "90%",
                    height: "90%",
                    borderRadius: "0.375rem",
                    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                    background: "rgba(255, 255, 255, 0.9)",
                    color: "#333",
                    zIndex: 1,
                }}
            >
                <h1>{condition == "true" ? "All Municipality Documents" : "Documents"}</h1>
                <ul className="list-group">
                    {documentsToShow.map((document) => (
                        <li
                            key={document.id}
                            className={`list-group-item ${
                                hoveredItem === document.id ? "active" : ""
                            }`}
                            onMouseEnter={() => setHoveredItem(document.id)}
                            onMouseLeave={() => setHoveredItem(null)}
                            onClick={() => setSelectedDocument(document)}
                        >
                            {document.title}
                        </li>
                    ))}
                </ul>
            </div>

            {selectedDocument && (
                <div className="details-panel-container">
                    <DetailsPanel
                        doc={selectedDocument.id}
                        onClose={() => setSelectedDocument(null)}
                        isLoggedIn={isLoggedIn}
                    />
                </div>
            )}
        </div>
    );
};

export default List;
