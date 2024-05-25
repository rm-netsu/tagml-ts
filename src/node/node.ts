import { NodeToken } from '../parsing/tokenize'
import { NodeChildrenQueryInterface } from './children-query'

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
	/** @deprecated */
	children: TagmlNode[]

	query: NodeChildrenQueryInterface

	constructor(data: TagmlNodeConstructData) {

		this.nodeName = data.nodeName
		this.attributes = data.attributes ?? new Map()
		this.children = data.children ?? []

		if(data.rawNodeMetadata) this.rawNodeMetadata = data.rawNodeMetadata
		if(data.comments) this.comments = data.comments

		this.query = new NodeChildrenQueryInterface(this.children)
	}

	static fromToken(token: NodeToken) {
		const { name, meta } = token
		return new TagmlNode({ nodeName: name, rawNodeMetadata: meta })
	}

	cast<T extends TagmlNode>(as: NodeConstructor<T>) {
		return new as(this)
	}

	addComment(comment: string) {
		if(!this.comments) this.comments = []
		this.comments.push(comment)
		return this
	}

	requireAttribute(name: string, validateFn?: AttrValidateFn) {
		const value = this.attributes.get(name)
		if(value === undefined)
			throw new Error(`Missing required attribute '${name}'`)

		if(validateFn && !validateFn(value))
			throw new Error(`Invalid value of attribute '${name}'`)

		return value
	}
	requireString(name: string, validateFn?: AttrValidateFn<string>) {
		const value = this.requireAttribute(name)
		if(value === null || (validateFn && !validateFn(value)))
			throw new Error(`Invalid value of attribute '${name}'`)

		return value
	}

	hasAttributes(...attrNames: string[]) {
		return attrNames.every($ => this.attributes.has($))
	}
}

export type NodeConstructor<T extends TagmlNode> = new (node: TagmlNode) => T
type AttrValidateFn<T = string|null> = (value: T) => boolean
