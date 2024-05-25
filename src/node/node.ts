import { NodeToken } from '../parsing/tokenize'

export type TagmlNodeConstructData = {
	nodeName: string
	rawNodeMetadata?: string
	attributes?: Map<string, string | null>
	comments?: string[]
	children?: TagmlNode[]
}

export class TagmlNode {
	nodeName: string
	declare rawNodeMetadata?: string
	attributes: Map<string, string | null>
	declare comments?: string[]
	children: TagmlNode[]

	constructor(data: TagmlNodeConstructData) {
		this.nodeName = data.nodeName
		this.attributes = data.attributes ?? new Map()
		this.children = data.children ?? []

		if(data.rawNodeMetadata) this.rawNodeMetadata = data.rawNodeMetadata
		if(data.comments) this.comments = data.comments
	}

	static fromToken(token: NodeToken) {
		const { name, meta } = token
		return new TagmlNode({ nodeName: name, rawNodeMetadata: meta })
	}

	addComment(comment: string) {
		if(!this.comments) this.comments = []
		this.comments.push(comment)
		return this
	}

	findChild(predicate: ArrPredicate<TagmlNode>) {
		return this.children.find(predicate) ?? null
	}
	findDescendant(predicate: ArrPredicate<TagmlNode>): TagmlNode | null {
		const result = this.findChild(predicate)
		if(result) return result

		for(const child of this.children) {
			const result = child.findDescendant(predicate)
			if(result) return result
		}

		return null
	}

	findChildAs<T extends TagmlNode>(
		predicate: ArrPredicate<TagmlNode>,
		as: NodeConstructor<T>
	): T | null {
		const node = this.findChild(predicate)
		return node? new as(node) : null
	}
	findDescendantAs<T extends TagmlNode>(
		predicate: ArrPredicate<TagmlNode>,
		as: NodeConstructor<T>
	): T | null {
		const node = this.findDescendant(predicate)
		return node? new as(node) : null
	}
}

type ArrPredicate<T> = (value: T, index: number, obj: T[]) => boolean
type NodeConstructor<T extends TagmlNode> = new (node: TagmlNode) => T
