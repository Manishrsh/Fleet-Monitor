import { z } from 'zod';
import { vehicles } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
};

export const api = {
  vehicles: {
    list: {
      method: 'GET' as const,
      path: '/api/vehicles' as const,
      responses: {
        200: z.array(z.custom<typeof vehicles.$inferSelect>()),
      },
    },
    updateLocation: {
      method: 'PUT' as const,
      path: '/api/vehicles/:imei/location' as const,
      input: z.object({
        lat: z.union([z.string(), z.number()]),
        lng: z.union([z.string(), z.number()]),
        speed: z.union([z.string(), z.number()]).optional(),
        battery: z.union([z.string(), z.number()]).optional(),
        altitude: z.union([z.string(), z.number()]).optional(),
        timestamp: z.string().optional(),
      }),
      responses: {
        200: z.custom<typeof vehicles.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type VehiclesListResponse = z.infer<typeof api.vehicles.list.responses[200]>;
export type VehicleResponse = z.infer<typeof api.vehicles.updateLocation.responses[200]>;
