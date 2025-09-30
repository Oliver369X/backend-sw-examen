# Frontend Simplificado con React Flow + WebSockets

## 🎯 Arquitectura Recomendada

### Stack Tecnológico:
- **React** + **TypeScript**
- **React Flow** para editor UML
- **Socket.io-client** para colaboración
- **Material-UI** para componentes
- **Zustand** para estado (simple)

## 🏗️ Estructura del Proyecto

```
frontend/
├── src/
│   ├── components/
│   │   ├── DiagramEditor/          # Editor UML principal
│   │   │   ├── ClassNode.tsx       # Nodo de clase
│   │   │   ├── RelationshipEdge.tsx # Arista de relación
│   │   │   ├── Toolbar.tsx         # Paleta de herramientas
│   │   │   └── PropertiesPanel.tsx # Panel de propiedades
│   │   ├── Collaboration/          # Colaboración en tiempo real
│   │   │   ├── UserCursors.tsx     # Cursores de usuarios
│   │   │   ├── UserList.tsx        # Lista de usuarios
│   │   │   └── Chat.tsx            # Chat opcional
│   │   └── Generation/             # Generación de código
│   │       ├── ConfigForm.tsx      # Formulario configuración
│   │       └── DownloadButton.tsx  # Botón descarga
│   ├── hooks/
│   │   ├── useSocket.ts            # Hook para WebSockets
│   │   ├── useDiagram.ts           # Hook para diagrama
│   │   └── useCollaboration.ts     # Hook para colaboración
│   ├── services/
│   │   ├── socketService.ts        # Servicio WebSocket
│   │   ├── backendService.ts       # Servicio backend
│   │   └── diagramService.ts       # Servicio diagrama
│   ├── types/
│   │   ├── uml.types.ts            # Tipos UML
│   │   ├── socket.types.ts         # Tipos WebSocket
│   │   └── collaboration.types.ts  # Tipos colaboración
│   └── utils/
│       ├── diagramUtils.ts         # Utilidades diagrama
│       └── validationUtils.ts      # Validación
```

## 🎨 Componente Principal: DiagramEditor

```typescript
// src/components/DiagramEditor/DiagramEditor.tsx
import React, { useCallback, useState } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
} from 'reactflow';
import { useSocket } from '../../hooks/useSocket';
import { useCollaboration } from '../../hooks/useCollaboration';
import ClassNode from './ClassNode';
import RelationshipEdge from './RelationshipEdge';
import Toolbar from './Toolbar';
import PropertiesPanel from './PropertiesPanel';

const nodeTypes = {
  classNode: ClassNode,
};

const edgeTypes = {
  relationship: RelationshipEdge,
};

export default function DiagramEditor() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  
  // WebSocket para colaboración
  const { socket, isConnected } = useSocket();
  const { users, cursors } = useCollaboration(socket);

  // Agregar nueva clase
  const addClass = useCallback(() => {
    const newClass: Node = {
      id: `class_${Date.now()}`,
      type: 'classNode',
      position: { x: 100, y: 100 },
      data: {
        name: 'NewClass',
        attributes: [
          { name: 'id', type: 'Long', visibility: 'private', isRequired: true }
        ],
        methods: []
      }
    };
    
    setNodes(nds => [...nds, newClass]);
    
    // Notificar a otros usuarios
    socket?.emit('diagram-change', {
      type: 'add-node',
      node: newClass
    });
  }, [setNodes, socket]);

  // Conectar nodos (crear relación)
  const onConnect = useCallback((params: Connection) => {
    const newEdge: Edge = {
      id: `edge_${Date.now()}`,
      type: 'relationship',
      source: params.source!,
      target: params.target!,
      data: {
        type: 'association',
        cardinality: '1:N'
      }
    };
    
    setEdges(eds => addEdge(newEdge, eds));
    
    // Notificar a otros usuarios
    socket?.emit('diagram-change', {
      type: 'add-edge',
      edge: newEdge
    });
  }, [setEdges, socket]);

  // Manejar cambios de nodos
  const handleNodesChange = useCallback((changes) => {
    onNodesChange(changes);
    
    // Notificar cambios de posición
    changes.forEach(change => {
      if (change.type === 'position') {
        socket?.emit('node-move', {
          nodeId: change.id,
          position: change.position
        });
      }
    });
  }, [onNodesChange, socket]);

  return (
    <div className="diagram-editor">
      <div className="toolbar">
        <Toolbar onAddClass={addClass} />
        <div className="collaboration-info">
          👥 {users.length} usuarios conectados
        </div>
      </div>
      
      <div className="main-area">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={handleNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={(_, node) => setSelectedNode(node)}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
        >
          <Controls />
          <Background />
          
          {/* Cursores de colaboración */}
          {cursors.map(cursor => (
            <div
              key={cursor.userId}
              className="user-cursor"
              style={{
                left: cursor.x,
                top: cursor.y,
                backgroundColor: cursor.color
              }}
            >
              {cursor.username}
            </div>
          ))}
        </ReactFlow>
        
        <div className="properties-panel">
          <PropertiesPanel 
            selectedNode={selectedNode}
            onUpdateNode={(updatedNode) => {
              setNodes(nds => nds.map(n => 
                n.id === updatedNode.id ? updatedNode : n
              ));
              
              socket?.emit('node-update', updatedNode);
            }}
          />
        </div>
      </div>
    </div>
  );
}
```

