export class URLSearchParams {
  private params: Map<string, string[]>;

  constructor(
    init?: string | Record<string, string | string[]> | [string, string][],
  ) {
    this.params = new Map();

    if (typeof init === 'string') {
      this.parseQueryString(init);
    } else if (Array.isArray(init)) {
      init.forEach(([key, value]) => this.append(key, value));
    } else if (init && typeof init === 'object') {
      Object.entries(init).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v) => this.append(key, v));
        } else {
          this.append(key, value);
        }
      });
    }
  }

  private parseQueryString(queryString: string): void {
    const pairs = queryString.startsWith('?')
      ? queryString.slice(1)
      : queryString;
    pairs.split('&').forEach((pair) => {
      const [key, value = ''] = pair.split('=').map(decodeURIComponent);
      this.append(key!, value);
    });
  }

  append(key: string, value: string): void {
    if (!this.params.has(key)) {
      this.params.set(key, []);
    }
    this.params.get(key)!.push(value);
  }

  set(key: string, value: string): void {
    this.params.set(key, [value]);
  }

  get(key: string): string | null {
    const values = this.params.get(key);
    return values ? values[0]! : null;
  }

  getAll(key: string): string[] {
    return this.params.get(key) || [];
  }

  has(key: string): boolean {
    return this.params.has(key);
  }

  delete(key: string): void {
    this.params.delete(key);
  }

  toString(): string {
    const query: string[] = [];
    this.params.forEach((values, key) => {
      values.forEach((value) => {
        query.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
      });
    });
    return query.join('&');
  }

  forEach(callback: (value: string, key: string) => void): void {
    this.params.forEach((values, key) => {
      values.forEach((value) => callback(value, key));
    });
  }

  keys(): IterableIterator<string> {
    return this.params.keys();
  }

  values(): IterableIterator<string> {
    const allValues: string[] = [];
    this.params.forEach((values) => allValues.push(...values));
    return allValues[Symbol.iterator]();
  }

  entries(): IterableIterator<[string, string]> {
    const allEntries: [string, string][] = [];
    this.params.forEach((values, key) => {
      values.forEach((value) => allEntries.push([key, value]));
    });
    return allEntries[Symbol.iterator]();
  }

  [Symbol.iterator](): IterableIterator<[string, string]> {
    return this.entries();
  }
}
