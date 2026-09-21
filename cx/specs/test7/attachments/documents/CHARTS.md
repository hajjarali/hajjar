# ECharts Chart Catalog

All charts in this project are ECharts-backed React elements driven by Java
`*ChartData` DTOs. The React side (`AbstractEChartsElement.jsx` + per-chart
elements) is a near-passthrough: most chart-level POJOs are written so the field
names match ECharts option keys exactly, e.g. `option.title = data.chartTitle`,
`option.legend = data.legend`, `option.tooltip = data.tooltip`.

## Chart list

| jsontype | Java data class | React element | Series item type |
|---|---|---|---|
| `ui.charts.barChart`     | `BarChartData`     | `BarChartElement.jsx`     | `ChartsSeries<Number>`        |
| `ui.charts.lineChart`    | `LineChartData`    | `LineChartElement.jsx`    | `LineChartSeries` (extends `ChartsSeries<Number>`) |
| `ui.charts.scatterChart` | `ScatterChartData` | `ScatterChartElement.jsx` | `ChartsSeries<ScatterPoint>`  |
| `ui.charts.pieChart`     | `PieChartData`     | `PieChartElement.jsx`     | `PieChartSeries` (extends `ChartsSeries<PieCategory>`) |
| `ui.charts.radarChart`   | `RadarChartData`   | `RadarChartElement.jsx`   | `RadarSeries` (extends `ChartsSeries<Number>`) |
| `ui.charts.funnelChart`  | `FunnelChartData`  | `FunnelChartElement.jsx`  | `ChartsSeries<FunnelItem>`    |
| `ui.charts.gaugeChart`   | `GaugeChartData`   | `GaugeChartElement.jsx`   | `ChartsSeries<Object>` (unused; value rides `AbstractElementData.value`) |

---

## Common base — every chart has these

All chart DTOs extend `AbstractChartData<S>` (and inherit from
`AbstractElementData` above that). Field names line up 1:1 with ECharts option
keys so they pass through untranslated.

### `AbstractChartData<S>` — universal chart fields

| Field | Type | Purpose |
|---|---|---|
| `chartTitle` | `ChartTitle` (`{ text, subtext }`) | Canvas title. **Named `chartTitle`** to avoid shadowing `AbstractElementData.title` (HTML tooltip/aria-label). |
| `animation` | `Boolean` | Enable/disable mount + transition animation. |
| `animationDuration` | `Integer` | ms. |
| `legend` | `ChartsLegend` (`{ position, hidden }`) | Legend chrome. |
| `tooltip` | `ChartsTooltip` (`{ trigger: "item"\|"axis"\|"none" }`) | Hover tooltip behavior. |
| `series` | `List<S>` | Series list — `S` is the per-chart type. |

### `AbstractCartesianChartData<S>` — adds axes (Bar, Line, Scatter)

| Field | Type | Purpose |
|---|---|---|
| `xAxis` | `List<ChartsXAxis>` | X-axis configs: `data` (categories), `label`, `scaleType` (`IScaleType` — discrete/continuous), `position` (`top`/`bottom`). |
| `yAxis` | `List<ChartsYAxis>` | Y-axis configs: same + `position` (`left`/`right`). |
| `grid`  | `ChartsGrid` (`{ horizontal, vertical }`) | Show/hide grid lines. |

### `ChartsSeries<T>` — the generic series envelope

Every series item carries:

| Field | Type | Purpose |
|---|---|---|
| `id`    | `String` | Series identity. |
| `label` | `String` | Legend label. |
| `color` | `String` | CSS color override. If absent, the brand's ECharts theme assigns a color via `getSeriesColor(i)`. |
| `stack` | `String` | Stacking group (Bar/Line). Series sharing a `stack` name stack on top of one another. |
| `data`  | `List<T>` | Datapoints — `T` differs per chart. |

---

## Bar — `ui.charts.barChart`

`BarChartData extends AbstractCartesianChartData<ChartsSeries<Number>>`

**Specific field:** `layout` — `"horizontal"` or `"vertical"`.

```json
{
  "id": "sales-bar",
  "jsontype": "ui.charts.barChart",
  "chartTitle": { "text": "Quarterly Sales" },
  "legend": { "position": "top" },
  "tooltip": { "trigger": "axis" },
  "layout": "vertical",
  "xAxis": [{ "data": ["Q1", "Q2", "Q3", "Q4"], "label": "Quarter" }],
  "yAxis": [{ "label": "Revenue ($k)" }],
  "grid":  { "horizontal": true, "vertical": false },
  "series": [
    { "id": "north", "label": "North", "stack": "region", "data": [120, 140, 160, 180] },
    { "id": "south", "label": "South", "stack": "region", "data": [ 80, 100, 130, 150] }
  ]
}
```

---

## Line — `ui.charts.lineChart`

`LineChartData extends AbstractCartesianChartData<LineChartSeries>`

All line-specific options live **per-series** on `LineChartSeries`:

| Field | Type | Purpose |
|---|---|---|
| `curve`        | `LineChartCurve` enum | Line interpolation: `linear`, `monotone`, `step`, ... |
| `area`         | `Boolean` | Filled area below the line. |
| `connectNulls` | `Boolean` | Skip-over vs. break-at nulls. |

```json
{
  "id": "traffic-line",
  "jsontype": "ui.charts.lineChart",
  "chartTitle": { "text": "Daily Traffic" },
  "xAxis": [{ "data": ["Mon","Tue","Wed","Thu","Fri"], "scaleType": "discrete" }],
  "yAxis": [{ "label": "Visits" }],
  "series": [
    {
      "id": "site-a", "label": "Site A",
      "curve": "monotone", "area": true, "connectNulls": false,
      "data": [120, 200, 150, 80, 70]
    }
  ]
}
```

