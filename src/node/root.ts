import { TagmlNode } from './node'

export class RootNode extends TagmlNode {
    packageName: string
    namespace: string

    constructor(node: TagmlNode) {
        super(node)
		const packageName = this.attributes.get('package')
		if(!packageName)
			throw new Error('Root node must have valid `package` attribute')
        this.packageName = packageName
        this.namespace = this.attributes.get('namespace') ?? 'generic'
    }
}
