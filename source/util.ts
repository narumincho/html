export const mapMapValue = <Key, Input, Output>(
  input: ReadonlyMap<Key, Input>,
  func: (value: Input, key: Key) => Output | undefined
): ReadonlyMap<Key, Output> => {
  const result: Map<Key, Output> = new Map();
  for (const [key, value] of input) {
    const newValue = func(value, key);
    if (newValue !== undefined) {
      result.set(key, newValue);
    }
  }
  return result;
};
