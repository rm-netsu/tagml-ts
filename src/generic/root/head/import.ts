import { TagmlNode } from '@/node/node'
import { useEntityImportNode, usePackageImportNode } from './import/index'
import { GenericHeadNode } from '../head'

export type ImportEntry = {
	type: string
	name: string
	alias: string | null
} | '*'
export type ImportMap = Map<string, ImportEntry[]>

export class GenericImportNode extends TagmlNode {
	imports: ImportMap = new Map()

	constructor(node: TagmlNode) {
		super(node)
		usePackageImportNode(this)
		useEntityImportNode(this)
	}
}

export const useGenericImportNode = (head: GenericHeadNode) => {
	head.query.childrenAs(
		$ => $.nodeName === 'import',
		GenericImportNode
	).forEach(im => {
		im.imports.forEach(($$v,$k) => {
			if(!head.imports.has($k))
				head.imports.set($k, [...$$v])
			else head.imports.get($k)!.push(...$$v)
		})
	})
}
