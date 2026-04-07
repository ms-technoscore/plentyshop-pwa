<template>
  <div>
    <button
      aria-label="WhatsApp Us"
      class="fixed bottom-[150px] md:bottom-24 right-4 md:right-6 z-[100] flex items-center justify-center gap-2 px-4 py-2.5 md:px-5 md:py-3 bg-white text-gray-800 rounded-full shadow-[0_4px_14px_rgba(0,0,0,0.15)] hover:scale-105 transition-transform duration-300 border border-gray-100"
      @click="openModal"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 text-[#25D366]" fill="currentColor" viewBox="0 0 448 512">
        <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3s19.9 53.7 22.7 57.4c2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
      </svg>
      <span class="font-bold text-sm">WhatsApp us</span>
    </button>

    <div v-if="isOpen" class="fixed inset-0 z-[110] flex items-center justify-center bg-black bg-opacity-60 px-4">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
        
        <button class="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors" @click="closeModal">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 class="text-xl font-bold mb-1 text-[#062633]">Frage zum Produkt?</h2>
        <p class="text-sm text-gray-600 mb-4">Senden Sie uns eine Nachricht. Wir helfen Ihnen gerne weiter!</p>

        <div class="bg-gray-50 border border-gray-200 rounded-md p-3 mb-4 text-sm text-gray-600">
          <p class="font-medium text-gray-800 mb-2">Hallo Komplett-Konzept Team! Ich habe eine Frage zu diesem Artikel.</p>
          <p class="line-clamp-2" :title="productTitle"><strong>Produkt:</strong> {{ productTitle }}</p>
          <p class="truncate text-blue-600 mt-1" :title="currentUrl">{{ currentUrl }}</p>
        </div>

        <label class="block text-sm font-bold text-gray-800 mb-2">Meine Frage:</label>
        <textarea
          v-model="userQuestion"
          rows="4"
          placeholder="Schreiben Sie hier Ihre Frage..."
          class="w-full border border-gray-300 rounded-md p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-[#25D366] resize-none"
        />

        <button
          class="w-full bg-[#25D366] text-white font-bold py-3 rounded-md hover:bg-[#1ebe57] transition-colors flex justify-center items-center gap-2"
          @click="sendMessage"
        >
          Auf WhatsApp senden
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const isOpen = ref(false);

// 🚨 UPDATE THIS: Put the client's actual WhatsApp number here (Include country code, no + or spaces)
const adminPhone = '4915112345678'; 

const currentUrl = ref('');
const productTitle = ref('');
const userQuestion = ref('');

const openModal = () => {
  isOpen.value = true;
  userQuestion.value = ''; // Reset input field when opening
  
  if (typeof window !== 'undefined') {
    currentUrl.value = window.location.href;
    // Grabs the page title so the admin knows the product name instantly
    productTitle.value = document.title; 
  }
};

const closeModal = () => {
  isOpen.value = false;
};

const sendMessage = () => {
  // Combine the read-only part and the user's question into one final string
  const finalMessage = `Hallo Komplett-Konzept Team! Ich habe eine Frage zu diesem Artikel.\n\nTitel: ${productTitle.value}\nProdukt-Link: ${currentUrl.value}\n\nMeine Frage: ${userQuestion.value}`;
  
  // Encode and send
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${adminPhone}&text=${encodeURIComponent(finalMessage)}`;
  window.open(whatsappUrl, '_blank');
  closeModal();
};
</script>