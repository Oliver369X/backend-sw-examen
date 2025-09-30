"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SpringBootTemplateEngine_1 = require("./generators/SpringBootTemplateEngine");
const umlParser_1 = require("./utils/umlParser");
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
// Diagrama UML muy simple
const simpleUML = {
    classes: [
        {
            id: "test_001",
            name: "TestEntity",
            attributes: [
                { name: "id", type: "Long", visibility: "private", isRequired: true },
                { name: "name", type: "String", visibility: "private", isRequired: true }
            ]
        }
    ],
    relationships: [],
    metadata: {
        projectName: "SimpleTest",
        packageName: "com.example.test",
        version: "1.0.0"
    }
};
async function testSimpleGeneration() {
    console.log('🧪 Probando generación simple...\n');
    try {
        // 1. Parsear UML
        const umlData = umlParser_1.UMLParser.parseDiagram(simpleUML);
        console.log(`✅ UML parseado: ${umlData.classes.length} clases`);
        // 2. Generar archivos
        const templateEngine = new SpringBootTemplateEngine_1.SpringBootTemplateEngine();
        const files = await templateEngine.generateProject(umlData, {
            packageName: 'com.example.test',
            projectName: 'SimpleTest',
            databaseType: 'h2',
            includeSwagger: false,
            includeSecurity: false
        });
        console.log(`✅ ${files.length} archivos generados`);
        // 3. Crear directorio de prueba
        const testDir = path_1.default.join(__dirname, '../temp/simple-test');
        await fs_extra_1.default.ensureDir(testDir);
        await fs_extra_1.default.emptyDir(testDir);
        // 4. Escribir archivos
        for (const file of files) {
            const filePath = path_1.default.join(testDir, file.path);
            await fs_extra_1.default.ensureDir(path_1.default.dirname(filePath));
            await fs_extra_1.default.writeFile(filePath, file.content);
            console.log(`📄 ${file.path}`);
        }
        // 5. Probar compilación
        console.log('\n🔨 Probando compilación...');
        const { exec } = require('child_process');
        const { promisify } = require('util');
        const execAsync = promisify(exec);
        process.chdir(testDir);
        const { stdout, stderr } = await execAsync('mvn clean compile -q');
        if (stderr && stderr.includes('ERROR')) {
            console.error('❌ Errores de compilación:');
            console.error(stderr);
        }
        else {
            console.log('✅ Compilación exitosa!');
        }
    }
    catch (error) {
        console.error('❌ Error:', error.message);
        if (error.stderr) {
            console.error('Stderr:', error.stderr);
        }
    }
}
testSimpleGeneration();
