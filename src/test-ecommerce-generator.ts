import { expertSpringBootTemplate } from './experts/expertSpringBootTemplate';
import { UMLParser } from './utils/umlParser';
import fs from 'fs-extra';
import path from 'path';

// Diagrama UML completo de E-Commerce con 6 tablas y relaciones complejas
const ecommerceUMLDiagram = {
  classes: [
    {
      id: "user_001",
      name: "User",
      attributes: [
        { name: "id", type: "Long", visibility: "private", isRequired: true },
        { name: "email", type: "String", visibility: "private", isRequired: true },
        { name: "username", type: "String", visibility: "private", isRequired: true },
        { name: "password", type: "String", visibility: "private", isRequired: true },
        { name: "firstName", type: "String", visibility: "private", isRequired: true },
        { name: "lastName", type: "String", visibility: "private", isRequired: true },
        { name: "phone", type: "String", visibility: "private", isRequired: false },
        { name: "active", type: "Boolean", visibility: "private", isRequired: true }
      ]
    },
    {
      id: "category_002",
      name: "Category",
      attributes: [
        { name: "id", type: "Long", visibility: "private", isRequired: true },
        { name: "name", type: "String", visibility: "private", isRequired: true },
        { name: "description", type: "String", visibility: "private", isRequired: false },
        { name: "active", type: "Boolean", visibility: "private", isRequired: true }
      ]
    },
    {
      id: "product_003",
      name: "Product",
      attributes: [
        { name: "id", type: "Long", visibility: "private", isRequired: true },
        { name: "name", type: "String", visibility: "private", isRequired: true },
        { name: "description", type: "String", visibility: "private", isRequired: false },
        { name: "price", type: "Double", visibility: "private", isRequired: true },
        { name: "stock", type: "Integer", visibility: "private", isRequired: true },
        { name: "sku", type: "String", visibility: "private", isRequired: true },
        { name: "active", type: "Boolean", visibility: "private", isRequired: true }
      ]
    },
    {
      id: "order_004",
      name: "Order",
      attributes: [
        { name: "id", type: "Long", visibility: "private", isRequired: true },
        { name: "orderNumber", type: "String", visibility: "private", isRequired: true },
        { name: "orderDate", type: "Date", visibility: "private", isRequired: true },
        { name: "status", type: "String", visibility: "private", isRequired: true },
        { name: "total", type: "Double", visibility: "private", isRequired: true },
        { name: "shippingAddress", type: "String", visibility: "private", isRequired: true }
      ]
    },
    {
      id: "orderitem_005",
      name: "OrderItem",
      attributes: [
        { name: "id", type: "Long", visibility: "private", isRequired: true },
        { name: "quantity", type: "Integer", visibility: "private", isRequired: true },
        { name: "unitPrice", type: "Double", visibility: "private", isRequired: true },
        { name: "subtotal", type: "Double", visibility: "private", isRequired: true }
      ]
    },
    {
      id: "review_006",
      name: "Review",
      attributes: [
        { name: "id", type: "Long", visibility: "private", isRequired: true },
        { name: "rating", type: "Integer", visibility: "private", isRequired: true },
        { name: "comment", type: "String", visibility: "private", isRequired: false },
        { name: "reviewDate", type: "Date", visibility: "private", isRequired: true }
      ]
    }
  ],
  relationships: [
    {
      id: "rel_001",
      type: "one-to-many",
      sourceClassId: "user_001",
      targetClassId: "order_004",
      sourceMultiplicity: "1",
      targetMultiplicity: "*",
      name: "orders"
    },
    {
      id: "rel_002",
      type: "many-to-one",
      sourceClassId: "product_003",
      targetClassId: "category_002",
      sourceMultiplicity: "*",
      targetMultiplicity: "1",
      name: "category"
    },
    {
      id: "rel_003",
      type: "one-to-many",
      sourceClassId: "order_004",
      targetClassId: "orderitem_005",
      sourceMultiplicity: "1",
      targetMultiplicity: "*",
      name: "orderItems"
    },
    {
      id: "rel_004",
      type: "many-to-one",
      sourceClassId: "orderitem_005",
      targetClassId: "product_003",
      sourceMultiplicity: "*",
      targetMultiplicity: "1",
      name: "product"
    },
    {
      id: "rel_005",
      type: "many-to-one",
      sourceClassId: "review_006",
      targetClassId: "product_003",
      sourceMultiplicity: "*",
      targetMultiplicity: "1",
      name: "product"
    },
    {
      id: "rel_006",
      type: "many-to-one",
      sourceClassId: "review_006",
      targetClassId: "user_001",
      sourceMultiplicity: "*",
      targetMultiplicity: "1",
      name: "user"
    }
  ],
  metadata: {
    projectName: "ECommerceApp",
    packageName: "com.example.ecommerce",
    version: "1.0.0"
  }
};

