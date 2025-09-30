"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpringBootTemplateEngine = void 0;
const handlebars_1 = __importDefault(require("handlebars"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const umlParser_1 = require("../utils/umlParser");
// Registrar helpers personalizados para Handlebars
handlebars_1.default.registerHelper('eq', function (a, b) {
    return a === b;
});
handlebars_1.default.registerHelper('capitalize', function (str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
});
handlebars_1.default.registerHelper('lowercase', function (str) {
    return str.toLowerCase();
});
handlebars_1.default.registerHelper('uppercase', function (str) {
    return str.toUpperCase();
});
class SpringBootTemplateEngine {
    constructor() {
        this.templatesPath = path_1.default.join(__dirname, '../templates/springboot');
    }
    /**
     * Genera un proyecto Spring Boot completo desde un diagrama UML
     */
    async generateProject(umlDiagram, config) {
        const files = [];
        // Validar nombre de paquete
        const validatedPackageName = this.validatePackageName(config.packageName || 'com.example.app');
        if (validatedPackageName !== config.packageName) {
            console.warn(`⚠️  Nombre de paquete corregido: ${config.packageName} → ${validatedPackageName}`);
        }
        // Configuración por defecto
        const defaultConfig = {
            projectName: 'SpringBootApp',
            databaseType: 'h2',
            includeSwagger: false,
            includeSecurity: false,
            ...config,
            packageName: validatedPackageName // Forzar el uso del paquete validado
        };
        // Generar archivos para cada clase
        for (const umlClass of umlDiagram.classes) {
            const classData = this.prepareClassData(umlClass, umlDiagram.relationships, defaultConfig);
            // Generar entidad
            files.push(await this.generateEntity(classData, defaultConfig));
            // Generar DTO
            files.push(await this.generateDTO(classData, defaultConfig));
            // Generar Mapper
            files.push(await this.generateMapper(classData, defaultConfig));
            // Generar repositorio
            files.push(await this.generateRepository(classData, defaultConfig));
            // Generar servicio
            files.push(await this.generateService(classData, defaultConfig));
            // Generar controlador
            files.push(await this.generateController(classData, defaultConfig));
        }
        // Generar archivos de configuración
        files.push(await this.generatePomXml(defaultConfig));
        files.push(await this.generateApplicationProperties(defaultConfig));
        files.push(await this.generateMainClass(defaultConfig));
        // Generar archivos de testing
        for (const umlClass of umlDiagram.classes) {
            const classData = this.prepareClassData(umlClass, umlDiagram.relationships, defaultConfig);
            files.push(await this.generateEntityTest(classData, defaultConfig));
            files.push(await this.generateServiceTest(classData, defaultConfig));
        }
        // Generar archivos de configuración avanzada
        if (config?.includeSecurity) {
            files.push(await this.generateSecurityConfig(defaultConfig));
        }
        files.push(await this.generateCacheConfig(defaultConfig));
        files.push(await this.generateGlobalExceptionHandler(defaultConfig));
        return files;
    }
    /**
     * Prepara los datos de una clase para las plantillas
     */
    prepareClassData(umlClass, relationships, config) {
        const classRelationships = relationships.filter(rel => rel.sourceClassId === umlClass.id || rel.targetClassId === umlClass.id);
        const processedRelationships = classRelationships.map(rel => {
            const isSource = rel.sourceClassId === umlClass.id;
            const targetClassId = isSource ? rel.targetClassId : rel.sourceClassId;
            return {
                ...rel,
                targetClass: this.toPascalCase(this.findClassNameById(targetClassId, relationships)),
                propertyName: this.toCamelCase(this.generatePropertyName(rel, umlClass.id)),
                mappedBy: this.generateMappedBy(rel, umlClass.id),
                joinColumn: this.generateJoinColumn(rel, umlClass.id),
                joinTable: this.generateJoinTable(rel),
                inverseJoinColumn: this.generateInverseJoinColumn(rel, umlClass.id)
            };
        });
        // Asegurar que siempre haya un campo ID
        let attributes = [...umlClass.attributes];
        const hasId = attributes.some(attr => attr.name.toLowerCase() === 'id');
        if (!hasId) {
            console.warn(`⚠️  Clase ${umlClass.name} no tiene campo 'id', se agregará automáticamente`);
            attributes.unshift({
                name: 'id',
                type: 'Long',
                visibility: 'private',
                isRequired: true
            });
        }
        return {
            className: umlClass.name,
            tableName: this.validateTableName(this.toSnakeCase(umlClass.name)),
            packageName: config.packageName,
            attributes: attributes.map(attr => ({
                ...attr,
                javaType: umlParser_1.UMLParser.mapUMLTypeToJava(attr.type),
                nullable: !attr.isRequired,
                unique: attr.name === 'email' || attr.name === 'username' || attr.name === 'code',
                maxLength: this.getMaxLength(attr.type),
                minValue: this.getMinValue(attr.type),
                maxValue: this.getMaxValue(attr.type),
                columnDefinition: this.getColumnDefinition(attr.type),
                snakeCase: this.toSnakeCase(attr.name)
            })),
            relationships: processedRelationships,
            imports: this.generateImports(umlClass, processedRelationships),
            idField: attributes.find(attr => attr.name.toLowerCase() === 'id')?.name || 'id',
            idType: umlParser_1.UMLParser.mapUMLTypeToJava(attributes.find(attr => attr.name.toLowerCase() === 'id')?.type || 'Long'),
            hasUniqueConstraints: this.hasUniqueConstraints(attributes),
            uniqueConstraints: this.generateUniqueConstraints(attributes),
            repositoryName: `${this.toCamelCase(umlClass.name)}Repository`,
            serviceName: `${this.toCamelCase(umlClass.name)}Service`,
            entityName: this.toCamelCase(umlClass.name),
            entityListName: `${umlClass.name.toLowerCase()}s`,
            endpoint: this.toKebabCase(umlClass.name)
        };
    }
    /**
     * Genera una entidad JPA
     */
    async generateEntity(classData, config) {
        const template = await this.loadTemplate('entity.hbs');
        const content = template(classData);
        // Validar el código generado
        this.validateGeneratedCode(content, `${classData.className}.java`);
        return {
            path: `src/main/java/${config.packageName?.replace(/\./g, '/')}/entity/${classData.className}.java`,
            content
        };
    }
    /**
     * Genera un DTO
     */
    async generateDTO(classData, config) {
        const template = await this.loadTemplate('dto.hbs');
        const content = template(classData);
        return {
            path: `src/main/java/${config.packageName?.replace(/\./g, '/')}/dto/${classData.className}DTO.java`,
            content
        };
    }
    /**
     * Genera un Mapper
     */
    async generateMapper(classData, config) {
        const template = await this.loadTemplate('mapper.hbs');
        const content = template(classData);
        return {
            path: `src/main/java/${config.packageName?.replace(/\./g, '/')}/mapper/${classData.className}Mapper.java`,
            content
        };
    }
    /**
     * Genera un repositorio JPA
     */
    async generateRepository(classData, config) {
        const template = await this.loadTemplate('repository.hbs');
        const data = {
            ...classData,
            repositoryName: `${classData.className}Repository`,
            queryMethods: this.generateQueryMethods(classData)
        };
        const content = template(data);
        return {
            path: `src/main/java/${config.packageName?.replace(/\./g, '/')}/repository/${classData.className}Repository.java`,
            content
        };
    }
    /**
     * Genera un servicio
     */
    async generateService(classData, config) {
        const template = await this.loadTemplate('service.hbs');
        const data = {
            ...classData,
            serviceName: `${classData.className}Service`,
            repositoryName: `${classData.className.toLowerCase()}Repository`,
            entityName: this.toCamelCase(classData.className),
            customMethods: []
        };
        const content = template(data);
        return {
            path: `src/main/java/${config.packageName?.replace(/\./g, '/')}/service/${classData.className}Service.java`,
            content
        };
    }
    /**
     * Genera un controlador REST
     */
    async generateController(classData, config) {
        const template = await this.loadTemplate('controller.hbs');
        const data = {
            ...classData,
            controllerName: `${classData.className}Controller`,
            serviceName: `${classData.className.toLowerCase()}Service`,
            entityName: classData.className.toLowerCase(),
            entityListName: `${classData.className.toLowerCase()}s`,
            endpoint: this.toKebabCase(classData.className),
            customEndpoints: []
        };
        const content = template(data);
        return {
            path: `src/main/java/${config.packageName?.replace(/\./g, '/')}/controller/${classData.className}Controller.java`,
            content
        };
    }
    /**
     * Genera pom.xml
     */
    async generatePomXml(config) {
        const template = await this.loadTemplate('pom.xml.hbs');
        const content = template(config);
        return {
            path: 'pom.xml',
            content
        };
    }
    /**
     * Genera application.properties
     */
    async generateApplicationProperties(config) {
        const template = await this.loadTemplate('application.properties.hbs');
        const content = template(config);
        return {
            path: 'src/main/resources/application.properties',
            content
        };
    }
    /**
     * Genera la clase principal de Spring Boot
     */
    async generateMainClass(config) {
        const template = await this.loadTemplate('Application.java.hbs');
        const content = template(config);
        return {
            path: `src/main/java/${config.packageName?.replace(/\./g, '/')}/${config.projectName}Application.java`,
            content
        };
    }
    /**
     * Genera test de entidad
     */
    async generateEntityTest(classData, config) {
        const template = await this.loadTemplate('EntityTest.hbs');
        // Agregar imports específicos para entity tests
        const testData = {
            ...classData,
            imports: this.generateImportsForTests(classData, false)
        };
        const content = template(testData);
        return {
            path: `src/test/java/${config.packageName?.replace(/\./g, '/')}/${classData.className}Test.java`,
            content
        };
    }
    /**
     * Genera test de servicio
     */
    async generateServiceTest(classData, config) {
        const template = await this.loadTemplate('ServiceTest.hbs');
        // Agregar imports específicos para service tests
        const testData = {
            ...classData,
            imports: this.generateImportsForTests(classData, true)
        };
        const content = template(testData);
        return {
            path: `src/test/java/${config.packageName?.replace(/\./g, '/')}/${classData.className}ServiceTest.java`,
            content
        };
    }
    /**
     * Genera configuración de seguridad
     */
    async generateSecurityConfig(config) {
        const template = await this.loadTemplate('SecurityConfig.hbs');
        const content = template(config);
        return {
            path: `src/main/java/${config.packageName?.replace(/\./g, '/')}/config/SecurityConfig.java`,
            content
        };
    }
    /**
     * Genera configuración de cache
     */
    async generateCacheConfig(config) {
        const template = await this.loadTemplate('CacheConfig.hbs');
        const content = template(config);
        return {
            path: `src/main/java/${config.packageName?.replace(/\./g, '/')}/config/CacheConfig.java`,
            content
        };
    }
    /**
     * Genera manejador global de excepciones
     */
    async generateGlobalExceptionHandler(config) {
        const template = await this.loadTemplate('GlobalExceptionHandler.hbs');
        const content = template(config);
        return {
            path: `src/main/java/${config.packageName?.replace(/\./g, '/')}/config/GlobalExceptionHandler.java`,
            content
        };
    }
    /**
     * Carga una plantilla Handlebars
     */
    async loadTemplate(templateName) {
        const templatePath = path_1.default.join(this.templatesPath, templateName);
        const templateSource = await fs_extra_1.default.readFile(templatePath, 'utf-8');
        return handlebars_1.default.compile(templateSource);
    }
    /**
     * Genera imports necesarios para una clase
     */
    generateImports(umlClass, relationships) {
        const imports = new Set();
        // Imports básicos de JPA
        imports.add('jakarta.persistence.*');
        imports.add('jakarta.validation.constraints.*');
        imports.add('java.util.*');
        imports.add('java.util.Objects');
        // Imports para relaciones
        if (relationships.length > 0) {
            imports.add('java.util.ArrayList');
            imports.add('java.util.List');
        }
        // Verificar tipos específicos
        const hasDates = umlClass.attributes.some(attr => attr.type.toLowerCase().includes('date') || attr.type.toLowerCase().includes('time'));
        if (hasDates) {
            imports.add('java.time.LocalDateTime');
        }
        return Array.from(imports);
    }
    /**
     * Genera imports específicos para tests
     */
    generateImportsForTests(classData, isServiceTest = false) {
        const imports = new Set();
        // Imports básicos para tests
        imports.add('org.junit.jupiter.api.Test');
        imports.add('org.junit.jupiter.api.BeforeEach');
        imports.add('static org.junit.jupiter.api.Assertions.*');
        if (isServiceTest) {
            // Imports para service tests
            imports.add('org.junit.jupiter.api.extension.ExtendWith');
            imports.add('org.mockito.InjectMocks');
            imports.add('org.mockito.Mock');
            imports.add('org.mockito.junit.jupiter.MockitoExtension');
            imports.add('static org.mockito.Mockito.*');
            imports.add('java.util.List');
            imports.add('java.util.Optional');
            imports.add('org.springframework.data.domain.Page');
            imports.add('org.springframework.data.domain.PageImpl');
            imports.add('org.springframework.data.domain.Pageable');
            // Imports específicos del proyecto
            imports.add(`${classData.packageName}.entity.${classData.className}`);
            imports.add(`${classData.packageName}.dto.${classData.className}DTO`);
            imports.add(`${classData.packageName}.repository.${classData.className}Repository`);
            imports.add(`${classData.packageName}.service.${classData.className}Service`);
            imports.add(`${classData.packageName}.mapper.${classData.className}Mapper`);
        }
        else {
            // Imports para entity tests
            imports.add('org.springframework.boot.test.context.SpringBootTest');
            imports.add('org.springframework.test.context.ActiveProfiles');
            imports.add('org.springframework.transaction.annotation.Transactional');
            imports.add('org.springframework.beans.factory.annotation.Autowired');
            imports.add('java.util.Optional');
            // Imports específicos del proyecto
            imports.add(`${classData.packageName}.entity.${classData.className}`);
            imports.add(`${classData.packageName}.repository.${classData.className}Repository`);
        }
        return Array.from(imports);
    }
    /**
     * Genera métodos de consulta para repositorios
     */
    generateQueryMethods(classData) {
        const methods = [];
        // Métodos básicos basados en atributos
        for (const attr of classData.attributes) {
            if (attr.unique) {
                methods.push({
                    type: 'findBy',
                    field: attr.name,
                    fieldType: attr.javaType
                });
                methods.push({
                    type: 'existsBy',
                    field: attr.name,
                    fieldType: attr.javaType
                });
            }
        }
        return methods;
    }
    /**
     * Encuentra el nombre de clase por ID
     */
    findClassNameById(classId, relationships) {
        // Esta función debería recibir todas las clases, pero por simplicidad
        // asumimos que el ID contiene el nombre de la clase
        return classId.replace(/_001$/, '');
    }
    /**
     * Genera nombre de propiedad para relaciones
     */
    generatePropertyName(relationship, classId) {
        if (relationship.name) {
            return relationship.name;
        }
        const targetClass = this.findClassNameById(relationship.sourceClassId === classId ? relationship.targetClassId : relationship.sourceClassId, []);
        return this.toCamelCase(targetClass);
    }
    /**
     * Genera mappedBy para relaciones
     */
    generateMappedBy(relationship, classId) {
        if (relationship.type === 'one-to-many') {
            const sourceClass = this.findClassNameById(classId, []);
            return this.toCamelCase(sourceClass);
        }
        return '';
    }
    /**
     * Genera nombre de columna de join
     */
    generateJoinColumn(relationship, classId) {
        const targetClass = this.findClassNameById(relationship.sourceClassId === classId ? relationship.targetClassId : relationship.sourceClassId, []);
        return `${this.toSnakeCase(targetClass)}_id`;
    }
    /**
     * Genera nombre de tabla de join para many-to-many
     */
    generateJoinTable(relationship) {
        const sourceClass = this.findClassNameById(relationship.sourceClassId, []);
        const targetClass = this.findClassNameById(relationship.targetClassId, []);
        return `${this.toSnakeCase(sourceClass)}_${this.toSnakeCase(targetClass)}`;
    }
    /**
     * Genera nombre de columna inversa para many-to-many
     */
    generateInverseJoinColumn(relationship, classId) {
        const targetClass = this.findClassNameById(relationship.sourceClassId === classId ? relationship.targetClassId : relationship.sourceClassId, []);
        return `${this.toSnakeCase(targetClass)}_id`;
    }
    /**
     * Utilidades de conversión de texto
     */
    toPascalCase(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    toCamelCase(str) {
        return str.charAt(0).toLowerCase() + str.slice(1);
    }
    toSnakeCase(str) {
        return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`).replace(/^_/, '');
    }
    toKebabCase(str) {
        return str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`).replace(/^-/, '');
    }
    /**
     * Obtiene la longitud máxima para un tipo
     */
    getMaxLength(type) {
        const maxLengths = {
            'String': 255,
            'Long': undefined,
            'Integer': undefined,
            'Boolean': undefined,
            'Date': undefined
        };
        return maxLengths[type] || 255;
    }
    /**
     * Obtiene el valor mínimo para un tipo
     */
    getMinValue(type) {
        if (type === 'Integer')
            return 0;
        if (type === 'Long')
            return 0;
        return undefined;
    }
    /**
     * Obtiene el valor máximo para un tipo
     */
    getMaxValue(type) {
        if (type === 'Integer')
            return 2147483647;
        if (type === 'Long')
            return undefined;
        return undefined;
    }
    /**
     * Obtiene la definición de columna para un tipo
     */
    getColumnDefinition(type) {
        const definitions = {
            'Date': 'TIMESTAMP',
            'BigDecimal': 'DECIMAL(10,2)'
        };
        return definitions[type];
    }
    /**
     * Verifica si hay restricciones únicas
     */
    hasUniqueConstraints(attributes) {
        return attributes.some(attr => attr.unique);
    }
    /**
     * Genera restricciones únicas
     */
    generateUniqueConstraints(attributes) {
        const uniqueAttrs = attributes.filter(attr => attr.unique);
        return uniqueAttrs.map(attr => ({
            columns: [this.toSnakeCase(attr.name)]
        }));
    }
    /**
     * Valida nombres de tablas para evitar palabras reservadas SQL
     */
    validateTableName(tableName) {
        const reservedWords = ['user', 'order', 'group', 'select', 'from', 'where', 'table', 'index'];
        const lowerTableName = tableName.toLowerCase();
        if (reservedWords.includes(lowerTableName)) {
            return tableName + 's'; // Agregar 's' para pluralizar
        }
        return tableName;
    }
    validatePackageName(packageName) {
        const javaReservedWords = [
            'abstract', 'assert', 'boolean', 'break', 'byte', 'case', 'catch', 'char', 'class',
            'const', 'continue', 'default', 'do', 'double', 'else', 'enum', 'extends', 'false',
            'final', 'finally', 'float', 'for', 'goto', 'if', 'implements', 'import', 'instanceof',
            'int', 'interface', 'long', 'native', 'new', 'null', 'package', 'private', 'protected',
            'public', 'return', 'short', 'static', 'strictfp', 'super', 'switch', 'synchronized',
            'this', 'throw', 'throws', 'transient', 'true', 'try', 'void', 'volatile', 'while'
        ];
        const parts = packageName.split('.');
        const correctedParts = parts.map(part => {
            if (javaReservedWords.includes(part.toLowerCase())) {
                return part + 'app'; // Agregar 'app' para evitar conflicto
            }
            return part;
        });
        return correctedParts.join('.');
    }
    /**
     * Valida sintaxis básica del código generado
     */
    validateGeneratedCode(code, fileName) {
        // Validar constructores
        const constructorMatch = code.match(/public\s+\w+\s*\([^)]*\)/g);
        if (constructorMatch) {
            constructorMatch.forEach(constructor => {
                if (constructor.includes(',,')) {
                    throw new Error(`Constructor en ${fileName} tiene parámetros sin nombre: ${constructor}`);
                }
            });
        }
        // Validar toString
        if (code.includes('+\n\n\n+')) {
            throw new Error(`Método toString() en ${fileName} tiene concatenación incompleta`);
        }
        // Validar imports
        if (code.includes('Arrays.asList') && !code.includes('import java.util.Arrays')) {
            throw new Error(`Falta import de Arrays en ${fileName}`);
        }
        // Validar sintaxis de métodos setter
        if (code.includes('\n    .')) {
            throw new Error(`Método setter incompleto en ${fileName}: falta variable antes del punto`);
        }
        // Validar nombres de variables inválidos (números)
        if (code.match(/\d+\.setName/)) {
            throw new Error(`Nombre de variable inválido en ${fileName}: no puede empezar con número`);
        }
        // Validar cache annotations vacías
        if (code.match(/@Cache\w+\([^)]*value\s*=\s*""\s*[^)]*\)/)) {
            throw new Error(`Anotación de cache con valor vacío en ${fileName}`);
        }
        // Validar variables no definidas en tests
        if (fileName.includes('Test.java')) {
            const undefinedVars = code.match(/(?:saved|updated)\.(?!contains|equals)/g);
            if (undefinedVars) {
                throw new Error(`Variables no definidas en ${fileName}: ${undefinedVars.join(', ')}`);
            }
        }
        // Validar que los tests usen DTOs en lugar de Entities
        if (fileName.includes('ServiceTest.java')) {
            if (code.includes('List<{{className}}> result = {{serviceName}}.findAll()')) {
                throw new Error(`ServiceTest en ${fileName} debe usar DTOs, no Entities`);
            }
        }
    }
    /**
     * Compila y valida el proyecto generado
     */
    async validateProjectCompilation(projectPath) {
        try {
            const { exec } = require('child_process');
            const { promisify } = require('util');
            const execAsync = promisify(exec);
            // Cambiar al directorio del proyecto
            process.chdir(projectPath);
            // Ejecutar compilación
            const { stdout, stderr } = await execAsync('mvn clean compile -q');
            if (stderr && stderr.includes('ERROR')) {
                console.error('Errores de compilación encontrados:', stderr);
                return false;
            }
            return true;
        }
        catch (error) {
            console.error('Error durante la validación de compilación:', error.message);
            return false;
        }
    }
}
exports.SpringBootTemplateEngine = SpringBootTemplateEngine;
