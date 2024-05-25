export const parseLineTree = (input: string) => {
	return input.split('\n').reduce((state, line, lN) => {
		const indent = line.search(/(?<=^\t*)\S/)
		if(indent > 0) line = line.slice(indent)

		if(indent !== -1) {
			// set root line
			if(state.cursor.length === 0) state.cursor.push(
				state.linetree = {
					line,
					indent,
					number: lN+1,
					children: [],
				}
			)
			else {
				const parent = state.cursor.at(-1)
				if(indent > parent!.indent + 1)
					throw new Error(`Too large indent at line ${lN+1}`)
				
				for(let i = parent!.indent - indent + 1; i > 0; --i) {
					state.cursor.pop()
					if(state.cursor.at(-1) === undefined)
						throw new Error(`Too small indent at line ${lN+1}`)
				}
				
				const node = {
					line,
					indent,
					number: lN+1,
					children: [],
				}
				state.cursor.at(-1)!.children.push(node)
				state.cursor.push(node)
			}
		}
		else {
			// no root line -> noop
			if(state.cursor.length === 0) return state
			// insert
			else state.cursor.at(-1)!.children.push({
				line,
				indent,
				number: lN+1,
				children: [],
			})
		}

		return state
	}, {
		linetree: null,
		cursor: []
	} as LineTreeParsingState).linetree
}

type LineTreeParsingState = {
	linetree: LineTree | null
	cursor: LineTree[]
}

export type LineTree = {
	line: string
	number: number
	indent: number
	children: LineTree[]
}
