<script setup lang="ts">
import HeartsteelIcon from "@/components/HeartsteelIcon.vue";
import { computed, provide, ref } from "vue";
import HealthBar from "@/components/HealthBar.vue";
import MainController from "@/game/main-controller";
import PlayButton from "@/components/PlayButton.vue";
import AttackButton from "@/components/AttackButton.vue";
import HeartsteelAudioResources from "@/components/HeartsteelAudioResources.vue";
import ChargingProgressBar from "@/components/ChargingProgressBar.vue";
import ItemSelector from "@/components/ItemSelector.vue";
import HeartsteelQuest from "@/components/HeartsteelQuest.vue";
import { TANK_ITEMS, DD_ITEM_URL } from "@/game/items/tank-items";

const ctrl = new MainController();
const isPlaying = ref(false);
const attackButton = ref<typeof AttackButton>();

const maxHP = computed(() => {
  if (isPlaying.value) {
    return ctrl.maxHP.value;
  } else {
    return ctrl.baseHP.value;
  }
});

const showItemSelector = ref(false);

const play = () => {
  isPlaying.value = true;
  ctrl.start();
};

provide("main-controller", ctrl);

document.addEventListener("keypress", (event) => {
  if (isPlaying.value && event.code === "Space") {
    attackButton.value?.onClick();
  }
});
</script>

<template>
  <heartsteel-audio-resources />

  <main>
    <div class="center-layout">
      <!-- Icon -->
      <heartsteel-icon
        :is-bought="isPlaying"
        :progress="0"
        :stack-count="ctrl.heartsteel.itemBonusHP.value"
      />
      <!-- Introduce -->
      <span class="passive-text">
        <span class="passive-title">龐然巨噬：</span>
        隨時間對鄰近的 1 名敵方英雄進行 1 次強力普攻。此充能普攻會造成額外物理傷害，並提供永久最大生命。<del>每個目標的冷卻時間 30 秒。</del>（這裡沒有冷卻 :P）
      </span>
      <!-- Health bar -->
      <span class="user-health-bar-text">你的生命值：</span>
      <health-bar class="user-health-bar" :current="maxHP" :max="maxHP" />
      <!-- Selected item icons -->
      <div v-if="isPlaying" class="equipped-items">
        <div
          v-for="id in ctrl.selectedItemIds.value"
          :key="id"
          class="equipped-item"
          :title="TANK_ITEMS.find(i => i.id === id)?.name"
        >
          <img
            :src="DD_ITEM_URL(TANK_ITEMS.find(i => i.id === id)!.icon)"
            :alt="TANK_ITEMS.find(i => i.id === id)?.name"
            class="equipped-item-img"
          />
        </div>
      </div>
      <!-- Item Selector -->
      <div v-if="!isPlaying" class="item-selector-section">
        <button class="toggle-selector-btn" @click="showItemSelector = !showItemSelector">
          {{ showItemSelector ? '▲ 收起裝備' : '▼ 選擇裝備（最多 6 件）' }}
        </button>
        <item-selector
          v-if="showItemSelector"
          v-model:selected-ids="ctrl.selectedItemIds.value"
          class="app-item-selector"
        />
      </div>
      <!-- Buttons -->
      <play-button v-show="!isPlaying" class="app-play-button" @click="play" />
      <attack-button
        v-show="isPlaying"
        ref="attackButton"
        class="app-attack-button"
        @click="ctrl.doAttack()"
      />
      <charging-progress-bar
        v-if="isPlaying"
        class="app-progress-bar"
        :current="ctrl.heartsteel.currentChargeStack.value"
        :max="4"
      />
      <!-- 心鋼之力 quest -->
      <heartsteel-quest
        v-if="isPlaying"
        class="app-quest"
        :bonus-h-p="ctrl.heartsteel.itemBonusHP.value"
        :threshold="ctrl.heartsteel.TRIPLE_THRESHOLD"
        :is-unlocked="ctrl.heartsteel.isTripleUnlocked.value"
      />
    </div>

    <div class="background">
      <video class="background-video" autoplay muted loop>
        <source src="./assets/media/meme-background.mp4" type="video/mp4" />
        <source src="./assets/media/meme-background.webm" type="video/webm" />
      </video>
      <div class="background-layer" />
    </div>
  </main>
</template>

<style lang="less" scoped>
main {
  height: 100vh;
  color: #fafafa;
}

.center-layout {
  width: 100%;
  height: 100%;
  z-index: 0;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.passive-text {
  margin-top: 24px;
  width: calc(100% - 32px);
  max-width: 500px;
  font-size: 14px;
}
.passive-title {
  font-weight: bold;
  color: var(--circle-button-icon-fill);
}

.user-health-bar-text {
  margin-top: 32px;
  font-size: 14px;
}

.user-health-bar {
  width: calc(100% - 16px * 2);
  max-width: 500px;
  margin: 8px 0 0 0;
}

.item-selector-section {
  margin-top: 16px;
  width: calc(100% - 32px);
  max-width: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.toggle-selector-btn {
  background: transparent;
  border: 1px solid #705424;
  border-radius: 3px;
  color: #c09b6a;
  font-size: 12px;
  padding: 4px 16px;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s;

  &:hover {
    background: rgba(200, 160, 80, 0.15);
  }
}

.app-item-selector {
  width: 100%;
}

.app-play-button,
.app-attack-button {
  margin-top: 16px;
}

.app-progress-bar {
  margin-top: 8px;
}

.equipped-items {
  display: flex;
  flex-direction: row;
  gap: 4px;
  margin-top: 8px;
}

.equipped-item {
  width: 36px;
  height: 36px;
  border-radius: 3px;
  border: 1px solid #705424;
  overflow: hidden;

  .equipped-item-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.app-quest {
  margin-top: 12px;
}


@media screen and (max-height: 700px) {
  .passive-text {
    font-size: 12px;
  }

  .user-health-bar-text {
    margin-top: 8px;
    font-size: 12px;
  }

  .app-play-button,
  .app-attack-button {
    margin-top: 16px;
  }

  .app-quest {
    margin-top: 8px;
  }
}

.background {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  background: black;

  .background-video {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100vh;
    object-fit: cover;
  }

  .background-layer {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background: black;
    opacity: 0.6;
  }
}
</style>
