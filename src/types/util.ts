export type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType extends readonly (infer ElementType)[]
	? ElementType
	: never

export type NoUndefined = string | number | boolean | symbol | object | Function;