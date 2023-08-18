export type Bean = {
    name: string,
    dependencies: string[],
    [key: string]: any
}

export function extractGraph(beans: Bean[], filterFn: (bean: Bean) => boolean = (_) => true) {
    const nodes: Bean[] = beans;

    const filteredNodes = nodes.filter(filterFn);
    const dependentNodes = filteredNodes.flatMap(node => {
        return [
            ...(nodes.filter((n) => n.dependencies.includes(node.name))),
            ...node.dependencies.map(dep => nodes.find(n => n.name === dep)).filter(n => n)
        ]
    })

    const filteredNodeSet = [...new Set([...filteredNodes, ...dependentNodes])];
    const containedNodeIds = filteredNodeSet.map(n => n.name);
    const edges = filteredNodeSet.flatMap(bean => {
        return bean.dependencies
            .filter(dep => containedNodeIds.includes(dep) && containedNodeIds.includes(bean.name))
            .map(dep => ({
                id: `${bean.name}-->${dep}`,
                source: bean.name,
                target: dep
            }))
    });
    
    return [...edges, ...filteredNodeSet];
}