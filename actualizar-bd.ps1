# Script para Actualizar la Base de Datos con Nuevos Agentes
# Este script ejecuta el seeder para poblar la BD con 9 agentes

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "   Actualización de Base de Datos - TaskSystemCore" -ForegroundColor Cyan
Write-Host "   Agregando 6 nuevos agentes de TI" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# Verificar que estamos en la raíz del proyecto
if (-not (Test-Path "backend")) {
    Write-Host "❌ Error: Debes ejecutar este script desde la raíz del proyecto" -ForegroundColor Red
    Write-Host "   Directorio actual: $PWD" -ForegroundColor Yellow
    exit 1
}

Write-Host "📁 Directorio correcto detectado" -ForegroundColor Green
Write-Host ""

# Navegar a la carpeta backend
Set-Location backend

Write-Host "🔍 Verificando dependencias..." -ForegroundColor Yellow
if (-not (Test-Path "node_modules")) {
    Write-Host "⚠️  Las dependencias no están instaladas" -ForegroundColor Yellow
    Write-Host "   Instalando dependencias..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Error al instalar dependencias" -ForegroundColor Red
        Set-Location ..
        exit 1
    }
    Write-Host "✅ Dependencias instaladas" -ForegroundColor Green
}

Write-Host ""
Write-Host "⚠️  ADVERTENCIA: Este proceso eliminará todos los datos existentes" -ForegroundColor Yellow
Write-Host "   y creará nuevos datos de ejemplo" -ForegroundColor Yellow
Write-Host ""
Write-Host "   Se crearán:" -ForegroundColor White
Write-Host "   - 9 Agentes de TI (3 originales + 6 nuevos)" -ForegroundColor White
Write-Host "   - 3 Equipos de Soporte" -ForegroundColor White
Write-Host "   - 16 Tickets distribuidos" -ForegroundColor White
Write-Host "   - 3 Clientes" -ForegroundColor White
Write-Host "   - Comentarios de ejemplo" -ForegroundColor White
Write-Host ""

$confirm = Read-Host "¿Deseas continuar? (s/n)"
if ($confirm -ne "s" -and $confirm -ne "S") {
    Write-Host "❌ Operación cancelada" -ForegroundColor Yellow
    Set-Location ..
    exit 0
}

Write-Host ""
Write-Host "🚀 Ejecutando seeder..." -ForegroundColor Cyan
Write-Host ""

npm run db:seed

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "==================================================" -ForegroundColor Green
    Write-Host "   ✅ Base de datos actualizada exitosamente!" -ForegroundColor Green
    Write-Host "==================================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "📊 Nuevos agentes agregados:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "   Equipo de Soporte 1 (3 agentes):" -ForegroundColor White
    Write-Host "   • Leslie Alexander - leslie@tasksystemcore.com" -ForegroundColor Gray
    Write-Host "   • Devon Lane - devon@tasksystemcore.com" -ForegroundColor Gray
    Write-Host "   • Carlos Rodríguez - carlos@tasksystemcore.com ⭐" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "   Equipo de Soporte 2 (3 agentes):" -ForegroundColor White
    Write-Host "   • Jenny Wilson - jenny@tasksystemcore.com" -ForegroundColor Gray
    Write-Host "   • María García - maria@tasksystemcore.com ⭐" -ForegroundColor Yellow
    Write-Host "   • Juan Martínez - juan@tasksystemcore.com ⭐" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "   Equipo de Soporte 3 (3 agentes) - NUEVO:" -ForegroundColor White
    Write-Host "   • Ana López - ana@tasksystemcore.com ⭐" -ForegroundColor Yellow
    Write-Host "   • Pedro Sánchez - pedro@tasksystemcore.com ⭐" -ForegroundColor Yellow
    Write-Host "   • Laura Fernández - laura@tasksystemcore.com ⭐" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "   Contraseña para todos: agent123" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📋 Total de tickets creados: 16" -ForegroundColor White
    Write-Host "👥 Total de agentes: 9" -ForegroundColor White
    Write-Host ""
    Write-Host "🌐 Próximos pasos:" -ForegroundColor Cyan
    Write-Host "   1. Asegúrate de que el backend esté corriendo: npm run dev" -ForegroundColor White
    Write-Host "   2. Asegúrate de que el frontend esté corriendo" -ForegroundColor White
    Write-Host "   3. Ve a http://localhost:5173" -ForegroundColor White
    Write-Host "   4. Inicia sesión y ve a 'Equipo de TI'" -ForegroundColor White
    Write-Host "   5. Filtra por equipos para ver todos los agentes" -ForegroundColor White
    Write-Host ""
    Write-Host "📖 Para más información, consulta: ACTUALIZAR_AGENTES.md" -ForegroundColor Yellow
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ Error al ejecutar el seeder" -ForegroundColor Red
    Write-Host "   Verifica que PostgreSQL esté ejecutándose" -ForegroundColor Yellow
    Write-Host "   Revisa las credenciales en backend/.env" -ForegroundColor Yellow
    Write-Host ""
}

# Volver a la raíz
Set-Location ..

Write-Host "==================================================" -ForegroundColor Cyan
