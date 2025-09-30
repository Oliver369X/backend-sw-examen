"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const expertSpringBootTemplate_1 = require("./experts/expertSpringBootTemplate");
const umlParser_1 = require("./utils/umlParser");
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
// Diagrama UML simple para debug
const testUMLDiagram = {
    classes: [
        {
            id: "user_001",
            name: "User",
            attributes: [
                { name: "id", type: "Long", visibility: "private", isRequired: true },
                { name: "email", type: "String", visibility: "private", isRequired: true },
                { name: "username", type: "String", visibility: "private", isRequired: true }
            ]
        }
    ],
    relationships: [],
    metadata: {
        projectName: "DebugApp",
        packageName: "com.example.debug",
        version: "1.0.0"
    }
};
async function debugGenerator() {
    console.log('🔍 Debug del generador...\n');
    try {
        // 1. Parsear diagrama UML
        console.log('1. Parseando diagrama UML...');
        const umlData = umlParser_1.UMLParser.parseDiagram(testUMLDiagram);
        console.log(`✅ Diagrama parseado: ${umlData.classes.length} clases`);
        // 2. Generar proyecto Spring Boot
        console.log('\n2. Generando proyecto Spring Boot...');
        const result = await expertSpringBootTemplate_1.expertSpringBootTemplate.process({
            umlDiagram: umlData,
            config: {
                packageName: 'com.example.debug',
                projectName: 'DebugApp',
                databaseType: 'h2',
                includeSwagger: false,
                includeSecurity: false
            }
        });
        // 3. Guardar el resultado
        const outputPath = path_1.default.join(__dirname, '../temp/debug-app.zip');
        await fs_extra_1.default.ensureDir(path_1.default.dirname(outputPath));
        await fs_extra_1.default.writeFile(outputPath, result);
        console.log(`✅ Proyecto generado: ${outputPath}`);
        console.log(`📦 Tamaño: ${result.length} bytes`);
        // 4. Extraer y probar compilación
        console.log('\n3. Extrayendo proyecto...');
        const extractPath = path_1.default.join(__dirname, '../temp/debug-app');
        await fs_extra_1.default.ensureDir(extractPath);
        // Simular extracción manual
        console.log('📝 Para probar:');
        console.log(`   1. Extrae ${outputPath} a ${extractPath}`);
        console.log(`   2. cd ${extractPath}`);
        console.log(`   3. mvn clean compile`);
    }
    catch (error) {
        console.error('❌ Error:', error.message);
        console.error('Stack:', error.stack);
    }
}
debugGenerator();
