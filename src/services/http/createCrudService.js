import httpClient from './httpClient';
import { env } from '@/config/env';

/**
 * Builds a standard CRUD service over `httpClient` for a REST resource.
 *
 * OCP in practice: adding a new resource means calling this factory with a
 * new config, never touching the factory body. Every generated service
 * exposes the exact same method shapes (LSP), so composables/components that
 * consume a service never need to special-case which one they got.
 *
 * In DEV, when the real request fails (e.g. no backend running yet), calls
 * fall back to an in-memory mock dataset so the UI stays usable.
 *
 * @param {string} resource - REST path segment, e.g. 'tasks'.
 * @param {{ mockData?: object[], mockDelay?: number }} [options]
 */
export function createCrudService(resource, { mockData = [], mockDelay = 400 } = {}) {
  const endpoint = `/${resource}`;
  let mockStore = [...mockData];

  const withMockFallback = async (realCall, mockFallback) => {
    try {
      return await realCall();
    } catch (error) {
      if (env.isDev) {
        await new Promise((resolve) => setTimeout(resolve, mockDelay));
        return mockFallback();
      }
      throw error;
    }
  };

  return {
    async getAll(params = {}) {
      return withMockFallback(
        async () => (await httpClient.get(endpoint, { params })).data,
        () => mockStore
      );
    },

    async getById(id) {
      return withMockFallback(
        async () => (await httpClient.get(`${endpoint}/${id}`)).data,
        () => mockStore.find((item) => item.id === id)
      );
    },

    async create(data) {
      return withMockFallback(
        async () => (await httpClient.post(endpoint, data)).data,
        () => {
          const created = { ...data, id: Date.now() };
          mockStore = [...mockStore, created];
          return created;
        }
      );
    },

    async update(id, data) {
      return withMockFallback(
        async () => (await httpClient.put(`${endpoint}/${id}`, data)).data,
        () => {
          const updated = { ...data, id };
          mockStore = mockStore.map((item) => (item.id === id ? updated : item));
          return updated;
        }
      );
    },

    async patch(id, data) {
      return withMockFallback(
        async () => (await httpClient.patch(`${endpoint}/${id}`, data)).data,
        () => {
          mockStore = mockStore.map((item) => (item.id === id ? { ...item, ...data } : item));
          return mockStore.find((item) => item.id === id);
        }
      );
    },

    async remove(id) {
      return withMockFallback(
        async () => (await httpClient.delete(`${endpoint}/${id}`)).data,
        () => {
          mockStore = mockStore.filter((item) => item.id !== id);
          return true;
        }
      );
    },
  };
}
