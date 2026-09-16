import type { SiteContent } from '../types'
import seedJson from './seed-content.json'

export const DEFAULT_ADMIN_PASSWORD = 'admin123'

export const seedContent = seedJson as SiteContent
