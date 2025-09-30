// Parser para diagramas UML que procesa la estructura JSON del frontend

export interface UMLDiagramData {
  classes: UMLClass[];
  relationships: UMLRelationship[];
  interfaces?: UMLInterface[];
  metadata?: {
    projectName?: string;
    packageName?: string;
    version?: string;
    lastModified?: Date;
  };
}

export interface UMLInterface {
  id: string;
  name: string;
  methods?: UMLMethod[];
  position?: { x: number; y: number };
}

export interface UMLClass {
  id: string;
  name: string;
  attributes: UMLAttribute[];
  methods?: UMLMethod[];
  position?: { x: number; y: number };
  stereotype?: string;
}

export interface UMLAttribute {
  name: string;
  type: string;
  visibility: 'private' | 'public' | 'protected';
  isRequired?: boolean;
  defaultValue?: string;
}

export interface UMLMethod {
  name: string;
  returnType: string;
  parameters: UMLParameter[];
  visibility: 'private' | 'public' | 'protected';
}

export interface UMLParameter {
  name: string;
  type: string;
}

export interface UMLRelationship {
  id: string;
  type: 'association' | 'inheritance' | 'composition' | 'aggregation' | 'one-to-one' | 'one-to-many' | 'many-to-one' | 'many-to-many';
  sourceClassId: string;
  targetClassId: string;
  cardinality?: '1:1' | '1:N' | 'N:1' | 'N:M';
  name?: string;
}

export class UMLParser {
  
