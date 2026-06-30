import randomInteger from "random-int";
import type { Ref } from "vue";
import { computed, readonly, ref } from "vue";
import { playSoundWithSettings } from "@/game/main-settings";

interface HeartsteelResourcesProvider {
  getStackSFX(n: number): HTMLAudioElement;
  getThirdStackSFX(n: number): HTMLAudioElement;
  getTriggerSFX(n: number): HTMLAudioElement;
}

let heartResourcesProviderInstance: HeartsteelResourcesProvider | null = null;

function installHeartsteelResourcesProvider(
  resources: HeartsteelResourcesProvider
): void {
  heartResourcesProviderInstance = resources;
}

const MAX_CHARGE_STACK_COUNT = 4;

function applyHeartsteelTripleLogic(
  itemBonusHP: { value: number },
  grant: number,
  threshold: number
): void {
  const before = itemBonusHP.value;
  itemBonusHP.value += grant;
  const after = itemBonusHP.value;
  if (before < threshold && after >= threshold) {
    // 首次跨過門檻：當前總量 ×3
    itemBonusHP.value = after * 3;
  } else if (before >= threshold) {
    // 門檻後每次疊加量額外 ×2（已加 grant，再補 grant*2 = 共 grant*3）
    itemBonusHP.value += grant * 2;
  }
}
const CHARGE_INTERVAL_MS = 750;

class HeartsteelChargeProcess {
  private currentStackCount = 0;
  private chargeIntervalCallback: number | undefined;
  private isStopped = false;
  private activeAudio: HTMLAudioElement | undefined;

  maxStackCount = MAX_CHARGE_STACK_COUNT;

  onStackCountChange: (current: number) => void = () => {};

  constructor() {}

  reset(): void {
    this.activeAudio?.pause();
    this.isStopped = false;
    this.currentStackCount = 0;
    this.onStackCountChange(0);
  }

  start(): void {
    this.chargeIntervalCallback = window.setInterval(
      () => this.onChargeIntervalTick(),
      CHARGE_INTERVAL_MS
    );
    // trigger initial tick
    this.onChargeIntervalTick();
  }

  stop(): void {
    this.isStopped = true;
    // clear interval
    if (this.chargeIntervalCallback) {
      window.clearInterval(this.chargeIntervalCallback);
    }
  }

  private async onChargeIntervalTick(): Promise<void> {
    if (this.isStopped) {
      return;
    }
    this.onStackCountChange(this.currentStackCount);
    let audioEl: HTMLAudioElement;
    if (this.currentStackCount < MAX_CHARGE_STACK_COUNT) {
      audioEl = heartResourcesProviderInstance!.getStackSFX(
        this.currentStackCount
      );
    } else {
      audioEl = heartResourcesProviderInstance!.getThirdStackSFX(
        randomInteger(0, 2)
      );
    }
    this.activeAudio = audioEl;
    try {
      await playSoundWithSettings(audioEl);
    } catch (_) {
      // sfx play failed, ignore
    }
    // stop self when reached max charge stack count
    if (this.currentStackCount === MAX_CHARGE_STACK_COUNT) {
      this.stop();
      return;
    }
    // increase current stack for next tick
    this.currentStackCount += 1;
  }
}

class HeartsteelController {
  private readonly heroMaxHP: Readonly<Ref<number>>;

  private readonly chargeProcess: HeartsteelChargeProcess;

  private readonly triggerGrantBonusHPBase = 12.5;
  private readonly triggerGrantBonusHPPercentageMaxHP = 0.01 * 0.6;

  private activeAudio: HTMLAudioElement | undefined = undefined;

  readonly itemBaseHP = 800;
  readonly itemBonusHP = ref(0);
  readonly currentChargeStack = ref(0);

  readonly TRIPLE_THRESHOLD = 300;
  readonly isTripleUnlocked = computed(
    () => this.itemBonusHP.value >= this.TRIPLE_THRESHOLD
  );

  constructor(heroMaxHP: Ref<number>) {
    this.heroMaxHP = readonly(heroMaxHP);

    this.chargeProcess = new HeartsteelChargeProcess();
    this.chargeProcess.onStackCountChange = (n: number) => {
      this.currentChargeStack.value = n;
    };
  }

  start(): void {
    this.chargeProcess.start();
  }

  trigger(): boolean {
    if (this.currentChargeStack.value < this.chargeProcess.maxStackCount) {
      return false;
    }
    // play trigger sfx
    const audioEl = heartResourcesProviderInstance!.getTriggerSFX(
      randomInteger(0, 2)
    );
    this.activeAudio = audioEl;
    playSoundWithSettings(audioEl).catch(() => {});
    // grant bonus hp
    applyHeartsteelTripleLogic(this.itemBonusHP, this.triggerGrantBonusHP, this.TRIPLE_THRESHOLD);
    // restart heartsteel charge process
    this.chargeProcess.reset();
    this.chargeProcess.start();
    return true;
  }

  release(): void {
    this.activeAudio?.pause();
  }

  get triggerGrantBonusHP(): number {
    return (
      this.triggerGrantBonusHPBase +
      this.heroMaxHP.value * this.triggerGrantBonusHPPercentageMaxHP
    );
  }
}

export {
  type HeartsteelResourcesProvider,
  installHeartsteelResourcesProvider,
  HeartsteelChargeProcess,
  HeartsteelController,
};
