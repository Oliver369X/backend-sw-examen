// Script para probar la generación con plantillas
import { expertSpringBootTemplate } from './experts/expertSpringBootTemplate';
import { exampleUMLDiagram, exampleConfig } from './test-uml-example';
import fs from 'fs-extra';
import path from 'path';

async function testTemplateGeneration() {
  console.log('🧪 Iniciando prueba de generación con PLANTILLAS...');
  
  try {
    // Probar generación con plantillas
    console.log('\n📦 Generando aplicación Spring Boot con PLANTILLAS...');
    const result = await expertSpringBootTemplate.process({
      umlDiagram: exampleUMLDiagram,
      config: exampleConfig
    });

    if (result instanceof Buffer) {
      const tempDir = path.join(__dirname, '../temp');
      await fs.ensureDir(tempDir);
      const zipFile = path.join(tempDir, 'blog-app-templates.zip');
      await fs.writeFile(zipFile, result);
      console.log('✅ Aplicación Spring Boot generada exitosamente con PLANTILLAS');
      console.log('📦 Archivo ZIP guardado en:', zipFile);
      console.log('📊 Tamaño del ZIP:', result.length, 'bytes');
      
      // Mostrar estadísticas
      console.log('\n📈 Estadísticas:');
      console.log(`- Clases generadas: ${exampleUMLDiagram.classes.length}`);
      console.log(`- Relaciones procesadas: ${exampleUMLDiagram.relationships.length}`);
      console.log(`- Proyecto: ${exampleConfig.projectName}`);
      console.log(`- Paquete: ${exampleConfig.packageName}`);
      console.log(`- Base de datos: ${exampleConfig.databaseType}`);
    } else {
      console.error('❌ Error: No se generó un Buffer válido');
    }

  } catch (error) {
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

export { testTemplateGeneration };

