# Librerías de terceros incrustadas

## chart.umd.min.js — Chart.js 4.4.1

**Licencia MIT** · https://www.chartjs.org · Copyright (c) 2014-2024 Chart.js Contributors

### Por qué está aquí y no en un CDN

La regla de portabilidad del curso (decisión D7) exige que cada HTML abra con doble clic, sin
servidor y sin conexión. Un `<script src="https://cdn...">` deja el gráfico en blanco sin red.

Incrustar la librería **no viola la portabilidad: la cumple**. Es lo que indica el §6 del método
para gráficos interactivos — los estáticos se convierten a SVG en línea, que sale más barato.

### Dónde se usa

| Sesión | Archivo | Gráfico | Por qué la librería y no SVG |
|---|---|---|---|
| 4 | `index.html` · `version-moodle.html` | Radar de 5 organismos × 5 ejes | Seis botones filtran y resaltan cada organismo. Reescribirlo sería rehacer una librería de gráficos |

Los gráficos **estáticos** del curso no la usan. En la sesión 7, `marco_normativo_jurisprudencial`
tenía una barra y un donut sin interacción: se convirtieron a SVG en línea y se ahorraron estos
205 KB.

### Cómo actualizarla

```bash
curl -sL -o _shared/vendor/chart.umd.min.js \
  "https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"
```

Igual que `tokens.css`, este archivo es **fuente canónica, no enlace**: se copia en línea dentro
del `<style>`/`<script>` de cada página que lo necesita. Al actualizarlo hay que propagarlo.
