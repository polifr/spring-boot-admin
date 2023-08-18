<template>
  <div class="relative w-100 h-96">
    <VueFlow v-model="localElements">
      <template #edge-sba="props">
        <BezierEdge v-bind="props"/>
      </template>
    </VueFlow>
  </div>
</template>

<style>
@import '@vue-flow/core/dist/style.css';
@import '@vue-flow/core/dist/theme-default.css';

.vue-flow__node-default {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px;
}
</style>

<script setup lang="ts">
import {BezierEdge, Edge, Element, isEdge, isNode, Node, Position, useVueFlow, VueFlow} from '@vue-flow/core'
import {computed, watch, watchEffect} from "vue";
import dagre from "dagre"
import {Bean} from "@/views/instances/beans/bean-flow.utils";

const {onPaneReady, onUpdateNodeInternals, fitView} = useVueFlow();

const dagreGraph = new dagre.graphlib.Graph()
dagreGraph.setDefaultEdgeLabel(() => ({}))

const props = defineProps({
  elements: {
    required: true,
    type: Array<Bean>
  }
});

const localElements = computed<any>(() => {
  let elements = props.elements?.map(e => {
    if (isEdge(e)) {
      return {
        ...e,
        type: "sba",
        animated: true,
      } as Edge
    } else {
      return {
        ...e,
        id: e.name,
        label: e.name.split(".").pop(),
        type: "sba",
        position: {x: 0, y: 0}
      } as Node
    }
  });
  setTimeout(() => fitView(), 10);
  return props.elements?.length > 0 ? doLayout(elements, "LR") : []
})

function doLayout(elements: any[], direction: string) {
  dagreGraph.setGraph({rankdir: direction})

  elements.forEach((el) => {
    if (isNode(el)) {
      dagreGraph.setNode(el.id, {width: 400, height: 40})
    } else {
      dagreGraph.setEdge(el.source, el.target)
    }
  })

  dagre.layout(dagreGraph)

  const isHorizontal = direction === 'LR'
  elements.filter(isNode).forEach((el) => {
    const nodeWithPosition = dagreGraph.node(el.id)
    el.targetPosition = isHorizontal ? Position.Left : Position.Top
    el.sourcePosition = isHorizontal ? Position.Right : Position.Bottom
    el.position = {x: nodeWithPosition.x, y: nodeWithPosition.y}
    el.width = nodeWithPosition.width
    el.height = nodeWithPosition.height
  })

  return elements;
}
</script>
