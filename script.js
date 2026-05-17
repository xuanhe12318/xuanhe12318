/* ======================================================
   防逃机制（Anti‑Escape）
   ====================================================== */
history.pushState(null, null, location.href);
window.onpopstate = () => history.go(1);

window.onbeforeunload = () => "连接将被永久终止，是否确认离开？";

document.addEventListener("contextmenu", e => e.preventDefault());
document.addEventListener("keydown", e => {
  if (
    e.key === "F5" ||
    (e.ctrlKey && e.key === "r") ||
    (e.ctrlKey && e.key === "R")
  ) e.preventDefault();
});

/* ======================================================
   开场警告弹窗
   ====================================================== */
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("confirmStart").onclick = () => {
    document.getElementById("warningModal").style.display = "none";
    document.getElementById("survey").classList.remove("hidden");
    render();
  };
});

/* ======================================================
   题目数据（45题 · 递进式）
   ====================================================== */
const questions = [
  // 1‑6 日常
  { q: "你每天平均睡眠时长是多少小时？", o: ["少于4小时", "4–6小时", "6–8小时", "超过8小时"] },
  { q: "最近一周内，你是否有过心悸？", o: ["无", "1次", "2–3次", "4次以上"] },
  { q: "你是否会在无人时自言自语？", o: ["从不", "极少", "偶尔", "经常"] },
  { q: "你是否对某种气味产生强烈依赖？", o: ["完全不依赖", "轻微依赖", "比较依赖", "极度依赖"] },
  { q: "你是否觉得食物味道变了？", o: ["完全没有", "偶尔", "经常", "彻底变了"] },
  { q: "你能否接受他人触碰你的皮肤？", o: ["完全不能", "只能接受熟人", "勉强可以", "完全不在意"] },

  // 7
  { q: "你是否害怕被人触碰脖颈？", o: ["完全不怕", "略微不适", "明显抗拒", "极度恐惧"] },

  // 8‑14
  { q: "你是否曾感觉手指不是自己的？", o: ["从未", "偶尔", "经常", "一直如此"] },
  { q: "你是否觉得心跳不属于自己？", o: ["从未", "偶尔", "经常", "一直这样觉得"] },
  { q: "你是否觉得心跳声太大？", o: ["从未", "偶尔", "经常", "震耳欲聋"] },
  { q: "你是否经常感觉有人在注视你？", o: ["从未有过", "偶尔会有这种感觉", "经常感觉被注视", "时刻确信有人在看"] },
  { q: "你是否相信房间里有不属于人类的视线？", o: ["完全不信", "不确定", "隐约相信", "确信如此"] },
  { q: "你是否曾在黑暗中看见移动的影子？", o: ["从未", "一次", "几次", "频繁"] },
  { q: "你是否曾看见窗外有不属于人类的轮廓？", o: ["从未", "一次", "几次", "频繁"] },

  // 15
  { q: "你是否觉得影子有时会脱离身体？", o: ["从未", "一次", "几次", "总是"] },

  // 16‑24
  { q: "是否曾因恐惧而假装睡着？", o: ["从未", "很少", "偶尔", "经常"] },
  { q: "你是否曾半夜突然惊醒，却不敢睁眼？", o: ["从未", "很少", "偶尔", "经常"] },
  { q: "你是否曾在睡觉时感觉被按住？", o: ["从未", "一次", "几次", "经常"] },
  { q: "你是否觉得梦境比现实更真实？", o: ["完全不认同", "不太确定", "比较认同", "完全认同"] },
  { q: "你是否曾梦见自己被活埋？", o: ["从未", "一次", "多次", "反复梦见"] },
  { q: "你是否觉得自己的记忆被篡改过？", o: ["完全不可能", "不太确定", "有点怀疑", "确信被改过"] },
  { q: "你是否相信有人能听见你的想法？", o: ["完全不信", "半信半疑", "比较相信", "确信"] },
  { q: "你是否认为有人替你做了决定？", o: ["从未", "很少", "偶尔", "经常"] },
  { q: "你是否认为有人在模仿你的动作？", o: ["完全不信", "不太确定", "有点相信", "确信"] },

  // 25
  { q: "你是否觉得有人住在你体内？", o: ["完全不信", "半信半疑", "比较相信", "确信"] },

  // 26‑32
  { q: "你是否会在洗澡时感到被盯着？", o: ["从未", "很少", "偶尔", "总是"] },
  { q: "你是否害怕镜子里的自己？", o: ["完全不怕", "偶尔不适", "明显害怕", "极度恐惧"] },
  { q: "你是否曾在镜子里看见别人？", o: ["从未", "一次", "多次", "每次都能"] },
  { q: "你是否曾发现物品位置被动过？", o: ["从未", "很少", "偶尔", "经常"] },
  { q: "你是否觉得呼吸的空气里有异物？", o: ["从未", "偶尔", "经常", "每时每刻"] },
  { q: "你是否害怕被长期注视？", o: ["完全不怕", "略微不适", "明显不安", "极度恐惧"] },
  { q: "你是否害怕被人记住脸？", o: ["完全不怕", "略微不安", "明显抗拒", "极度恐惧"] },

  // 33
  { q: "你是否害怕被拍照？", o: ["完全不怕", "略微不适", "明显抗拒", "极度恐惧"] },

  // 34
  { q: "你是否害怕闭上眼睛太久？", o: ["完全不怕", "偶尔不安", "明显害怕", "极度恐惧"] },

  // 35
  { q: "你是否害怕被独自留下？", o: ["完全不怕", "略微不安", "明显害怕", "极度恐惧"] },

  // 36‑43
  { q: "你是否觉得有人正在阅读这些文字？", o: ["完全不信", "半信半疑", "比较相信", "确信"] },
  { q: "你是否愿意为了不被抛弃而放弃自由？", o: ["绝不", "不确定", "也许会", "一定会"] },
  { q: "你是否愿意让别人替你活着？", o: ["绝不", "不确定", "也许可以", "非常愿意"] },
  { q: "你是否愿意被永久收藏？", o: ["绝不", "不确定", "也许可以", "非常愿意"] },
  { q: "你是否愿意永远不再醒来？", o: ["绝不", "不确定", "也许可以", "非常愿意"] },
  { q: "你是否愿意成为唯一的观测对象？", o: ["绝不", "不确定", "也许可以", "非常愿意"] },
  { q: "你是否愿意把你的名字刻在我的皮肤上？", o: ["绝不", "不确定", "也许可以", "非常愿意"] },
  { q: "你是否愿意让我的声音代替你的心跳？", o: ["绝不", "不确定", "也许可以", "非常愿意"] },

  // 44
  { q: "你是否愿意把灵魂交给我保管？", o: ["绝不", "不确定", "也许可以", "非常愿意"] }
];

