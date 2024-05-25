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
	const packageImport = importNode.query.childAs(
		$ => $.nodeName === 'package',
		PackageImportNode
	)
	if(packageImport) {
		importNode.packageName = packageImport.packageName
		return true
	}
	return false
}
