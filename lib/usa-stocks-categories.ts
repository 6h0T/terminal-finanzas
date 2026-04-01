// Categorías de acciones USA basadas en sectores conocidos
// Se usan para clasificar las acciones que devuelve data912.com/live/usa_stocks

export const USA_SECTOR_SYMBOLS: Record<string, string[]> = {
  tech: [
    "AAPL", "MSFT", "GOOGL", "GOOG", "META", "NVDA", "AMD", "INTC", "AVGO", "CRM",
    "ADBE", "ORCL", "CSCO", "QCOM", "TXN", "NOW", "AMAT", "MU", "LRCX", "KLAC",
    "SNPS", "CDNS", "MRVL", "NXPI", "ADI", "FTNT", "PANW", "CRWD", "ZS", "NET",
    "DDOG", "SNOW", "PLTR", "UBER", "ABNB", "SHOP", "SQ", "PYPL", "INTU", "ADSK",
    "WDAY", "TEAM", "VEEV", "HUBS", "TWLO", "TTD", "APP", "RBLX", "U", "ARM",
    "SMCI", "DELL", "HPQ", "HPE", "IBM", "SAP", "TSM", "ASML", "MELI", "SE",
    "BIDU", "JD", "PDD", "BABA", "NTES", "BILI", "TME", "ZM", "DOCU", "OKTA",
    "MDB", "ESTC", "CFLT", "PATH", "MNDY", "GLOB", "WIX", "BILL", "APPN", "ALTR",
  ],
  financial: [
    "JPM", "BAC", "WFC", "C", "GS", "MS", "BLK", "SCHW", "AXP", "V",
    "MA", "COF", "USB", "PNC", "TFC", "BK", "STT", "FITB", "HBAN", "KEY",
    "CFG", "RF", "ZION", "MTB", "CMA", "ALLY", "SIVB", "FRC", "WAL", "EWBC",
    "IBKR", "MKTX", "CBOE", "CME", "ICE", "NDAQ", "SPGI", "MCO", "MSCI", "FIS",
    "FISV", "GPN", "ADP", "AFRM", "SOFI", "HOOD", "COIN", "MARA", "RIOT",
    "BRK.B", "MET", "PRU", "AFL", "AIG", "ALL", "TRV", "PGR", "CB", "HIG",
  ],
  energy: [
    "XOM", "CVX", "COP", "SLB", "EOG", "MPC", "PSX", "VLO", "PXD", "OXY",
    "HAL", "BKR", "FANG", "DVN", "HES", "APA", "MRO", "CTRA", "EQT", "AR",
    "RRC", "SWN", "OVV", "CHRD", "MTDR", "VNOM", "TRGP", "WMB", "KMI", "OKE",
    "ET", "EPD", "MPLX", "PAA", "AM", "LNG", "DINO", "DK", "PBF", "CIVI",
  ],
  healthcare: [
    "JNJ", "UNH", "PFE", "ABBV", "TMO", "ABT", "LLY", "MRK", "BMY", "AMGN",
    "GILD", "ISRG", "VRTX", "REGN", "MDT", "SYK", "BDX", "ZBH", "BSX", "EW",
    "DXCM", "ALGN", "IDXX", "DHR", "A", "IQV", "CRL", "WST", "MTD", "WAT",
    "CI", "ELV", "HCA", "HUM", "CNC", "MOH", "CVS", "WBA", "MCK", "CAH",
    "BIIB", "MRNA", "BNTX", "AZN", "NVO", "GSK", "SNY", "ALNY", "SGEN", "EXAS",
  ],
  consumer: [
    "AMZN", "TSLA", "HD", "LOW", "TGT", "WMT", "COST", "DG", "DLTR", "ROST",
    "TJX", "NKE", "LULU", "GPS", "ANF", "AEO", "BBWI", "ETSY", "W", "CHWY",
    "CVNA", "DASH", "DKNG", "MGM", "LVS", "WYNN", "MAR", "HLT", "H", "RCL",
    "CCL", "NCLH", "SBUX", "MCD", "CMG", "DPZ", "QSR", "YUM", "WING", "CAVA",
    "KO", "PEP", "MNST", "KDP", "STZ", "TAP", "BUD", "DEO", "PM", "MO",
    "PG", "CL", "KMB", "CHD", "CLX", "EL", "ULTA", "DIS", "NFLX", "CMCSA",
    "WBD", "PARA", "FOX", "FOXA", "LYV", "SPOT", "ROKU", "IMAX",
  ],
  industrial: [
    "BA", "RTX", "LMT", "NOC", "GD", "LHX", "HII", "TDG", "HWM", "TXT",
    "GE", "HON", "MMM", "CAT", "DE", "PCAR", "CMI", "AGCO", "CNHI", "TT",
    "EMR", "ROK", "AME", "ETN", "PH", "DOV", "XYL", "ITW", "SWK", "FAST",
    "GWW", "MSM", "URI", "WAB", "NSC", "CSX", "UNP", "UPS", "FDX", "JBHT",
    "CHRW", "EXPD", "XPO", "ODFL", "SAIA", "DAL", "UAL", "AAL", "LUV", "ALK",
    "WM", "RSG", "WCN", "VRSK", "BR", "ADP",
  ],
  realestate: [
    "AMT", "PLD", "CCI", "EQIX", "SPG", "O", "WELL", "DLR", "PSA", "AVB",
    "EQR", "VTR", "ARE", "BXP", "SLG", "VNO", "KIM", "REG", "FRT", "HST",
    "MAA", "ESS", "CPT", "UDR", "INVH", "AMH", "VICI", "GLPI", "STOR", "NNN",
    "WPC", "STAG", "COLD", "REXR", "FR", "EGP", "CUBE", "EXR", "LSI", "IRM",
  ],
  etf: [
    "SPY", "QQQ", "DIA", "IWM", "VTI", "VOO", "IVV", "VXX", "UVXY", "SQQQ",
    "TQQQ", "ARKK", "ARKW", "ARKF", "ARKG", "ARKQ", "XLF", "XLK", "XLE", "XLV",
    "XLI", "XLP", "XLY", "XLB", "XLU", "XLRE", "XLC", "GLD", "SLV", "USO",
    "TLT", "HYG", "LQD", "BND", "AGG", "EMB", "EEM", "EFA", "VWO", "IEMG",
    "KWEB", "FXI", "MCHI", "VGK", "EWJ", "EWZ", "INDA", "AMLP", "SCHD", "VIG",
    "JEPI", "JEPQ", "TSLL", "NVDL", "TSLY", "TSLQ", "SOXL", "SOXS", "LABU",
  ],
}

export type UsaCategoryType = "all" | "tech" | "financial" | "energy" | "healthcare" | "consumer" | "industrial" | "realestate" | "etf"

export const USA_CATEGORY_LABELS: Record<UsaCategoryType, string> = {
  all: "TODOS",
  tech: "TECH",
  financial: "FINANCIERO",
  energy: "ENERGÍA",
  healthcare: "SALUD",
  consumer: "CONSUMO",
  industrial: "INDUSTRIAL",
  realestate: "REAL ESTATE",
  etf: "ETFs",
}

// Función para categorizar un símbolo
export function categorizeSymbol(symbol: string): string[] {
  const categories: string[] = []
  for (const [category, symbols] of Object.entries(USA_SECTOR_SYMBOLS)) {
    if (symbols.includes(symbol)) {
      categories.push(category)
    }
  }
  return categories.length > 0 ? categories : ["other"]
}
