import { RootNode } from './root'

type RootNodeConstructor = new (node: RootNode) => RootNode

export class TagmlNamespaceRegistry {
	constructors: Map<string, RootNodeConstructor> = new Map()

	registerNamespace(namespace: string, root: RootNodeConstructor) {
		this.constructors.set(namespace, root)
	}
	specialize(node: RootNode) {
		const namespace = [...this.constructors.keys()]
			.filter($ => node.namespace.startsWith($))
			.sort()
			.map($ => this.constructors.get($)!)
		return namespace.reduce((root, ns) => new ns(root), node)
	}
}

export const NAMESPACES = new TagmlNamespaceRegistry()