  /**
   * Parsea un diagrama UML desde JSON y lo valida
   */
  static parseDiagram(jsonData: any): UMLDiagramData {
    try {
      console.log('DEBUG UMLParser: Datos recibidos:', JSON.stringify(jsonData, null, 2));
      
      // Si viene como string, parsearlo
      const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
      
      console.log('DEBUG UMLParser: Datos parseados:', JSON.stringify(data, null, 2));
      
      // Validar estructura básica
      if (!data || typeof data !== 'object') {
        throw new Error('Datos del diagrama UML inválidos');
      }

      // Intentar detectar y normalizar diferentes formatos de entrada
      const normalizedData = this.normalizeInputData(data);
      
      const diagram: UMLDiagramData = {
        classes: this.parseClasses(normalizedData.classes || []),
        relationships: this.parseRelationships(normalizedData.relationships || []),
        interfaces: this.parseInterfaces(normalizedData.interfaces || []),
        metadata: this.parseMetadata(normalizedData.metadata || {})
      };

      console.log('DEBUG UMLParser: Diagrama procesado:', {
        classesCount: diagram.classes.length,
        relationshipsCount: diagram.relationships.length,
        interfacesCount: diagram.interfaces?.length || 0,
        classes: diagram.classes.map(c => ({ id: c.id, name: c.name })),
        interfaces: diagram.interfaces?.map(i => ({ id: i.id, name: i.name })) || []
      });

      // Validar integridad del diagrama
      this.validateDiagram(diagram);
      
      return diagram;
    } catch (error) {
      console.error('Error parsing UML diagram:', error);
      throw new Error(`Error parsing UML diagram: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Normaliza los datos de entrada para manejar diferentes formatos
   */
  private static normalizeInputData(data: any): any {
    console.log('DEBUG UMLParser: Normalizando datos de entrada...');
    
    // Si data ya tiene la estructura esperada
    if (data.classes && Array.isArray(data.classes)) {
      console.log('DEBUG UMLParser: Estructura ya normalizada');
      return data;
    }
    
    // Si data es un array directamente (posible formato del frontend)
    if (Array.isArray(data)) {
      console.log('DEBUG UMLParser: Detectado array directo, convirtiendo a estructura UML');
      return {
        classes: data,
        relationships: [],
        metadata: {}
      };
    }
    
    // Si data tiene propiedades que parecen clases pero no están en 'classes'
    const possibleClassKeys = ['entities', 'models', 'nodes', 'components'];
    for (const key of possibleClassKeys) {
      if (data[key] && Array.isArray(data[key])) {
        console.log(`DEBUG UMLParser: Detectadas clases en propiedad '${key}'`);
        return {
          classes: data[key],
          relationships: data.relationships || [],
          metadata: data.metadata || {}
        };
      }
    }
    
    // Si no se puede normalizar, devolver como está
    console.log('DEBUG UMLParser: No se pudo normalizar, usando datos originales');
    return data;
  }

  /**
   * Parsea las clases del diagrama
   */
  private static parseClasses(classesData: any[]): UMLClass[] {
    if (!Array.isArray(classesData)) {
      return [];
    }

    return classesData.map(classData => {
      if (!classData || typeof classData !== 'object') {
        throw new Error('Clase UML inválida');
      }

      return {
        id: this.validateString(classData.id, 'Class ID'),
        name: this.validateString(classData.name, 'Class name'),
        attributes: this.parseAttributes(classData.attributes || []),
        methods: this.parseMethods(classData.methods || []),
        position: classData.position || { x: 0, y: 0 },
        stereotype: classData.stereotype
      };
    });
  }

  /**
   * Parsea las interfaces del diagrama
   */
  private static parseInterfaces(interfacesData: any[]): UMLInterface[] {
    if (!Array.isArray(interfacesData)) {
      return [];
    }

    return interfacesData.map(interfaceData => {
      if (!interfaceData || typeof interfaceData !== 'object') {
        throw new Error('Interfaz UML inválida');
      }

      return {
        id: this.validateString(interfaceData.id, 'Interface ID'),
        name: this.validateString(interfaceData.name, 'Interface name'),
        methods: this.parseMethods(interfaceData.methods || []),
        position: interfaceData.position || { x: 0, y: 0 }
      };
    });
  }

  /**
   * Parsea los atributos de una clase
   */
  private static parseAttributes(attributesData: any[]): UMLAttribute[] {
    if (!Array.isArray(attributesData)) {
      return [];
    }

    return attributesData.map(attrData => {
      // Si es un objeto, usarlo directamente
      if (attrData && typeof attrData === 'object' && !Array.isArray(attrData)) {
        return {
          name: this.validateString(attrData.name, 'Attribute name'),
          type: this.validateString(attrData.type, 'Attribute type'),
          visibility: this.validateVisibility(attrData.visibility),
          isRequired: Boolean(attrData.isRequired),
          defaultValue: attrData.defaultValue
        };
      }
      
      // Si es un string, parsearlo (para compatibilidad)
      if (typeof attrData === 'string') {
        const parsed = this.parseAttributeString(attrData);
        return {
          name: parsed.name,
          type: parsed.type,
          visibility: parsed.visibility,
          isRequired: false,
          defaultValue: undefined
        };
      }
      
      throw new Error(`Atributo UML inválido: ${JSON.stringify(attrData)}`);
    });
  }
  
  /**
   * Parsea un atributo desde string
   * Formato: [+|-|#|~] nombre: tipo
   */
  private static parseAttributeString(attrStr: string): { name: string; type: string; visibility: 'public' | 'private' | 'protected' } {
    const match = attrStr.match(/^\s*([+\-#~])\s+(\w+):\s*(\w+)/);
    
    if (!match) {
      console.warn(`Formato de atributo inválido: ${attrStr}`);
      return { name: 'unknown', type: 'String', visibility: 'private' };
    }
    
    const [, visibilitySymbol, name, type] = match;
    const visibilityMap: { [key: string]: 'public' | 'private' | 'protected' } = {
      '+': 'public',
      '-': 'private',
      '#': 'protected',
      '~': 'private' // package se mapea a private
    };
    
    return {
      name,
      type,
      visibility: visibilityMap[visibilitySymbol] || 'private'
    };
  }

  /**
   * Parsea los métodos de una clase
   */
  private static parseMethods(methodsData: any[]): UMLMethod[] {
    if (!Array.isArray(methodsData)) {
      return [];
    }

    return methodsData.map(methodData => {
      // Si es un objeto, usarlo directamente
      if (methodData && typeof methodData === 'object' && !Array.isArray(methodData)) {
        return {
          name: this.validateString(methodData.name, 'Method name'),
          returnType: this.validateString(methodData.returnType, 'Method return type'),
          parameters: this.parseParameters(methodData.parameters || []),
          visibility: this.validateVisibility(methodData.visibility)
        };
      }
      
      // Si es un string, parsearlo (para compatibilidad)
      if (typeof methodData === 'string') {
        const parsed = this.parseMethodString(methodData);
        return {
          name: parsed.name,
          returnType: parsed.returnType,
          parameters: parsed.parameters,
          visibility: parsed.visibility
        };
      }
      
      throw new Error(`Método UML inválido: ${JSON.stringify(methodData)}`);
    });
  }
  
  /**
   * Parsea un método desde string
   * Formato: [+|-|#|~] nombre(params): tipo
   */
  private static parseMethodString(methodStr: string): { name: string; returnType: string; visibility: 'public' | 'private' | 'protected'; parameters: UMLParameter[] } {
    const match = methodStr.match(/^\s*([+\-#~])\s+(\w+)\s*\(([^)]*)\)\s*:\s*(\w+)/);
    
    if (!match) {
      console.warn(`Formato de método inválido: ${methodStr}`);
      return { name: 'unknown', returnType: 'void', visibility: 'public', parameters: [] };
    }
    
    const [, visibilitySymbol, name, paramsStr, returnType] = match;
    const visibilityMap: { [key: string]: 'public' | 'private' | 'protected' } = {
      '+': 'public',
      '-': 'private',
      '#': 'protected',
      '~': 'public' // package se mapea a public
    };
    
    const parameters = paramsStr ? paramsStr.split(',').map(p => {
      const paramMatch = p.trim().match(/(\w+):\s*(\w+)/);
      return paramMatch ? {
        name: paramMatch[1],
        type: paramMatch[2]
      } : { name: 'param', type: 'Object' };
    }) : [];
    
    return {
      name,
      returnType,
      visibility: visibilityMap[visibilitySymbol] || 'public',
      parameters
    };
  }

  /**
   * Parsea los parámetros de un método
   */
  private static parseParameters(parametersData: any[]): UMLParameter[] {
    if (!Array.isArray(parametersData)) {
      return [];
    }

    return parametersData.map(paramData => {
      if (!paramData || typeof paramData !== 'object') {
        throw new Error('Parámetro UML inválido');
      }

      return {
        name: this.validateString(paramData.name, 'Parameter name'),
        type: this.validateString(paramData.type, 'Parameter type')
      };
    });
  }

  /**
   * Parsea las relaciones del diagrama
   */
  private static parseRelationships(relationshipsData: any[]): UMLRelationship[] {
    if (!Array.isArray(relationshipsData)) {
      return [];
    }

    return relationshipsData.map(relData => {
      if (!relData || typeof relData !== 'object') {
        throw new Error('Relación UML inválida');
      }

      return {
        id: this.validateString(relData.id, 'Relationship ID'),
        type: this.validateRelationshipType(relData.type),
        sourceClassId: this.validateString(relData.sourceClassId, 'Source class ID'),
        targetClassId: this.validateString(relData.targetClassId, 'Target class ID'),
        cardinality: relData.cardinality,
        name: relData.name
      };
    });
  }

  /**
   * Parsea los metadatos del diagrama
   */
  private static parseMetadata(metadataData: any): any {
    if (!metadataData || typeof metadataData !== 'object') {
      return {};
    }

    return {
      projectName: metadataData.projectName,
      packageName: metadataData.packageName,
      version: metadataData.version,
      lastModified: metadataData.lastModified ? new Date(metadataData.lastModified) : new Date()
    };
  }

  /**
   * Valida la integridad del diagrama
   */
  private static validateDiagram(diagram: UMLDiagramData): void {
    // Validar que hay al menos una clase
    if (diagram.classes.length === 0) {
      throw new Error('El diagrama debe tener al menos una clase. Verifica que el frontend esté enviando las clases en el formato correcto: { classes: [{ id: "string", name: "string", attributes: [] }] }');
    }

    // Validar IDs únicos de clases
    const classIds = new Set<string>();
    for (const cls of diagram.classes) {
      if (classIds.has(cls.id)) {
        throw new Error(`ID de clase duplicado: ${cls.id}`);
      }
      classIds.add(cls.id);
    }

    // Crear set de todos los IDs válidos (clases + interfaces)
    const allValidIds = new Set([...classIds]);
    if (diagram.interfaces) {
      for (const iface of diagram.interfaces) {
        allValidIds.add(iface.id);
      }
    }

    // Validar que las relaciones referencian clases o interfaces existentes
    for (const rel of diagram.relationships) {
      if (!allValidIds.has(rel.sourceClassId)) {
        throw new Error(`Relación ${rel.id} referencia clase/interfaz inexistente: ${rel.sourceClassId}`);
      }
      if (!allValidIds.has(rel.targetClassId)) {
        throw new Error(`Relación ${rel.id} referencia clase/interfaz inexistente: ${rel.targetClassId}`);
      }
    }
  }

  /**
   * Valida que un valor sea un string no vacío
   */
  private static validateString(value: any, fieldName: string): string {
    if (typeof value !== 'string' || value.trim() === '') {
      throw new Error(`${fieldName} debe ser un string no vacío`);
    }
    return value.trim();
  }

  /**
   * Valida la visibilidad de un elemento
   */
  private static validateVisibility(visibility: any): 'private' | 'public' | 'protected' {
    const validVisibilities = ['private', 'public', 'protected'];
    if (!validVisibilities.includes(visibility)) {
      return 'private'; // Default
    }
    return visibility;
  }

  /**
   * Valida el tipo de relación
   */
  private static validateRelationshipType(type: any): UMLRelationship['type'] {
    const validTypes = [
      'association', 'inheritance', 'composition', 'aggregation',
      'one-to-one', 'one-to-many', 'many-to-one', 'many-to-many'
    ];
    
    if (!validTypes.includes(type)) {
      return 'association'; // Default
    }
    
    return type;
  }

  /**
   * Convierte tipos UML a tipos Java
   */
  static mapUMLTypeToJava(umlType: string): string {
    const typeMapping: Record<string, string> = {
      'String': 'String',
      'Integer': 'Integer',
      'Long': 'Long',
      'Double': 'Double',
      'Float': 'Float',
      'Boolean': 'Boolean',
      'Date': 'LocalDateTime',
      'DateTime': 'LocalDateTime',
      'BigDecimal': 'BigDecimal',
      'int': 'Integer',
      'long': 'Long',
      'double': 'Double',
      'float': 'Float',
      'boolean': 'Boolean'
    };

    return typeMapping[umlType] || 'String';
  }

  /**
   * Genera imports necesarios para las entidades Java
   */
  static generateImports(classes: UMLClass[], relationships: UMLRelationship[]): string[] {
    const imports = new Set<string>();
    
    // Imports básicos de JPA
    imports.add('jakarta.persistence.*');
    imports.add('jakarta.validation.constraints.*');
    imports.add('java.util.*');
    
    // Verificar si hay fechas
    const hasDates = classes.some(cls => 
      cls.attributes.some(attr => 
        attr.type.toLowerCase().includes('date') || attr.type.toLowerCase().includes('time')
      )
    );
    
    if (hasDates) {
      imports.add('java.time.LocalDateTime');
    }
    
    // Verificar si hay BigDecimal
    const hasBigDecimal = classes.some(cls =>
      cls.attributes.some(attr => attr.type === 'BigDecimal')
    );
    
    if (hasBigDecimal) {
      imports.add('java.math.BigDecimal');
    }
    
    // Verificar relaciones para imports adicionales
    const hasRelations = relationships.length > 0;
    if (hasRelations) {
      imports.add('java.util.ArrayList');
      imports.add('java.util.List');
    }
    
    return Array.from(imports);
  }

  /**
   * Encuentra las clases relacionadas con una clase dada
   */
  static findRelatedClasses(classId: string, relationships: UMLRelationship[]): UMLRelationship[] {
    return relationships.filter(rel => 
      rel.sourceClassId === classId || rel.targetClassId === classId
    );
  }

  /**
   * Determina si una relación es bidireccional
   */
  static isBidirectionalRelationship(relationship: UMLRelationship, allRelationships: UMLRelationship[]): boolean {
    return allRelationships.some(rel => 
      rel.id !== relationship.id &&
      rel.sourceClassId === relationship.targetClassId &&
      rel.targetClassId === relationship.sourceClassId
    );
  }
}

