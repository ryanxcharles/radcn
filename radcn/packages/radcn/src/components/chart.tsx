import type { Handle, RemixNode } from 'remix/ui'

import { classes } from '../utils/classes.ts'

export interface ChartSeriesConfig {
  color?: string
  label: string
}

export type ChartConfig = Record<string, ChartSeriesConfig>

export interface ChartContainerProps {
  ariaDescribedBy?: string
  ariaLabel?: string
  ariaLabelledby?: string
  children?: RemixNode
  class?: string
  config?: ChartConfig
  description?: string
  id?: string
  style?: string
  title?: string
}

export interface ChartBarSeriesProps {
  class?: string
  color?: string
  height?: number
  labels?: string[]
  name?: string
  values: number[]
  width?: number
}

export interface ChartLineSeriesProps {
  class?: string
  color?: string
  height?: number
  labels?: string[]
  name?: string
  values: number[]
  width?: number
}

export interface ChartLegendProps {
  children?: RemixNode
  class?: string
  style?: string
}

export interface ChartLegendItemProps {
  children?: RemixNode
  class?: string
  color?: string
  name?: string
  style?: string
}

export interface ChartTooltipProps {
  children?: RemixNode
  class?: string
  label?: string
  style?: string
}

export interface ChartTooltipItemProps {
  class?: string
  color?: string
  label: string
  style?: string
  value: string | number
}

function maxValue(values: number[]) {
  return Math.max(1, ...values.map((value) => (Number.isFinite(value) ? value : 0)))
}

function pointLabel(labels: string[] | undefined, index: number) {
  return labels?.[index] ?? `Item ${index + 1}`
}

function chartVariables(config: ChartConfig | undefined) {
  if (!config) return undefined
  return Object.entries(config)
    .map(([key, item]) => (item.color ? `--radcn-chart-${key}: ${item.color}` : ''))
    .filter(Boolean)
    .join('; ')
}

export function ChartContainer(handle: Handle<ChartContainerProps>) {
  return () => {
    let {
      ariaDescribedBy,
      ariaLabel,
      ariaLabelledby,
      children,
      class: className,
      config,
      description,
      id,
      style,
      title,
    } = handle.props
    let variables = chartVariables(config)
    let mergedStyle = [variables, style].filter(Boolean).join('; ') || undefined

    return (
      <figure
        aria-describedby={ariaDescribedBy}
        aria-label={ariaLabelledby ? undefined : ariaLabel}
        aria-labelledby={ariaLabelledby}
        class={classes('radcn-chart', className)}
        data-radcn-chart
        id={id}
        role="img"
        style={mergedStyle}
      >
        {title ? <figcaption class="radcn-chart-title" data-radcn-chart-title>{title}</figcaption> : undefined}
        {description ? <p class="radcn-chart-description" data-radcn-chart-description>{description}</p> : undefined}
        {children}
      </figure>
    )
  }
}

export function ChartBarSeries(handle: Handle<ChartBarSeriesProps>) {
  return () => {
    let { class: className, color, height = 180, labels, name = 'Value', values, width = 320 } = handle.props
    let max = maxValue(values)
    let gap = 10
    let padding = 24
    let innerWidth = width - padding * 2
    let innerHeight = height - padding * 2
    let barWidth = values.length > 0 ? Math.max(4, (innerWidth - gap * (values.length - 1)) / values.length) : 0

    return (
      <svg
        aria-hidden="true"
        class={classes('radcn-chart-svg', className)}
        data-radcn-chart-svg
        data-series={name}
        viewBox={`0 0 ${width} ${height}`}
      >
        <line class="radcn-chart-axis" x1={padding} x2={width - padding} y1={height - padding} y2={height - padding} />
        {values.map((value, index) => {
          let normalized = Math.max(0, value) / max
          let barHeight = normalized * innerHeight
          let x = padding + index * (barWidth + gap)
          let y = height - padding - barHeight

          return (
            <rect
              aria-label={`${pointLabel(labels, index)} ${value}`}
              class="radcn-chart-bar"
              data-label={pointLabel(labels, index)}
              data-radcn-chart-bar
              data-value={value}
              fill={color || `var(--radcn-chart-${name}, var(--radcn-primary))`}
              height={barHeight}
              key={index}
              rx="4"
              width={barWidth}
              x={x}
              y={y}
            />
          )
        })}
      </svg>
    )
  }
}

