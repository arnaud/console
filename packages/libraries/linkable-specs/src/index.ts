import { DocumentNode } from 'graphql';
import { FederatedLink } from './link';
import type { LinkableSpec } from './linkable-spec';

export * from './link-import';
export * from './link-url';
export * from './link';
export * from './linkable-spec';

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
