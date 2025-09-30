# ☕ Generador Spring Boot

## 📋 **Descripción**
Sistema de generación de aplicaciones Spring Boot completas a partir de diagramas UML usando plantillas Handlebars (sin IA).

## 🏗️ **Arquitectura**

### **Archivos del Módulo:**
```
src/
├── experts/expertSpringBootTemplate.ts    # Experto principal
├── generators/SpringBootTemplateEngine.ts # Motor de plantillas
├── templates/springboot/                  # Plantillas Handlebars
│   ├── entity.hbs                        # Entidades JPA
│   ├── repository.hbs                    # Repositorios
│   ├── service.hbs                       # Servicios
│   ├── controller.hbs                    # Controladores REST
│   ├── pom.xml.hbs                       # Maven POM
│   ├── application.properties.hbs        # Configuración
│   ├── Application.java.hbs              # Clase principal
│   ├── EntityTest.hbs                    # Tests de entidades
│   ├── ServiceTest.hbs                   # Tests de servicios
│   ├── SecurityConfig.hbs                # Configuración de seguridad
│   ├── CacheConfig.hbs                   # Configuración de cache
│   └── GlobalExceptionHandler.hbs        # Manejo de excepciones
├── utils/umlParser.ts                     # Parser de diagramas UML
└── test/springboot.test.ts               # Tests del generador
```

## 🔌 **API Principal**

### **POST /api/ai/springboot-template-zip**
Genera una aplicación Spring Boot completa como archivo ZIP.

**Request Body:**
```json
{
  "umlDiagram": {
    "classes": [
      {
        "id": "class-1",
        "name": "User",
        "attributes": [
          {
            "name": "id",
            "type": "Long",
            "visibility": "private",
            "isRequired": true
          },
          {
            "name": "email",
            "type": "String",
            "visibility": "private",
            "isRequired": true
          },
          {
            "name": "password",
            "type": "String",
            "visibility": "private",
            "isRequired": true
          }
        ],
        "methods": [
          {
            "name": "getFullName",
            "returnType": "String",
            "parameters": [],
            "visibility": "public"
          }
        ]
      },
      {
        "id": "class-2",
        "name": "Product",
        "attributes": [
          {
            "name": "id",
            "type": "Long",
            "visibility": "private",
            "isRequired": true
          },
          {
            "name": "name",
            "type": "String",
            "visibility": "private",
            "isRequired": true
          },
          {
            "name": "price",
            "type": "BigDecimal",
            "visibility": "private",
            "isRequired": true
          },
          {
            "name": "stock",
            "type": "Integer",
            "visibility": "private",
            "isRequired": true
          }
        ]
      }
    ],
    "relationships": [
      {
        "id": "rel-1",
        "type": "one-to-many",
        "sourceClass": "User",
        "targetClass": "Product",
        "sourceField": "products",
        "targetField": "owner"
      }
    ],
    "metadata": {
      "projectName": "EcommerceApp",
      "packageName": "com.ecommerce.app",
      "version": "1.0.0"
    }
  },
  "config": {
    "databaseType": "h2",
    "includeSecurity": true,
    "includeCache": true,
    "includeTests": true
  }
}
```

**Response:**
- **Content-Type**: `application/zip`
- **Content-Disposition**: `attachment; filename=EcommerceApp_template_1234567890.zip`
- **Body**: Archivo ZIP binario

## 📦 **Contenido del ZIP Generado**

### **Estructura del Proyecto:**
```
EcommerceApp/
├── pom.xml                                    # Maven POM
├── src/
│   ├── main/
│   │   ├── java/com/ecommerce/app/
│   │   │   ├── EcommerceAppApplication.java  # Clase principal
│   │   │   ├── entity/
│   │   │   │   ├── User.java                 # Entidad JPA
│   │   │   │   └── Product.java              # Entidad JPA
│   │   │   ├── repository/
│   │   │   │   ├── UserRepository.java       # Repositorio
│   │   │   │   └── ProductRepository.java    # Repositorio
│   │   │   ├── service/
│   │   │   │   ├── UserService.java          # Servicio
│   │   │   │   └── ProductService.java       # Servicio
│   │   │   ├── controller/
│   │   │   │   ├── UserController.java       # Controlador REST
│   │   │   │   └── ProductController.java    # Controlador REST
│   │   │   └── config/
│   │   │       ├── SecurityConfig.java       # Seguridad
│   │   │       ├── CacheConfig.java          # Cache
│   │   │       └── GlobalExceptionHandler.java # Excepciones
│   │   └── resources/
│   │       └── application.properties        # Configuración
│   └── test/
│       └── java/com/ecommerce/app/
│           ├── UserTest.java                 # Test entidad
│           ├── UserServiceTest.java          # Test servicio
│           ├── ProductTest.java               # Test entidad
│           └── ProductServiceTest.java       # Test servicio
```

## 🎯 **Características Generadas**

