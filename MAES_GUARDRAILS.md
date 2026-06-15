# Guardrails y Reglas de Comportamiento (Metodología MAES)

Estas reglas son de cumplimiento **OBLIGATORIO** para cualquier desarrollo, componente o modificación en este entorno:

1. **Performance (Core Web Vitals):** 
   - Todo el código generado debe estar optimizado para cumplir con los estándares de Core Web Vitals (LCP, INP, CLS).
   - Minimizar el tamaño del bundle, optimizar carga de recursos (lazy loading) y utilizar directivas de cliente de Astro (`client:load`, `client:visible`, etc.) de forma estratégica y solo cuando sea estrictamente necesario.

2. **Semántica (Tripletas Semánticas):**
   - Inyectar automáticamente Tripletas Semánticas (Sujeto, Predicado, Objeto) mediante atributos `data-*` u otras etiquetas semánticas (`itemscope`, `itemprop`, `itemtype`) en cada componente y elemento clave de la UI, para asegurar la máxima comprensión por parte de motores de búsqueda y LLMs.

3. **Seguridad (Mejores Prácticas):**
   - Aplicar los estándares de **Better Auth** para cualquier flujo de autenticación, autorización o manejo de sesiones.
   - Instrumentar adecuadamente el monitoreo de errores y rendimiento con **Sentry** en cada página o componente interactivo.
   - Sanear inputs, prevenir XSS e inyecciones en la manipulación del DOM y rutas API.

4. **Sincronización:**
   - Todo ciclo de inicialización o actualización de dependencias críticas finalizará con `npm install` para garantizar la integridad y correcta vinculación del entorno local.