---

## Scatter — `ui.charts.scatterChart`

`ScatterChartData extends AbstractCartesianChartData<ChartsSeries<ScatterPoint>>`

| Field | Type | Purpose |
|---|---|---|
| `zAxis` | `List<ChartsAxis>` | Used to scale marker size client-side. **Not rendered** as a third axis. |

`ScatterPoint`: `{ id, x: Number, y: Number, z: Number }` — `z` drives marker
size.

```json
{
  "id": "perf-scatter",
  "jsontype": "ui.charts.scatterChart",
  "xAxis": [{ "label": "Latency (ms)" }],
  "yAxis": [{ "label": "Throughput" }],
  "zAxis": [{ "label": "Memory (MB)" }],
  "series": [{
    "id": "nodes", "label": "Nodes",
    "data": [
      { "id": "n1", "x": 12, "y": 4200, "z": 64 },
      { "id": "n2", "x": 18, "y": 3800, "z": 128 },
      { "id": "n3", "x":  9, "y": 5100, "z": 96 }
    ]
  }]
}
```

---

## Pie — `ui.charts.pieChart`

`PieChartData extends AbstractChartData<PieChartSeries>` *(no cartesian axes)*

**Chart-level:** `label` — `ChartLabel { show, position }` for per-slice labels
(`PieLabelPosition` = `outside | inside | center`).

**Per-series (`PieChartSeries`):** `innerRadius`, `outerRadius` — concentric
"nested pie" rendering. Data items are `PieCategory { id, value, label }`.

```json
{
  "id": "share-pie",
  "jsontype": "ui.charts.pieChart",
  "chartTitle": { "text": "Market Share" },
  "label": { "show": true, "position": "outside" },
  "series": [{
    "id": "share", "label": "Share",
    "innerRadius": 40, "outerRadius": 100,
    "data": [
      { "id": "a", "label": "Alpha", "value": 35 },
      { "id": "b", "label": "Beta",  "value": 28 },
      { "id": "c", "label": "Gamma", "value": 22 },
      { "id": "d", "label": "Delta", "value": 15 }
    ]
  }]
}
```

---

## Radar — `ui.charts.radarChart`

`RadarChartData extends AbstractChartData<RadarSeries>`

**Chart-level:** `radar` — `RadarMetrics { metrics: List<String> }` (the spoke
labels).

**Per-series (`RadarSeries`):** `fillArea` (Boolean). `data` is a `List<Number>`
— one value per metric, **in the same order as `radar.metrics`**.

```json
{
  "id": "skills-radar",
  "jsontype": "ui.charts.radarChart",
  "radar": { "metrics": ["Speed", "Power", "Range", "Stealth", "Cost"] },
  "series": [
    { "id": "team-a", "label": "Team A", "fillArea": true,  "data": [80, 70, 90, 60, 50] },
    { "id": "team-b", "label": "Team B", "fillArea": false, "data": [60, 85, 70, 80, 70] }
  ]
}
```

---

## Funnel — `ui.charts.funnelChart`

`FunnelChartData extends AbstractChartData<ChartsSeries<FunnelItem>>`

| Field | Type | Purpose |
|---|---|---|
| `sort`   | `"descending" \| "ascending" \| "none"` (`FunnelSort`) | Segment order. |
| `orient` | `"vertical" \| "horizontal"` | Funnel direction. |
| `gap`    | `Integer` | Pixel gap between segments. |
| `label`  | `ChartLabel` | Per-segment label (`FunnelLabelPosition` = inside / outside / left / right / center / corners). |

`FunnelItem`: `{ name, value }`.

```json
{
  "id": "conv-funnel",
  "jsontype": "ui.charts.funnelChart",
  "chartTitle": { "text": "Conversion" },
  "sort": "descending", "orient": "vertical", "gap": 4,
  "label": { "show": true, "position": "inside" },
  "series": [{
    "id": "conv", "label": "Conversion",
    "data": [
      { "name": "Visitors", "value": 1000 },
      { "name": "Signups",  "value":  420 },
      { "name": "Trials",   "value":  180 },
      { "name": "Paid",     "value":   65 }
    ]
  }]
}
```

---

## Gauge — `ui.charts.gaugeChart`

`GaugeChartData extends AbstractChartData<ChartsSeries<Object>>` — single-value
chart. **The displayed value rides on `AbstractElementData.value`, not in
`series`.**

| Field | Type | Purpose |
|---|---|---|
| `valueMin` / `valueMax` | `Number` | Gauge range. |
| `progress` | `GaugeProgress { show, color }` | Filled value arc. |
| `showPointer` | `Boolean` | Show/hide the dial pointer. |
| `startAngle` / `endAngle` | `Number` (degrees) | Raw arc geometry. |

```json
{
  "id": "cpu-gauge",
  "jsontype": "ui.charts.gaugeChart",
  "chartTitle": { "text": "CPU" },
  "value": 72,
  "valueMin": 0, "valueMax": 100,
  "progress":    { "show": true, "color": "#ff5a78" },
  "showPointer": true,
  "startAngle":  220, "endAngle": -40
}
```

---

## How the React side consumes it

`AbstractEChartsElement.buildCommonOption(data)` is a POJO passthrough — it
assigns the chart-level fields directly:

```js
option.title   = data.chartTitle;
option.legend  = data.legend;
option.tooltip = data.tooltip;
```

Per-chart subclasses (`BarChartElement.jsx`, `PieChartElement.jsx`, …) translate
their specific fields and series into ECharts `series[]`. Brand theming
(palette, axis colors, tooltip chrome, splitLine alpha) is supplied by the
registered ECharts theme `"obs-brand"` — series with no explicit `color` cycle
through `echartsTheme.palette` via `getSeriesColor(i)`.