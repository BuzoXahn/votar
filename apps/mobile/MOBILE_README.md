# VotAR — App Mobile (Fase 4)

App construida con **Expo + React Native** en TypeScript.

## Requisitos

- Node.js >= 20
- Expo CLI: `npm install -g expo-cli`
- App **Expo Go** en tu teléfono (iOS o Android)
- La API corriendo en `localhost:3000`

## Instalación

```bash
cd apps/mobile
npm install
```

## Correr la app

```bash
npx expo start
```

Escanea el QR con Expo Go en tu teléfono.

## Conectar con la API

Abre `src/services/api.ts` y cambia `API_URL`:

```typescript
// Si corres en simulador iOS
export const API_URL = 'http://localhost:3000/v1';

// Si corres en Android o dispositivo físico
// Usa la IP de tu máquina en la red local
export const API_URL = 'http://192.168.1.X:3000/v1';
```

Para saber tu IP local en Windows:
```powershell
ipconfig | Select-String "IPv4"
```

## Estructura de pantallas

```
Auth:
  SplashScreen      → Pantalla de bienvenida
  LoginScreen       → Ingreso de email
  OtpScreen         → Verificación de código 6 dígitos

Setup (solo usuarios nuevos):
  ProfessionScreen  → Selección de profesión
  AvatarScreen      → Creación de avatar anónimo

Main (usuarios autenticados):
  HomeScreen        → Lista de votaciones activas
  PollDetailScreen  → Detalle de votación
  VoteScreen        → Emitir voto + comprobante
  ResultsScreen     → Resultados general y por profesión
  OfficialsScreen   → Lista de funcionarios
  OfficialDetail    → Perfil de funcionario
  ProfileScreen     → Mi perfil y privacidad
```

## Flujo completo

1. Splash → toca "Comenzar"
2. Ingresa tu email → recibe OTP en la consola de la API
3. Verifica con el código de 6 dígitos
4. Selecciona tu profesión
5. Crea tu avatar (animal + color + apodo)
6. Ya estás en el Home con las votaciones activas
7. Toca una votación → "Votar" → elige opción → confirmar
8. Recibe comprobante con hash del voto
9. Ve los resultados generales y por profesión
