import { TagmlNode } from '@/node/node'
import { ImportMap, useGenericImportNode } from './head/import'
import { GenericRootNode } from '../root'

export class GenericHeadNode extends TagmlNode {
	imports: ImportMap = new Map()

	constructor(node: TagmlNode) {
		super(node)
		useGenericImportNode(this)
	}
}

export const useGenericHeadNode = (root: GenericRootNode) => {
	root.head = root.query.childAs(
		$ => $.nodeName === 'head',
		GenericHeadNode
	)
}
