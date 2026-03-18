<template>
  <div
    v-if="parent || (categoryTreeItem && categoryTreeGetters.getItems(categoryTreeItem)?.length)"
    class="category-tree w-full"
  >
    <div
      class="py-2 px-4 mb-4 bg-primary-50/50 typography-headline-6 font-bold text-neutral-900 uppercase tracking-widest rounded-none select-none"
      data-testid="category-tree"
    >
      {{ t('common.labels.category') }}
    </div>
    <template v-if="parent">
      <CategoryTreeItem
        :name="categoryTreeGetters.getName(parent)"
        :href="localePath(buildCategoryMenuLink(parent, categoryTree))"
        :count="categoryTreeGetters.getCount(parent)"
        class="w-full block"
      >
        <SfIconArrowBack size="sm" class="text-neutral-500 mr-2" />
      </CategoryTreeItem>
    </template>
    
    <ul v-if="categoryTreeItem" class="mb-4 md:mt-2 w-full block" data-testid="categories">
      
      <template v-for="(categoryItem, index) in categoryTreeGetters.getItems(categoryTreeItem)" :key="index">
        
        <CategoryTreeItem
          :name="categoryTreeGetters.getName(categoryItem)"
          :href="localePath(buildCategoryMenuLink(categoryItem, categoryTree))"
          :count="categoryTreeGetters.getCount(categoryItem)"
          class="w-full block"
        />
        
        <ul 
          v-if="categoryTreeGetters.getItems(categoryItem)?.length" 
          class="w-full pl-4 border-l-2 border-neutral-200 ml-4 mb-3 block clear-both"
        >
          <CategoryTreeItem
            v-for="(childItem, childIndex) in categoryTreeGetters.getItems(categoryItem)"
            :key="childIndex"
            :name="categoryTreeGetters.getName(childItem)"
            :href="localePath(buildCategoryMenuLink(childItem, categoryTree))"
            :count="categoryTreeGetters.getCount(childItem)"
            class="!text-sm opacity-80 w-full block" 
          />
        </ul>
        
      </template>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { categoryGetters, categoryTreeGetters } from '@plentymarkets/shop-api';
import { SfIconArrowBack } from '@storefront-ui/vue';
import type { CategoryTreeProps } from '~/components/CategoryTree/types';

const props = defineProps<CategoryTreeProps>();

const { data: categoryTree } = useCategoryTree();
const { buildCategoryMenuLink } = useLocalization();

const localePath = useLocalePath();
const categoryTreeItem = computed(() =>
  categoryTreeGetters.findCategoryById(categoryTree.value, categoryGetters.getId(props.category)),
);
const parent = computed(() =>
  categoryTreeGetters.findCategoryById(categoryTree.value, categoryGetters.getParentId(props.category)),
);
</script>
