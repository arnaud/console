import { DocumentNode } from 'graphql';
import { FederatedLink } from './link.js';
import type { LinkableSpec } from './linkable-spec.js';

export * from './link-import.js';
export * from './link-url.js';
export * from './link.js';
export * from './linkable-spec.js';

export function detectLinkedImplementations<T>(
  typeDefs: DocumentNode,
  supportedSpecs: LinkableSpec<T>[],
): T[] {
  const links = FederatedLink.fromTypedefs(typeDefs);
  return supportedSpecs
    .map(spec => {
      const specImpl = spec.detectImplementation(links);
      return specImpl;
    })
    .filter(v => v !== undefined);
}
