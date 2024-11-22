# API Server

-   GET /api/connections

    Response:

```json
    { "connections": ["Direct Consequence", ...] }
```

-   GET /api/stakeholders

    Response:

```json
    { "stakeholders": [
        {
            "id": 1,
            "name": "LKAB",
            "color": "#000000"
        },
        ...
    ]}
```

## Documents

-   GET /api/documents/:id

    Response:

    ```json
    {
        "document": {
            "id": 2,
            "title": "Detail plan for Bolagsomradet Gruvstadspark (18)",
            "scaleType": "Plan",
            "scaleValue": "1:8.000",
            "issuanceDate": "2010-10-20T00:00:00.000Z",
            "type": "Prescriptive Document",
            "language": "Swedish",
            "pages": "1-32",
            "description": "This is ...",
            "stakeholders": [
                {
                    "id": 2,
                    "name": "Municipality",
                    "color": "#FF0000"
                }
            ],
            "connections": [
                {
                    "id": 5,
                    "relationship": "Update",
                    "targetDocument": {
                        "id": 6,
                        ...,
                        "description": "This document is ...",
                    }
                },
                {
                    "id": 7,
                    "relationship": "Prevision",
                    "targetDocument": {
                        "id": 3,
                        ...,
                        "description": "The development plan ...",
                    }
                }
            ]
        }
    }
    ```

-   GET /api/documents

    Response:

    ```json
    {
        "documents": [...(same form as previous get document by id)]
    }
    ```

### Authenticated

-   POST /api/documents

    Header:

    **Authorization: Bearer <your_jwt_token>**

    Body:

    ```json
    {
        "title": "Sample Document",
        "scaleType": "Plan",
        "scaleValue": "1:1.000",
        "issuanceDate": "2014-02-14T00:00:00.000Z",
        "type": "Technical Document",
        "language": "English",
        "pages": "12",
        "description": "This is a description",
        "stakeholders": [{ "id": 1 }, { "id": 2 }],
        "connections": [{"documentId": 1, "relationship": "Prevision"}, ...]
    }
    ```

    Response:

    ```json
    {
        "document": {
            "id": 11,
            "title": "Sample Document",
            "scaleType": "Plan",
            "scaleValue": "1:1.000",
            "issuanceDate": "2014-02-14T00:00:00.000Z",
            "type": "Technical Document",
            "language": "English",
            "pages": "12",
            "description": "This is a description",
            "allMunicipality": null,
            "latitude": null,
            "longitude": null,
            "stakeholders": [
                {
                    "id": 1,
                    "name": "Citizens",
                    "color": "#FFFF00"
                }
            ],
            "connections": [
                {
                    "id": 11,
                    "relationship": "Prevision",
                    "targetDocument": {
                        "id": 1,
                        ...,
                        "longitude": null
                    }
                },
                ...,
            ]
        }
    }
    ```

-   PUT /api/documents/:id

    Header:

    **Authorization: Bearer <your_jwt_token>**

    Body:

    ```json
    {
        "title": "New Document",
        "scaleType": "Plan",
        "scaleValue": "1:1.000",
        "issuanceDate": "2014-02-14T00:00:00.000Z",
        "type": "Technical Document",
        "language": "English",
        "pages": "12",
        "description": "This is a new description",
        "stakeholders": [{ "id": 1 }, { "id": 2 }],
        "connections": [{"documentId": 1, "relationship": "Prevision"}, ...]
    }
    ```

    Response:

    ```json
    {
        "document": {
            "id": 11,
            "title": "Sample Document",
            "scaleType": "Plan",
            "scaleValue": "1:1.000",
            "issuanceDate": "2014-02-14T00:00:00.000Z",
            "type": "Technical Document",
            "language": "English",
            "pages": "12",
            "description": "This is a description",
            "allMunicipality": null,
            "latitude": null,
            "longitude": null,
            "stakeholders": [
                {
                    "id": 1,
                    "name": "Citizens",
                    "color": "#FFFF00"
                }
            ],
            "connections": [
                {
                    "id": 11,
                    "relationship": "Prevision",
                    "targetDocument": {
                        "id": 1,
                        ...,
                        "longitude": null
                    }
                },
                ...,
            ]
        }
    }
    ```

## Users

-   POST /api/users/register

    Body:

    ```json
    {
        "username": "aUsername",
        "password": "aStrongPassword"
    }
    ```

    Response:

    ```json
    {
        "message": "User created",
        "user": "aUsername"
    }
    ```

-   POST /api/users/login

    Body:

    ```json
    {
        "username": "aUsername",
        "password": "aStrongPassword"
    }
    ```

    Response:

    ```json
    {
        "message": "Login successful",
        "token": "eyJhbGciOi...qDUpt4E"
    }
    ```
