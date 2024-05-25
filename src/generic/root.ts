import { NAMESPACES } from '../node/namespaces'
import { RootNode, TagmlNode } from '../node/node'
import { GenericHeadNode } from './root/head'

export class GenericRootNode extends RootNode {
	namespace: string
	head: GenericHeadNode | null = null
	body: TagmlNode | null = null

	constructor(node: RootNode) {
		super(node)
		this.namespace = this.attributes.get('namespace') ?? 'generic'

		this.head = this.findChildAs(
			$ => $.nodeName === 'head',
			GenericHeadNode
		)
		this.body = this.findChild($ => $.nodeName === 'body')
	}
}

NAMESPACES.registerNamespace('generic', GenericRootNode)
