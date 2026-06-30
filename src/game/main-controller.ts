import { HeartsteelController } from "@/game/items/heartsteel";
import { computed, readonly, type Ref, ref } from "vue";
import { debounce } from "lodash-es";
import { useMainSettings } from "@/game/main-settings";
import { TANK_ITEMS } from "@/game/items/tank-items";

export default class MainController {
  private readonly vibrateEnabled: Ref<Boolean>;
  heartsteel: HeartsteelController;
  readonly heroBaseHP = ref(1000);
  readonly selectedItemIds = ref<string[]>(["heartsteel"]);

  readonly itemBonusHP = computed(() =>
    this.selectedItemIds.value.reduce((sum, id) => {
      const item = TANK_ITEMS.find((i) => i.id === id);
      return sum + (item?.hp ?? 0);
    }, 0)
  );

  baseHP = computed(() =>
    Math.max(this.heroBaseHP.value + this.itemBonusHP.value, 500)
  );

  bonusHP = computed(() => this.heartsteel.itemBonusHP.value);
  maxHP = computed(() => this.baseHP.value + this.bonusHP.value);

  constructor() {
    this.vibrateEnabled = readonly(useMainSettings().vibrateEnabled);
    this.heartsteel = new HeartsteelController(this.maxHP);
  }

  clearHeartsteelBonus(): void {
    this.heartsteel.itemBonusHP.value = 0;
  }

  start(): void {
    this.heartsteel.start();
  }

  private _doAttack = debounce(
    () => {
      this.doAttackNormalOp();
      if (this.heartsteel.trigger()) {
        if (this.vibrateEnabled.value) {
          window.navigator.vibrate?.([50, 20, 200]);
        }
      }
    },
    100,
    {
      leading: true,
      trailing: false,
    }
  );

  doAttack(): void {
    this._doAttack();
  }

  private doAttackNormalOp(): void {
    // normal attack ops
  }
}
