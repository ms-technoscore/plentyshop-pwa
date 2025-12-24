<template>
  <div class="footer-settings">
    <UiAccordionItem summary-class="p-4 font-bold border-b hover:bg-gray-50">
      <template #summary>Footer Styles</template>
      <div class="p-4 flex flex-col gap-4">
        <div>
          <UiFormLabel>Background Color</UiFormLabel>
          <SfInput v-model="footerContent.backgroundColor" type="color" />
        </div>
        <div>
          <UiFormLabel>Text Color</UiFormLabel>
          <SfInput v-model="footerContent.textColor" type="color" />
        </div>
      </div>
    </UiAccordionItem>

    <div v-for="(col, index) in footerContent.columns" :key="col.id">
      <UiAccordionItem summary-class="p-4 font-bold border-b hover:bg-gray-50">
        <template #summary>
          <div class="flex justify-between w-full items-center">
            <span>Column {{ index + 1 }} {{ col.title ? `- ${col.title}` : '' }}</span>
            <SfButton 
              class="text-red-500"
              variant="tertiary" 
              size="sm" 
              @click.stop="removeColumn(index)"
            >
              Delete
            </SfButton>
          </div>
        </template>
        
        <div class="p-4 flex flex-col gap-4 bg-gray-50">
          
          <div>
            <UiFormLabel>Title (Optional)</UiFormLabel>
            <SfInput v-model="col.title" placeholder="e.g. Service or About Us" />
          </div>

          <div class="border p-3 rounded bg-white">
            <UiFormLabel class="font-bold mb-2">Column Image</UiFormLabel>
            <UiImagePicker
              label="Upload Image (Logo/Payment Icons)"
              :image="col.image"
              placeholder="https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png"
              dimensions="Recommended: 200px width"
              @add="(payload) => col.image = payload.image"
              @delete="col.image = ''"
            />
            <div v-if="col.image" class="mt-2">
               <UiFormLabel>Width (e.g. 150px or 100%)</UiFormLabel>
               <SfInput v-model="col.imageWidth" placeholder="e.g. 200px" />
            </div>
          </div>

          <div class="border p-3 rounded bg-white">
            <UiFormLabel class="font-bold mb-2">Links List</UiFormLabel>
            <div v-for="(link, lIndex) in col.links" :key="lIndex" class="flex gap-2 mb-2 items-center">
              <SfInput v-model="link.text" placeholder="Link Text" class="flex-1" size="sm" />
              <SfInput v-model="link.url" placeholder="/url" class="flex-1" size="sm" />
              <SfButton variant="tertiary" size="sm" @click="removeLink(index, lIndex)">x</SfButton>
            </div>
            <SfButton size="sm" variant="secondary" @click="addLink(index)">+ Add Link</SfButton>
          </div>

          <div class="border p-3 rounded bg-white">
            <UiFormLabel class="font-bold mb-2">Social Icons</UiFormLabel>
            <div v-for="(social, sIndex) in col.socials" :key="sIndex" class="flex gap-2 mb-2 items-center">
              <select v-model="social.icon" class="border rounded px-2 py-1 text-sm h-9">
                <option value="facebook">Facebook</option>
                <option value="instagram">Instagram</option>
                <option value="twitter">X / Twitter</option>
                <option value="youtube">YouTube</option>
                <option value="linkedin">LinkedIn</option>
                <option value="pinterest">Pinterest</option>
              </select>
              <SfInput v-model="social.url" placeholder="https://..." class="flex-1" size="sm" />
              <SfButton variant="tertiary" size="sm" @click="removeSocial(index, sIndex)">x</SfButton>
            </div>
            <SfButton size="sm" variant="secondary" @click="addSocial(index)">+ Add Icon</SfButton>
          </div>

          <div class="border p-3 rounded bg-white">
             <UiFormLabel class="font-bold mb-2">Description / HTML</UiFormLabel>
             <SfTextarea v-model="col.content" placeholder="Enter text or HTML..." class="w-full h-24" />
          </div>

        </div>
      </UiAccordionItem>
    </div>

    <div class="p-4">
      <SfButton class="w-full" @click="addColumn"> + Add New Column </SfButton>
    </div>

    <UiAccordionItem summary-class="p-4 font-bold border-b hover:bg-gray-50">
      <template #summary>Bottom Footnote</template>
      <div class="p-4">
        <SfTextarea v-model="footerContent.footnote" placeholder="© 2025 Company Name..." class="w-full h-24" />
      </div>
    </UiAccordionItem>

  </div>
</template>

<script setup lang="ts">
import { SfInput, SfButton, SfTextarea } from '@storefront-ui/vue';
import type { FooterContent } from './types';

// Used to identify the exact block instance
const props = defineProps<{ uuid?: string }>();

// 1. Retrieve Context
const route = useRoute();
const { $i18n } = useNuxtApp();
const { blockUuid } = useSiteConfiguration();

// 2. Load Data Linked to Page
const { data } = useCategoryTemplate(
  route?.meta?.identifier as string,
  route?.meta?.type as string,
  $i18n.locale.value
);

const { findOrDeleteBlockByUuid } = useBlockManager();

// Helper to get the actual block from the CMS data
const getBlock = () => findOrDeleteBlockByUuid(data.value, props.uuid || blockUuid.value);

// --- 3. Initialize Local State ---
const footerContent = ref<FooterContent>({
  columns: [],
  backgroundColor: '#333333',
  textColor: '#ffffff',
  footnote: ''
});

// --- 4. Load Existing Data ---
const block = getBlock();
if (block && block.content) {
  const loaded = block.content as unknown as FooterContent;
  footerContent.value = {
    columns: loaded.columns || [],
    backgroundColor: loaded.backgroundColor || '#333333',
    textColor: loaded.textColor || '#ffffff',
    footnote: loaded.footnote || ''
  };
}

// --- 5. Watch for Changes & Save Back ---
watch(footerContent, (newVal) => {
  const currentBlock = getBlock();
  if (currentBlock) {
    // Save the local state back to the CMS block
    currentBlock.content = JSON.parse(JSON.stringify(newVal));
  }
  // FIXED: Removed console.error to satisfy linter
}, { deep: true });

// --- Actions ---

const generateId = () => {
  return typeof crypto !== 'undefined' && crypto.randomUUID 
    ? crypto.randomUUID() 
    : 'id-' + Math.random().toString(36).substr(2, 9);
};

const addColumn = () => {
  footerContent.value.columns.push({
    id: generateId(),
    title: 'New Column',
    links: [],
    socials: [],
    content: ''
  });
};

const removeColumn = (index: number) => {
  footerContent.value.columns.splice(index, 1);
};

const addLink = (colIndex: number) => {
  const col = footerContent.value.columns[colIndex];
  if (!col) return;
  if (!col.links) col.links = [];
  col.links.push({ text: '', url: '/' });
};

const removeLink = (colIndex: number, linkIndex: number) => {
  const col = footerContent.value.columns[colIndex];
  if (col && col.links) {
    col.links.splice(linkIndex, 1);
  }
};

const addSocial = (colIndex: number) => {
  const col = footerContent.value.columns[colIndex];
  if (!col) return;
  if (!col.socials) col.socials = [];
  col.socials.push({ icon: 'facebook', url: '' });
};

const removeSocial = (colIndex: number, socialIndex: number) => {
  const col = footerContent.value.columns[colIndex];
  if (col && col.socials) {
    col.socials.splice(socialIndex, 1);
  }
};
</script>