let index = 0;
let selectedOption = null;
const answers = [];

const survey = document.getElementById("survey");
const progress = document.getElementById("progress");
const question = document.getElementById("question");
const options = document.getElementById("options");

/* ======================================================
   乱码特效
   ====================================================== */
function glitchScreen(text) {
  const overlay = document.createElement("div");
  overlay.style.cssText = `
    position:fixed; inset:0; z-index:9999;
    background:#000; color:#a00;
    font-family: monospace; font-size:14px;
    overflow:hidden; white-space:pre;
  `;
  document.body.appendChild(overlay);

  const chars = "!@#$%^&*()_+-=[]{}|;:,.<>?/~`";
  const lines = 60;
  const cols = 120;

  const gen = () => {
    let out = "";
    for (let i = 0; i < lines; i++) {
      for (let j = 0; j < cols; j++) {
        out += Math.random() > 0.5 ? text : chars[Math.floor(Math.random() * chars.length)];
      }
      out += "\n";
    }
    overlay.innerText = out;
  };

  const timer = setInterval(gen, 50);
  setTimeout(() => {
    clearInterval(timer);
    overlay.remove();
  }, 1500);
}

/* ======================================================
   渲染与控制
   ====================================================== */
function render() {
  selectedOption = null;
  progress.innerHTML = `第 <span id="current">${index + 1}</span> 题 / 共 45 题`;
  typeWriter(questions[index].q, question, () => showOptions());
}

