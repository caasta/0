/**
 * cPanel / Passenger friendly entrypoint.
 * Set Application startup file to: app.js
 * (also works: server/index.js)
 */
import { startServer } from './server/index.js'

startServer()
