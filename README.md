# Seminario de fundamentación en cuidados paliativos

**Universidad Antonio Nariño · Facultad de Enfermería**
Maestría en Cuidados Paliativos · Código 32264001 · Plan de estudios 3660 · 3 créditos
Semestre **2026-II** · Docente: Jorge Wilhem Bogoya López · [jbogoya63@uan.edu.co](mailto:jbogoya63@uan.edu.co)

---

## Qué es este seminario

Un espacio académico que trabaja sobre una distancia: **hay norma y no hay datos.** Colombia
tiene una ley de cuidados paliativos desde 2014, resoluciones, sentencias y lineamientos
internacionales — y, al mismo tiempo, si se pregunta cuántas personas con necesidad paliativa hay
en un municipio y cuántas están siendo atendidas, lo más probable es que el dato no exista.

Se trabaja **en modelo de aula invertida**: el contenido se estudia antes, cada sesión abre con un
entregable individual y el encuentro se conduce contrastando lo que el grupo escribió.

Tres unidades:

| Unidad | Contenido |
|---|---|
| **1 · Contexto histórico-filosófico y lineamientos sociopolíticos** | Antecedentes y fundamentos filosóficos · políticas mundiales, latinoamericanas y colombianas · marco legal y barreras de acceso |
| **2 · Modelos de atención desde la investigación** | Modelos tradicionales vs. alternativos · telesalud y tecnologías digitales · enfoques diferenciales |
| **3 · Aspectos bioéticos y experiencias de manejo integral** | Bioética y dilemas éticos · planificación anticipada · equipo interprofesional y redes de apoyo |

**Evaluación:** tres cortes — 35 % · 35 % · 30 %.

---

## El sitio

**https://jboglop.github.io/seminario_fundamentacion_cp/**

Ahí está la portada del seminario, con las siete sesiones. Esta página que está leyendo es la cara
del repositorio; la portada es la cara del curso.

## Las siete sesiones

Siete encuentros de tres horas, los viernes de 8:00 a 11:00. Cada sesión tiene una guía, una
**presentación** que se estudia antes y un **entregable previo** individual. Las fichas de las
siete ya están publicadas; el material se construye una a una.

| # | Fecha | Sesión | Unidad |
|---|---|---|---|
| 1 | 21 ago | [Antecedentes históricos y fundamentos filosóficos](sesiones/s01-historia-fundamentos/) — [presentación](sesiones/s01-historia-fundamentos/clase.html) · [entregable](sesiones/s01-historia-fundamentos/preparacion.html) | U1 |
| 2 | 4 sep | [Lineamientos y políticas: mundo, región, Colombia](sesiones/s02-politicas-lineamientos/) — [presentación](sesiones/s02-politicas-lineamientos/clase.html) · [entregable](sesiones/s02-politicas-lineamientos/preparacion.html) | U1 |
| 3 | 18 sep | [Marco legal, enfoque de derechos y barreras de acceso](sesiones/s03-marco-legal-barreras/) | U1 · entrega 35 % |
| 4 | 2 oct | [Modelos de atención y telesalud](sesiones/s04-modelos-telesalud/) | U2 |
| 5 | 16 oct | [Enfoques diferenciales](sesiones/s05-enfoques-diferenciales/) | U2 · entrega 35 % |
| 6 | 30 oct | [Bioética, dilemas y planificación anticipada](sesiones/s06-bioetica-decisiones/) | U3 |
| 7 | 20 nov | [Equipo interprofesional, liderazgo y redes de apoyo](sesiones/s07-equipo-redes/) | U3 · final 30 % |

La lista canónica vive en [`sesiones/_sesiones.json`](sesiones/_sesiones.json), y
`node scripts/verificar.js` falla si la portada deja de coincidir con ella.

---

## Estado

El sitio y el motor de entregables están completos. **Las sesiones 1 y 2 están construidas** y
la 1 ya se dictó. Faltan las sesiones 3 a 7.

> **¿Va a trabajar en este repositorio?** Empiece por [`HANDOFF.md`](HANDOFF.md): tiene el
> contexto completo, las reglas del proyecto y lo que costó caro aprender.

| Documento | Qué contiene |
|---|---|
| [`HANDOFF.md`](HANDOFF.md) | **Punto de entrada.** De dónde viene la asignatura, cómo se trabaja y qué falta |
| [`CLAUDE.md`](CLAUDE.md) | Las reglas en versión corta y ejecutable, para agentes y para quien llega nuevo |
| [`docs/CRUCE-FUSION.md`](docs/CRUCE-FUSION.md) | Qué material viene de cada asignatura y qué se queda fuera |
| [`docs/PROGRAMADOR-2026-II.md`](docs/PROGRAMADOR-2026-II.md) | Las siete sesiones, con el calendario oficial verificado |
| [`docs/PLAN_MIGRACION_U1.md`](docs/PLAN_MIGRACION_U1.md) | Cómo se condensan las 8 clases de 2026-I en 3 sesiones |
| [`docs/DISENO_UNIDAD_2.md`](docs/DISENO_UNIDAD_2.md) · [`DISENO_UNIDAD_3.md`](docs/DISENO_UNIDAD_3.md) | Diseño pedagógico de las unidades nuevas |
| [`docs/METODO-reorganizar-asignatura.md`](docs/METODO-reorganizar-asignatura.md) | El procedimiento, ya probado en dos asignaturas |

---

## Las reglas de la casa

1. **Portabilidad sin conexión.** Cada HTML abre con doble clic, sin servidor y sin internet.
   Sin Google Fonts, sin librerías desde CDN, sin `<iframe>`.
2. **Sin datos de estudiantes.** Este repositorio es público e indexable.
3. **No se designa a nadie por su pronóstico.** «persona con enfermedad avanzada», no «paciente
   terminal», salvo en citas literales de normas.
4. **Material de terceros: se cita, no se reproduce.**

Comprobables con `node scripts/verificar.js` — cinco comprobaciones: enlaces rotos, recursos
externos, datos personales, lenguaje del curso y coherencia entre la portada y el manifiesto de
sesiones. Detalle en [`CLAUDE.md`](CLAUDE.md).
