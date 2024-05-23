import { NodeToken } from './tokenize'

export type TagmlNodeConstructData = {
	name: string
	meta?: string
	attributes?: Map<string, string | null>
	comments?: string[]
	children?: TagmlNode[]
}

export class TagmlNode {
	name: string
	declare meta?: string
	attributes: Map<string, string | null>
	declare comments?: string[]
	children: TagmlNode[]

	constructor(data: TagmlNodeConstructData) {
		this.name = data.name
		this.attributes = data.attributes ?? new Map()
		this.children = data.children ?? []

		if(data.meta) this.meta = data.meta
		if(data.comments) this.comments = data.comments
	}

	static fromToken(token: NodeToken) {
		const { name, meta } = token
		return new TagmlNode({ name, meta })
	}

	addComment(comment: string) {
		if(!this.comments) this.comments = []
		this.comments.push(comment)
		return this
	}
}
