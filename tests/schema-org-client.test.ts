import { SchemaOrgClient } from '../src/schema-org-client';

describe('SchemaOrgClient', () => {
  let client: SchemaOrgClient;

  beforeAll(() => {
    client = new SchemaOrgClient();
  }, 60000); // Increase timeout for network operations

  test('should get schema type for Person', async () => {
    const result = await client.getSchemaType('Person');
    expect(result.name).toBe('Person');
    expect(result.id).toBe('schema:Person');
    expect(result.superTypes).toBeDefined();
  }, 30000);

  test('should search for article schemas', async () => {
    const results = await client.searchSchemas('article', 5);
    expect(results.length).toBeGreaterThan(0);
    expect(results.length).toBeLessThanOrEqual(5);
    
    const hasArticle = results.some(r => r.name.toLowerCase().includes('article'));
    expect(hasArticle).toBe(true);
  }, 30000);

  test('should get type hierarchy for NewsArticle', async () => {
    const hierarchy = await client.getTypeHierarchy('NewsArticle');
    expect(hierarchy.name).toBe('NewsArticle');
    expect(hierarchy.parents).toBeDefined();
    expect(hierarchy.parents.length).toBeGreaterThan(0);
  }, 30000);

  test('should get properties for Organization', async () => {
    const properties = await client.getTypeProperties('Organization', true);
    expect(properties.length).toBeGreaterThan(0);
    
    const hasName = properties.some(p => p.name === 'name');
    expect(hasName).toBe(true);
  }, 30000);

  test('should generate example for Recipe', async () => {
    const example = await client.generateExample('Recipe', {
      name: 'Test Recipe',
      cookTime: 'PT30M',
    });
    
    expect(example['@context']).toBe('https://schema.org');
    expect(example['@type']).toBe('Recipe');
    expect(example.name).toBe('Test Recipe');
    expect(example.cookTime).toBe('PT30M');
  }, 30000);

  test('should throw error for non-existent type', async () => {
    await expect(client.getSchemaType('NonExistentType')).rejects.toThrow();
  }, 30000);

  test('should throw error for invalid input types', async () => {
    await expect(client.getSchemaType('')).rejects.toThrow('Type name must be a non-empty string');
    await expect(client.searchSchemas('')).rejects.toThrow('Query must be a non-empty string');
    await expect(client.searchSchemas('   ')).rejects.toThrow('Query cannot be empty');
  }, 30000);
});
