-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "ci" TEXT,
    "nombre" TEXT NOT NULL,
    "apellidos" TEXT,
    "correo" TEXT NOT NULL,
    "contrasena" TEXT NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sala" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "capacidad" INTEGER NOT NULL,
    "descripcion" TEXT NOT NULL,
    "esPrivada" BOOLEAN NOT NULL,
    "diagrama" JSONB NOT NULL,
    "idHost" TEXT NOT NULL,

    CONSTRAINT "Sala_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsuarioSala" (
    "id" TEXT NOT NULL,
    "idUsuario" TEXT NOT NULL,
    "idSala" TEXT NOT NULL,
    "rol" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UsuarioSala_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_ci_key" ON "Usuario"("ci");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_correo_key" ON "Usuario"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "UsuarioSala_idUsuario_idSala_key" ON "UsuarioSala"("idUsuario", "idSala");

-- AddForeignKey
ALTER TABLE "Sala" ADD CONSTRAINT "Sala_idHost_fkey" FOREIGN KEY ("idHost") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuarioSala" ADD CONSTRAINT "UsuarioSala_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuarioSala" ADD CONSTRAINT "UsuarioSala_idSala_fkey" FOREIGN KEY ("idSala") REFERENCES "Sala"("id") ON DELETE CASCADE ON UPDATE CASCADE;
