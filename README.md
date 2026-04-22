# Category Tree

Solución en Node.js + TypeScript para manejar un árbol de categorías desde una capa de dominio.

## Cómo correrlo

Primero instalar dependencias:

```bash
npm install
```

Correr tests:

```bash
npm test
```

Revisar errores de TypeScript:

```bash
npm run typecheck
```

## Fases completadas

- Fase 1: obtener paths de hojas activas ordenados alfabéticamente.
- Fase 2: buscar una categoría por ID y devolver su metadata.
- Fase 3: analizar una estructura y reportar métricas y anomalías.

## Supuestos que tomé

- Para Fase 1 y Fase 2 asumí que el árbol viene bien formado, como dice el enunciado.
- Para Fase 3 el input puede venir mal, por eso el método recibe `unknown`.
- Si `findCategoryById` no encuentra el ID, devuelve `null`.
- Si en el análisis aparece un nodo inválido, lo reporto y corto esa rama.
- Una hoja activa sólo entra en el resultado si todos sus padres también están activos.
- Los nombres se limpian con `trim()` al armar paths en el análisis.

## Decisiones principales

- Dejé todo en una capa de dominio chica, sin meter frameworks.
- Los tipos del dominio están en `src/domain/category.ts`.
- Las operaciones están en `CategoryService`.
- Usé un enum para los códigos de anomalías para no repetir strings sueltos.
- Para detectar IDs duplicados uso un `Set`.
- Para evitar ciclos reviso si el nodo ya existe en la cadena de padres actual.

## Complejidad

- `getActiveLeafPaths`: `O(n)` tiempo.
- `findCategoryById`: `O(n)` tiempo.
- `analyzeCategoryStructure`: `O(n)` tiempo y `O(n)` espacio por IDs, anomalías, paths y stack recursivo.

## Árboles muy profundos

Usé recursión porque para esta prueba deja el código más simple de leer. Para datos muy profundos, lo mejor sería cambiar el recorrido a un stack iterativo.

Los ciclos no generan loop infinito porque se detectan antes de seguir bajando por la rama.
