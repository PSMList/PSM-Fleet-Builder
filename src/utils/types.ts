export type Obj = { [key: string]: any };

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

export type ExtractUnionTypes<
  V,
  // avoid "Type instantiation is excessively deep and possibly infinite." error by limit depth levels
  D extends number = 30,
  A extends number[] = [],
> = A['length'] extends D
  ? never
  : V extends infer W | infer Rest
    ? W | ExtractUnionTypes<Rest, D, [0, ...A]>
    : V extends infer W
      ? W
      : never;

export type UnionToIntersection<U> = (
  U extends any ? (k: U) => void : never
) extends (k: infer I) => void
  ? I extends object
    ? I
    : never
  : never;