## 🔌 WebSocket Simplificado

```typescript
// src/hooks/useSocket.ts
import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const newSocket = io('ws://localhost:3000');
    
    newSocket.on('connect', () => {
      setIsConnected(true);
      console.log('Conectado al servidor');
    });
    
    newSocket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Desconectado del servidor');
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  return { socket, isConnected };
}
```

```typescript
// src/hooks/useCollaboration.ts
import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';

interface User {
  id: string;
  username: string;
  color: string;
}

interface Cursor {
  userId: string;
  username: string;
  x: number;
  y: number;
  color: string;
}

export function useCollaboration(socket: Socket | null) {
  const [users, setUsers] = useState<User[]>([]);
  const [cursors, setCursors] = useState<Cursor[]>([]);

  useEffect(() => {
    if (!socket) return;

    // Unirse a proyecto
    socket.emit('join-project', 'default-project');

    // Usuarios conectados
    socket.on('user-joined', (user: User) => {
      setUsers(prev => [...prev.filter(u => u.id !== user.id), user]);
    });

    socket.on('user-left', (userId: string) => {
      setUsers(prev => prev.filter(u => u.id !== userId));
      setCursors(prev => prev.filter(c => c.userId !== userId));
    });

    // Movimiento de cursor
    socket.on('cursor-move', (cursor: Cursor) => {
      setCursors(prev => {
        const others = prev.filter(c => c.userId !== cursor.userId);
        return [...others, cursor];
      });
    });

    // Cambios en diagrama
    socket.on('diagram-change', (change) => {
      console.log('Cambio recibido:', change);
      // Aquí se aplicaría el cambio al diagrama local
    });

    return () => {
      socket.off('user-joined');
      socket.off('user-left');
      socket.off('cursor-move');
      socket.off('diagram-change');
    };
  }, [socket]);

  return { users, cursors };
}
```

## 🎨 Nodo de Clase Personalizado

```typescript
// src/components/DiagramEditor/ClassNode.tsx
import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Card, CardContent, Typography, IconButton } from '@mui/material';
import { Edit } from '@mui/icons-material';

interface ClassData {
  name: string;
  attributes: Array<{
    name: string;
    type: string;
    visibility: 'private' | 'public' | 'protected';
  }>;
  methods: Array<{
    name: string;
    returnType: string;
    visibility: 'private' | 'public' | 'protected';
  }>;
}

export default function ClassNode({ data, selected }: NodeProps<ClassData>) {
  return (
    <Card 
      className={`class-node ${selected ? 'selected' : ''}`}
      style={{ minWidth: 200 }}
    >
      <Handle type="target" position={Position.Top} />
      
      <CardContent>
        <div className="class-header">
          <Typography variant="h6" component="div">
            {data.name}
          </Typography>
          <IconButton size="small">
            <Edit />
          </IconButton>
        </div>
        
        <div className="class-attributes">
          {data.attributes.map((attr, index) => (
            <div key={index} className="attribute">
              <span className="visibility">{attr.visibility === 'private' ? '-' : '+'}</span>
              <span className="name">{attr.name}</span>
              <span className="type">: {attr.type}</span>
            </div>
          ))}
        </div>
        
        <div className="class-methods">
          {data.methods.map((method, index) => (
            <div key={index} className="method">
              <span className="visibility">{method.visibility === 'private' ? '-' : '+'}</span>
              <span className="name">{method.name}()</span>
              <span className="type">: {method.returnType}</span>
            </div>
          ))}
        </div>
      </CardContent>
      
      <Handle type="source" position={Position.Bottom} />
    </Card>
  );
}
```

## 🎛️ Panel de Propiedades

