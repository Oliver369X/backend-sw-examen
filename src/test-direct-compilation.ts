import { SpringBootTemplateEngine } from './generators/SpringBootTemplateEngine';
import { UMLParser } from './utils/umlParser';
import fs from 'fs-extra';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Diagrama UML simple
const simpleUML = {
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
    projectName: "DirectTest",
    packageName: "com.example.direct",
    version: "1.0.0"
  }
};

async function testDirectCompilation() {
  console.log('🔍 Test directo de compilación...\n');

  try {
    // 1. Parsear UML
    const umlData = UMLParser.parseDiagram(simpleUML);
    console.log(`✅ UML parseado: ${umlData.classes.length} clases`);

    // 2. Generar archivos
    const templateEngine = new SpringBootTemplateEngine();
    const files = await templateEngine.generateProject(umlData, {
      packageName: 'com.example.direct',
      projectName: 'DirectTest',
      databaseType: 'h2',
      includeSwagger: false,
      includeSecurity: false
    });

    console.log(`✅ ${files.length} archivos generados`);

    // 3. Crear directorio de prueba
    const testDir = path.join(__dirname, '../temp/direct-test');
    await fs.ensureDir(testDir);
    await fs.emptyDir(testDir);

    // 4. Escribir archivos
    for (const file of files) {
      const filePath = path.join(testDir, file.path);
      await fs.ensureDir(path.dirname(filePath));
      await fs.writeFile(filePath, file.content);
      console.log(`📄 ${file.path}`);
    }

    // 5. Probar compilación
    console.log('\n🔨 Probando compilación...');
    const originalCwd = process.cwd();
    process.chdir(testDir);
    
    try {
      const { stdout, stderr } = await execAsync('mvn clean compile');
      
      if (stderr && stderr.includes('ERROR')) {
        console.error('❌ Errores de compilación:');
        console.error(stderr);
      } else {
        console.log('✅ Compilación exitosa!');
        console.log(stdout);
      }
    } catch (compileError: any) {
      console.error('❌ Error de compilación:');
      console.error(compileError.stderr || compileError.message);
    } finally {
      process.chdir(originalCwd);
    }

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    if (error.stderr) {
      console.error('Stderr:', error.stderr);
    }
  }
}

testDirectCompilation();
