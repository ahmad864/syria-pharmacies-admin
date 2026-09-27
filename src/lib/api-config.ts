/** Central place for backend connection settings — mirrors the Flutter app's ApiConfig. */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";
