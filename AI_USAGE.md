# AI Usage

Sí usé IA durante la prueba, principalmente como apoyo para revisar ideas y validar que el enfoque tuviera sentido.

La implementación la fui armando y ajustando yo. Usé la ayuda para:

- revisar decisiones de diseño
- mejorar casos de prueba
- comparar opciones cuando había varias formas válidas de resolver una regla
- destrabar la Fase 3, especialmente en cómo validar datos `unknown`, reportar anomalías sin romper todo el análisis y evitar ciclos
- resolver dudas puntuales de TypeScript cuando el compilador no podía inferir tipos después de validar campos
- mejorar la redacción del README

La implementación final la fui armando y ajustando yo, sobre todo:

- los nombres principales del dominio, tipos y métodos
- el comportamiento de `findCategoryById` cuando no encuentra un ID
- los criterios del analizador para decidir cuándo un nodo es válido y cuándo se reporta como anomalía
- la forma de manejar ramas inválidas sin detener todo el análisis
- los tests mínimos para cubrir las fases completadas
- los supuestos documentados en el README

También revisé manualmente el código, corrí los tests y el typecheck antes de dejar la solución lista.
