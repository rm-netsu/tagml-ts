import { TagmlRepo } from '@/repo/index'
import { TagmlNode } from './node'

export class RootNode extends TagmlNode {
    packageName: string
    namespace: string
    repo: TagmlRepo | null = null

    constructor(node: TagmlNode) {
        super(node)
		this.packageName = this.requireString('package')
        this.namespace = this.attributes.get('namespace') ?? 'generic'
    }

    bindRepo(repo: TagmlRepo) {
        this.repo = repo
    }
}
