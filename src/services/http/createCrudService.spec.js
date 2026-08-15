import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('./httpClient', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('@/config/env', () => ({ env: { isDev: false } }));

const httpClient = (await import('./httpClient')).default;
const { createCrudService } = await import('./createCrudService');

describe('createCrudService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('delegates getAll to httpClient.get on the resource endpoint', async () => {
    httpClient.get.mockResolvedValue({ data: [{ id: 1 }] });
    const service = createCrudService('widgets');

    const result = await service.getAll({ page: 1 });

    expect(httpClient.get).toHaveBeenCalledWith('/widgets', { params: { page: 1 } });
    expect(result).toEqual([{ id: 1 }]);
  });

  it('delegates create to httpClient.post', async () => {
    httpClient.post.mockResolvedValue({ data: { id: 1, name: 'A' } });
    const service = createCrudService('widgets');

    const result = await service.create({ name: 'A' });

    expect(httpClient.post).toHaveBeenCalledWith('/widgets', { name: 'A' });
    expect(result).toEqual({ id: 1, name: 'A' });
  });

  it('propagates the error when the request fails and env.isDev is false', async () => {
    httpClient.get.mockRejectedValue(new Error('network down'));
    const service = createCrudService('widgets', { mockData: [{ id: 1 }] });

    await expect(service.getAll()).rejects.toThrow('network down');
  });
});
