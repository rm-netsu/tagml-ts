import { TagmlNode } from '@/node/index'
import { GenericImportNode } from '../import'

export class EntityImportNode extends TagmlNode {
	packageName: string
	entityType: string
	entityName: string
	entityAlias: string | null

	constructor(node: TagmlNode) {
		super(node)
		this.packageName = this.requireString('from')
		this.entityType = this.nodeName
		const entityName = this.attributes.get('ref') ?? this.rawNodeMetadata
		if(!entityName) throw new Error('Entity import must contain ref')
		
		this.entityName = entityName
		this.entityAlias = this.attributes.get('as') ?? null
	}
}

export const useEntityImportNode = (importNode: GenericImportNode) => {
	const entityImport = importNode.query.childrenAs(
		$ =>
			($.attributes.has('ref') || $.rawNodeMetadata !== null)
			&& $.attributes.has('from'),
		EntityImportNode
	)
	entityImport.forEach($ => {
		const pkgName = $.packageName
		if(!importNode.imports.has(pkgName))
			importNode.imports.set(pkgName, [])

		importNode.imports.get(pkgName)!.push({
			type: $.entityType!,
			name: $.entityName,
			alias: $.entityAlias
		})
	})
}
