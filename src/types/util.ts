export type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType extends readonly (infer ElementType)[]
  ? ElementType
  : never;

// eslint-disable-next-line @typescript-eslint/ban-types
export type NoUndefined = string | number | boolean | symbol | object | Function;
