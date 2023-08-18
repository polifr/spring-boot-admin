<!--
  - Copyright 2014-2018 the original author or authors.
  -
  - Licensed under the Apache License, Version 2.0 (the "License");
  - you may not use this file except in compliance with the License.
  - You may obtain a copy of the License at
  -
  -     http://www.apache.org/licenses/LICENSE-2.0
  -
  - Unless required by applicable law or agreed to in writing, software
  - distributed under the License is distributed on an "AS IS" BASIS,
  - WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  - See the License for the specific language governing permissions and
  - limitations under the License.
  -->

<template>
  <div class="-mx-4 -my-3">
    <template v-for="(bean, index) in beans" :key="bean.name">
      <div
        :class="{
          'm-1 border rounded shadow-sm': showDetails[bean.name] === true,
        }"
      >
        <div
          :key="bean.name"
          class="flex items-center gap-1"
          :class="{
            'bg-gray-50': index % 2 === 0 || showDetails[bean.name] === true,
            'px-3 py-2': showDetails[bean.name] === true,
            'px-4 py-3': showDetails[bean.name] !== true,
          }"
          @click="toggle(bean.name)"
        >
          <div class="flex-1 sm:break-all">
            <div
              :class="{ 'font-bold': showDetails[bean.name] === true }"
              :title="bean.name"
              v-text="bean.shortName"
            />
            <small
              class="sm:break-all"
              :title="bean.type"
              v-text="bean.shortType"
            />
          </div>
          <div v-text="bean.scope" />
          <div>
            <sba-button size="xs" @click="(e) => {e.preventDefault(); $emit('showDependencies', bean.name)}">
              <font-awesome-icon :icon="faSitemap" />
            </sba-button>
          </div>
        </div>
        <div
          v-if="showDetails[bean.name] === true"
          :key="`${bean.name}-detail`"
          class="text-sm"
        >
          <beans-list-details :bean="bean" />
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import BeansListDetails from '@/views/instances/beans/beans-list-details';
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {faSitemap} from "@fortawesome/free-solid-svg-icons";

export default {
  components: {FontAwesomeIcon, BeansListDetails },
  props: {
    beans: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['showDependencies'],
  data() {
    return {
      showDetails: {},
      faSitemap
    };
  },
  methods: {
    faSitemap() {
      return faSitemap
    },
    toggle(name) {
      if (this.showDetails[name]) {
        this.showDetails = {
          ...this.showDetails,
          [name]: null,
        };
      } else {
        this.showDetails = {
          ...this.showDetails,
          [name]: true,
        };
      }
    },
  },
};
</script>
