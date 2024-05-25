import { TagmlNode } from '@/node/node'
import { useEntityImportNode, usePackageImportNode } from './import/index'
import { GenericHeadNode } from '../head'

export class GenericImportNode extends TagmlNode {
	packageName!: string
	entityType: string | null = null
	entityName: string | null = null
	entityAlias: string | null = null

	constructor(node: TagmlNode) {
		super(node)
		usePackageImportNode(this) || useEntityImportNode(this)

		if(!this.packageName)
			throw new Error('Import must contain package or entity reference')
	}
}

export const useGenericImportNode = (head: GenericHeadNode) => {
	head.query.childrenAs(
		$ => $.nodeName === 'import',
		GenericImportNode
	).forEach(im => {
		if(!head.imports.has(im.packageName))
			head.imports.set(im.packageName, [])

		if(im.entityName) {
			head.imports.get(im.packageName)!.push({
				type: im.entityType!,
				name: im.entityName,
				alias: im.entityAlias
			})
		}
		else head.imports.get(im.packageName)!.push('*')
	})
}
