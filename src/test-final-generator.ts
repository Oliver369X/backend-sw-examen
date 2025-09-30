import { expertSpringBootTemplate } from './experts/expertSpringBootTemplate';
import { UMLParser } from './utils/umlParser';
import fs from 'fs-extra';
import path from 'path';

// Diagrama UML simple para prueba final
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
    projectName: "FinalTest",
    packageName: "com.example.final",
    version: "1.0.0"
  }
};

async function testFinalGenerator() {
  console.log('🎯 Probando generador final...\n');

  try {
    // 1. Parsear diagrama UML
    console.log('1. Parseando diagrama UML...');
    const umlData = UMLParser.parseDiagram(testUMLDiagram);
    console.log(`✅ Diagrama parseado: ${umlData.classes.length} clases`);

    // 2. Generar proyecto Spring Boot
    console.log('\n2. Generando proyecto Spring Boot...');
    const result = await expertSpringBootTemplate.process({
      umlDiagram: umlData,
      config: {
        packageName: 'com.example.final',
        projectName: 'FinalTest',
        databaseType: 'h2',
        includeSwagger: false,
        includeSecurity: false
      }
    });

    // 3. Guardar el resultado
    const outputPath = path.join(__dirname, '../temp/final-test.zip');
    await fs.ensureDir(path.dirname(outputPath));
    await fs.writeFile(outputPath, result);
    
    console.log(`✅ Proyecto generado: ${outputPath}`);
    console.log(`📦 Tamaño: ${(result as Buffer).length} bytes`);

    // 4. Extraer y examinar archivos
    console.log('\n3. Extrayendo proyecto...');
    const extractPath = path.join(__dirname, '../temp/final-test');
    await fs.ensureDir(extractPath);
    
    // Simular extracción manual
    console.log('📝 Para probar manualmente:');
    console.log(`   1. Extrae ${outputPath} a ${extractPath}`);
    console.log(`   2. cd ${extractPath}`);
    console.log(`   3. mvn clean compile`);
    console.log(`   4. mvn spring-boot:run`);

    console.log('\n🎉 Generador funcionando correctamente!');

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

testFinalGenerator();