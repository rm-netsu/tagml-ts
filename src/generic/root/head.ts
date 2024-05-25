import { TagmlNode } from '@/node/node'
import { GenericImportNode } from './head/import'

export type ImportMap = Map<string, null | {
	type: string
	name: string
	alias: string | null
}[]>

export class GenericHeadNode extends TagmlNode {
	entityImports: ImportMap = new Map()
	packageImports: string[] = []

	constructor(node: TagmlNode) {
		super(node)
		this.children
			.filter($ => $.nodeName === 'import')
			.map($ => new GenericImportNode($))
			.forEach(im => {
				if(im.entityName) {
					if(!this.entityImports.has(im.packageName))
						this.entityImports.set(im.packageName, [])

					this.entityImports.get(im.packageName)!.push({
						type: im.entityType!,
						name: im.entityName,
						alias: im.entityAlias
					})
				}
				else this.packageImports.push(im.packageName)
			})
	}
}
