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
			.at(-1)
		if(!namespace)
			throw Error(
				`Root constructor for namespace '${node.namespace}' not found`
			)

		return new (this.constructors.get(namespace))!(node)
	}
}

export const NAMESPACES = new TagmlNamespaceRegistry()
