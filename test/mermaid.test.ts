import { expertMermaid } from '../src/experts/expertMermaid';

describe('Expert Mermaid', () => {
  
  const sampleDiagram = {
    classes: [
      {
        id: 'class-1',
        name: 'Usuario',
        x: 100,
        y: 100,
        width: 200,
        height: 150,
        attributes: [
          '- id: Long',
          '- nombre: String',
          '- email: String'
        ],
        methods: [
          '+ getNombre(): String',
          '+ setNombre(nombre: String): void',
          '+ validar(): Boolean'
        ],
        stereotypes: []
      },
      {
        id: 'class-2',
        name: 'Producto',
        x: 400,
        y: 100,
        width: 200,
        height: 150,
        attributes: [
          '- id: Long',
          '- precio: Double'
        ],
        methods: [
          '+ calcularDescuento(): Double'
        ],
        stereotypes: []
      }
    ],
    interfaces: [
      {
        id: 'interface-1',
        name: 'Auditable',
        x: 100,
        y: 400,
        width: 200,
        height: 100,
        methods: [
          '+ audit(): void'
        ]
      }
    ],
    relationships: [
      {
        id: 'rel-1',
        type: 'inheritance',
        from: 'class-2',
        to: 'class-1',
        fromMultiplicity: '',
        toMultiplicity: '',
        label: '',
        points: []
      }
    ],
    notes: [],
    packages: []
  };

  describe('Conversión UML a Mermaid', () => {
    
    it('debería convertir diagrama UML a código Mermaid', async () => {
      const input = {
        action: 'toMermaid' as const,
        diagramData: sampleDiagram
      };

      const result = await expertMermaid.process(input);

      expect(result).toBeDefined();
      expect(result.mermaidCode).toBeDefined();
      expect(result.mermaidCode).toContain('classDiagram');
      expect(result.mermaidCode).toContain('class Usuario');
      expect(result.mermaidCode).toContain('class Producto');
    });

    it('debería incluir atributos en el código Mermaid', async () => {
      const input = {
        action: 'toMermaid' as const,
        diagramData: sampleDiagram
      };

      const result = await expertMermaid.process(input);

      expect(result.mermaidCode).toContain('id: Long');
      expect(result.mermaidCode).toContain('nombre: String');
      expect(result.mermaidCode).toContain('email: String');
    });

    it('debería incluir métodos en el código Mermaid', async () => {
      const input = {
        action: 'toMermaid' as const,
        diagramData: sampleDiagram
      };

      const result = await expertMermaid.process(input);

      expect(result.mermaidCode).toContain('getNombre()');
      expect(result.mermaidCode).toContain('validar()');
    });

    it('debería incluir relaciones en el código Mermaid', async () => {
      const input = {
        action: 'toMermaid' as const,
        diagramData: sampleDiagram
      };

      const result = await expertMermaid.process(input);

      expect(result.mermaidCode).toContain('<|--');
    });

    it('debería incluir interfaces como clases especiales', async () => {
      const input = {
        action: 'toMermaid' as const,
        diagramData: sampleDiagram
      };

      const result = await expertMermaid.process(input);

      expect(result.mermaidCode).toContain('class Auditable');
      expect(result.mermaidCode).toContain('<<interface>>');
    });

    it('debería manejar diagrama vacío', async () => {
      const input = {
        action: 'toMermaid' as const,
        diagramData: {
          classes: [],
          interfaces: [],
          relationships: [],
          notes: [],
          packages: []
        }
      };

      const result = await expertMermaid.process(input);

      expect(result.mermaidCode).toContain('classDiagram');
    });
  });

  describe('Conversión Mermaid a UML', () => {
    
    it('debería convertir código Mermaid a diagrama UML', async () => {
      const mermaidCode = `
        classDiagram
          class Usuario {
            -id: Long
            -nombre: String
            +getNombre(): String
          }
      `;

      const input = {
        action: 'fromMermaid' as const,
        mermaidCode
      };

      const result = await expertMermaid.process(input);

      expect(result).toBeDefined();
      expect(result.diagramData).toBeDefined();
      expect(result.diagramData.classes).toBeInstanceOf(Array);
      expect(result.diagramData.classes.length).toBeGreaterThan(0);
    });

    it('debería parsear atributos correctamente', async () => {
      const mermaidCode = `
        classDiagram
          class Producto {
            -id: Long
            -precio: Double
          }
      `;

      const input = {
        action: 'fromMermaid' as const,
        mermaidCode
      };

      const result = await expertMermaid.process(input);

      const productClass = result.diagramData.classes.find((c: any) => c.name === 'Producto');
      expect(productClass).toBeDefined();
      if (productClass) {
        expect(productClass.attributes.length).toBeGreaterThan(0);
      }
    });

    it('debería parsear métodos correctamente', async () => {
      const mermaidCode = `
        classDiagram
          class Usuario {
            +validar(): Boolean
            +guardar(): void
          }
      `;

      const input = {
        action: 'fromMermaid' as const,
        mermaidCode
      };

      const result = await expertMermaid.process(input);

      const userClass = result.diagramData.classes.find((c: any) => c.name === 'Usuario');
      expect(userClass).toBeDefined();
      if (userClass) {
        expect(userClass.methods.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Roundtrip (UML → Mermaid → UML)', () => {
    
    it('debería mantener estructura básica en roundtrip', async () => {
      // UML -> Mermaid
      const toMermaidInput = {
        action: 'toMermaid' as const,
        diagramData: sampleDiagram
      };

      const mermaidResult = await expertMermaid.process(toMermaidInput);
      
      // Mermaid -> UML
      const fromMermaidInput = {
        action: 'fromMermaid' as const,
        mermaidCode: mermaidResult.mermaidCode || ''
      };

      const umlResult = await expertMermaid.process(fromMermaidInput);

      expect(umlResult.diagramData).toBeDefined();
      expect(umlResult.diagramData.classes).toBeInstanceOf(Array);
    });
  });
});
