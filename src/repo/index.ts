import { NAMESPACES } from "@/node/namespaces"
import { parseLineTree } from "@/parsing/linetree"
import { parseNodeTree } from "@/parsing/nodetree"

export class TagmlRepo {
	packageResolveFn: RepoConfig['packageResolveFn']

	constructor(config: RepoConfig) {
		this.packageResolveFn = config.packageResolveFn
	}

	fetch(packageName: string) {
		const path = this.packageResolveFn(packageName)
		
		return window.fetch(path).then(resp => resp.text())
		.then(text => {
			const linetree = parseLineTree(text)
			if(linetree === null)
				throw new Error('Unable to parse line tree')

			const nodetree = parseNodeTree(linetree)
			if(nodetree === null)
				throw new Error('Unable to parse node tree')
			
			return NAMESPACES.specialize(nodetree)
		})
	}
}

export type RepoConfig = {
	packageResolveFn: (pkgName: string) => string
}