### **1. Entidades JPA:**
```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    @NotNull
    @NotBlank
    @Email
    private String email;

    @Column(nullable = false)
    @NotNull
    @NotBlank
    @Size(min = 8, message = "La contraseña debe tener al menos 8 caracteres")
    private String password;

    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Product> products = new ArrayList<>();

    // Constructors, getters, setters, business methods
    public boolean isValid() { return true; }
}
```

### **2. Repositorios Spring Data:**
```java
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
}
```

### **3. Servicios con Lógica de Negocio:**
```java
@Service
@Transactional
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Cacheable(value = "users", key = "'all'")
    public List<User> findAll() { /* ... */ }

    @Transactional
    @CacheEvict(value = {"users", "user"}, allEntries = true)
    public User save(User user) { /* ... */ }

    // Métodos específicos por entidad
    public Optional<User> findByEmail(String email) { /* ... */ }
    public User activateUser(Long id) { /* ... */ }
}
```

### **4. Controladores REST:**
```java
@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
@Validated
public class UserController {
    @GetMapping
    @Cacheable(value = "users")
    public ResponseEntity<List<User>> getAllUsers() { /* ... */ }

    @PostMapping
    @CacheEvict(value = {"users", "user"}, allEntries = true)
    public ResponseEntity<User> createUser(@Validated @RequestBody User user) { /* ... */ }

    @GetMapping("/email/{email}")
    @Cacheable(value = "userByEmail", key = "#email")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) { /* ... */ }
}
```

### **5. Tests Unitarios:**
```java
@ExtendWith(MockitoExtension.class)
public class UserServiceTest {
    @Mock
    private UserRepository userRepository;
    @InjectMocks
    private UserService userService;

    @Test
    void testSave() {
        // Given
        User user = new User();
        when(userRepository.save(user)).thenReturn(user);
        
        // When
        User result = userService.save(user);
        
        // Then
        assertNotNull(result);
        verify(userRepository).save(user);
    }
}
```

### **6. Configuración Avanzada:**
```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        // Configuración de seguridad
    }
}

@Configuration
@EnableCaching
public class CacheConfig {
    @Bean
    @Primary
    public CacheManager cacheManager() {
        // Configuración de cache
    }
}
```

## 📊 **Tipos de Datos Soportados**

### **Tipos UML → Java:**
| Tipo UML | Tipo Java | Validaciones |
|----------|-----------|--------------|
| `String` | `String` | `@NotBlank`, `@Size(max=255)` |
| `Integer` | `Integer` | `@Min(0)`, `@Max(2147483647)` |
| `Long` | `Long` | `@Positive` |
| `Boolean` | `Boolean` | - |
| `Date` | `LocalDateTime` | - |
| `BigDecimal` | `BigDecimal` | `@DecimalMin("0.0")` |
| `Double` | `Double` | `@Positive` |

### **Validaciones Automáticas:**
- **Email**: `@Email` para campos "email"
- **Teléfono**: `@Pattern` para campos "phone"
- **Contraseña**: `@Size(min=8)` para campos "password"
- **Campos únicos**: `unique = true` para email, username, code
- **Campos requeridos**: `@NotNull`, `@NotBlank`

## 🔗 **Relaciones Soportadas**

### **1. One-to-Many:**
```java
@OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
private List<Product> products = new ArrayList<>();
```

### **2. Many-to-One:**
```java
@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "owner_id")
private User owner;
```

### **3. One-to-One:**
```java
@OneToOne(cascade = CascadeType.ALL)
@JoinColumn(name = "profile_id")
private UserProfile profile;
```

### **4. Many-to-Many:**
```java
@ManyToMany(cascade = CascadeType.ALL)
@JoinTable(
    name = "user_roles",
    joinColumns = @JoinColumn(name = "user_id"),
    inverseJoinColumns = @JoinColumn(name = "role_id")
)
private List<Role> roles = new ArrayList<>();
```

## ⚙️ **Configuraciones Disponibles**

### **Base de Datos:**
- **H2**: Base de datos en memoria (desarrollo)
- **PostgreSQL**: Base de datos de producción
- **MySQL**: Base de datos alternativa

### **Características Opcionales:**
- **Security**: Spring Security configurado
- **Cache**: Cache con Caffeine
- **Tests**: Tests unitarios completos
- **Validation**: Validaciones JSR-303
- **Logging**: SLF4J configurado

## 🧪 **Tests del Generador**

### **Casos de Prueba:**
1. ✅ Generar aplicación simple (1 entidad)
2. ✅ Generar aplicación con relaciones
3. ✅ Generar aplicación con validaciones
4. ✅ Generar aplicación con tests
5. ✅ Generar aplicación con seguridad
6. ✅ Generar aplicación con cache
7. ✅ Validar estructura del ZIP
8. ✅ Validar contenido de archivos

### **Ejecutar Tests:**
```bash
npm test -- --testPathPattern=springboot.test.ts
```

## 📊 **Métricas de Rendimiento**

- **Tiempo de generación**: ~2-5 segundos
- **Tamaño ZIP**: ~20-50 KB
- **Archivos generados**: 15-30 archivos
- **Líneas de código**: ~2000-5000 líneas
- **Cobertura de tests**: ~80-90%

## 🚀 **Uso en Frontend**