async function testECommerceGenerator() {
  console.log('🛒 Generando Sistema de E-Commerce completo...\n');

  try {
    // 1. Parsear diagrama UML
    console.log('1. Parseando diagrama UML de E-Commerce...');
    const umlData = UMLParser.parseDiagram(ecommerceUMLDiagram);
    console.log(`✅ Diagrama parseado: ${umlData.classes.length} clases, ${ecommerceUMLDiagram.relationships.length} relaciones`);

    // 2. Generar proyecto Spring Boot
    console.log('\n2. Generando proyecto Spring Boot...');
    const result = await expertSpringBootTemplate.process({
      umlDiagram: umlData,
      config: {
        packageName: 'com.example.ecommerce',
        projectName: 'ECommerceApp',
        databaseType: 'h2',
        includeSwagger: false,
        includeSecurity: false
      }
    });

    // 3. Guardar el resultado
    const outputPath = path.join(__dirname, '../temp/ecommerce-app.zip');
    await fs.ensureDir(path.dirname(outputPath));
    
    // Eliminar archivo anterior si existe
    if (await fs.pathExists(outputPath)) {
      await fs.remove(outputPath);
      console.log('🗑️  Archivo ZIP anterior eliminado');
    }
    
    await fs.writeFile(outputPath, result);
    
    console.log(`\n✅ Proyecto generado: ${outputPath}`);
    console.log(`📦 Tamaño: ${(result as Buffer).length} bytes`);

    // 4. Extraer y examinar archivos
    console.log('\n3. Extrayendo proyecto...');
    const extractPath = path.join(__dirname, '../temp/ecommerce-app');
    
    // Limpiar directorio de extracción si existe
    if (await fs.pathExists(extractPath)) {
      await fs.remove(extractPath);
      console.log('🗑️  Directorio de extracción anterior eliminado');
    }
    
    await fs.ensureDir(extractPath);
    
    console.log('\n📝 Para probar el proyecto:');
    console.log(`   1. Extrae ${outputPath} a ${extractPath}`);
    console.log(`   2. cd ${extractPath}`);
    console.log(`   3. mvn clean compile`);
    console.log(`   4. mvn spring-boot:run`);
    console.log(`   5. Abre http://localhost:8080`);

    console.log('\n🎉 Sistema de E-Commerce generado exitosamente!');
    console.log('\n📊 Entidades generadas:');
    console.log('   - User (Usuarios)');
    console.log('   - Category (Categorías)');
    console.log('   - Product (Productos)');
    console.log('   - Order (Pedidos)');
    console.log('   - OrderItem (Items de Pedido)');
    console.log('   - Review (Reseñas)');
    console.log('\n🔗 Relaciones implementadas:');
    console.log('   - User → Order (1:N)');
    console.log('   - Category → Product (1:N)');
    console.log('   - Order → OrderItem (1:N)');
    console.log('   - Product → OrderItem (1:N)');
    console.log('   - Product → Review (1:N)');
    console.log('   - User → Review (1:N)');

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

testECommerceGenerator();
