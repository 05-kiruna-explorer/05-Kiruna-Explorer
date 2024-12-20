import { useAreaDrawing } from "./UseAreaDrawing";
import { useMapSetup } from "./UseMapSetup";
// external libraries
import React, { useEffect, useRef, useState, useContext } from "react";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";

// OpenLayers
import "ol/ol.css";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { fromLonLat, toLonLat } from "ol/proj";
import { GeoJSON } from "ol/format";
import { Style, Stroke, Icon } from "ol/style";

// Icons and API
import API from "../API/API.mjs";
import designIcon from "../Icons/design.svg";
import informativeIcon from "../Icons/informative.svg";
import prescriptiveIcon from "../Icons/prescriptive.svg";
import technicalIcon from "../Icons/technical.svg";
import agreementIcon from "../Icons/agreement.svg";
import conflictIcon from "../Icons/conflict.svg";
import consultationIcon from "../Icons/consultation.svg";
import actionIcon from "../Icons/action.svg";
import otherIcon from "../Icons/other.svg";
//import actionIcon from "./reactIcons/actionIcon.jsx";

// internal components and appContext
import DetailsPanel from "./DetailsPanel";
import ClusterDetailsPanel from "./ClusterDetailsPanel";
import { AppContext } from "../context/AppContext";
import {
    createDocumentLayer,
    handleMapPointerMove,
    resetPreviousFeatureStyle,
    applyClickStyle,
} from "./utils/geoUtils";

const Legend = ({ iconMap }) => {
    const [expanded, setExpanded] = useState(false);

    const toggleLegend = () => {
        setExpanded((prev) => !prev);
    };

    return (
        <div
            className={`legend ${expanded ? "expanded" : "collapsed"}`}
            onMouseEnter={toggleLegend}
            onMouseLeave={toggleLegend}
            style={{
                position: "fixed",
                bottom: "100px",
                right: "20px",
                boxSizing: "border-box",
                padding: expanded ? "20px" : "10px",
                backgroundColor: "rgba(255, 255, 255, 0.96)",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                cursor: "pointer",
                transition:
                    "padding 0.3s ease-in-out, max-width 0.3s ease-in-out, max-height 0.3s ease-in-out",
                maxWidth: expanded ? "400px" : "140px",
                maxHeight: expanded ? "800px" : "40px",
                overflowY: "hidden",
            }}
        >
            <h6 style={{ margin: 0, textAlign: "center", fontWeight: "bold" }}>Legend</h6>
            <ul style={{ listStyleType: "none", padding: "10px 0 0 0", margin: 0 }}>
                {Object.entries(iconMap).map(([label, icon]) => (
                    <li
                        key={label}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: "10px",
                        }}
                    >
                        <img
                            src={icon}
                            alt={label}
                            style={{
                                width: "20px",
                                height: "20px",
                                marginRight: "10px",
                            }}
                        />
                        <div>
                            <h6>{label}</h6>
                        </div>
                    </li>
                ))}

            </ul>
        </div>
    );
};



