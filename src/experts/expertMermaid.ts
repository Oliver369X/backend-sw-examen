import { createExpert } from './expertBase';

interface MermaidInput {
  diagramData?: any; // UML diagram data to convert to Mermaid
  mermaidCode?: string; // Mermaid code to convert to UML
  action: 'toMermaid' | 'fromMermaid';
}

interface MermaidOutput {
  mermaidCode?: string;
  diagramData?: any;
  preview?: string;
}

export const expertMermaid = createExpert({
  name: 'Mermaid Converter',
  systemPrompt: `Eres un experto en convertir diagramas UML a código Mermaid y viceversa.`,

  async process(input: MermaidInput): Promise<MermaidOutput> {
    if (input.action === 'toMermaid') {
      // Convertir diagrama UML a código Mermaid
      return convertToMermaid(input.diagramData);
    } else {
      // Convertir código Mermaid a diagrama UML
      return convertFromMermaid(input.mermaidCode || '');
    }
  }
});

// Convertir UML a Mermaid
function convertToMermaid(diagramData: any): MermaidOutput {
  if (!diagramData || !diagramData.classes) {
    return { mermaidCode: 'classDiagram\n  %% Diagrama vacío' };
  }

  let mermaidCode = 'classDiagram\n';

  // Agregar clases
  diagramData.classes?.forEach((cls: any) => {
    mermaidCode += `  class ${cls.name} {\n`;
    
    // Agregar atributos
    cls.attributes?.forEach((attr: string) => {
      const cleaned = attr.replace(/^[+\-#]\s*/, '').trim();
      const visibility = attr.startsWith('+') ? '+' : attr.startsWith('-') ? '-' : attr.startsWith('#') ? '#' : '';
      mermaidCode += `    ${visibility}${cleaned}\n`;
    });

    // Agregar métodos
    cls.methods?.forEach((method: string) => {
      const cleaned = method.replace(/^[+\-#]\s*/, '').trim();
      const visibility = method.startsWith('+') ? '+' : method.startsWith('-') ? '-' : method.startsWith('#') ? '#' : '';
      mermaidCode += `    ${visibility}${cleaned}\n`;
    });

    mermaidCode += `  }\n\n`;
  });

  // Agregar interfaces
  diagramData.interfaces?.forEach((iface: any) => {
    mermaidCode += `  class ${iface.name} {\n`;
    mermaidCode += `    <<interface>>\n`;
    
    iface.methods?.forEach((method: string) => {
      const cleaned = method.replace(/^[+\-#]\s*/, '').trim();
      mermaidCode += `    ${cleaned}\n`;
    });

    mermaidCode += `  }\n\n`;
  });

  // Agregar relaciones
  diagramData.relationships?.forEach((rel: any) => {
    const fromClass = diagramData.classes?.find((c: any) => c.id === rel.from) || 
                      diagramData.interfaces?.find((i: any) => i.id === rel.from);
    const toClass = diagramData.classes?.find((c: any) => c.id === rel.to) || 
                    diagramData.interfaces?.find((i: any) => i.id === rel.to);

    if (fromClass && toClass) {
      let arrow = '-->';
      
      switch (rel.type) {
        case 'inheritance':
          arrow = '<|--';
          break;
        case 'realization':
          arrow = '<|..';
          break;
        case 'composition':
          arrow = '*--';
          break;
        case 'aggregation':
          arrow = 'o--';
          break;
        case 'association':
          arrow = '-->';
          break;
      }

      const label = rel.label ? ` : ${rel.label}` : '';
      mermaidCode += `  ${toClass.name} ${arrow} ${fromClass.name}${label}\n`;
    }
  });

  return {
    mermaidCode,
    preview: `Se generó código Mermaid con ${diagramData.classes?.length || 0} clases y ${diagramData.relationships?.length || 0} relaciones.`
  };
}

// Convertir Mermaid a UML (básico)
function convertFromMermaid(mermaidCode: string): MermaidOutput {
  const classes: any[] = [];
  const relationships: any[] = [];
  
  // Parser simple de Mermaid (implementación básica)
  const lines = mermaidCode.split('\n');
  let currentClass: any = null;
  let classIndex = 0;

  lines.forEach(line => {
    const trimmed = line.trim();

    // Detectar definición de clase
    if (trimmed.startsWith('class ')) {
      if (currentClass) {
        classes.push(currentClass);
      }

      const className = trimmed.match(/class\s+(\w+)/)?.[1];
      currentClass = {
        id: `class-${++classIndex}`,
        name: className || 'Unknown',
        x: 100 + (classIndex * 250),
        y: 100,
        width: 200,
        height: 150,
        attributes: [],
        methods: [],
        stereotypes: []
      };
    }
    // Detectar atributos/métodos
    else if (currentClass && trimmed.match(/^[+\-#]/)) {
      if (trimmed.includes('(') && trimmed.includes(')')) {
        currentClass.methods.push(trimmed);
      } else {
        currentClass.attributes.push(trimmed);
      }
    }
    // Detectar relaciones
    else if (trimmed.includes('-->') || trimmed.includes('<|--') || trimmed.includes('*--')) {
      const match = trimmed.match(/(\w+)\s+([<>*o\-|.]+)\s+(\w+)/);
      if (match) {
        let type = 'association';
        if (match[2].includes('<|--')) type = 'inheritance';
        else if (match[2].includes('*--')) type = 'composition';
        else if (match[2].includes('o--')) type = 'aggregation';

        relationships.push({
          id: `rel-${relationships.length + 1}`,
          type,
          from: `class-${classIndex}`,
          to: `class-${classIndex - 1}`,
          fromMultiplicity: '',
          toMultiplicity: '',
          label: '',
          points: []
        });
      }
    }
  });

  if (currentClass) {
    classes.push(currentClass);
  }

  return {
    diagramData: {
      classes,
      interfaces: [],
      relationships,
      notes: [],
      packages: []
    },
    preview: `Se convirtió código Mermaid a ${classes.length} clases.`
  };
}
