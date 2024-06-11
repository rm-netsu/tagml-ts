import { NAMESPACES, RootNode, TagmlNode } from '../node/index'
import { GenericHeadNode, useGenericHeadNode } from './root/head'

export class GenericRootNode extends RootNode {
	head: GenericHeadNode | null = null
	body: TagmlNode | null = null

	constructor(node: RootNode) {
		super(node)
		this.repo = node.repo
		
		useGenericHeadNode(this)

		this.body = this.query.child($ => $.nodeName === 'body')
	}
}

NAMESPACES.registerNamespace('generic', GenericRootNode)
