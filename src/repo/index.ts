import { NAMESPACES } from '@/node/namespaces'
import { RootNode } from '@/node/root'
import { parseLineTree } from '@/parsing/linetree'
import { parseNodeTree } from '@/parsing/nodetree'

export class TagmlRepo {
	packageResolveFn: RepoConfig['packageResolveFn']
	requests: Map<string, Promise<RootNode>> = new Map()
	packages: Map<string, RootNode> = new Map()

	constructor(config: RepoConfig) {
		this.packageResolveFn = config.packageResolveFn
	}

	fetch(packageName: string) {
		if(this.requests.has(packageName))
			return this.requests.get(packageName)!

		const path = this.packageResolveFn(packageName)
		const req = window.fetch(path).then(resp => resp.text())
		.then(text => {
			const linetree = parseLineTree(text)
			if(linetree === null)
				throw new Error('Unable to parse line tree')

			const nodetree = parseNodeTree(linetree)
			if(nodetree === null)
				throw new Error('Unable to parse node tree')

			nodetree.bindRepo(this)
			
			const spec = NAMESPACES.specialize(nodetree)
			this.packages.set(packageName, spec)
			return spec
		})
		this.requests.set(packageName, req)

		return req
	}
}

export type RepoConfig = {
	packageResolveFn: (pkgName: string) => string
}
