"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.expertSpringBootTemplate = void 0;
const expertBase_1 = require("./expertBase");
const SpringBootTemplateEngine_1 = require("../generators/SpringBootTemplateEngine");
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const archiver_1 = __importDefault(require("archiver"));
exports.expertSpringBootTemplate = (0, expertBase_1.createExpert)({
    name: 'Spring Boot Template Generator',
    systemPrompt: `Eres un sistema automatizado para generar una aplicación Spring Boot completa a partir de un diagrama UML de clases usando plantillas predefinidas.
Tu función principal es procesar el diagrama UML y generar código Java usando plantillas Handlebars, sin usar IA para generar código.

El sistema genera:
- Entidades JPA con anotaciones apropiadas
- Repositorios JPA con métodos básicos
- Servicios con lógica CRUD
- Controladores REST con endpoints básicos
- Configuración de proyecto Maven
- Archivos de configuración de base de datos

El código generado es consistente, funcional y sigue las mejores prácticas de Spring Boot.`,
    async process(input) {
        const { umlDiagram, config } = input;
        if (!umlDiagram || !umlDiagram.classes || umlDiagram.classes.length === 0) {
            console.error('ERROR: No se proporcionó un diagrama UML válido para generar la aplicación Spring Boot.');
            throw new Error('No se proporcionó un diagrama UML válido para generar la aplicación Spring Boot.');
        }
        const projectName = config?.projectName || umlDiagram.metadata?.projectName || 'spring-boot-app';
        const tempAppName = `${projectName}_${Date.now()}`;
        const tempDir = path_1.default.join(__dirname, `../../../temp/${tempAppName}`);
        try {
            // 1. Crear directorio temporal
            await fs_extra_1.default.emptyDir(tempDir);
            console.log(`Directorio temporal creado/limpiado: ${tempDir}`);
            // 2. Usar el motor de plantillas para generar archivos
            const templateEngine = new SpringBootTemplateEngine_1.SpringBootTemplateEngine();
            const generatedFiles = await templateEngine.generateProject(umlDiagram, config || {});
            // 3. Escribir todos los archivos generados
            for (const file of generatedFiles) {
                const filePath = path_1.default.join(tempDir, file.path);
                await fs_extra_1.default.ensureDir(path_1.default.dirname(filePath));
                await fs_extra_1.default.writeFile(filePath, file.content);
                console.log(`Archivo generado: ${file.path}`);
            }
            // 4. Validar compilación del proyecto generado
            console.log('Validando compilación del proyecto generado...');
            const compilationValid = await templateEngine.validateProjectCompilation(tempDir);
            if (!compilationValid) {
                console.warn('⚠️  Advertencia: El proyecto generado tiene errores de compilación');
                console.warn('   Se recomienda revisar los archivos generados antes de usar');
            }
            else {
                console.log('✅ Proyecto compilado exitosamente');
            }
            // 5. Empaquetar todo en un ZIP
            const archive = (0, archiver_1.default)('zip', {
                zlib: { level: 9 }
            });
            const zipBuffer = await new Promise((resolve, reject) => {
                const buffers = [];
                archive.on('data', (buffer) => buffers.push(buffer));
                archive.on('end', () => resolve(Buffer.concat(buffers)));
                archive.on('error', (err) => reject(err));
                archive.directory(tempDir, false);
                archive.finalize();
            });
            console.log(`Aplicación Spring Boot generada con plantillas. Tamaño: ${zipBuffer.length} bytes`);
            // 6. Limpiar directorio temporal (solo si no hay errores)
            try {
                await fs_extra_1.default.remove(tempDir);
                console.log(`Directorio temporal ${tempDir} eliminado.`);
            }
            catch (cleanupError) {
                console.warn(`No se pudo eliminar el directorio temporal ${tempDir}:`, cleanupError.message);
                console.log(`Directorio temporal mantenido en: ${tempDir}`);
            }
            return zipBuffer;
        }
        catch (error) {
            console.error('Error generando la aplicación Spring Boot con plantillas:', error);
            if (await fs_extra_1.default.pathExists(tempDir)) {
                await fs_extra_1.default.remove(tempDir);
                console.log(`Limpieza del directorio temporal ${tempDir} debido a un error.`);
            }
            throw new Error(`Error al generar la aplicación Spring Boot: ${error.message}`);
        }
    }
});