### **Integración con React:**
```javascript
import axios from 'axios';

class SpringBootGenerator {
  async generateApp(umlDiagram, config = {}) {
    try {
      const response = await axios.post('/api/ai/springboot-template-zip', {
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

      // Descargar archivo ZIP
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `spring-boot-app-${Date.now()}.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (error) {
      console.error('Error generando aplicación:', error);
      return { success: false, error: error.message };
    }
  }
}

// Uso
const generator = new SpringBootGenerator();

const umlDiagram = {
  classes: [
    {
      id: 'user-1',
      name: 'User',
      attributes: [
        { name: 'id', type: 'Long', visibility: 'private', isRequired: true },
        { name: 'email', type: 'String', visibility: 'private', isRequired: true },
        { name: 'password', type: 'String', visibility: 'private', isRequired: true }
      ]
    }
  ],
  relationships: [],
  metadata: {
    projectName: 'MyApp',
    packageName: 'com.example.app'
  }
};

generator.generateApp(umlDiagram, {
  databaseType: 'postgresql',
  includeSecurity: true
});
```

### **Integración con Vue:**
```javascript
export default {
  methods: {
    async generateSpringBootApp() {
      try {
        const response = await this.$http.post('/api/ai/springboot-template-zip', {
          umlDiagram: this.umlDiagram,
          config: this.generationConfig
        }, {
          responseType: 'blob'
        });

        // Crear y descargar archivo
        const blob = new Blob([response.data], { type: 'application/zip' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.projectName}-spring-boot.zip`;
        a.click();
        window.URL.revokeObjectURL(url);

        this.$toast.success('Aplicación Spring Boot generada exitosamente');
      } catch (error) {
        this.$toast.error('Error generando aplicación: ' + error.message);
      }
    }
  }
};
```

## ⚠️ **Limitaciones**

### **1. Tipos de Datos:**
- Solo tipos básicos de Java
- Sin tipos personalizados
- Sin enums automáticos
- Sin tipos de colección complejos

### **2. Relaciones:**
- Sin herencia automática
- Sin relaciones bidireccionales complejas
- Sin cascadas personalizadas
- Sin fetch strategies avanzadas

### **3. Validaciones:**
- Solo validaciones básicas
- Sin validaciones personalizadas
- Sin validaciones de negocio
- Sin validaciones cross-field

### **4. Configuración:**
- Sin configuración personalizada por entidad
- Sin profiles de Spring
- Sin configuración de base de datos avanzada
- Sin configuración de logging personalizada

### **5. Tests:**
- Solo tests unitarios básicos
- Sin tests de integración
- Sin tests de performance
- Sin mocks avanzados

## 🔄 **Próximas Mejoras**

- [ ] Soporte para enums
- [ ] Herencia automática
- [ ] Validaciones personalizadas
- [ ] Tests de integración
- [ ] Configuración avanzada
- [ ] Soporte para microservicios
- [ ] Generación de DTOs
- [ ] Documentación automática (Swagger)
- [ ] Configuración de Docker
- [ ] CI/CD pipelines

## 📚 **Ejemplos de Uso**

### **Ejemplo 1: E-commerce Simple**
```json
{
  "umlDiagram": {
    "classes": [
      {
        "name": "User",
        "attributes": [
          {"name": "id", "type": "Long", "isRequired": true},
          {"name": "email", "type": "String", "isRequired": true},
          {"name": "password", "type": "String", "isRequired": true}
        ]
      },
      {
        "name": "Product",
        "attributes": [
          {"name": "id", "type": "Long", "isRequired": true},
          {"name": "name", "type": "String", "isRequired": true},
          {"name": "price", "type": "BigDecimal", "isRequired": true}
        ]
      }
    ],
    "relationships": [
      {
        "type": "one-to-many",
        "sourceClass": "User",
        "targetClass": "Product"
      }
    ]
  }
}
```

### **Ejemplo 2: Sistema de Blog**
```json
{
  "umlDiagram": {
    "classes": [
      {
        "name": "User",
        "attributes": [
          {"name": "id", "type": "Long", "isRequired": true},
          {"name": "username", "type": "String", "isRequired": true},
          {"name": "email", "type": "String", "isRequired": true}
        ]
      },
      {
        "name": "Post",
        "attributes": [
          {"name": "id", "type": "Long", "isRequired": true},
          {"name": "title", "type": "String", "isRequired": true},
          {"name": "content", "type": "String", "isRequired": true},
          {"name": "publishedAt", "type": "Date", "isRequired": false}
        ]
      },
      {
        "name": "Comment",
        "attributes": [
          {"name": "id", "type": "Long", "isRequired": true},
          {"name": "content", "type": "String", "isRequired": true},
          {"name": "createdAt", "type": "Date", "isRequired": true}
        ]
      }
    ],
    "relationships": [
      {
        "type": "one-to-many",
        "sourceClass": "User",
        "targetClass": "Post"
      },
      {
        "type": "one-to-many",
        "sourceClass": "Post",
        "targetClass": "Comment"
      }
    ]
  }
}
```

