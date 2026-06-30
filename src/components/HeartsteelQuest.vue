<script setup lang="ts">
import HeartsteelQuestIcon from "@/assets/media/heartsteel.jpg";

const props = defineProps<{
  bonusHP: number;
  threshold: number;
  isUnlocked: boolean;
}>();
</script>

<template>
  <div class="quest-card" :class="{ unlocked: isUnlocked }">
    <div class="quest-icon-wrap">
      <img class="quest-icon" :src="HeartsteelQuestIcon" alt="心之鋼" />
      <div class="quest-icon-overlay" v-if="!isUnlocked" />
    </div>

    <div class="quest-body">
      <div class="quest-row">
        <span class="quest-label">任務：</span>
        <span class="quest-desc">擁有 {{ threshold }} 層以上的雄心之鋼。</span>
      </div>
      <div class="quest-row">
        <span class="quest-label">獎勵：</span>
        <span class="quest-reward">雄心之鋼堆疊乘以 3 倍。</span>
      </div>
      <div class="quest-progress-bar">
        <div
          class="quest-progress-fill"
          :style="{ width: `${Math.min((bonusHP / threshold) * 100, 100)}%` }"
        />
      </div>
      <div class="quest-progress-text">
        <span v-if="!isUnlocked">{{ Math.floor(bonusHP) }} / {{ threshold }}</span>
        <span v-else class="unlocked-text">✓ 已解鎖</span>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.quest-card {
  display: flex;
  align-items: center;
  gap: 10px;
  width: calc(100% - 32px);
  max-width: 500px;
  background: rgba(10, 10, 15, 0.85);
  border: 1px solid #3a3020;
  border-radius: 6px;
  padding: 8px 12px;
  transition: border-color 0.4s;

  &.unlocked {
    border-color: #c09b6a;
    background: rgba(20, 15, 5, 0.9);
  }
}

.quest-icon-wrap {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #3a3020;

  .quest-icon {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: grayscale(80%);
    transition: filter 0.4s;
  }

  .quest-icon-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
  }
}

.unlocked .quest-icon-wrap .quest-icon {
  filter: grayscale(0%);
}

.quest-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.quest-row {
  font-size: 11.5px;
  line-height: 1.4;
}

.quest-label {
  color: #e8c17d;
  font-weight: bold;
}

.quest-desc {
  color: #d0d0d0;
}

.quest-reward {
  color: #6dc8ff;
}

.quest-progress-bar {
  margin-top: 5px;
  height: 4px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.1);
  overflow: hidden;
}

.quest-progress-fill {
  height: 100%;
  border-radius: 2px;
  background: linear-gradient(to right, #705424, #e8c17d);
  transition: width 0.3s ease;
}

.unlocked .quest-progress-fill {
  background: linear-gradient(to right, #c09b6a, #ffe8a0);
}

.quest-progress-text {
  font-size: 10px;
  color: #808080;
  margin-top: 2px;
}

.unlocked-text {
  color: #c09b6a;
  font-weight: bold;
}
</style>
