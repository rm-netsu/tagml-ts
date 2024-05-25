import { TagmlNode } from '@/node/node'
import { PackageImportNode } from './import/package'

export class GenericImportNode extends TagmlNode {
	packageName: string
	entityType: string | null = null
	entityName: string | null = null
	entityAlias: string | null = null

	constructor(node: TagmlNode) {
		super(node)
		const packageImport = this.findChildAs(
			$ => $.nodeName === 'package',
			PackageImportNode
		)
		if(packageImport) {
			this.packageName = packageImport.packageName
			return this
		}

		const entityImport = this.findChild(
			$ => !!$.attributes.get('ref') && !!$.attributes.get('from')
		)
		if(entityImport) {
			this.packageName = entityImport.attributes.get('from')!
			this.entityType = entityImport.nodeName
			this.entityName = entityImport.attributes.get('ref')!
			const alias = entityImport.attributes.get('as')
			if(alias) this.entityAlias = alias
			return this
		}

		throw new Error('Import must contain package or entity reference')
	}
}
