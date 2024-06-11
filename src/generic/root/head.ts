import { TagmlNode } from '@/node/node'
import { ImportMap, useGenericImportNode } from './head/import'
import { GenericRootNode } from '../root'
import { ExportMap, useGenericExportNode } from './head/export'

export class GenericHeadNode extends TagmlNode {
	imports: ImportMap = new Map()
	exports: ExportMap = new Map()

	constructor(node: TagmlNode) {
		super(node)
		useGenericImportNode(this)
		useGenericExportNode(this)
	}
}

export const useGenericHeadNode = (root: GenericRootNode) => {
	root.head = root.query.childAs(
		$ => $.nodeName === 'head',
		GenericHeadNode
	)
	return true
}
