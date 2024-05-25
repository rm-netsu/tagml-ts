import { TagmlNode } from './node'

export class RootNode extends TagmlNode {
    packageName: string
    namespace: string

    constructor(node: TagmlNode) {
        super(node)
		this.packageName = this.requireString('package')
        this.namespace = this.attributes.get('namespace') ?? 'generic'
    }
}
