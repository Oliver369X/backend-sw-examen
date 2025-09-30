"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testTemplateGeneration = testTemplateGeneration;
// Script para probar la generación con plantillas
const expertSpringBootTemplate_1 = require("./experts/expertSpringBootTemplate");
const test_uml_example_1 = require("./test-uml-example");
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
async function testTemplateGeneration() {
    console.log('🧪 Iniciando prueba de generación con PLANTILLAS...');
    try {
        // Probar generación con plantillas
        console.log('\n📦 Generando aplicación Spring Boot con PLANTILLAS...');
        const result = await expertSpringBootTemplate_1.expertSpringBootTemplate.process({
            umlDiagram: test_uml_example_1.exampleUMLDiagram,
            config: test_uml_example_1.exampleConfig
        });
        if (result instanceof Buffer) {
            const tempDir = path_1.default.join(__dirname, '../temp');
            await fs_extra_1.default.ensureDir(tempDir);
            const zipFile = path_1.default.join(tempDir, 'blog-app-templates.zip');
            await fs_extra_1.default.writeFile(zipFile, result);
            console.log('✅ Aplicación Spring Boot generada exitosamente con PLANTILLAS');
            console.log('📦 Archivo ZIP guardado en:', zipFile);
            console.log('📊 Tamaño del ZIP:', result.length, 'bytes');
            // Mostrar estadísticas
            console.log('\n📈 Estadísticas:');
            console.log(`- Clases generadas: ${test_uml_example_1.exampleUMLDiagram.classes.length}`);
            console.log(`- Relaciones procesadas: ${test_uml_example_1.exampleUMLDiagram.relationships.length}`);
            console.log(`- Proyecto: ${test_uml_example_1.exampleConfig.projectName}`);
            console.log(`- Paquete: ${test_uml_example_1.exampleConfig.packageName}`);
            console.log(`- Base de datos: ${test_uml_example_1.exampleConfig.databaseType}`);
        }
        else {
            console.error('❌ Error: No se generó un Buffer válido');
        }
    }
    catch (error) {
        console.error('❌ Error durante la prueba:', error);
    }
}
// Ejecutar solo si se llama directamente
if (require.main === module) {
    testTemplateGeneration()
        .then(() => {
        console.log('\n🎉 Prueba de plantillas completada');
        process.exit(0);
    })
        .catch((error) => {
        console.error('💥 Error fatal:', error);
        process.exit(1);
    });
}
