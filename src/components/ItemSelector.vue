<script setup lang="ts">
import { computed } from "vue";
import { TANK_ITEMS, type TankItem } from "@/game/items/tank-items";

const props = defineProps<{
  selectedIds: string[];
}>();

const emits = defineEmits<{
  (event: "update:selectedIds", value: string[]): void;
}>();

const MAX_SLOTS = 6;
const FIXED_ID = "heartsteel";

const heartsteel = TANK_ITEMS.find((i) => i.id === FIXED_ID)!;
const availableItems = TANK_ITEMS.filter((i) => i.id !== FIXED_ID);

const canSelectMore = computed(
  () => props.selectedIds.length < MAX_SLOTS
);

function isSelected(id: string): boolean {
  return props.selectedIds.includes(id);
}

function toggle(item: TankItem) {
  if (item.id === FIXED_ID) return;
  if (isSelected(item.id)) {
    emits("update:selectedIds", props.selectedIds.filter((id) => id !== item.id));
  } else if (canSelectMore.value) {
    emits("update:selectedIds", [...props.selectedIds, item.id]);
  }
}

const totalHP = computed(() =>
  props.selectedIds.reduce((sum, id) => {
    return sum + (TANK_ITEMS.find((i) => i.id === id)?.hp ?? 0);
  }, 0)
);
const totalArmor = computed(() =>
  props.selectedIds.reduce((sum, id) => {
    return sum + (TANK_ITEMS.find((i) => i.id === id)?.armor ?? 0);
  }, 0)
);
const totalMR = computed(() =>
  props.selectedIds.reduce((sum, id) => {
    return sum + (TANK_ITEMS.find((i) => i.id === id)?.mr ?? 0);
  }, 0)
);
const totalAH = computed(() =>
  props.selectedIds.reduce((sum, id) => {
    return sum + (TANK_ITEMS.find((i) => i.id === id)?.ah ?? 0);
  }, 0)
);

const slotCount = computed(() => props.selectedIds.length);
</script>

<template>
  <div class="item-selector">
    <div class="selector-header">
      <span class="selector-title">選擇裝備（亂鬥峽谷）</span>
      <span class="slot-count">{{ slotCount }} / {{ MAX_SLOTS }}</span>
    </div>

    <!-- Fixed: Heartsteel -->
    <div class="item-row fixed-item">
      <div class="item-checkbox checked fixed">
        <span class="checkmark">✓</span>
      </div>
      <div class="item-info">
        <span class="item-name">{{ heartsteel.name }}</span>
        <span class="item-stats">
          <span class="stat hp">生命 +{{ heartsteel.hp }}</span>
          <span class="stat cost">{{ heartsteel.cost }}金</span>
        </span>
      </div>
    </div>

    <!-- Selectable items -->
    <div
      v-for="item in availableItems"
      :key="item.id"
      class="item-row"
      :class="{
        selected: isSelected(item.id),
        disabled: !isSelected(item.id) && !canSelectMore,
      }"
      @click="toggle(item)"
    >
      <div class="item-checkbox" :class="{ checked: isSelected(item.id) }">
        <span v-if="isSelected(item.id)" class="checkmark">✓</span>
      </div>
      <div class="item-info">
        <span class="item-name">{{ item.name }}</span>
        <span class="item-stats">
          <span v-if="item.hp > 0" class="stat hp">生命 +{{ item.hp }}</span>
          <span v-if="item.armor > 0" class="stat armor">護甲 +{{ item.armor }}</span>
          <span v-if="item.mr > 0" class="stat mr">魔抗 +{{ item.mr }}</span>
          <span v-if="item.ah > 0" class="stat ah">加速 +{{ item.ah }}</span>
          <span class="stat cost">{{ item.cost }}金</span>
        </span>
      </div>
    </div>

    <!-- Totals -->
    <div class="item-totals">
      <span class="totals-label">裝備合計：</span>
      <span v-if="totalHP > 0" class="stat hp">生命 +{{ totalHP }}</span>
      <span v-if="totalArmor > 0" class="stat armor">護甲 +{{ totalArmor }}</span>
      <span v-if="totalMR > 0" class="stat mr">魔抗 +{{ totalMR }}</span>
      <span v-if="totalAH > 0" class="stat ah">加速 +{{ totalAH }}</span>
    </div>
  </div>
</template>

<style lang="less" scoped>
.item-selector {
  width: 100%;
  max-width: 500px;
  background: rgba(0, 0, 0, 0.65);
  border: 1px solid #705424;
  border-radius: 4px;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.selector-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.selector-title {
  font-size: 13px;
  font-weight: bold;
  color: #e8c17d;
}

.slot-count {
  font-size: 12px;
  color: #a08050;
}

.item-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 6px;
  border-radius: 3px;
  cursor: pointer;
  transition: background 0.15s;

  &:hover:not(.fixed-item):not(.disabled) {
    background: rgba(200, 160, 80, 0.15);
  }

  &.selected {
    background: rgba(200, 160, 80, 0.08);
  }

  &.disabled {
    opacity: 0.35;
    cursor: default;
  }

  &.fixed-item {
    cursor: default;
    border-bottom: 1px solid #3a2a10;
    margin-bottom: 3px;
    padding-bottom: 6px;
  }
}

.item-checkbox {
  width: 14px;
  height: 14px;
  border: 1px solid #705424;
  border-radius: 2px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  &.checked {
    background: #c09b6a;
    border-color: #e8c17d;
  }

  &.fixed {
    background: #705424;
  }

  .checkmark {
    font-size: 9px;
    color: #000;
    line-height: 1;
  }
}

.item-info {
  display: flex;
  flex: 1;
  justify-content: space-between;
  align-items: center;
  gap: 4px;
  min-width: 0;
}

.item-name {
  font-size: 12px;
  color: #fafafa;
  white-space: nowrap;
}

.item-stats {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
  flex-wrap: nowrap;
}

.stat {
  font-size: 10px;
  white-space: nowrap;

  &.hp     { color: #6dc414; }
  &.armor  { color: #c0c060; }
  &.mr     { color: #60a0e0; }
  &.ah     { color: #c080e0; }
  &.cost   { color: #a08050; }
}

.item-totals {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 4px;
  padding-top: 6px;
  border-top: 1px solid #705424;
  font-size: 11px;

  .totals-label {
    color: #e8c17d;
  }
}
</style>