const CityMap = ({
    handleCoordinatesSelected,
    isSatelliteView,
    handleAreaSelected,
    centerIn,
    seeOnMap,
}) => {
    const see = false;
    const mapRef = useRef(null);
    const location = useLocation();
    const hoveredFeatureRef = useRef(null);
    const clickedFeatureRef = useRef(null);
    const detailsPanelRef = useRef(null);
    const [areas, setAreas] = useState([]);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [documentLayer, setDocumentLayer] = useState(null);
    const [boundaryLayer, setBoundaryLayer] = useState(null);

    const [selectedCluster, setSelectedCluster] = useState(null);

    const {
        setAllDocuments,
        allDocuments,
        isLoggedIn,
        isSelectingArea,
        areaGeoJSON,
        setAreaGeoJSON,
        isSelectingCoordinates,
    } = useContext(AppContext);

    const iconMap = {
        "Design Document": designIcon,
        "Informative Document": informativeIcon,
        "Prescriptive Document": prescriptiveIcon,
        "Technical Document": technicalIcon,
        Agreement: agreementIcon,
        Conflict: conflictIcon,
        Consultation: consultationIcon,
        Action: actionIcon,
        Other: otherIcon,
    };
    const mapInstanceRef = useMapSetup({ mapRef, isSatelliteView, centerIn });
    useAreaDrawing({ mapInstanceRef, isSelectingArea, setAreaGeoJSON, handleAreaSelected });

    useEffect(() => {
        const loadAreas = async () => {
            try {
                const fetchedAreas = await API.fetchAreas();
                setAreas(fetchedAreas);
            } catch (error) {
                console.error("Failed to load areas:", error);
            }
        };
        loadAreas();
    }, []);

    // Fetch all documents on load
    useEffect(() => {
        const fetchAllDocuments = async () => {
            try {
                const response = await API.getDocuments();
                setAllDocuments(response.documents);
            } catch (err) {
                console.error("Failed to fetch documents:", err.message);
            }
        };

        fetchAllDocuments();
    }, [isSatelliteView]);

    //draw new area
    useEffect(() => {
        const map = mapInstanceRef.current;
        if (!map || !areaGeoJSON || isSelectingArea) return;

        const areaSource = new VectorSource();
        const areaLayer = new VectorLayer({
            source: areaSource,
            style: new Style({
                stroke: new Stroke({
                    color: "rgba(0, 255, 0, 0.8)",
                    width: 2,
                }),
            }),
        });

        const geojsonFormat = new GeoJSON();
        try {
            const features = geojsonFormat.readFeatures(areaGeoJSON, {
                featureProjection: "EPSG:3857",
            });
            areaSource.addFeatures(features);
        } catch (error) {
            console.error("Error in GeoJSON:", error);
        }
        map.addLayer(areaLayer);

        return () => {
            map.removeLayer(areaLayer);
        };
    }, [isSelectingArea, areaGeoJSON]);

    //draw documents and boundaries
    useEffect(() => {
        const map = mapInstanceRef.current;
        if (!map) return;

        const shouldShow =
            !(location.pathname === "/add" || location.pathname.includes("edit")) ||
            isSelectingCoordinates;

        // if `shouldShow` is true and there are documents, create layer
        if (shouldShow && allDocuments?.length > 0) {
            const newDocumentLayer = createDocumentLayer(allDocuments, iconMap);
            // Add layer to the map
            if (newDocumentLayer) {
                map.addLayer(newDocumentLayer);
            }
            // Remove old layer
            if (documentLayer) {
                map.removeLayer(documentLayer);
            }
            // set new layer
            setDocumentLayer(newDocumentLayer);
        } else if (documentLayer) {
            map.removeLayer(documentLayer);
            setDocumentLayer(null);
        }

        // Update boundary layer
        if (shouldShow || isSelectingArea) {
            const fetchGeoJSON = async () => {
                const geojsonFormat = new GeoJSON();
                try {
                    const data = await API.getBoundaries();

                    const features = geojsonFormat.readFeatures(data, {
                        featureProjection: "EPSG:3857",
                    });

                    const vectorSource = new VectorSource({ features });
                    const newBoundaryLayer = new VectorLayer({
                        source: vectorSource,
                        style: new Style({
                            stroke: new Stroke({ color: "blue", width: 3 }),
                        }),
                    });

                    if (boundaryLayer) map.removeLayer(boundaryLayer);

                    map.addLayer(newBoundaryLayer);
                    setBoundaryLayer(newBoundaryLayer);
                } catch (err) {
                    console.error("Error loading GeoJSON", err);
                }
            };

            fetchGeoJSON();
        } else {
            map.removeLayer(boundaryLayer);
            setBoundaryLayer(null);
        }
    }, [allDocuments, areas, location.pathname, isSelectingCoordinates]);

    // Center the map on the selected document
    useEffect(() => {
        const map = mapInstanceRef.current;
        if (!map || !selectedDocument) return;

        if (selectedDocument.longitude && selectedDocument.latitude) {
            const location = fromLonLat([selectedDocument.longitude, selectedDocument.latitude]);
            map.getView().setCenter(location);
            //map.getView().setZoom(14); // Adjust zoom level as needed
        } else if (selectedDocument.area) {
            const location = fromLonLat([
                selectedDocument.area.centerLon,
                selectedDocument.area.centerLat,
            ]);
            map.getView().setCenter(location);
            //map.getView().setZoom(14); // Adjust zoom level as needed
        }
    }, [selectedDocument]);

    // Handle coordinate selection or document click
    useEffect(() => {
        const map = mapInstanceRef.current;
        if (!map) return;

        const handleMapClick = (event) => {
            if (isSelectingCoordinates) {
                handleCoordinateSelection(event);
            } else {
                handleFeatureSelection(event);
            }
        };

        const handleCoordinateSelection = (event) => {
            const [lon, lat] = toLonLat(event.coordinate);
            handleCoordinatesSelected(lon, lat);
        };

        const handleFeatureSelection = (event) => {
            const clickedFeature = findClickedFeature(event.pixel);

            if (clickedFeature) {
                const features = clickedFeature.get("features"); // Clustered features
                if (features?.length > 1) {
                    // Cluster clicked
                    const clusterDocuments = features.map((feature) => {
                        const documentId = feature.get("documentId");
                        return findMatchedDocument(documentId);
                    });
                    setSelectedCluster(clusterDocuments); // Open ClusterDetailsPanel
                    setSelectedDocument(null); // Clear single document selection
                } else {
                    // Single document clicked

                    //Create new style for the clicked feature

                    const documentId = features?.[0]?.get("documentId");
                    const matchedDocument = findMatchedDocument(documentId);
                    setSelectedDocument(matchedDocument); // Open DetailsPanel
                    setSelectedCluster(null); // Clear cluster selection
                    resetPreviousFeatureStyle(clickedFeatureRef);
                    applyClickStyle(clickedFeature.values_.features[0]);
                    clickedFeatureRef.current = clickedFeature.values_?.features[0];
                }
            } else {
                // Click outside any feature
                setSelectedDocument(null);
                setSelectedCluster(null);
            }
        };

        const findClickedFeature = (pixel) => {
            let clickedFeature = null;

            map.forEachFeatureAtPixel(pixel, (feature, layer) => {
                if (layer.get("name") === "documentLayer") clickedFeature = feature;
            });

            return clickedFeature;
        };

        const findMatchedDocument = (documentId) => {
            return allDocuments.find((doc) => doc.id === documentId) || null;
        };

        const handleGlobalClick = (event) => {
            const mapElement = mapRef.current;
            const panelElement = detailsPanelRef.current;

            if (
                mapElement &&
                !mapElement.contains(event.target) &&
                panelElement &&
                !panelElement.contains(event.target)
            ) {
                setSelectedDocument(null);
            }
        };

        map.on("click", handleMapClick);
        document.addEventListener("click", handleGlobalClick);

        return () => {
            map.un("click", handleMapClick);
            document.removeEventListener("click", handleGlobalClick);
        };
    }, [isSelectingCoordinates, handleCoordinatesSelected, allDocuments]);

    //hover effect
    useEffect(() => {
        const cleanup = handleMapPointerMove({
            mapInstanceRef,
            hoveredFeatureRef,
            isSelectingCoordinates,
            allDocuments,
        });

        return cleanup; // remove effects when unmount component
    }, [allDocuments, areas, isSelectingCoordinates]);

    // hover and click effect
    useEffect(() => { }, [allDocuments, selectedDocument]);

    return (
        <div style={{ position: "absolute", top: "0", left: "0", width: "100%", height: "100%" }}>
            <div id="map" ref={mapRef} style={{ width: "100%", height: "100%" }}></div>
            <Legend iconMap={iconMap} />

            {selectedDocument && location.pathname === "/map" && (
                <DetailsPanel
                    ref={detailsPanelRef}
                    initialDocId={selectedDocument.id}
                    onClose={() => {
                        setSelectedDocument(null);
                        resetPreviousFeatureStyle(clickedFeatureRef);
                        clickedFeatureRef.current = null;
                    }}
                    isLoggedIn={isLoggedIn}
                    see={see}
                    seeOnMap={seeOnMap}
                />
            )}
            {selectedCluster && location.pathname === "/map" && (
                <ClusterDetailsPanel
                    documents={selectedCluster}
                    onClose={() => setSelectedCluster(null)}
                />
            )}
        </div>
    );
};

CityMap.propTypes = {
    handleCoordinatesSelected: PropTypes.func.isRequired,
    isSatelliteView: PropTypes.bool.isRequired,
    handleAreaSelected: PropTypes.func.isRequired,
    centerIn: PropTypes.any,
};

export default CityMap;
