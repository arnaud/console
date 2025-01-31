import { FederatedLink } from './link';

export type Versioned<T> = {
  [minVersion: string]: (resolveImportName: FederatedLink['resolveImportName']) => T;
};

export class LinkableSpec<T> {
  private readonly sortedVersionKeys: string[];

  constructor(
    public readonly identity: string,
    public readonly versions: Versioned<T>,
  ) {
    // sort the versions in descending order for quicker lookups
    this.sortedVersionKeys = Object.keys(versions).sort((a, b) => {
      const [aMajor, aMinor] = a.split('.').map(Number);
      const [bMajor, bMinor] = b.split('.').map(Number);
      return bMajor !== aMajor ? bMajor - aMajor : bMinor - aMinor;
    });
  }

  /**
   *
   * @param links List of links used in a schema. Can be extracted from SDL using: `FederatedLink.fromTypedefs(parse(sdl))`
   * @returns the minimum version that is supported by this LinkableSpec
   */
  private detectLinkVersion(link: FederatedLink): string | null {
    // for every link, find the highest supported version
    const impl =
      link.identity === this.identity &&
      this.sortedVersionKeys.find(minVersion => link.supports(minVersion));
    return impl || null;
  }

  private findLinkByIdentity(links: FederatedLink[]): FederatedLink | undefined {
    return links.find(link => link.identity === this.identity);
  }

  public detectImplementation(links: FederatedLink[]): T | undefined {
    const maybeLink = this.findLinkByIdentity(links);
    if (maybeLink) {
      const version = this.detectLinkVersion(maybeLink);
      if (version) {
        const activeVersion = this.versions[version];
        return activeVersion?.(maybeLink.resolveImportName.bind(maybeLink));
      }
      console.warn(
        `Cannot apply @link due to unsupported version found for "${this.identity}". ` +
          `Available versions: ${this.sortedVersionKeys.join(', ')} and any version these are compatible compatible with.`,
      );
    }
  }
}