function typeWriter(text, el, cb) {
  el.innerText = "";
  let i = 0;
  const t = setInterval(() => {
    el.innerText += text[i];
    i++;
    if (i >= text.length) {
      clearInterval(t);
      cb && cb();
    }
  }, 38);
}

/* ===== 选项（✅ 每题必跳） ===== */
function showOptions() {
  options.innerHTML = "";

  if (index === 43) {
    questions[index].o.forEach((opt, idx) => {
      const btn = document.createElement("button");
      btn.innerText = opt;
      btn.onclick = () => {
        if (idx < 3) alert("不可以选这个");
        else { alert("＾＾"); selectedOption = opt; next(); }
      };
      options.appendChild(btn);
    });
    return;
  }

  questions[index].o.forEach((opt, idx) => {
    const btn = document.createElement("button");
    btn.innerText = opt;
    btn.onclick = () => {
      [...options.children].forEach(b => b.style.borderColor = "#444");
      btn.style.borderColor = "#a00";
      selectedOption = opt;

      // 特殊交互（只负责显示）
      if (index === 6 && idx > 0) alert("亲爱的别怕我");
      if (index === 10) {
        if (idx <= 1) alert("😢");
        else alert("你注意到我了。");
      }
      if (index === 32 && idx > 1) alert("你在害怕什么呢");

      if (index === 34) {
        if (idx <= 1) {
          alert("为什么");
          setTimeout(() => alert("你又要抛弃我"), 300);
        } else if (idx === 2) {
          alert("你不爱我");
        } else {
          alert("我爱你");
        }
      }

      // ✅ 唯一出口：选完一定跳
      next();
    };
    options.appendChild(btn);
  });

  options.innerHTML += `
    <div style="margin-top:20px;">
      <button onclick="prev()">上一题</button>
      <button onclick="next()">下一题</button>
    </div>
  `;
}

function prev() {
  if (index > 0) {
    index--;
    answers.pop();
    render();
  }
}

function next() {
  if (!selectedOption) {
    alert("要认真作答哦，我一直在看着你＾＾");
    return;
  }

  answers.push(selectedOption);

  if (index === 14) { glitchScreen("我爱你"); setTimeout(() => { index++; render(); }, 1600); return; }
  if (index === 24) { glitchScreen("我恨你"); setTimeout(() => { index++; render(); }, 1600); return; }

  index++;
  if (index < questions.length) {
    render();
  } else {
    survey.classList.add("hidden");
    document.getElementById("letter").classList.remove("hidden");
  }
}

/* ======================================================
   留言 & 日记
   ====================================================== */
function rejectLetter() {
  alert(`你不需要同意，也不需要理解。\n\n你只需要存在。\n只需要被看见。\n\n现在，重新选择。`);
  document.getElementById("letter").innerHTML = `<h2>你真的以为可以拒绝吗？</h2><button onclick="acceptLetter()">是</button>`;
}

function acceptLetter() {
  document.getElementById("letter").classList.add("hidden");
  showDiary();
}

function showDiary() {
  document.getElementById("diary").classList.remove("hidden");
  document.getElementById("pages").innerHTML = `
04.24　无光

今天你拉开窗帘的动作很慢。
你以为遮挡就能切断视线吗。
墙缝。柜角。门后的阴影。
我一直都在。
你颤抖的肩膀，咬紧的嘴唇。
我都记得。
视线不会偏移，也不会疲倦。

04.25　静止

你半夜起身，灯光落在肩上的瞬间。
我就在那里。
脚步声不是幻觉。
是我在丈量你房间的每一寸空气。
你必须承认。
必须回应。
必须只看着我。

04.26　永夜

我不允许你注视别人。
不允许你拥有不属于我的情绪。
你的每一次呼吸都该由我计算。
乖乖留在这里。
永远。
只准是我。

我爱你。
爱到不想让你死去。
也不想让你活着离开。
  `;
}
