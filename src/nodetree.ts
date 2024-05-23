import { LineTree } from './linetree'
import { TagmlNode } from './node'
import { NodeToken, Token, TokenizedLineTree, tokenizeLineTree } from './tokenize'

export const parseNodeTree = (linetree: LineTree) => {
	if(linetree === null) return null

	return parseRoot(tokenizeLineTree(linetree))
}

const appendToken = (node: TagmlNode, token: Token) => {
	switch(token.type) {
		case 'attribute': {
			if(!node.attributes.has(token.name))
				node.attributes.set(token.name, null)
			return node
		}
		case 'value': {
			const attr = [...node.attributes.keys()].pop()
			if(!attr) throw new Error('No attribute to assign value to')
			
			if(node.attributes.get(attr) === null)
				node.attributes.set(attr, token.value)
			else node.attributes.set(attr,
				`${node.attributes.get(attr)}\n${token.value}`
			)
			return node
		}
		case 'comment': return node.addComment(token.value)
		case 'node': {
			const newNode = TagmlNode.fromToken(token)
			node.children.push(newNode)

			return newNode
		}
	}
}

const parseRoot = (subtree: TokenizedLineTree) => {
	if(subtree.tokens.at(0)?.type !== 'node')
		throw new Error('Root node not found')

	const root = TagmlNode.fromToken(subtree.tokens.at(0) as NodeToken)

	const restTokens = subtree.tokens.slice(1)
	const cursor = restTokens.reduce(
		(node, token) => appendToken(node, token), root
	)

	subtree.children.forEach(block => parseBlock(block, cursor))

	return root
}

const parseBlock = (block: TokenizedLineTree, root: TagmlNode) => {
	const cursor = block.tokens.reduce(
		(node, token) => appendToken(node, token), root
	)
	block.children.forEach(block => parseBlock(block, cursor))
}
