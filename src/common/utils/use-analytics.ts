export function logAnalytics(event: string, data: object) {
  console.log(`[Analytics] ${event}`, data);
  // these should be sent to analytics provider
}
