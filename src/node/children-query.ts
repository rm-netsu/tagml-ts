import { NodeConstructor, TagmlNode } from './node'

export class NodeChildrenQueryInterface {
	allChildren: TagmlNode[]
	constructor(children: TagmlNode[]) {
		this.allChildren = children
	}

	child(predicate: ChildPredicate) {
		return this.allChildren.find(predicate) ?? null
	}
	childAs<T extends TagmlNode>(
		predicate: ChildPredicate,
		as: NodeConstructor<T>
	): T | null {
		return this.child(predicate)?.cast(as) ?? null
	}

	children(predicate: ChildPredicate) {
		return this.allChildren.filter(predicate)
	}
	childrenAs<T extends TagmlNode>(
		predicate: ChildPredicate,
		as: NodeConstructor<T>
	) {
		return this.children(predicate).map($ => $.cast(as))
	}

	descendant(predicate: ChildPredicate): TagmlNode | null {
		const result = this.child(predicate)
		if(result) return result

		for(const child of this.allChildren) {
			const result = child.query.descendant(predicate)
			if(result) return result
		}

		return null
	}
	descendantAs<T extends TagmlNode>(
		predicate: ChildPredicate,
		as: NodeConstructor<T>
	): T | null {
		return this.descendant(predicate)?.cast(as) ?? null
	}

	descendants(predicate: ChildPredicate): TagmlNode[] {
		const own = this.children(predicate)
		const nested = this.allChildren.flatMap(
			$ => $.query.descendants(predicate)
		)

		return [...own, ...nested]
	}
	descendantsAs<T extends TagmlNode>(
		predicate: ChildPredicate,
		as: NodeConstructor<T>
	) {
		return this.descendants(predicate).map($ => $.cast(as))
	}
}

export type ChildPredicate<T = TagmlNode> = (
	value: T,
	index: number,
	obj: T[]
) => boolean
