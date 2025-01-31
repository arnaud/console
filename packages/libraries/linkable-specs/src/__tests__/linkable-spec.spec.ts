import { parse } from 'graphql';
import { FederatedLink } from '../link';
import { LinkableSpec } from '../linkable-spec';

describe('LinkableSpec', () => {
  test('getSupportingVersion returned the most compatible version.', () => {
    const spec = new LinkableSpec('https://specs.graphql-hive.com/example', {
      'v2.0': _resolveImportName => 'Version 2.0 used.',
      'v1.0': _resolveImportName => 'Version 1.0 used.',
    });
    const sdl = `
      extend schema
        @link(url: "https://specs.graphql-hive.com/example/v1.1")
    `;

    const links = FederatedLink.fromTypedefs(parse(sdl));
    const specImpl = spec.detectImplementation(links);
    expect(specImpl).toBe('Version 1.0 used.');
  });
});
