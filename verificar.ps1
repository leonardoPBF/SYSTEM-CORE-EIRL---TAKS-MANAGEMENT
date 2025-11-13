# Script de Prueba Rápida - Sistema de Gestión de Tickets
# Este script verifica que todo esté funcionando correctamente

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "   Sistema de Gestión de Tickets - TaskSystemCore" -ForegroundColor Cyan
Write-Host "   Script de Verificación" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# Función para verificar si un comando existe
function Test-Command {
    param($Command)
    try {
        Get-Command $Command -ErrorAction Stop | Out-Null
        return $true
    }
    catch {
        return $false
    }
}

# 1. Verificar Node.js
Write-Host "[1/6] Verificando Node.js..." -ForegroundColor Yellow
if (Test-Command node) {
    $nodeVersion = node --version
    Write-Host "  ✓ Node.js instalado: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "  ✗ Node.js NO está instalado" -ForegroundColor Red
    Write-Host "    Descarga desde: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# 2. Verificar npm
Write-Host "[2/6] Verificando npm..." -ForegroundColor Yellow
if (Test-Command npm) {
    $npmVersion = npm --version
    Write-Host "  ✓ npm instalado: v$npmVersion" -ForegroundColor Green
} else {
    Write-Host "  ✗ npm NO está instalado" -ForegroundColor Red
    exit 1
}

# 3. Verificar PostgreSQL
Write-Host "[3/6] Verificando PostgreSQL..." -ForegroundColor Yellow
if (Test-Command psql) {
    $pgVersion = psql --version
    Write-Host "  ✓ PostgreSQL instalado: $pgVersion" -ForegroundColor Green
} else {
    Write-Host "  ! PostgreSQL no detectado en PATH" -ForegroundColor Yellow
    Write-Host "    Asegúrate de tener PostgreSQL instalado y ejecutándose" -ForegroundColor Yellow
}

# 4. Verificar estructura del proyecto
Write-Host "[4/6] Verificando estructura del proyecto..." -ForegroundColor Yellow
$backendExists = Test-Path "backend"
$frontendExists = Test-Path "frontend"

if ($backendExists -and $frontendExists) {
    Write-Host "  ✓ Carpetas backend y frontend encontradas" -ForegroundColor Green
} else {
    Write-Host "  ✗ Estructura del proyecto incompleta" -ForegroundColor Red
    if (-not $backendExists) { Write-Host "    Falta: backend/" -ForegroundColor Red }
    if (-not $frontendExists) { Write-Host "    Falta: frontend/" -ForegroundColor Red }
    exit 1
}

# 5. Verificar dependencias del backend
Write-Host "[5/6] Verificando dependencias del backend..." -ForegroundColor Yellow
if (Test-Path "backend/node_modules") {
    Write-Host "  ✓ Dependencias del backend instaladas" -ForegroundColor Green
} else {
    Write-Host "  ! Dependencias del backend NO instaladas" -ForegroundColor Yellow
    Write-Host "    Ejecuta: cd backend && npm install" -ForegroundColor Yellow
}

# Verificar archivo .env
if (Test-Path "backend/.env") {
    Write-Host "  ✓ Archivo .env encontrado" -ForegroundColor Green
} else {
    Write-Host "  ! Archivo .env NO encontrado" -ForegroundColor Yellow
    Write-Host "    Crea backend/.env con las credenciales de PostgreSQL" -ForegroundColor Yellow
}

# 6. Verificar dependencias del frontend
Write-Host "[6/6] Verificando dependencias del frontend..." -ForegroundColor Yellow
if (Test-Path "frontend/node_modules") {
    Write-Host "  ✓ Dependencias del frontend instaladas" -ForegroundColor Green
} else {
    Write-Host "  ! Dependencias del frontend NO instaladas" -ForegroundColor Yellow
    Write-Host "    Ejecuta: cd frontend && npm install" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "   Resumen de Verificación" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# Verificar archivos clave creados
$filesCreated = @(
    "frontend/src/components/ui/dialog.tsx",
    "frontend/src/components/ui/select.tsx",
    "frontend/src/components/ui/textarea.tsx",
    "GUIA_INSTALACION.md",
    "IMPLEMENTACION_NUEVO_TICKET.md"
)

Write-Host "Archivos de la implementación:" -ForegroundColor Cyan
foreach ($file in $filesCreated) {
    if (Test-Path $file) {
        Write-Host "  ✓ $file" -ForegroundColor Green
    } else {
        Write-Host "  ✗ $file" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Próximos pasos:" -ForegroundColor Cyan
Write-Host "1. Asegúrate de que PostgreSQL esté ejecutándose" -ForegroundColor White
Write-Host "2. Configura backend/.env con tus credenciales" -ForegroundColor White
Write-Host "3. Ejecuta: cd backend && npm run db:push" -ForegroundColor White
Write-Host "4. Ejecuta: cd backend && npm run db:seed" -ForegroundColor White
Write-Host "5. Inicia el backend: cd backend && npm run dev" -ForegroundColor White
Write-Host "6. Inicia el frontend: cd frontend && npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Para más información, consulta GUIA_INSTALACION.md" -ForegroundColor Yellow
Write-Host ""
Write-Host "==================================================" -ForegroundColor Cyan
