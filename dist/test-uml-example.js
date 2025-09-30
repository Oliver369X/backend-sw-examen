"use strict";
// Ejemplo simple de diagrama UML para probar la generación de Spring Boot
Object.defineProperty(exports, "__esModule", { value: true });
exports.exampleConfig = exports.exampleUMLDiagram = void 0;
exports.exampleUMLDiagram = {
    classes: [
        {
            id: "user_001",
            name: "User",
            attributes: [
                { name: "id", type: "Long", visibility: "private", isRequired: true },
                { name: "email", type: "String", visibility: "private", isRequired: true },
                { name: "username", type: "String", visibility: "private", isRequired: true },
                { name: "password", type: "String", visibility: "private", isRequired: true },
                { name: "createdAt", type: "Date", visibility: "private" }
            ],
            methods: [
                { name: "getEmail", returnType: "String", parameters: [], visibility: "public" },
                { name: "setEmail", returnType: "void", parameters: [{ name: "email", type: "String" }], visibility: "public" }
            ],
            position: { x: 100, y: 100 }
        },
        {
            id: "post_001",
            name: "Post",
            attributes: [
                { name: "id", type: "Long", visibility: "private", isRequired: true },
                { name: "title", type: "String", visibility: "private", isRequired: true },
                { name: "content", type: "String", visibility: "private", isRequired: true },
                { name: "publishedAt", type: "Date", visibility: "private" }
            ],
            position: { x: 400, y: 100 }
        },
        {
            id: "comment_001",
            name: "Comment",
            attributes: [
                { name: "id", type: "Long", visibility: "private", isRequired: true },
                { name: "content", type: "String", visibility: "private", isRequired: true },
                { name: "createdAt", type: "Date", visibility: "private" }
            ],
            position: { x: 700, y: 100 }
        }
    ],
    relationships: [
        {
            id: "rel_001",
            type: "one-to-many",
            sourceClassId: "user_001",
            targetClassId: "post_001",
            cardinality: "1:N",
            name: "authored"
        },
        {
            id: "rel_002",
            type: "one-to-many",
            sourceClassId: "post_001",
            targetClassId: "comment_001",
            cardinality: "1:N",
            name: "has"
        },
        {
            id: "rel_003",
            type: "many-to-one",
            sourceClassId: "comment_001",
            targetClassId: "user_001",
            cardinality: "N:1",
            name: "author"
        }
    ],
    metadata: {
        projectName: "BlogApp",
        packageName: "com.example.blog",
        version: "1.0.0",
        lastModified: new Date()
    }
};
exports.exampleConfig = {
    packageName: "com.example.blog",
    projectName: "BlogApp",
    databaseType: "h2",
    includeSwagger: true,
    includeSecurity: false
};
