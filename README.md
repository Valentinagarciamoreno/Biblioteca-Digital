# Biblioteca Digital

Página web gratuita para leer libros en línea. Leer no cuesta ni pide cuenta; registrarse es opcional.
Es el proyecto de certificación del Tecnólogo en Análisis y Desarrollo de Software del SENA.

**Sitio publicado:** https://script.google.com/macros/s/AKfycbzR5STHtggBOW5lkLPWFOgHzjAAqScZszQdyIP1rvPFPq6WpvSBQUGynfWSovQ956Z4/exec

## Estado

El catálogo tiene 10 libros de ejemplo. El inicio de sesión valida el formato de los datos, pero
todavía no comprueba cuentas reales, y los favoritos se guardan solo en el navegador.

## Tecnologías

Google Apps Script (V8), HTML, CSS y JavaScript. El despliegue se hace con
[clasp](https://github.com/google/clasp).

## Estructura

- `src/`: código de la aplicación.
- `docs/`: documentación técnica.

## Despliegue

El archivo `.clasp.json` no se publica en este repositorio; cada computador debe tener el suyo, con
`"rootDir": "src"`.

```
clasp push
clasp create-version "descripción"
clasp update-deployment <id-del-despliegue> -V <número> -d "descripción"
```
