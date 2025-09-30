/* // Script para probar la generación de Spring Boot
import { expertUMLToSpringBoot } from './experts/expertUMLToSpringBoot';
//import { expertSpringBootAppGen } from './experts/expertSpringBootAppGen';
import { exampleUMLDiagram, exampleConfig } from './test-uml-example';
import fs from 'fs-extra';
import path from 'path';

async function testSpringBootGeneration() {
  console.log('🧪 Iniciando prueba de generación Spring Boot...');
  
  try {
    // Probar generación de código individual
    console.log('\n📝 Generando código Spring Boot individual...');
    const codeResult = await expertUMLToSpringBoot.process({
      umlDiagram: exampleUMLDiagram,
      config: exampleConfig
    });

    if (codeResult.error) {
      console.error('❌ Error en generación de código:', codeResult.error);
      return;
    }

    console.log('✅ Código Spring Boot generado exitosamente');
    console.log('📄 Longitud del código:', codeResult.springBootCode.length);

    // Guardar código en archivo temporal
    const tempDir = path.join(__dirname, '../temp');
    await fs.ensureDir(tempDir);
    const codeFile = path.join(tempDir, 'generated-springboot-code.txt');
    await fs.writeFile(codeFile, codeResult.springBootCode);
    console.log('💾 Código guardado en:', codeFile);

    // Probar generación de aplicación completa
    console.log('\n📦 Generando aplicación Spring Boot completa...');
    const appResult = await expertSpringBootAppGen.process({
      umlDiagram: exampleUMLDiagram,
      config: exampleConfig
    });

    if (appResult instanceof Buffer) {
      const zipFile = path.join(tempDir, 'blog-app.zip');
      await fs.writeFile(zipFile, appResult);
      console.log('✅ Aplicación Spring Boot generada exitosamente');
      console.log('📦 Archivo ZIP guardado en:', zipFile);
      console.log('📊 Tamaño del ZIP:', appResult.length, 'bytes');
    } else {
      console.error('❌ Error: No se generó un Buffer válido');
    }

  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
  }
}

// Ejecutar solo si se llama directamente
if (require.main === module) {
  testSpringBootGeneration()
    .then(() => {
      console.log('\n🎉 Prueba completada');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Error fatal:', error);
      process.exit(1);
    });
}

export { testSpringBootGeneration };

 */