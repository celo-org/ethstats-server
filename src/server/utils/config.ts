export const trusted: string[] = []

export const banned: string[] = []

export const reserved: string[] = []

// general config
export const cfg = {
  port: process.env.PORT || 3000,
  compression: process.env.COMPRESSION || false,
  headersTimeout: 0.9 * 1000,
  maxHeadersCount: 0,
  timeout: 0.6 * 1000
}
