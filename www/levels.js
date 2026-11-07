/* =====================================================================
   关卡配置 —— 以后设计新关卡，只需要改这个文件
   打开 index.html?check 可以检查这里的配置有没有写错。

   关卡按等级（world）分组，界面上的编号（1-3 = 等级 1 第 3 关）按顺序自动算，
   所以插入、删除、调换关卡都可以直接改，不影响玩家存档。

   key      每关（和每个等级）固定不变的名字，存档靠它记录星星和最高纪录。
            ⚠ 一旦发布就不要再改，改了玩家这一关的记录就丢了；新关卡起一个新名字即可。

   每一关都会先套用 DEFAULTS，关卡里写了的字段会覆盖默认值。
   name     关卡名（可选，游戏里显示），不写就显示"凑 N"
   target   目标和（可以是负数、小数）
   dec      小数位数（0 = 整数；1 = 一位小数 ...）
   pools    数字池，[{min,max,step,w}]，w 是权重，用来混合不同位数
   maxPick  一次最多选几个数（至少 2 个）
   cols/rows 棋盘几列几行
   time     限时（秒，必须 > 0）。时间到时凑出的组数 ≥ goal 就过关
   goal     过关需要凑出的组数
   stars    [1 星, 2 星, 3 星] 需要的组数，不写就按 goal、goal×1.25、goal×1.5
   help     生成新数字时"故意放一个能配对的数"的概率，越高越简单
   idleHint 发呆 9 秒自动提示（给小朋友）
   zero     棋盘上可以出现 0（比如 0 + 2 = 2），也会出现和目标一样大的数
   ===================================================================== */
const DEFAULTS = { time:120, goal:20, cols:7, rows:9, maxPick:2 };

const WORLDS = [
  {
    key:'first',
    name:{ en:'First Sums', zh:'小小加法' },
    desc:{ en:'Small numbers, with 0: make 1, 2, 3 … up to 10', zh:'小数字，有 0：从凑 1 开始，一直到凑 10' },
    // 凑 1 … 10，有 0（0 + 1 = 1），给小朋友，发呆会自动提示
    levels:[
      { key:'first-1',  target:1,  pools:[{min:0, max:1}],  help:0.3, zero:true, idleHint:true, time:45 },
      { key:'first-2',  target:2,  pools:[{min:0, max:2}],  help:0.3, zero:true, idleHint:true, time:45 },
      { key:'first-3',  target:3,  pools:[{min:0, max:3}],  help:0.3, zero:true, idleHint:true, time:45 },
      { key:'first-4',  target:4,  pools:[{min:0, max:4}],  help:0.3, zero:true, idleHint:true, time:45 },
      { key:'first-5',  target:5,  pools:[{min:0, max:5}],  help:0.3, zero:true, idleHint:true, time:45 },
      { key:'first-6',  target:6,  pools:[{min:0, max:6}],  help:0.3, zero:true, idleHint:true, time:45 },
      { key:'first-7',  target:7,  pools:[{min:0, max:7}],  help:0.3, zero:true, idleHint:true, time:45 },
      { key:'first-8',  target:8,  pools:[{min:0, max:8}],  help:0.3, zero:true, idleHint:true, time:45 },
      { key:'first-9',  target:9,  pools:[{min:0, max:9}],  help:0.3, zero:true, idleHint:true, time:45 },
      { key:'first-10', target:10, pools:[{min:0, max:10}], help:0.3, zero:true, idleHint:true, time:45 },
    ],
  },
  {
    key:'teens',
    name:{ en:'Teens', zh:'凑十几' },
    desc:{ en:'Make 11, 12, 13 … up to 20', zh:'从凑 11 开始，一直到凑 20' },
    levels:[
      { key:'teens-11', target:11, pools:[{min:1, max:10}], help:0.3 },
      { key:'teens-12', target:12, pools:[{min:1, max:11}], help:0.3 },
      { key:'teens-13', target:13, pools:[{min:1, max:12}], help:0.3 },
      { key:'teens-14', target:14, pools:[{min:1, max:13}], help:0.3 },
      { key:'teens-15', target:15, pools:[{min:1, max:14}], help:0.3 },
      { key:'teens-16', target:16, pools:[{min:1, max:15}], help:0.3 },
      { key:'teens-17', target:17, pools:[{min:1, max:16}], help:0.3 },
      { key:'teens-18', target:18, pools:[{min:1, max:17}], help:0.3 },
      { key:'teens-19', target:19, pools:[{min:1, max:18}], help:0.3 },
      { key:'teens-20', target:20, pools:[{min:1, max:19}], help:0.3 },
    ],
  },
  {
    key:'tens',
    name:{ en:'Make Tens', zh:'凑整十' },
    desc:{ en:'Make 10, then 20, 30 … all the way to 100', zh:'从凑 10 开始，每关加 10，一直到凑 100' },
    levels:[
      { key:'tens-10',  target:10,  pools:[{min:1, max:9}],  help:0.3 },
      { key:'tens-20',  target:20,  pools:[{min:1, max:19}], help:0.3 },
      { key:'tens-30',  target:30,  pools:[{min:1, max:29}], help:0.3 },
      { key:'tens-40',  target:40,  pools:[{min:1, max:39}], help:0.3 },
      { key:'tens-50',  target:50,  pools:[{min:1, max:49}], help:0.3 },
      { key:'tens-60',  target:60,  pools:[{min:1, max:59}], help:0.3 },
      { key:'tens-70',  target:70,  pools:[{min:1, max:69}], help:0.3 },
      { key:'tens-80',  target:80,  pools:[{min:1, max:79}], help:0.3 },
      { key:'tens-90',  target:90,  pools:[{min:1, max:89}], help:0.3 },
      { key:'tens-100', target:100, pools:[{min:1, max:99}], help:0.3 },
    ],
  },
  // 等级 4、5：草稿，之后再细调
  {
    key:'neg',
    name:{ en:'Negatives', zh:'负数登场' },
    desc:{ en:'Striped tiles are negative: they make the sum smaller', zh:'带斜纹的是负数，加上它会变小' },
    levels:[
      { key:'neg-plusminus', name:{ en:'Plus and Minus', zh:'有正有负' }, target:10, pools:[{min:-9,max:9}], maxPick:3, help:.15 },
      { key:'neg-zero',      name:{ en:'Back to Zero',   zh:'归零' },     target:0,  pools:[{min:-20,max:20}], maxPick:3, help:.15 },
    ],
  },
  {
    key:'dec',
    name:{ en:'Decimals', zh:'小数点' },
    desc:{ en:'The target isn’t a whole number anymore', zh:'目标不再是整数' },
    levels:[
      { key:'dec-one',      name:{ en:'Make One',  zh:'凑一' },     target:1, dec:1, pools:[{min:.1,max:.9,step:.1}], help:.15 },
      { key:'dec-five',     name:{ en:'Make Five', zh:'凑五' },     target:5, dec:1, pools:[{min:.1,max:3.9,step:.1}], maxPick:3, help:.15 },
      { key:'dec-quarters', name:{ en:'Quarters',  zh:'四分之几' }, target:1, dec:2, pools:[{min:-1.5,max:1.5,step:.25}], maxPick:3, help:.15 },
    ],
  },
];
