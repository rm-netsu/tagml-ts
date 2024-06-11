import { TagmlNode } from '@/node/index'
import { GenericImportNode } from '../import'

export class PackageImportNode extends TagmlNode {
	packageName: string

	constructor(node: TagmlNode) {
		super(node)
		this.packageName = this.requireString('name')
	}
}

export const usePackageImportNode = (importNode: GenericImportNode) => {
	const packageImport = importNode.query.childrenAs(
		$ => $.nodeName === 'package',
		PackageImportNode
	)
	packageImport.forEach($ => {
		const pkgName = $.packageName
		if(!importNode.imports.has(pkgName))
			importNode.imports.set(pkgName, [])

		importNode.imports.get(pkgName)!.push('*')
	})
}
