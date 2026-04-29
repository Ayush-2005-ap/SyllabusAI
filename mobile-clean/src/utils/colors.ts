// ─── Dark Mode (Purple / Violet Accent) ──────────────────────
export const darkColors = {
  background:             '#0d0d14',
  surface:                '#0d0d14',
  surfaceContainerLowest: '#080810',
  surfaceContainerLow:    '#13131e',
  surfaceContainer:       '#18182a',
  surfaceContainerHigh:   '#1f1f33',
  surfaceContainerHighest:'#28283f',
  primary:                '#c4a8ff',   // Vivid violet
  primaryContainer:       '#7c4dff',   // Deep purple CTA
  onPrimary:              '#1a0050',
  onPrimaryContainer:     '#ede0ff',
  onSurface:              '#e8e0f5',
  onBackground:           '#e8e0f5',
  onSurfaceVariant:       '#c3b9d4',
  tertiary:               '#ffb07a',   // Warm coral accent
  tertiaryContainer:      '#b85c00',
  error:                  '#ffb4ab',
  errorContainer:         '#93000a',
  secondary:              '#cdbfea',
  secondaryContainer:     '#3d2f6b',
  outline:                '#8a7fa0',
  outlineVariant:         '#3d3852',
  // legacy aliases
  cardBackground:         'rgba(25,20,45,0.80)',
  cardBorder:             'rgba(196,168,255,0.10)',
  textPrimary:            '#e8e0f5',
  textSecondary:          '#c3b9d4',
  success:                '#57e89c',
  warning:                '#ffb07a',
  danger:                 '#ff7c7c',
};


// ─── Light Mode ──────────────────────────────────────────────
export const lightColors = {
  background:             '#f0f4ff',
  surface:                '#f0f4ff',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow:    '#e8eef9',
  surfaceContainer:       '#dde4f0',
  surfaceContainerHigh:   '#d0d9ec',
  surfaceContainerHighest:'#c2cfe0',
  primary:                '#0061a5',
  primaryContainer:       '#4f94dd',
  onPrimary:              '#ffffff',
  onPrimaryContainer:     '#001c37',
  onSurface:              '#0e1322',
  onBackground:           '#0e1322',
  onSurfaceVariant:       '#44474f',
  tertiary:               '#8c5800',
  tertiaryContainer:      '#ffb955',
  error:                  '#ba1a1a',
  errorContainer:         '#ffdad6',
  secondary:              '#1a324c',
  secondaryContainer:     '#d2e4ff',
  outline:                '#74777f',
  outlineVariant:         '#c4c6d0',
  // legacy aliases
  cardBackground:         'rgba(220,228,245,0.85)',
  cardBorder:             'rgba(0,0,0,0.08)',
  textPrimary:            '#0e1322',
  textSecondary:          '#44474f',
  success:                '#15803d',
  warning:                '#8c5800',
  danger:                 '#ba1a1a',
};

// Default export is dark (used by files that import colors directly)
export const colors = darkColors;
