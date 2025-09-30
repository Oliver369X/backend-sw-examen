# 🔗 Guía de Integración Frontend

## 📋 **Descripción**
Guía completa para integrar el backend con diferentes frameworks frontend (React, Vue, Angular).

## 🏗️ **Arquitectura del Sistema**

### **Componentes:**
```
Frontend (React/Vue/Angular)
    ↓ HTTP/WebSocket
Backend (Node.js + Express + Socket.IO)
    ↓ ORM
Base de Datos (PostgreSQL)
    ↓ API
IA (Google Gemini) - Solo para auditoría
```

### **Flujo de Datos:**
1. **Autenticación**: Login/Register → JWT Token
2. **Colaboración**: Socket.IO → Tiempo real
3. **Generación**: UML → Spring Boot ZIP (con plantillas)
4. **Persistencia**: Diagramas → Base de datos

---

## ⚛️ **INTEGRACIÓN CON REACT**

### **1. Configuración Inicial**

#### **Instalación de Dependencias:**
```bash
npm install axios socket.io-client
npm install @types/socket.io-client --save-dev
```

#### **Configuración de Axios:**
```javascript
// src/api/client.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### **2. Autenticación**

#### **Hook de Autenticación:**
```javascript
// src/hooks/useAuth.js
import { useState, useEffect, createContext, useContext } from 'react';
import apiClient from '../api/client';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verificar token válido
      verifyToken();
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async () => {
    try {
      // Aquí podrías hacer una llamada para verificar el token
      // Por ahora, asumimos que si existe, es válido
      setUser({ token: localStorage.getItem('token') });
    } catch (error) {
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (correo, contrasena) => {
    try {
      const response = await apiClient.post('/auth/login', {
        correo,
        contrasena
      });

      if (response.data.success) {
        const { token, data: userData } = response.data;
        localStorage.setItem('token', token);
        setUser({ ...userData, token });
        return { success: true, user: userData };
      }
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Error de login' };
    }
  };

  const register = async (correo, contrasena, nombre) => {
    try {
      const response = await apiClient.post('/auth/register', {
        correo,
        contrasena,
        nombre
      });

      if (response.data.success) {
        const { token, data: userData } = response.data;
        localStorage.setItem('token', token);
        setUser({ ...userData, token });
        return { success: true, user: userData };
      }
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Error de registro' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
```

#### **Componente de Login:**
```javascript
// src/components/Login.js
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
  const [formData, setFormData] = useState({
    correo: '',
    contrasena: ''
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(formData.correo, formData.contrasena);
    
    if (result.success) {
      // Redirigir al dashboard
      window.location.href = '/dashboard';
    } else {
      alert(result.error);
    }
    
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Correo"
        value={formData.correo}
        onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
        required
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={formData.contrasena}
        onChange={(e) => setFormData({ ...formData, contrasena: e.target.value })}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </button>
    </form>
  );
};

export default Login;
```

### **3. Colaboración en Tiempo Real**

#### **Hook de Socket.IO:**
```javascript
// src/hooks/useSocket.js
import { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';

const useSocket = (roomId) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [users, setUsers] = useState([]);
  const [diagram, setDiagram] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    if (roomId) {
      const newSocket = io(process.env.REACT_APP_API_URL || 'http://localhost:4000');
      socketRef.current = newSocket;
      setSocket(newSocket);

      // Eventos de conexión
      newSocket.on('connect', () => {
        setConnected(true);
        newSocket.emit('join-room', roomId);
      });

      newSocket.on('disconnect', () => {
        setConnected(false);
      });

      // Eventos de colaboración
      newSocket.on('user-joined', (data) => {
        console.log('Usuario se unió:', data);
      });

      newSocket.on('user-left', (data) => {
        console.log('Usuario salió:', data);
      });

      newSocket.on('diagram-update', (data) => {
        setDiagram(data);
      });

      newSocket.on('user-update', (data) => {
        setUsers(prev => updateUsers(prev, data));
      });

      newSocket.on('diagram-loaded', (data) => {
        setDiagram(data);
      });

      return () => {
        newSocket.emit('leave-room', roomId);
        newSocket.disconnect();
      };
    }
  }, [roomId]);

  const updateDiagram = (diagramData, userInfo) => {
    if (socket) {
      socket.emit('diagram-update', {
        ...diagramData,
        userInfo
      }, roomId);
    }
  };

  const updateUserStatus = (status) => {
    if (socket) {
      socket.emit('user-update', {
        status,
        cursor: getCurrentCursor()
      }, roomId);
    }
  };

  return {
    socket,
    connected,
    users,
    diagram,
    updateDiagram,
    updateUserStatus
  };
};

export default useSocket;
```

#### **Componente de Editor Colaborativo:**
```javascript
// src/components/CollaborativeEditor.js
import React, { useState, useEffect } from 'react';
import useSocket from '../hooks/useSocket';
import { useAuth } from '../hooks/useAuth';

const CollaborativeEditor = ({ roomId }) => {
  const { user } = useAuth();
  const { connected, users, diagram, updateDiagram, updateUserStatus } = useSocket(roomId);
  const [localDiagram, setLocalDiagram] = useState(null);

  useEffect(() => {
    if (diagram) {
      setLocalDiagram(diagram);
    }
  }, [diagram]);

  const handleDiagramChange = (newDiagram) => {
    setLocalDiagram(newDiagram);
    
    // Enviar cambios al servidor
    updateDiagram(newDiagram, {
      userName: user.nombre,
      userId: user.id
    });
  };

  const handleUserStatusChange = (status) => {
    updateUserStatus(status);
  };

  return (
    <div className="collaborative-editor">
      <div className="status-bar">
        <span>Estado: {connected ? 'Conectado' : 'Desconectado'}</span>
        <span>Usuarios: {users.length}</span>
      </div>
      
      <div className="editor-area">
        {/* Aquí iría tu editor de diagramas */}
        <DiagramEditor
          diagram={localDiagram}
          onChange={handleDiagramChange}
          onUserStatusChange={handleUserStatusChange}
        />
      </div>
      
      <div className="users-panel">
        <h3>Usuarios Conectados</h3>
        {users.map(user => (
          <div key={user.userId} className="user-item">
            <span>{user.userName}</span>
            <span className="status">{user.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CollaborativeEditor;
```

### **4. Generación de Spring Boot**

#### **Hook de Generación:**
```javascript
// src/hooks/useSpringBootGenerator.js
import { useState } from 'react';
import apiClient from '../api/client';

const useSpringBootGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateApp = async (umlDiagram, config = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.post('/api/ai/springboot-template-zip', {
        umlDiagram,
        config: {
          databaseType: 'h2',
          includeSecurity: true,
          includeCache: true,
          includeTests: true,
          ...config
        }
      }, {
        responseType: 'blob'
      });

      // Crear y descargar archivo ZIP
      const blob = new Blob([response.data], { type: 'application/zip' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${umlDiagram.metadata?.projectName || 'spring-boot-app'}-${Date.now()}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Error generando aplicación';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    generateApp,
    loading,
    error
  };
};

export default useSpringBootGenerator;
```

#### **Componente de Generación:**
```javascript
// src/components/SpringBootGenerator.js
import React, { useState } from 'react';
import useSpringBootGenerator from '../hooks/useSpringBootGenerator';

const SpringBootGenerator = ({ umlDiagram }) => {
  const { generateApp, loading, error } = useSpringBootGenerator();
  const [config, setConfig] = useState({
    databaseType: 'h2',
    includeSecurity: true,
    includeCache: true,
    includeTests: true
  });

  const handleGenerate = async () => {
    const result = await generateApp(umlDiagram, config);
    
    if (result.success) {
      alert('Aplicación Spring Boot generada exitosamente');
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  return (
    <div className="springboot-generator">
      <h3>Generar Aplicación Spring Boot</h3>
      
      <div className="config-options">
        <label>
          <input
            type="radio"
            name="databaseType"
            value="h2"
            checked={config.databaseType === 'h2'}
            onChange={(e) => setConfig({ ...config, databaseType: e.target.value })}
          />
          H2 (Desarrollo)
        </label>
        
        <label>
          <input
            type="radio"
            name="databaseType"
            value="postgresql"
            checked={config.databaseType === 'postgresql'}
            onChange={(e) => setConfig({ ...config, databaseType: e.target.value })}
          />
          PostgreSQL (Producción)
        </label>
        
        <label>
          <input
            type="checkbox"
            checked={config.includeSecurity}
            onChange={(e) => setConfig({ ...config, includeSecurity: e.target.checked })}
          />
          Incluir Spring Security
        </label>
        
        <label>
          <input
            type="checkbox"
            checked={config.includeCache}
            onChange={(e) => setConfig({ ...config, includeCache: e.target.checked })}
          />
          Incluir Cache
        </label>
        
        <label>
          <input
            type="checkbox"
            checked={config.includeTests}
            onChange={(e) => setConfig({ ...config, includeTests: e.target.checked })}
          />
          Incluir Tests
        </label>
      </div>
      
      <button onClick={handleGenerate} disabled={loading}>
        {loading ? 'Generando...' : 'Generar Aplicación'}
      </button>
      
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default SpringBootGenerator;
```

---

## 🟢 **INTEGRACIÓN CON VUE**

### **1. Configuración Inicial**

#### **Instalación de Dependencias:**
```bash
npm install axios socket.io-client
```

#### **Configuración de Axios:**
```javascript
// src/api/client.js
import axios from 'axios';

const API_BASE_URL = process.env.VUE_APP_API_URL || 'http://localhost:4000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
```

### **2. Store de Autenticación (Vuex)**

```javascript
// src/store/auth.js
import apiClient from '../api/client';

const state = {
  user: null,
  token: localStorage.getItem('token') || null
};

const mutations = {
  SET_USER(state, user) {
    state.user = user;
  },
  SET_TOKEN(state, token) {
    state.token = token;
    localStorage.setItem('token', token);
  },
  CLEAR_AUTH(state) {
    state.user = null;
    state.token = null;
    localStorage.removeItem('token');
  }
};

const actions = {
  async login({ commit }, { correo, contrasena }) {
    try {
      const response = await apiClient.post('/auth/login', {
        correo,
        contrasena
      });

      if (response.data.success) {
        const { token, data: userData } = response.data;
        commit('SET_TOKEN', token);
        commit('SET_USER', userData);
        return { success: true };
      }
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },

  async register({ commit }, { correo, contrasena, nombre }) {
    try {
      const response = await apiClient.post('/auth/register', {
        correo,
        contrasena,
        nombre
      });

      if (response.data.success) {
        const { token, data: userData } = response.data;
        commit('SET_TOKEN', token);
        commit('SET_USER', userData);
        return { success: true };
      }
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },

  logout({ commit }) {
    commit('CLEAR_AUTH');
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
```

### **3. Composable de Socket.IO**

```javascript
// src/composables/useSocket.js
import { ref, onMounted, onUnmounted } from 'vue';
import io from 'socket.io-client';

export function useSocket(roomId) {
  const socket = ref(null);
  const connected = ref(false);
  const users = ref([]);
  const diagram = ref(null);

  onMounted(() => {
    if (roomId) {
      socket.value = io(process.env.VUE_APP_API_URL || 'http://localhost:4000');

      socket.value.on('connect', () => {
        connected.value = true;
        socket.value.emit('join-room', roomId);
      });

      socket.value.on('disconnect', () => {
        connected.value = false;
      });

      socket.value.on('diagram-update', (data) => {
        diagram.value = data;
      });

      socket.value.on('user-update', (data) => {
        // Actualizar usuarios
        const index = users.value.findIndex(u => u.userId === data.userId);
        if (index >= 0) {
          users.value[index] = { ...users.value[index], ...data };
        } else {
          users.value.push(data);
        }
      });
    }
  });

  onUnmounted(() => {
    if (socket.value) {
      socket.value.emit('leave-room', roomId);
      socket.value.disconnect();
    }
  });

  const updateDiagram = (diagramData, userInfo) => {
    if (socket.value) {
      socket.value.emit('diagram-update', {
        ...diagramData,
        userInfo
      }, roomId);
    }
  };

  const updateUserStatus = (status) => {
    if (socket.value) {
      socket.value.emit('user-update', {
        status,
        cursor: getCurrentCursor()
      }, roomId);
    }
  };

  return {
    socket,
    connected,
    users,
    diagram,
    updateDiagram,
    updateUserStatus
  };
}
```

---

## 🔺 **INTEGRACIÓN CON ANGULAR**

### **1. Configuración Inicial**

#### **Instalación de Dependencias:**
```bash
npm install axios socket.io-client
npm install @types/socket.io-client --save-dev
```

#### **Servicio de API:**
```typescript
// src/app/services/api.service.ts
import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiClient = axios.create({
    baseURL: environment.apiUrl || 'http://localhost:4000',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  constructor() {
    // Interceptor para agregar token
    this.apiClient.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  async login(correo: string, contrasena: string) {
    const response = await this.apiClient.post('/auth/login', {
      correo,
      contrasena
    });
    return response.data;
  }

  async register(correo: string, contrasena: string, nombre: string) {
    const response = await this.apiClient.post('/auth/register', {
      correo,
      contrasena,
      nombre
    });
    return response.data;
  }

  async generateSpringBoot(umlDiagram: any, config: any) {
    const response = await this.apiClient.post('/api/ai/springboot-template-zip', {
      umlDiagram,
      config
    }, {
      responseType: 'blob'
    });
    return response.data;
  }
}
```

### **2. Servicio de Socket.IO**

```typescript
// src/app/services/socket.service.ts
import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;
  private connectedSubject = new BehaviorSubject<boolean>(false);
  private usersSubject = new BehaviorSubject<any[]>([]);
  private diagramSubject = new BehaviorSubject<any>(null);

  public connected$ = this.connectedSubject.asObservable();
  public users$ = this.usersSubject.asObservable();
  public diagram$ = this.diagramSubject.asObservable();

  connect(roomId: string) {
    this.socket = io(environment.apiUrl || 'http://localhost:4000');

    this.socket.on('connect', () => {
      this.connectedSubject.next(true);
      this.socket.emit('join-room', roomId);
    });

    this.socket.on('disconnect', () => {
      this.connectedSubject.next(false);
    });

    this.socket.on('diagram-update', (data) => {
      this.diagramSubject.next(data);
    });

    this.socket.on('user-update', (data) => {
      const currentUsers = this.usersSubject.value;
      const index = currentUsers.findIndex(u => u.userId === data.userId);
      if (index >= 0) {
        currentUsers[index] = { ...currentUsers[index], ...data };
      } else {
        currentUsers.push(data);
      }
      this.usersSubject.next([...currentUsers]);
    });
  }

  disconnect(roomId: string) {
    if (this.socket) {
      this.socket.emit('leave-room', roomId);
      this.socket.disconnect();
    }
  }

  updateDiagram(diagramData: any, userInfo: any, roomId: string) {
    if (this.socket) {
      this.socket.emit('diagram-update', {
        ...diagramData,
        userInfo
      }, roomId);
    }
  }

  updateUserStatus(status: string, roomId: string) {
    if (this.socket) {
      this.socket.emit('user-update', {
        status,
        cursor: this.getCurrentCursor()
      }, roomId);
    }
  }

  private getCurrentCursor() {
    // Implementar lógica para obtener cursor actual
    return { x: 0, y: 0 };
  }
}
```

---

## 🧪 **Tests de Integración**

### **React Testing Library:**
```javascript
// src/components/__tests__/Login.test.js
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider } from '../../hooks/useAuth';
import Login from '../Login';

const renderWithAuth = (component) => {
  return render(
    <AuthProvider>
      {component}
    </AuthProvider>
  );
};

test('should login successfully', async () => {
  renderWithAuth(<Login />);
  
  fireEvent.change(screen.getByPlaceholderText('Correo'), {
    target: { value: 'test@ejemplo.com' }
  });
  
  fireEvent.change(screen.getByPlaceholderText('Contraseña'), {
    target: { value: 'password123' }
  });
  
  fireEvent.click(screen.getByText('Iniciar Sesión'));
  
  await waitFor(() => {
    expect(screen.getByText('Iniciando sesión...')).toBeInTheDocument();
  });
});
```

### **Vue Testing:**
```javascript
// src/components/__tests__/Login.spec.js
import { mount } from '@vue/test-utils';
import { createStore } from 'vuex';
import Login from '../Login.vue';

describe('Login', () => {
  let store;

  beforeEach(() => {
    store = createStore({
      modules: {
        auth: {
          namespaced: true,
          actions: {
            login: jest.fn()
          }
        }
      }
    });
  });

  test('should login successfully', async () => {
    const wrapper = mount(Login, {
      global: {
        plugins: [store]
      }
    });

    await wrapper.find('input[type="email"]').setValue('test@ejemplo.com');
    await wrapper.find('input[type="password"]').setValue('password123');
    await wrapper.find('form').trigger('submit');

    expect(store._modules.root._children.auth.actions.login).toHaveBeenCalled();
  });
});
```

---

## 🚀 **Despliegue**

### **Variables de Entorno:**

#### **React:**
```env
REACT_APP_API_URL=http://localhost:4000
REACT_APP_SOCKET_URL=http://localhost:4000
```

#### **Vue:**
```env
VUE_APP_API_URL=http://localhost:4000
VUE_APP_SOCKET_URL=http://localhost:4000
```

#### **Angular:**
```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:4000',
  socketUrl: 'http://localhost:4000'
};
```

### **Docker Compose:**
```yaml
# docker-compose.yml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "4000:4000"
    environment:
      - DATABASE_URL=postgresql://user:password@db:5432/database
      - JWT_SECRET=your-secret-key
    depends_on:
      - db

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=http://localhost:4000
    depends_on:
      - backend

  db:
    image: postgres:13
    environment:
      - POSTGRES_DB=database
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

---

## 📊 **Monitoreo y Logs**

### **Métricas Recomendadas:**
- Tiempo de respuesta de APIs
- Número de conexiones Socket.IO
- Tasa de éxito de generación
- Errores de autenticación
- Uso de memoria y CPU

### **Logs Importantes:**
- Conexiones/desconexiones de usuarios
- Errores de generación
- Fallos de autenticación
- Errores de Socket.IO

---

## ⚠️ **Consideraciones de Seguridad**

### **Frontend:**
- Validar inputs antes de enviar
- Sanitizar datos del usuario
- No exponer tokens en logs
- Usar HTTPS en producción

### **Backend:**
- Rate limiting en APIs
- Validación de CORS
- Sanitización de inputs
- Logs de seguridad

---

## 🔄 **Próximas Mejoras**

- [ ] PWA para offline
- [ ] Notificaciones push
- [ ] Sincronización offline
- [ ] Compresión de datos
- [ ] Cache inteligente
- [ ] Analytics integrado
