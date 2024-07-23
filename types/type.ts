/**
 * 实现部分类型变为可选
 * type ArticleTodo = Optional<Article, "author" | "date" | "readCount">;
 * 结果： { title: string; content: string; author?: string; date?: Date; readCount?: number; }
 */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * 获取类型中的所有可选字段
 * type Article = {
 *   title: string;
 *   content: string;
 *   author?: string;
 *   date?: Date;
 *   readCount?: number;
 * };
 * type ArticleTodo = GetOptional<Article>;
 * 结果： { author?: string; date?: Date; readCount?: number; }
 */
export type GetOptional<T> = {
  [P in keyof T as T[P] extends Required<T>[P] ? never : P]: T[P];
};

/**
 * 实现不可变类型的深度遍历，给深层元素设置只读属性
 * type Article = {
 *   title: string;
 *   name: {
 *     first: string;
 *     lasr: string;
 *   };
 * };
 * type ArticleTodo = DeepReadonly<Article>;
 * };
 */
export type DeepReadonly<T extends Record<string | symbol, any>> = {
  readonly [K in keyof T]: DeepReadonly<T[K]>;
};

/**
 * 将联合类型转为交叉类型
 * type Article = { title: string } | { name: string } | { date: Date };
 * type ArticleTodo = UnionToIntersection<Article>;
 * 结果：{ title:string } & { name:string } & { date: Date }
 */
export type UnionToIntersection<T> = (
  T extends any ? (x: T) => any : never
) extends (x: infer R) => any
  ? R
  : never;

/**
 * 元组生成联合类型
 * const colors = ["red", "green", "orange", "blue"] as const;
 * type Colors = (typeof colors)[number];
 * const setColors = (value: Colors) => {
 *   console.log("value", value);
 * };
 */
