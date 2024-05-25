import { NAMESPACES, RootNode, TagmlNode } from '../node/index'
import { GenericHeadNode, useGenericHeadNode } from './root/head'

export class GenericRootNode extends RootNode {
	namespace: string
	head: GenericHeadNode | null = null
	body: TagmlNode | null = null

	constructor(node: RootNode) {
		super(node)
		this.namespace = this.attributes.get('namespace') ?? 'generic'

		useGenericHeadNode(this)
		this.body = this.query.child($ => $.nodeName === 'body')
	}
}

NAMESPACES.registerNamespace('generic', GenericRootNode)