export function ChartLineSeries(handle: Handle<ChartLineSeriesProps>) {
  return () => {
    let { class: className, color, height = 180, labels, name = 'Value', values, width = 320 } = handle.props
    let max = maxValue(values)
    let padding = 24
    let innerWidth = width - padding * 2
    let innerHeight = height - padding * 2
    let step = values.length > 1 ? innerWidth / (values.length - 1) : 0
    let points = values.map((value, index) => {
      let x = padding + step * index
      let y = height - padding - (Math.max(0, value) / max) * innerHeight
      return { label: pointLabel(labels, index), value, x, y }
    })
    let pointString = points.map((point) => `${point.x},${point.y}`).join(' ')

    return (
      <svg
        aria-hidden="true"
        class={classes('radcn-chart-svg', className)}
        data-radcn-chart-svg
        data-series={name}
        viewBox={`0 0 ${width} ${height}`}
      >
        <line class="radcn-chart-axis" x1={padding} x2={width - padding} y1={height - padding} y2={height - padding} />
        <polyline
          class="radcn-chart-line"
          data-radcn-chart-line
          fill="none"
          points={pointString}
          stroke={color || `var(--radcn-chart-${name}, var(--radcn-primary))`}
        />
        {points.map((point, index) => (
          <circle
            aria-label={`${point.label} ${point.value}`}
            class="radcn-chart-point"
            cx={point.x}
            cy={point.y}
            data-label={point.label}
            data-radcn-chart-point
            data-value={point.value}
            fill={color || `var(--radcn-chart-${name}, var(--radcn-primary))`}
            key={index}
            r="4"
          />
        ))}
      </svg>
    )
  }
}

export function ChartLegend(handle: Handle<ChartLegendProps>) {
  return () => {
    let { children, class: className, style } = handle.props

    return <div class={classes('radcn-chart-legend', className)} data-radcn-chart-legend style={style}>{children}</div>
  }
}

export function ChartLegendItem(handle: Handle<ChartLegendItemProps>) {
  return () => {
    let { children, class: className, color, name, style } = handle.props
    let mergedStyle = [color ? `--radcn-chart-item-color: ${color}` : undefined, style].filter(Boolean).join('; ') || undefined

    return (
      <span class={classes('radcn-chart-legend-item', className)} data-name={name} data-radcn-chart-legend-item style={mergedStyle}>
        <span aria-hidden="true" class="radcn-chart-legend-swatch" data-radcn-chart-legend-swatch />
        {children ?? name}
      </span>
    )
  }
}

export function ChartTooltip(handle: Handle<ChartTooltipProps>) {
  return () => {
    let { children, class: className, label, style } = handle.props

    return (
      <div class={classes('radcn-chart-tooltip', className)} data-radcn-chart-tooltip style={style}>
        {label ? <div class="radcn-chart-tooltip-label" data-radcn-chart-tooltip-label>{label}</div> : undefined}
        {children}
      </div>
    )
  }
}

export function ChartTooltipItem(handle: Handle<ChartTooltipItemProps>) {
  return () => {
    let { class: className, color, label, style, value } = handle.props
    let mergedStyle = [color ? `--radcn-chart-item-color: ${color}` : undefined, style].filter(Boolean).join('; ') || undefined

    return (
      <div class={classes('radcn-chart-tooltip-item', className)} data-radcn-chart-tooltip-item style={mergedStyle}>
        <span aria-hidden="true" class="radcn-chart-tooltip-swatch" data-radcn-chart-tooltip-swatch />
        <span data-radcn-chart-tooltip-name>{label}</span>
        <span data-radcn-chart-tooltip-value>{value}</span>
      </div>
    )
  }
}
