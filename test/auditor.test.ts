import request from 'supertest';
import app from '../src/app';

describe('Code Auditor API', () => {
  it('debe auditar código TypeScript correctamente', async () => {
    const testCode = `
      function processData(data: any) {
        if (!data) return null;
        return data.map(item => item.value);
      }
    `;

    const res = await request(app)
      .post('/api/ai/audit-code')
      .send({ 
        code: testCode,
        context: 'Función para procesar datos',
        focusAreas: ['seguridad', 'tipos TypeScript']
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('auditResult');
    expect(typeof res.body.auditResult).toBe('string');
    expect(res.body.auditResult.length).toBeGreaterThan(0);
  });

  it('debe manejar código con errores críticos', async () => {
    const problematicCode = `
      function dangerousFunction(input) {
        eval(input); // Código peligroso
        return input;
      }
    `;

    const res = await request(app)
      .post('/api/ai/audit-code')
      .send({ 
        code: problematicCode,
        focusAreas: ['seguridad']
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('auditResult');
    expect(res.body.auditResult).toContain('PROBLEMAS CRÍTICOS');
  });

  it('debe rechazar solicitudes sin código', async () => {
    const res = await request(app)
      .post('/api/ai/audit-code')
      .send({});

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toContain('código');
  });

  it('debe auditar código con diferentes áreas de enfoque', async () => {
    const testCode = `
      class DataProcessor {
        private data: any[] = [];
        
        addItem(item: any) {
          this.data.push(item);
        }
        
        processItems() {
          return this.data.map(item => item.value);
        }
      }
    `;

    const res = await request(app)
      .post('/api/ai/audit-code')
      .send({ 
        code: testCode,
        focusAreas: ['rendimiento', 'memory leaks', 'tipos TypeScript']
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('auditResult');
    expect(res.body.auditResult).toContain('SUGERENCIAS DE MEJORA');
  });

  it('debe detectar errores específicos de Flutter como tipos nullable', async () => {
    const flutterCodeWithErrors = `
      Widget _buildButton(String text, Color? backgroundColor, Color textColor) {
        return ElevatedButton(
          onPressed: () {},
          style: ElevatedButton.styleFrom(
            backgroundColor: backgroundColor, // Error: Color? no puede asignarse a Color
            foregroundColor: textColor,
          ),
          child: Text(text),
        );
      }
    `;

    const res = await request(app)
      .post('/api/ai/audit-code')
      .send({ 
        code: flutterCodeWithErrors,
        context: 'Código Flutter con errores de tipos nullable',
        focusAreas: ['errores Flutter', 'tipos nullable']
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('auditResult');
    expect(res.body.auditResult).toContain('PROBLEMAS CRÍTICOS');
    expect(res.body.auditResult).toContain('CORRECCIONES AUTOMÁTICAS');
  });

  it('debe detectar errores de Color nullable en Flutter', async () => {
    const flutterColorErrors = `
      _buildButton("AC", Colors.grey[500], Colors.black),
      _buildButton("+/-", Colors.grey[500], Colors.black),
      _buildButton("%", Colors.grey[500], Colors.black),
      _buildButton("÷", Colors.orange[500], Colors.white),
    `;

    const res = await request(app)
      .post('/api/ai/audit-code')
      .send({ 
        code: flutterColorErrors,
        context: 'Errores de Color nullable en Flutter',
        focusAreas: ['errores Flutter', 'tipos nullable']
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('auditResult');
    expect(res.body.auditResult).toContain('Color?');
    expect(res.body.auditResult).toContain('Color');
  });

  it('debe proporcionar correcciones automáticas para errores de Flutter', async () => {
    const problematicFlutterCode = `
      class CalculatorWidget extends StatelessWidget {
        @override
        Widget build(BuildContext context) {
          return Scaffold(
            body: Column(
              children: [
                _buildButton("AC", Colors.grey[500], Colors.black),
                _buildButton("÷", Colors.orange[500], Colors.white),
              ],
            ),
          );
        }
        
        Widget _buildButton(String text, Color? bgColor, Color textColor) {
          return ElevatedButton(
            onPressed: () {},
            style: ElevatedButton.styleFrom(
              backgroundColor: bgColor,
              foregroundColor: textColor,
            ),
            child: Text(text),
          );
        }
      }
    `;

    const res = await request(app)
      .post('/api/ai/audit-code')
      .send({ 
        code: problematicFlutterCode,
        context: 'Widget de calculadora con errores de tipos nullable',
        focusAreas: ['errores Flutter', 'tipos nullable']
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('auditResult');
    expect(res.body.auditResult).toContain('CORRECCIONES AUTOMÁTICAS');
    expect(res.body.auditResult).toContain('Colors.grey[500]!');
    expect(res.body.auditResult).toContain('Colors.orange[500]!');
  });
}); 