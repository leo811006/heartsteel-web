export interface TankItem {
  id: string;
  name: string;
  icon: string; // Data Dragon image filename
  hp: number;
  armor: number;
  mr: number;
  ah: number; // ability haste
  cost: number;
}

// Data Dragon base URL — version may need updating on major patches
const DDV = "16.13.1";
export const DD_ITEM_URL = (icon: string) =>
  `https://ddragon.leagueoflegends.com/cdn/${DDV}/img/item/${icon}`;

export const TANK_ITEMS: TankItem[] = [
  { id: "heartsteel",    name: "雄心之鋼",         icon: "3084.png", hp: 900,  armor: 0,  mr: 0,  ah: 0,  cost: 3000 },
  { id: "warmogs",       name: "好戰者鎧甲",       icon: "3083.png", hp: 1000, armor: 0,  mr: 0,  ah: 0,  cost: 3100 },
  { id: "unending",      name: "無盡絕望",         icon: "2502.png", hp: 400,  armor: 50, mr: 0,  ah: 15, cost: 2800 },
  { id: "thornmail",     name: "荊棘之甲",         icon: "3075.png", hp: 150,  armor: 75, mr: 0,  ah: 0,  cost: 2450 },
  { id: "jaksho",        name: "千變萬化之賈克修", icon: "6665.png", hp: 350,  armor: 45, mr: 45, ah: 0,  cost: 3200 },
  { id: "spiritvisage",  name: "振奮盔甲",         icon: "3065.png", hp: 400,  armor: 0,  mr: 50, ah: 10, cost: 2700 },
  { id: "forceofnature", name: "自然之力",         icon: "4401.png", hp: 400,  armor: 0,  mr: 55, ah: 0,  cost: 2800 },
  { id: "abyssalmask",   name: "均等法衣",         icon: "3001.png", hp: 350,  armor: 0,  mr: 45, ah: 15, cost: 2650 },
  { id: "hollowradiance",name: "虛偽光彩",         icon: "6664.png", hp: 400,  armor: 0,  mr: 40, ah: 10, cost: 2800 },
  { id: "titanic",       name: "泰坦九頭蛇",       icon: "3748.png", hp: 600,  armor: 0,  mr: 0,  ah: 0,  cost: 3300 },
  { id: "gargoyle",      name: "石像鬼磐核",       icon: "3193.png", hp: 0,    armor: 65, mr: 65, ah: 15, cost: 3200 },
  { id: "frozenheart",   name: "冰霜之心",         icon: "3110.png", hp: 0,    armor: 75, mr: 0,  ah: 20, cost: 2500 },
  { id: "deadmans",      name: "死者肩甲",         icon: "3742.png", hp: 350,  armor: 55, mr: 0,  ah: 0,  cost: 2900 },
  { id: "randuins",      name: "蘭頓之兆",         icon: "3143.png", hp: 350,  armor: 75, mr: 0,  ah: 0,  cost: 2700 },
];
