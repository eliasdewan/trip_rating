export function storeInDatabase(kvNamespace: KVNamespace, key: string, value: any) {
  kvNamespace.put(key, value);
}