```typescript
// src/components/DiagramEditor/PropertiesPanel.tsx
import React, { useState } from 'react';
import {
  Paper,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  IconButton,
  Select,
  MenuItem
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { Node } from 'reactflow';

interface PropertiesPanelProps {
  selectedNode: Node | null;
  onUpdateNode: (node: Node) => void;
}

export default function PropertiesPanel({ selectedNode, onUpdateNode }: PropertiesPanelProps) {
  const [newAttribute, setNewAttribute] = useState({
    name: '',
    type: 'String',
    visibility: 'private' as 'private' | 'public' | 'protected'
  });

  if (!selectedNode) {
    return (
      <Paper className="properties-panel">
        <Typography variant="h6">Selecciona una clase para editar</Typography>
      </Paper>
    );
  }

  const addAttribute = () => {
    if (!newAttribute.name) return;
    
    const updatedNode = {
      ...selectedNode,
      data: {
        ...selectedNode.data,
        attributes: [...selectedNode.data.attributes, { ...newAttribute }]
      }
    };
    
    onUpdateNode(updatedNode);
    setNewAttribute({ name: '', type: 'String', visibility: 'private' });
  };

  const removeAttribute = (index: number) => {
    const updatedNode = {
      ...selectedNode,
      data: {
        ...selectedNode.data,
        attributes: selectedNode.data.attributes.filter((_, i) => i !== index)
      }
    };
    
    onUpdateNode(updatedNode);
  };

  return (
    <Paper className="properties-panel">
      <Typography variant="h6">Propiedades de Clase</Typography>
      
      <TextField
        label="Nombre de la clase"
        value={selectedNode.data.name}
        onChange={(e) => {
          const updatedNode = {
            ...selectedNode,
            data: { ...selectedNode.data, name: e.target.value }
          };
          onUpdateNode(updatedNode);
        }}
        fullWidth
        margin="normal"
      />
      
      <Typography variant="subtitle1" style={{ marginTop: 16 }}>
        Atributos:
      </Typography>
      
      <List>
        {selectedNode.data.attributes.map((attr, index) => (
          <ListItem key={index}>
            <span>{attr.visibility} {attr.name}: {attr.type}</span>
            <IconButton onClick={() => removeAttribute(index)}>
              <Delete />
            </IconButton>
          </ListItem>
        ))}
      </List>
      
      <div className="add-attribute">
        <TextField
          label="Nombre"
          value={newAttribute.name}
          onChange={(e) => setNewAttribute({ ...newAttribute, name: e.target.value })}
          size="small"
        />
        
        <Select
          value={newAttribute.type}
          onChange={(e) => setNewAttribute({ ...newAttribute, type: e.target.value })}
          size="small"
        >
          <MenuItem value="String">String</MenuItem>
          <MenuItem value="Long">Long</MenuItem>
          <MenuItem value="Integer">Integer</MenuItem>
          <MenuItem value="Boolean">Boolean</MenuItem>
          <MenuItem value="Date">Date</MenuItem>
        </Select>
        
        <Select
          value={newAttribute.visibility}
          onChange={(e) => setNewAttribute({ ...newAttribute, visibility: e.target.value })}
          size="small"
        >
          <MenuItem value="private">private</MenuItem>
          <MenuItem value="public">public</MenuItem>
          <MenuItem value="protected">protected</MenuItem>
        </Select>
        
        <Button onClick={addAttribute} startIcon={<Add />}>
          Agregar
        </Button>
      </div>
    </Paper>
  );
}
```

## 🚀 Generación de Código

```typescript
// src/services/backendService.ts
export const generateSpringBoot = async (diagramData: any, config: any) => {
  try {
    const response = await fetch('/api/ai/springboot-template-zip', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        umlDiagram: diagramData,
        config: config
      })
    });

    if (!response.ok) {
      throw new Error('Error al generar el proyecto');
    }

    // Descargar ZIP
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.projectName || 'spring-boot-app'}.zip`;
    a.click();
    
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
```

## 🎯 Ventajas de esta Implementación

### ✅ **React Flow:**
- **Gratis** y open source
- **Excelente performance** para diagramas grandes
- **Fácil personalización** de nodos y aristas
- **TypeScript nativo**
- **Comunidad activa**

### ✅ **WebSockets Simples:**
- **Colaboración en tiempo real**
- **Cursores de usuarios**
- **Sincronización de cambios**
- **Chat opcional**

### ✅ **Arquitectura Limpia:**
- **Separación de responsabilidades**
- **Hooks reutilizables**
- **Servicios modulares**
- **Tipos TypeScript**

## 📋 Plan de Implementación

1. **Semana 1:** Setup básico + React Flow
2. **Semana 2:** Nodos de clase + Panel propiedades
3. **Semana 3:** WebSockets + Colaboración
4. **Semana 4:** Generación código + Testing

Esta implementación es **simple, escalable y mantenible**. ¿Te parece bien este enfoque?



