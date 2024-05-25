export const join = (options: RegExpJoinOptions | null, ...regexp: RegExp[]) => {
	const { separator = '', flags } = options ?? {}
	return new RegExp(regexp.map($ => $.source).join(separator), flags)
}

export type RegExpJoinOptions = {
	separator?: string
	flags?: string
}

export const wrap = (regexp: RegExp, options?: RegExpWrapOptions) => {
	switch(options) {
		case '?': return new RegExp(`(${regexp.source})?`)
		default: return new RegExp(`(${regexp.source})`)
	}
}

export type RegExpWrapOptions = '?'
