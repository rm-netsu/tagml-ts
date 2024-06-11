import { TagmlNode } from '@/node/index'
import { GenericExportNode } from '../export'

export class EntityExportNode extends TagmlNode {
	type: string
	name: string

	constructor(node: TagmlNode) {
		super(node)
		this.type = this.nodeName
		this.name = this.requireString('name')
	}
}

export const useEntityExportNode = (exportNode: GenericExportNode) => {
	const entityExport = exportNode.query.childrenAs(
		$ => $.attributes.has('name'),
		EntityExportNode
	)
	entityExport.forEach($ => {
		if(!exportNode.entities.has($.type))
			exportNode.entities.set($.type, [$])

		else exportNode.entities.get($.type)?.push($)
	})
}
