import { TagmlNode } from '@/node/node'
import { GenericHeadNode } from '../head'
import { useEntityExportNode } from './export/entity'

export type ExportMap = Map<string, TagmlNode[]>

export class GenericExportNode extends TagmlNode {
	entities: ExportMap = new Map()

	constructor(node: TagmlNode) {
		super(node)
		useEntityExportNode(this)
	}
}

export const useGenericExportNode = (head: GenericHeadNode) => {
	head.query.childrenAs(
		$ => $.nodeName === 'export',
		GenericExportNode
	)
}
