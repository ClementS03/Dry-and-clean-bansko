interface DesignConfig {
  colors: {
    gold: string
    goldLight: string
    goldDark: string
    ink: string
    ink800: string
    ink700: string
    ink600: string
    ink500: string
    cream: string
    creamDark: string
  }
  fonts: {
    display: string
    body: string
    googleUrl: string
  }
}

declare const design: DesignConfig
export = design
