import { TagmlNode } from '@/node/node'

export class PackageImportNode extends TagmlNode {
	packageName: string

	constructor(node: TagmlNode) {
		super(node)
		const packageName = this.attributes.get('name')
		if(!packageName)
			throw new Error('Package import must have valid `name` attribute')
		
		this.packageName = packageName
	}
}
