<script setup lang="ts">
import TheHeader from "./components/TheHeader.vue";
import Hero from "./components/Hero.vue";
import HowItWorks from "./components/HowItWorks.vue";
import CategoryColors from "./components/CategoryColors.vue";
import PrivacySection from "./components/PrivacySection.vue";
import InstallSection from "./components/InstallSection.vue";
import Instructions from "./components/Instructions.vue";
import TheFooter from "./components/TheFooter.vue";
</script>

<template>
  <div>
    <TheHeader />
    <main>
      <Hero />
      <HowItWorks />
      <CategoryColors />
      <PrivacySection />
      <InstallSection />
      <Instructions />
    </main>
    <TheFooter />
  </div>
</template>
