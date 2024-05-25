import { LineTree } from './linetree'
import { join, wrap } from './regexp'

const TOK_BEGIN = /(?<=^|\s)/

const TOK_BRACES_ANG = /<(?:[^>\\]|\\.)*?>/
const TOK_NODE_BEGIN = /[^\s@'-][^\s<]*/

const TOK_NODE = join(null, TOK_NODE_BEGIN, wrap(TOK_BRACES_ANG, '?'))
const TOK_NODE_INNER = join(null, wrap(TOK_NODE_BEGIN), wrap(TOK_BRACES_ANG, '?'))

const TOK_QUOTES_SINGLE = /'(?:[^'\\]|\\.)*?'/

const TOK_ATTR = /@\S+/

const TOK_COMMENT = /--.*$/

const TOK_ANY = join({ separator: '|' },
	wrap(join(null,
		TOK_BEGIN, wrap(join({ separator: '|' },
			TOK_ATTR, TOK_QUOTES_SINGLE, TOK_NODE
		))
	)),
	TOK_COMMENT
)

export const tokenizeLineTree = (input: LineTree): TokenizedLineTree => {
	const children = input.children.map(tokenizeLineTree)
	return { ...input, children, tokens: getLineTokens(input) }
}

export const getLineTokens = (input: LineTree) => {
	const tokens = input.line.match(new RegExp(TOK_ANY, 'g'))
	if(tokens === null)
		throw new Error(`Failed to tokenize line ${input.number}`)
	
	return [...tokens].map(recognize)
}

const recognize = (token: string): Token => {
	switch(token.at(0)) {
		case '@': return { type: 'attribute', name: token.slice(1) }
		case '\'': return { type: 'value', value: token.slice(1, -1).replaceAll('\\\'', '\'') }
		case '-': return { type: 'comment', value: token.slice(2).trim() }
		default: {
			let [_, name, meta] = TOK_NODE_INNER.exec(token) ?? []
			if(meta) meta = meta.slice(1, -1).replaceAll('\\>', '>')
			return { type: 'node', name, meta }
		}
	}
}

export type TokenizedLineTree = Omit<LineTree, 'children'> & {
	tokens: Token[]
	children: TokenizedLineTree[]
}

export type Token = NodeToken | AttributeToken | ValueToken | CommentToken

export type NodeToken = { type: 'node', name: string, meta?: string }
export type AttributeToken = { type: 'attribute', name: string }
export type ValueToken = { type: 'value', value: string }
export type CommentToken = { type: 'comment', value: string }
