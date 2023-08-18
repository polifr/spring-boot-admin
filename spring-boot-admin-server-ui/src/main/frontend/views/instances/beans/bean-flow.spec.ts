import {describe, expect, it} from "vitest";
import {extractGraph} from "@/views/instances/beans/bean-flow.utils";
import {isEdge} from "@vue-flow/core";

const beans = [
    {
        "name": "aBean",
        "aliases": [],
        "scope": "singleton",
        "type": "de.codecentric.boot.admin.server.web.client.LegacyEndpointConverter",
        "resource": "class path resource [de/codecentric/boot/admin/server/config/AdminServerInstanceWebClientConfiguration$LegaycEndpointConvertersConfiguration.class]",
        "dependencies": ["bBean"]
    },
    {
        "name": "bBean",
        "aliases": [],
        "scope": "singleton",
        "type": "org.springframework.cloud.client.discovery.health.DiscoveryClientHealthIndicator",
        "resource": "class path resource [org/springframework/cloud/client/CommonsClientAutoConfiguration$DiscoveryLoadBalancerConfiguration.class]",
        "dependencies": ["aBean"]
    },
    {
        "name": "cBean",
        "aliases": [],
        "scope": "singleton",
        "type": "org.springframework.cloud.commons.util.InetUtils",
        "resource": "class path resource [org/springframework/cloud/commons/util/UtilAutoConfiguration.class]",
        "dependencies": ["bBean"]
    },
    {
        "name": "dBean",
        "aliases": [],
        "scope": "singleton",
        "type": "org.springframework.cloud.commons.util.InetUtils",
        "resource": "class path resource [org/springframework/cloud/commons/util/UtilAutoConfiguration.class]",
        "dependencies": []
    }
]


describe("BeanFlow", () => {

    it('nodes are derived', () => {
        let graph = extractGraph(beans);
        expect(graph).toContainEqual({
            "name": "aBean",
            "aliases": [],
            "scope": "singleton",
            "type": "de.codecentric.boot.admin.server.web.client.LegacyEndpointConverter",
            "resource": "class path resource [de/codecentric/boot/admin/server/config/AdminServerInstanceWebClientConfiguration$LegaycEndpointConvertersConfiguration.class]",
            "dependencies": ["bBean"]
        })

        expect(graph).toContainEqual({
            "name": "bBean",
            "aliases": [],
            "scope": "singleton",
            "type": "org.springframework.cloud.client.discovery.health.DiscoveryClientHealthIndicator",
            "resource": "class path resource [org/springframework/cloud/client/CommonsClientAutoConfiguration$DiscoveryLoadBalancerConfiguration.class]",
            "dependencies": ["aBean"]
        })

        expect(graph).toContainEqual({
            "name": "cBean",
            "aliases": [],
            "scope": "singleton",
            "type": "org.springframework.cloud.commons.util.InetUtils",
            "resource": "class path resource [org/springframework/cloud/commons/util/UtilAutoConfiguration.class]",
            "dependencies": ["bBean"]
        })

        expect(graph).toContainEqual({
            "name": "dBean",
            "aliases": [],
            "scope": "singleton",
            "type": "org.springframework.cloud.commons.util.InetUtils",
            "resource": "class path resource [org/springframework/cloud/commons/util/UtilAutoConfiguration.class]",
            "dependencies": []
        })
    });

    it('edges are derived', () => {
        let graph = extractGraph(beans);
        expect(graph).toContainEqual({
            id: 'aBean-->bBean',
            source: 'aBean',
            target: 'bBean'
        })

        expect(graph).toContainEqual({
            id: 'bBean-->aBean',
            source: 'bBean',
            target: 'aBean'
        })

        expect(graph).toContainEqual({
            id: 'cBean-->bBean',
            source: 'cBean',
            target: 'bBean'
        })
    });

    it('allows to filter by id', () => {
        let graph = extractGraph(beans, (bean) => bean.name === 'bBean');

        expect(graph).toContainEqual({
            "name": "bBean",
            "aliases": [],
            "scope": "singleton",
            "type": "org.springframework.cloud.client.discovery.health.DiscoveryClientHealthIndicator",
            "resource": "class path resource [org/springframework/cloud/client/CommonsClientAutoConfiguration$DiscoveryLoadBalancerConfiguration.class]",
            "dependencies": ["aBean"]
        })

        expect(graph).toContainEqual({
            "name": "aBean",
            "aliases": [],
            "scope": "singleton",
            "type": "de.codecentric.boot.admin.server.web.client.LegacyEndpointConverter",
            "resource": "class path resource [de/codecentric/boot/admin/server/config/AdminServerInstanceWebClientConfiguration$LegaycEndpointConvertersConfiguration.class]",
            "dependencies": ["bBean"]
        })

        expect(graph).toContainEqual({
            "name": "cBean",
            "aliases": [],
            "scope": "singleton",
            "type": "org.springframework.cloud.commons.util.InetUtils",
            "resource": "class path resource [org/springframework/cloud/commons/util/UtilAutoConfiguration.class]",
            "dependencies": ["bBean"]
        })

        expect(graph.filter(n => !isEdge(n))).toHaveLength(3)
        expect(graph.filter(isEdge)).toHaveLength(3)
    })
})