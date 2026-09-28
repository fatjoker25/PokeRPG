/* ============================================================
   GERADO por ferramentas/gerar-golpes-showdown.js — não edite à mão.
   Animação de cada golpe, do cliente do Pokémon Showdown
   (battle-animations-moves.ts, CC0; battle-animations.ts, MIT).
   Quem roda é CenaShowdown, em js/ui/cena-showdown.js.
   212 golpes · 41 imagens · 2 fundos
   ============================================================ */
const SD_CONFIG = {routes:{client:'play.pokemonshowdown.com'}};
const SD_EFEITOS = {"angry":{"arq":"angry.png","w":30,"h":30},
  "blackwisp":{"arq":"blackwisp.png","w":100,"h":100},
  "bluefireball":{"arq":"bluefireball.png","w":64,"h":64},
  "bone":{"arq":"bone.png","w":29,"h":29},
  "bottombite":{"arq":"bottombite.png","w":108,"h":64},
  "electroball":{"arq":"electroball.png","w":100,"h":100},
  "energyball":{"arq":"energyball.png","w":100,"h":100},
  "fireball":{"arq":"fireball.png","w":64,"h":64},
  "fist":{"arq":"fist.png","w":55,"h":49},
  "flareball":{"arq":"flareball.png","w":100,"h":100},
  "foot":{"arq":"foot.png","w":50,"h":75},
  "heart":{"arq":"heart.png","w":30,"h":30},
  "hitmark":{"arq":"hitmarker.png","w":100,"h":100},
  "iceball":{"arq":"iceball.png","w":100,"h":100},
  "icicle":{"arq":"icicle.png","w":80,"h":60},
  "impact":{"arq":"impact.png","w":127,"h":119},
  "leaf1":{"arq":"leaf1.png","w":32,"h":26},
  "leaf2":{"arq":"leaf2.png","w":40,"h":26},
  "leftchop":{"arq":"leftchop.png","w":100,"h":130},
  "leftclaw":{"arq":"leftclaw.png","w":44,"h":60},
  "leftslash":{"arq":"leftslash.png","w":57,"h":56},
  "lightning":{"arq":"lightning.png","w":41,"h":229},
  "mistball":{"arq":"mistball.png","w":100,"h":100},
  "mudwisp":{"arq":"mudwisp.png","w":100,"h":100},
  "petal":{"arq":"petal.png","w":60,"h":60},
  "pointer":{"arq":"pointer.png","w":100,"h":100},
  "purplewisp":{"arq":"purplewisp.png","w":100,"h":100},
  "rightchop":{"arq":"rightchop.png","w":100,"h":130},
  "rightclaw":{"arq":"rightclaw.png","w":44,"h":60},
  "rightslash":{"arq":"rightslash.png","w":57,"h":56},
  "rock1":{"arq":"rock1.png","w":64,"h":80},
  "rock2":{"arq":"rock2.png","w":66,"h":72},
  "rock3":{"arq":"rock3.png","w":66,"h":72},
  "shadowball":{"arq":"shadowball.png","w":100,"h":100},
  "shell":{"arq":"shell.png","w":100,"h":91.5},
  "stare":{"arq":"stare.png","w":100,"h":35},
  "sword":{"arq":"sword.png","w":48,"h":100},
  "topbite":{"arq":"topbite.png","w":108,"h":64},
  "waterwisp":{"arq":"waterwisp.png","w":100,"h":100},
  "web":{"arq":"web.png","w":120,"h":122},
  "wisp":{"arq":"wisp.png","w":100,"h":100}};
const SD_FUNDOS = ["bg-space.jpg","weather-sunnyday.jpg"];
const SD_OUTRAS = {
  bite: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("topbite", {
        x: defender.x,
        y: defender.y + 50,
        z: defender.z,
        scale: 0.5,
        opacity: 0,
        time: 370
      }, {
        x: defender.x,
        y: defender.y + 10,
        z: defender.z,
        scale: 0.5,
        opacity: 1,
        time: 500
      }, "linear", "fade");
      scene.showEffect("bottombite", {
        x: defender.x,
        y: defender.y - 50,
        z: defender.z,
        scale: 0.5,
        opacity: 0,
        time: 370
      }, {
        x: defender.x,
        y: defender.y - 10,
        z: defender.z,
        scale: 0.5,
        opacity: 1,
        time: 500
      }, "linear", "fade");
    }},
  contactattack: {anim: function anim(scene, [attacker, defender]) {
      attacker.anim({
        x: defender.x,
        y: defender.y + 80,
        z: defender.behind(-30),
        time: 400
      }, "ballistic");
      attacker.anim({
        x: defender.x,
        y: defender.y + 5,
        z: defender.z,
        time: 100
      });
      attacker.anim({
        time: 500
      }, "ballistic2Back");
      defender.delay(450);
      defender.anim({
        z: defender.behind(20),
        time: 100
      }, "swing");
      defender.anim({
        time: 300
      }, "swing");
      scene.wait(500);
    }},
  dance: {anim: function anim(scene, [attacker]) {
      attacker.anim({ x: attacker.x - 10 });
      attacker.anim({ x: attacker.x + 10 });
      attacker.anim({ x: attacker.x });
    }},
  drain: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("energyball", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0.6,
        opacity: 0.6,
        time: 0
      }, {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        time: 500,
        opacity: 0
      }, "ballistic2");
      scene.showEffect("energyball", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0.6,
        opacity: 0.6,
        time: 50
      }, {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        time: 550,
        opacity: 0
      }, "linear");
      scene.showEffect("energyball", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0.6,
        opacity: 0.6,
        time: 100
      }, {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        time: 600,
        opacity: 0
      }, "ballistic2Under");
    }},
  hitmark: {anim: function anim(scene, [attacker]) {
      scene.showEffect("hitmark", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.5,
        opacity: 1
      }, {
        opacity: 0.5,
        time: 250
      }, "linear", "fade");
    }},
  hydroshot: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("waterwisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.4,
        opacity: 0.3
      }, {
        x: defender.x + 10,
        y: defender.y + 5,
        z: defender.behind(30),
        scale: 1,
        opacity: 0.6
      }, "decel", "explode");
      scene.showEffect("waterwisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.4,
        opacity: 0.3,
        time: 75
      }, {
        x: defender.x - 10,
        y: defender.y - 5,
        z: defender.behind(30),
        scale: 1,
        opacity: 0.6
      }, "decel", "explode");
      scene.showEffect("waterwisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.4,
        opacity: 0.3,
        time: 150
      }, {
        x: defender.x,
        y: defender.y + 5,
        z: defender.behind(30),
        scale: 1,
        opacity: 0.6
      }, "decel", "explode");
    }},
  kick: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("foot", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 1,
        opacity: 1,
        time: 400
      }, {
        x: defender.x,
        y: defender.y - 20,
        z: defender.behind(15),
        scale: 2,
        opacity: 0,
        time: 800
      }, "linear");
    }},
  punchattack: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("wisp", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0,
        opacity: 1,
        time: 400
      }, {
        x: defender.leftof(-20),
        y: defender.y,
        z: defender.behind(20),
        scale: 3,
        opacity: 0,
        time: 700
      }, "linear");
      scene.showEffect("wisp", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0,
        opacity: 1,
        time: 500
      }, {
        x: defender.leftof(-20),
        y: defender.y,
        z: defender.behind(20),
        scale: 3,
        opacity: 0,
        time: 800
      }, "linear");
      scene.showEffect("fist", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 1,
        opacity: 1,
        time: 400
      }, {
        x: defender.leftof(-20),
        y: defender.y,
        z: defender.behind(20),
        scale: 2,
        opacity: 0,
        time: 800
      }, "linear");
      attacker.anim({
        x: defender.leftof(20),
        y: defender.y,
        z: defender.behind(-20),
        time: 400
      }, "ballistic2Under");
      attacker.anim({
        x: defender.x,
        y: defender.y,
        z: defender.z,
        time: 50
      });
      attacker.anim({
        time: 500
      }, "ballistic2");
      defender.delay(425);
      defender.anim({
        x: defender.leftof(-15),
        y: defender.y,
        z: defender.behind(15),
        time: 50
      }, "swing");
      defender.anim({
        time: 300
      }, "swing");
    }},
  shake: {anim: function anim(scene, [attacker]) {
      attacker.anim({ x: attacker.x - 10, time: 200 });
      attacker.anim({ x: attacker.x + 10, time: 300 });
      attacker.anim({ x: attacker.x, time: 200 });
    }},
  xattack: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("wisp", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0,
        opacity: 1,
        time: 400
      }, {
        x: defender.leftof(-20),
        y: defender.y,
        z: defender.behind(20),
        scale: 3,
        opacity: 0,
        time: 700
      }, "linear");
      scene.showEffect("wisp", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0,
        opacity: 1,
        time: 700
      }, {
        x: defender.leftof(-20),
        y: defender.y,
        z: defender.behind(20),
        scale: 3,
        opacity: 0,
        time: 1e3
      }, "linear");
      defender.delay(480);
      defender.anim({
        z: defender.behind(20),
        time: 100
      }, "swing");
      defender.anim({
        time: 200
      }, "swing");
      defender.anim({
        z: defender.behind(20),
        time: 100
      }, "swing");
      defender.anim({
        time: 300
      }, "swing");
      attacker.anim({
        x: defender.leftof(-30),
        y: defender.y + 80,
        z: defender.behind(-30),
        time: 400
      }, "ballistic");
      attacker.anim({
        x: defender.leftof(30),
        y: defender.y + 5,
        z: defender.z,
        time: 100
      });
      attacker.anim({
        x: defender.leftof(30),
        y: defender.y + 80,
        z: defender.behind(-30),
        time: 200
      }, "ballisticUp");
      attacker.anim({
        x: defender.leftof(-30),
        y: defender.y + 5,
        z: defender.z,
        time: 100
      });
      attacker.anim({
        time: 500
      }, "ballistic2Back");
    }}
};
const SD_STATUS = {

};
const SD_GOLPES = {
  absorb: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("energyball", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0.6,
        opacity: 0.6,
        time: 0
      }, {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        time: 500,
        opacity: 0
      }, "ballistic2");
      scene.showEffect("energyball", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0.6,
        opacity: 0.6,
        time: 50
      }, {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        time: 550,
        opacity: 0
      }, "linear");
      scene.showEffect("energyball", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0.6,
        opacity: 0.6,
        time: 100
      }, {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        time: 600,
        opacity: 0
      }, "ballistic2Under");
    }},
  acid: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("purplewisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.1,
        opacity: 0
      }, {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0.7,
        opacity: 1,
        time: 400
      }, "ballistic", "fade");
      scene.showEffect("purplewisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.1,
        opacity: 0,
        time: 100
      }, {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0.7,
        opacity: 1,
        time: 500
      }, "ballistic", "fade");
      scene.showEffect("purplewisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.1,
        opacity: 0,
        time: 200
      }, {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0.7,
        opacity: 1,
        time: 600
      }, "ballistic", "fade");
    }},
  acidarmor: {anim: function anim(scene, [attacker]) {
      scene.showEffect("purplewisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 2,
        opacity: 0.2,
        time: 0
      }, {
        scale: 0,
        opacity: 1,
        time: 300
      }, "linear");
      scene.showEffect("purplewisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 2,
        opacity: 0.2,
        time: 200
      }, {
        scale: 0,
        opacity: 1,
        time: 500
      }, "linear");
    }},
  aeroblast: {anim: function anim(scene, [attacker, defender]) {
      let xstep = (defender.x - attacker.x) / 5;
      let ystep = (defender.y - attacker.y) / 5;
      let zstep = (defender.behind(50) - attacker.z) / 5;
      scene.backgroundEffect("#000000", 700, 0.6);
      for (let i = 0; i < 5; i++) {
        scene.showEffect("wisp", {
          x: attacker.x + xstep * (i + 1),
          y: attacker.y + ystep * (i + 1),
          z: attacker.z + zstep * (i + 1),
          scale: 1,
          opacity: 1,
          time: 20 * i
        }, {
          scale: 3,
          opacity: 0,
          time: 40 * i + 600
        }, "linear");
      }
      scene.showEffect("iceball", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.4,
        opacity: 0.6
      }, {
        x: defender.x + 30,
        y: defender.y + 30,
        z: defender.z,
        scale: 0.6,
        opacity: 0.2,
        time: 200
      }, "linear", "explode");
      scene.showEffect("iceball", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.4,
        opacity: 0.6,
        time: 75
      }, {
        x: defender.x + 20,
        y: defender.y - 30,
        z: defender.z,
        scale: 0.6,
        opacity: 0.2,
        time: 275
      }, "linear", "explode");
      scene.showEffect("iceball", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.4,
        opacity: 0.6,
        time: 150
      }, {
        x: defender.x - 30,
        y: defender.y,
        z: defender.z,
        scale: 0.6,
        opacity: 0.2,
        time: 350
      }, "linear", "explode");
      scene.showEffect("iceball", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.4,
        opacity: 0.6,
        time: 225
      }, {
        x: defender.x - 10,
        y: defender.y + 10,
        z: defender.z,
        scale: 0.6,
        opacity: 0.2,
        time: 425
      }, "linear", "explode");
      scene.showEffect("iceball", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.4,
        opacity: 0.6,
        time: 300
      }, {
        x: defender.x + 10,
        y: defender.y - 10,
        z: defender.z,
        scale: 0.6,
        opacity: 0.2,
        time: 500
      }, "linear", "explode");
      scene.showEffect("iceball", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.4,
        opacity: 0.6,
        time: 375
      }, {
        x: defender.x - 20,
        y: defender.y,
        z: defender.z,
        scale: 0.6,
        opacity: 0.2,
        time: 575
      }, "linear", "explode");
      scene.showEffect("iceball", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0,
        opacity: 0.5,
        time: 550
      }, {
        scale: 4,
        opacity: 0,
        time: 750
      }, "linear");
      scene.showEffect("iceball", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0,
        opacity: 0.5,
        time: 600
      }, {
        scale: 4,
        opacity: 0,
        time: 800
      }, "linear");
      defender.delay(125);
      defender.anim({
        z: defender.behind(5),
        time: 75
      }, "swing");
      defender.anim({
        time: 75
      }, "swing");
      defender.anim({
        z: defender.behind(5),
        time: 75
      }, "swing");
      defender.anim({
        time: 75
      }, "swing");
      defender.anim({
        z: defender.behind(5),
        time: 75
      }, "swing");
      defender.anim({
        time: 75
      }, "swing");
      defender.anim({
        z: defender.behind(5),
        time: 75
      }, "swing");
      defender.anim({
        time: 150
      }, "swing");
    }},
  agility: {anim: function anim(scene, [attacker]) {
      attacker.anim({ x: attacker.x - 10, time: 200 });
      attacker.anim({ x: attacker.x + 10, time: 300 });
      attacker.anim({ x: attacker.x - 20, time: 150 });
      attacker.anim({ x: attacker.x + 20, time: 150 });
      attacker.anim({ x: attacker.x, opacity: 0, time: 1 });
      attacker.delay(550);
      attacker.anim({ x: attacker.x, time: 150 });
      scene.showEffect(attacker.sp, {
        x: attacker.x + 20,
        y: attacker.y,
        z: attacker.z,
        opacity: 0.5,
        time: 800
      }, {
        x: attacker.x - 30,
        opacity: 0,
        time: 1300
      }, "decel");
      scene.showEffect(attacker.sp, {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        opacity: 0.5,
        time: 800
      }, {
        x: attacker.x + 30,
        opacity: 0,
        time: 1200
      }, "decel");
    }},
  amnesia: {anim: function anim(scene, [attacker]) {
      scene.showEffect("wisp", {
        x: attacker.x,
        y: attacker.y + 20,
        z: attacker.z,
        scale: 0.5,
        opacity: 0.1
      }, {
        x: attacker.x,
        y: attacker.y + 20,
        z: attacker.behind(-50),
        scale: 1.5,
        opacity: 1,
        time: 400
      }, "ballistic2Under", "fade");
      scene.showEffect("wisp", {
        x: attacker.x,
        y: attacker.y + 20,
        z: attacker.z,
        scale: 0.5,
        opacity: 0.1,
        time: 200
      }, {
        x: attacker.x,
        y: attacker.y + 20,
        z: attacker.behind(-50),
        scale: 1.5,
        opacity: 1,
        time: 600
      }, "ballistic2Under", "fade");
    }},
  ancientpower: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("rock3", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.2,
        opacity: 0.2
      }, {
        x: defender.x + 50,
        y: defender.y + 20,
        z: defender.behind(20),
        opacity: 0.6,
        scale: 0.7,
        time: 400
      }, "linear", "explode");
      scene.showEffect("rock3", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.2,
        opacity: 0.2
      }, {
        x: defender.x + 40,
        y: defender.y - 30,
        z: defender.behind(20),
        opacity: 0.6,
        scale: 0.7,
        time: 400
      }, "linear", "explode");
      scene.showEffect("rock3", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.2,
        opacity: 0.7
      }, {
        x: defender.x - 50,
        y: defender.y + 5,
        z: defender.behind(20),
        opacity: 0.6,
        scale: 0.8,
        time: 400
      }, "linear", "explode");
    }},
  attract: {anim: function anim(scene, [attacker, defender]) {
      SD_OUTRAS.shake.anim(scene, [attacker]);
      scene.showEffect("heart", {
        x: defender.x + 20,
        y: defender.y + 20,
        z: defender.z,
        scale: 0.5,
        opacity: 0.5,
        time: 0
      }, {
        scale: 1,
        opacity: 1,
        time: 300
      }, "ballistic2Under", "fade");
      scene.showEffect("heart", {
        x: defender.x - 20,
        y: defender.y + 10,
        z: defender.z,
        scale: 0.5,
        opacity: 0.5,
        time: 100
      }, {
        scale: 1,
        opacity: 1,
        time: 400
      }, "ballistic2Under", "fade");
      scene.showEffect("heart", {
        x: defender.x,
        y: defender.y + 40,
        z: defender.z,
        scale: 0.5,
        opacity: 0.5,
        time: 200
      }, {
        scale: 1,
        opacity: 1,
        time: 500
      }, "ballistic2Under", "fade");
    }},
  aurorabeam: {anim: function anim(scene, [attacker, defender]) {
      let xstep = (defender.x - attacker.x) / 5;
      let ystep = (defender.y - attacker.y) / 5;
      let zstep = (defender.z - attacker.z) / 5;
      for (let i = 0; i < 4; i++) {
        scene.showEffect("icicle", {
          x: attacker.x + xstep * (i + 1),
          y: attacker.y + ystep * (i + 1),
          z: attacker.z + zstep * (i + 1),
          scale: 1.5,
          opacity: 0.6,
          time: 40 * i
        }, {
          opacity: 0,
          time: 40 * i + 600
        }, "linear");
      }
      scene.showEffect("iceball", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0,
        opacity: 1,
        time: 100
      }, {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 2,
        opacity: 0,
        time: 400
      }, "linear");
      scene.showEffect("iceball", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0,
        opacity: 1,
        time: 300
      }, {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 2,
        opacity: 0,
        time: 600
      }, "linear");
      scene.showEffect("wisp", {
        x: defender.x - 30,
        y: defender.y,
        z: defender.z,
        scale: 2,
        opacity: 0.5,
        time: 200
      }, {
        scale: 4,
        opacity: 0,
        time: 600
      }, "linear", "fade");
      scene.showEffect("wisp", {
        x: defender.x,
        y: defender.y - 30,
        z: defender.z,
        scale: 2,
        opacity: 0.5,
        time: 300
      }, {
        scale: 4,
        opacity: 0,
        time: 650
      }, "linear", "fade");
      scene.showEffect("wisp", {
        x: defender.x + 15,
        y: defender.y,
        z: defender.z,
        scale: 2,
        opacity: 0.5,
        time: 400
      }, {
        scale: 4,
        opacity: 0,
        time: 700
      }, "linear", "fade");
    }},
  barrage: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("iceball", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.1,
        opacity: 0
      }, {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0.7,
        opacity: 1,
        time: 400
      }, "ballistic", "explode");
      scene.showEffect("iceball", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.1,
        opacity: 0,
        time: 100
      }, {
        x: defender.x + 40,
        y: defender.y - 20,
        z: defender.z,
        scale: 0.7,
        opacity: 1,
        time: 500
      }, "ballistic", "explode");
      scene.showEffect("iceball", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.1,
        opacity: 0,
        time: 200
      }, {
        x: defender.x - 30,
        y: defender.y - 10,
        z: defender.z,
        scale: 0.7,
        opacity: 1,
        time: 600
      }, "ballistic", "explode");
    }},
  barrier: {anim: function anim(scene, [attacker]) {
      scene.showEffect("electroball", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 2,
        opacity: 0.1,
        time: 0
      }, {
        scale: 0,
        opacity: 0.5,
        time: 600
      }, "linear");
    }},
  beatup: {anim: function anim(scene, [attacker, defender]) {
      attacker.anim({
        x: defender.x,
        y: defender.y + 80,
        z: defender.behind(-30),
        time: 400
      }, "ballistic");
      attacker.anim({
        x: defender.x,
        y: defender.y + 5,
        z: defender.z,
        time: 100
      });
      attacker.anim({
        time: 500
      }, "ballistic2Back");
      defender.delay(450);
      defender.anim({
        z: defender.behind(20),
        time: 100
      }, "swing");
      defender.anim({
        time: 300
      }, "swing");
      scene.wait(500);
    }},
  bind: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("iceball", {
        x: defender.x,
        y: defender.y + 15,
        z: defender.z,
        scale: 0.7,
        xscale: 2,
        opacity: 0.3,
        time: 500
      }, {
        scale: 0.4,
        xscale: 1,
        opacity: 0.1,
        time: 1100
      }, "decel", "fade");
      scene.showEffect("iceball", {
        x: defender.x,
        y: defender.y - 5,
        z: defender.z,
        scale: 0.7,
        xscale: 2,
        opacity: 0.3,
        time: 550
      }, {
        scale: 0.4,
        xscale: 1,
        opacity: 0.1,
        time: 1150
      }, "decel", "fade");
      scene.showEffect("iceball", {
        x: defender.x,
        y: defender.y - 20,
        z: defender.z,
        scale: 0.7,
        xscale: 2,
        opacity: 0.3,
        time: 600
      }, {
        scale: 0.4,
        xscale: 1,
        opacity: 0.1,
        time: 1200
      }, "decel", "fade");
      attacker.anim({
        x: defender.leftof(-30),
        y: defender.y + 80,
        z: defender.behind(-30),
        time: 400
      }, "ballistic");
      attacker.anim({
        x: defender.leftof(30),
        y: defender.y + 5,
        z: defender.z,
        time: 100
      });
      attacker.anim({
        x: defender.leftof(30),
        y: defender.y + 80,
        z: defender.behind(-30),
        time: 200
      }, "ballisticUp");
      attacker.anim({
        x: defender.leftof(-30),
        y: defender.y + 5,
        z: defender.z,
        time: 100
      });
      attacker.anim({
        time: 500
      }, "ballistic2Back");
      defender.delay(450);
      defender.anim({
        y: defender.y + 15,
        z: defender.behind(10),
        yscale: 1.3,
        time: 200
      }, "swing");
      defender.anim({
        time: 200
      }, "swing");
      defender.delay(25);
      defender.anim({
        x: defender.leftof(-10),
        y: defender.y + 15,
        z: defender.behind(5),
        yscale: 1.3,
        time: 200
      }, "swing");
      defender.anim({
        time: 200
      }, "swing");
    }},
  bite: {anim: function anim(scene, [attacker, defender]) {
      SD_OUTRAS.bite.anim(scene, [attacker, defender]);
      SD_OUTRAS.contactattack.anim(scene, [attacker, defender]);
    }},
  blizzard: {anim: function anim(scene, [attacker, defender]) {
      scene.backgroundEffect("#009AA4", 700, 0.5);
      scene.showEffect("icicle", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.6,
        opacity: 0.6
      }, {
        x: defender.x + 60,
        y: defender.y + 40,
        z: defender.z,
        scale: 2,
        opacity: 0.3
      }, "accel", "explode");
      scene.showEffect("icicle", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.6,
        opacity: 0.6,
        time: 75
      }, {
        x: defender.x + 40,
        y: defender.y - 40,
        z: defender.z,
        scale: 2,
        opacity: 0.3
      }, "accel", "explode");
      scene.showEffect("icicle", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.6,
        opacity: 0.6,
        time: 150
      }, {
        x: defender.x - 60,
        y: defender.y,
        z: defender.z,
        scale: 2,
        opacity: 0.3
      }, "accel", "explode");
      scene.showEffect("icicle", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.6,
        opacity: 0.6,
        time: 225
      }, {
        x: defender.x - 20,
        y: defender.y + 10,
        z: defender.z,
        scale: 2,
        opacity: 0.3
      }, "accel", "explode");
    }},
  bodyslam: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("wisp", {
        x: defender.x,
        y: defender.y - 30,
        z: defender.z,
        scale: 1,
        time: 500
      }, {
        x: defender.x + 70,
        scale: 0.8,
        opacity: 0.3,
        time: 800
      }, "linear", "fade");
      scene.showEffect("wisp", {
        x: defender.x,
        y: defender.y - 30,
        z: defender.z,
        scale: 1,
        time: 500
      }, {
        x: defender.x - 70,
        scale: 0.8,
        opacity: 0.3,
        time: 800
      }, "linear", "fade");
      attacker.anim({
        x: defender.x,
        y: defender.y + 80,
        z: defender.behind(-30),
        time: 400
      }, "ballistic");
      attacker.anim({
        x: defender.x,
        y: defender.y + 5,
        z: defender.z,
        time: 100
      });
      attacker.anim({
        time: 600
      }, "ballistic2Back");
      defender.delay(450);
      defender.anim({
        y: defender.y - 30,
        z: defender.behind(20),
        yscale: 0.5,
        time: 200
      }, "swing");
      defender.anim({
        time: 300
      }, "swing");
    }},
  boneclub: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("wisp", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0,
        opacity: 1,
        time: 400
      }, {
        x: defender.leftof(-20),
        y: defender.y,
        z: defender.behind(20),
        scale: 3,
        opacity: 0,
        time: 700
      }, "linear");
      scene.showEffect("wisp", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0,
        opacity: 1,
        time: 500
      }, {
        x: defender.leftof(-20),
        y: defender.y,
        z: defender.behind(20),
        scale: 3,
        opacity: 0,
        time: 800
      }, "linear");
      scene.showEffect("bone", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 1,
        opacity: 1,
        time: 400
      }, {
        x: defender.leftof(-20),
        y: defender.y,
        z: defender.behind(20),
        scale: 2,
        opacity: 0,
        time: 800
      }, "linear");
      SD_OUTRAS.contactattack.anim(scene, [attacker, defender]);
    }},
  bonemerang: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("bone", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        opacity: 0
      }, {
        z: defender.behind(20),
        opacity: 1,
        time: 300
      }, "ballistic2");
      scene.showEffect("bone", {
        x: defender.x,
        y: defender.y,
        z: defender.behind(20),
        opacity: 1,
        time: 300
      }, {
        z: attacker.z,
        opacity: 0,
        time: 600
      }, "ballistic2Under", "fade");
    }},
  bubble: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("iceball", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.5,
        opacity: 0.7
      }, {
        x: defender.x,
        y: defender.y,
        z: defender.behind(0),
        opacity: 0.6,
        time: 400
      }, "decel", "explode");
      scene.showEffect("iceball", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.5,
        opacity: 0.7,
        time: 100
      }, {
        x: defender.x + 20,
        y: defender.y - 10,
        z: defender.behind(0),
        opacity: 0.6,
        time: 500
      }, "decel", "explode");
      scene.showEffect("iceball", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.5,
        opacity: 0.7,
        time: 200
      }, {
        x: defender.x - 20,
        y: defender.y + 10,
        z: defender.behind(0),
        opacity: 0.6,
        time: 600
      }, "decel", "explode");
      scene.showEffect("iceball", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.5,
        opacity: 0.7,
        time: 300
      }, {
        x: defender.x,
        y: defender.y - 5,
        z: defender.behind(0),
        opacity: 0.6,
        time: 700
      }, "decel", "explode");
    }},
  bubblebeam: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("iceball", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.5,
        opacity: 0.7
      }, {
        x: defender.x,
        y: defender.y,
        z: defender.behind(0),
        opacity: 0.6,
        time: 400
      }, "decel", "explode");
      scene.showEffect("iceball", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.5,
        opacity: 0.7,
        time: 100
      }, {
        x: defender.x + 20,
        y: defender.y - 10,
        z: defender.behind(0),
        opacity: 0.6,
        time: 500
      }, "decel", "explode");
      scene.showEffect("iceball", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.5,
        opacity: 0.7,
        time: 200
      }, {
        x: defender.x - 20,
        y: defender.y + 10,
        z: defender.behind(0),
        opacity: 0.6,
        time: 600
      }, "decel", "explode");
      scene.showEffect("iceball", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.5,
        opacity: 0.7,
        time: 300
      }, {
        x: defender.x,
        y: defender.y - 5,
        z: defender.behind(0),
        opacity: 0.6,
        time: 700
      }, "decel", "explode");
    }},
  charm: {anim: function anim(scene, [attacker, defender]) {
      SD_OUTRAS.shake.anim(scene, [attacker]);
      scene.showEffect("heart", {
        x: defender.x + 20,
        y: defender.y + 20,
        z: defender.z,
        scale: 0.5,
        opacity: 0.5,
        time: 0
      }, {
        scale: 1,
        opacity: 1,
        time: 300
      }, "ballistic2Under", "fade");
      scene.showEffect("heart", {
        x: defender.x - 20,
        y: defender.y + 10,
        z: defender.z,
        scale: 0.5,
        opacity: 0.5,
        time: 100
      }, {
        scale: 1,
        opacity: 1,
        time: 400
      }, "ballistic2Under", "fade");
      scene.showEffect("heart", {
        x: defender.x,
        y: defender.y + 40,
        z: defender.z,
        scale: 0.5,
        opacity: 0.5,
        time: 200
      }, {
        scale: 1,
        opacity: 1,
        time: 500
      }, "ballistic2Under", "fade");
    }},
  clamp: {anim: function anim(scene, [attacker, defender]) {
      attacker.anim({
        x: defender.x,
        y: defender.y + 80,
        z: defender.behind(-30),
        time: 400
      }, "ballistic");
      attacker.anim({
        x: defender.x,
        y: defender.y + 5,
        z: defender.z,
        time: 100
      });
      attacker.anim({
        time: 500
      }, "ballistic2Back");
      defender.delay(450);
      defender.anim({
        z: defender.behind(20),
        time: 100
      }, "swing");
      defender.anim({
        time: 300
      }, "swing");
      scene.wait(500);
    }},
  cometpunch: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("wisp", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0,
        opacity: 1,
        time: 400
      }, {
        x: defender.leftof(-20),
        y: defender.y,
        z: defender.behind(20),
        scale: 3,
        opacity: 0,
        time: 700
      }, "linear");
      scene.showEffect("wisp", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0,
        opacity: 1,
        time: 500
      }, {
        x: defender.leftof(-20),
        y: defender.y,
        z: defender.behind(20),
        scale: 3,
        opacity: 0,
        time: 800
      }, "linear");
      scene.showEffect("fist", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 1,
        opacity: 1,
        time: 400
      }, {
        x: defender.leftof(-20),
        y: defender.y,
        z: defender.behind(20),
        scale: 2,
        opacity: 0,
        time: 800
      }, "linear");
      attacker.anim({
        x: defender.leftof(20),
        y: defender.y,
        z: defender.behind(-20),
        time: 400
      }, "ballistic2Under");
      attacker.anim({
        x: defender.x,
        y: defender.y,
        z: defender.z,
        time: 50
      });
      attacker.anim({
        time: 500
      }, "ballistic2");
      defender.delay(425);
      defender.anim({
        x: defender.leftof(-15),
        y: defender.y,
        z: defender.behind(15),
        time: 50
      }, "swing");
      defender.anim({
        time: 300
      }, "swing");
    }},
  confuseray: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("electroball", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.15,
        opacity: 0
      }, {
        x: defender.leftof(40),
        y: defender.y + 15,
        z: defender.z,
        scale: 0.3,
        opacity: 0.7,
        time: 500
      }, "decel", "fade");
      if (defender.isMissedPokemon) return;
      scene.showEffect("electroball", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.15,
        opacity: 0
      }, {
        x: defender.leftof(40),
        y: defender.y + 15,
        z: defender.z,
        scale: 0.3,
        opacity: 0.7,
        time: 500
      }, "decel", "fade");
      scene.showEffect("electroball", {
        x: defender.leftof(40),
        y: defender.y + 15,
        z: defender.z,
        scale: 0.3,
        opacity: 0.7,
        time: 500
      }, {
        x: defender.leftof(-40),
        y: defender.y,
        z: defender.z,
        scale: 0.2,
        opacity: 1,
        time: 700
      }, "swing", "fade");
      scene.showEffect("electroball", {
        x: defender.leftof(-40),
        y: defender.y,
        z: defender.z,
        scale: 0.1,
        opacity: 0,
        time: 700
      }, {
        x: defender.leftof(10),
        y: defender.y - 15,
        z: defender.z,
        scale: 0.5,
        opacity: 1,
        time: 900
      }, "swing", "explode");
    }},
  confusion: {anim: function anim(scene, [attacker, defender]) {
      scene.backgroundEffect("#AA44BB", 250, 0.6);
      scene.backgroundEffect("#AA44FF", 250, 0.6, 400);
      defender.anim({
        scale: 1.2,
        time: 100
      });
      defender.anim({
        scale: 1,
        time: 100
      });
      defender.anim({
        scale: 1.4,
        time: 150
      });
      defender.anim({
        scale: 1,
        time: 150
      });
      scene.wait(700);
    }},
  constrict: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("iceball", {
        x: defender.x,
        y: defender.y + 15,
        z: defender.z,
        scale: 0.7,
        xscale: 2,
        opacity: 0.3,
        time: 500
      }, {
        scale: 0.4,
        xscale: 1,
        opacity: 0.1,
        time: 1100
      }, "decel", "fade");
      scene.showEffect("iceball", {
        x: defender.x,
        y: defender.y - 5,
        z: defender.z,
        scale: 0.7,
        xscale: 2,
        opacity: 0.3,
        time: 550
      }, {
        scale: 0.4,
        xscale: 1,
        opacity: 0.1,
        time: 1150
      }, "decel", "fade");
      scene.showEffect("iceball", {
        x: defender.x,
        y: defender.y - 20,
        z: defender.z,
        scale: 0.7,
        xscale: 2,
        opacity: 0.3,
        time: 600
      }, {
        scale: 0.4,
        xscale: 1,
        opacity: 0.1,
        time: 1200
      }, "decel", "fade");
      attacker.anim({
        x: defender.leftof(-30),
        y: defender.y + 80,
        z: defender.behind(-30),
        time: 400
      }, "ballistic");
      attacker.anim({
        x: defender.leftof(30),
        y: defender.y + 5,
        z: defender.z,
        time: 100
      });
      attacker.anim({
        x: defender.leftof(30),
        y: defender.y + 80,
        z: defender.behind(-30),
        time: 200
      }, "ballisticUp");
      attacker.anim({
        x: defender.leftof(-30),
        y: defender.y + 5,
        z: defender.z,
        time: 100
      });
      attacker.anim({
        time: 500
      }, "ballistic2Back");
      defender.delay(450);
      defender.anim({
        y: defender.y + 15,
        z: defender.behind(10),
        yscale: 1.3,
        time: 200
      }, "swing");
      defender.anim({
        time: 200
      }, "swing");
      defender.delay(25);
      defender.anim({
        x: defender.leftof(-10),
        y: defender.y + 15,
        z: defender.behind(5),
        yscale: 1.3,
        time: 200
      }, "swing");
      defender.anim({
        time: 200
      }, "swing");
    }},
  conversion: {anim: function anim(scene, [attacker]) {
      scene.showEffect(attacker.sp, {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 2,
        opacity: 0.3
      }, {
        scale: 1,
        opacity: 0,
        time: 600
      }, "decel");
    }},
  cottonspore: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("purplewisp", {
        x: defender.x + 10,
        y: defender.y + 90,
        z: defender.z,
        opacity: 0,
        scale: 0.4
      }, {
        y: defender.y - 5,
        opacity: 1,
        time: 500
      }, "decel", "fade");
      scene.showEffect("purplewisp", {
        x: defender.x + 30,
        y: defender.y + 90,
        z: defender.z,
        opacity: 0,
        scale: 0.4,
        time: 150
      }, {
        y: defender.y - 5,
        opacity: 1,
        time: 650
      }, "decel", "fade");
      scene.showEffect("purplewisp", {
        x: defender.x - 30,
        y: defender.y + 90,
        z: defender.z,
        opacity: 0,
        scale: 0.4,
        time: 300
      }, {
        y: defender.y - 5,
        opacity: 1,
        time: 800
      }, "decel", "fade");
    }},
  counter: {anim: function anim(scene, [attacker, defender]) {
      attacker.anim({
        x: defender.x,
        y: defender.y + 80,
        z: defender.behind(-30),
        time: 400
      }, "ballistic");
      attacker.anim({
        x: defender.x,
        y: defender.y + 5,
        z: defender.z,
        time: 100
      });
      attacker.anim({
        time: 500
      }, "ballistic2Back");
      defender.delay(450);
      defender.anim({
        z: defender.behind(20),
        time: 100
      }, "swing");
      defender.anim({
        time: 300
      }, "swing");
      scene.wait(500);
    }},
  crabhammer: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("waterwisp", {
        x: defender.x,
        y: defender.y + 80,
        z: defender.behind(-15),
        scale: 1.5,
        opacity: 0.8,
        time: 400
      }, {
        y: defender.y,
        z: defender.z,
        scale: 0.5,
        opacity: 1,
        time: 500
      }, "linear", "explode");
      scene.showEffect("waterwisp", {
        x: defender.x,
        y: defender.y - 25,
        z: defender.z,
        scale: 1,
        time: 500
      }, {
        x: defender.x + 50,
        scale: 0.6,
        opacity: 0.3,
        time: 800
      }, "linear", "fade");
      scene.showEffect("waterwisp", {
        x: defender.x,
        y: defender.y - 25,
        z: defender.z,
        scale: 1,
        time: 500
      }, {
        x: defender.x - 50,
        scale: 0.6,
        opacity: 0.3,
        time: 800
      }, "linear", "fade");
      SD_OUTRAS.contactattack.anim(scene, [attacker, defender]);
    }},
  crosschop: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("rightslash", {
        x: defender.x - 10,
        y: defender.y,
        z: defender.z,
        scale: 0,
        opacity: 1,
        time: 425
      }, {
        scale: 3,
        opacity: 0,
        time: 800
      }, "linear", "fade");
      scene.showEffect("leftslash", {
        x: defender.x + 10,
        y: defender.y,
        z: defender.z,
        scale: 0,
        opacity: 1,
        time: 425
      }, {
        scale: 3,
        opacity: 0,
        time: 800
      }, "linear", "fade");
      scene.showEffect("leftchop", {
        x: defender.x + 60,
        y: defender.y + 70,
        z: defender.z,
        scale: 0.75,
        opacity: 1,
        time: 400
      }, {
        x: defender.x - 60,
        y: defender.y - 70,
        scale: 0.5,
        opacity: 0,
        time: 600
      }, "linear", "fade");
      scene.showEffect("rightchop", {
        x: defender.x - 60,
        y: defender.y + 70,
        z: defender.z,
        scale: 0.75,
        opacity: 1,
        time: 400
      }, {
        x: defender.x + 60,
        y: defender.y - 70,
        scale: 0.5,
        opacity: 0,
        time: 600
      }, "linear", "fade");
      SD_OUTRAS.contactattack.anim(scene, [attacker, defender]);
    }},
  crunch: {anim: function anim(scene, [attacker, defender]) {
      scene.backgroundEffect("#000000", 800, 0.3);
      scene.showEffect("topbite", {
        x: defender.x,
        y: defender.y + 70,
        z: defender.z,
        scale: 0.65,
        opacity: 0,
        time: 370
      }, {
        y: defender.y + 20,
        opacity: 1,
        time: 500
      }, "linear", "explode");
      scene.showEffect("bottombite", {
        x: defender.x,
        y: defender.y - 70,
        z: defender.z,
        scale: 0.65,
        opacity: 0,
        time: 370
      }, {
        y: defender.y - 20,
        opacity: 1,
        time: 500
      }, "linear", "explode");
      SD_OUTRAS.contactattack.anim(scene, [attacker, defender]);
    }},
  curse: {anim: function anim(scene, [attacker]) {
      scene.showEffect("wisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 2,
        opacity: 0.2,
        time: 0
      }, {
        scale: 0,
        opacity: 1,
        time: 300
      }, "linear");
      scene.showEffect("wisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 2,
        opacity: 0.2,
        time: 200
      }, {
        scale: 0,
        opacity: 1,
        time: 500
      }, "linear");
    }},
  defensecurl: {anim: function anim(scene, [attacker]) {
      scene.showEffect("wisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 2,
        opacity: 0.2,
        time: 0
      }, {
        scale: 0,
        opacity: 1,
        time: 300
      }, "linear");
      scene.showEffect("wisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 2,
        opacity: 0.2,
        time: 200
      }, {
        scale: 0,
        opacity: 1,
        time: 500
      }, "linear");
    }},
  detect: {anim: function anim(scene, [attacker]) {
      scene.showEffect("wisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 2,
        opacity: 0.2,
        time: 0
      }, {
        scale: 0,
        opacity: 1,
        time: 300
      }, "linear");
      scene.showEffect("wisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 2,
        opacity: 0.2,
        time: 200
      }, {
        scale: 0,
        opacity: 1,
        time: 500
      }, "linear");
    }},
  dig: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("wisp", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0,
        opacity: 0.5,
        time: 350
      }, {
        scale: 3,
        opacity: 0,
        time: 500
      }, "linear");
      scene.showEffect("wisp", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0,
        opacity: 0.5,
        time: 450
      }, {
        scale: 3,
        opacity: 0,
        time: 600
      }, "linear");
      attacker.anim({
        y: attacker.y - 80,
        opacity: 0,
        time: 100
      }, "linear");
      attacker.anim({
        x: defender.x,
        y: defender.y - 80,
        z: defender.z,
        opacity: 0,
        time: 1
      }, "linear");
      attacker.anim({
        x: defender.x,
        y: defender.y + 10,
        z: defender.z,
        opacity: 1,
        time: 350
      }, "linear");
      attacker.anim({
        x: defender.x,
        y: defender.y - 80,
        z: defender.z,
        opacity: 0,
        time: 300
      }, "linear");
      attacker.anim({
        x: attacker.x,
        y: attacker.y - 80,
        z: defender.z,
        opacity: 0,
        time: 1
      }, "linear");
      attacker.anim({
        time: 300,
        opacity: 1
      }, "linear");
      defender.delay(380);
      defender.anim({
        z: defender.behind(20),
        time: 100
      }, "swing");
      defender.anim({
        time: 300
      }, "swing");
    }},
  disable: {anim: function anim(scene, [attacker, defender]) {
      scene.backgroundEffect("#AA0000", 250, 0.3);
      scene.backgroundEffect("#000000", 250, 0.2, 400);
      scene.showEffect("stare", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 1,
        yscale: 0,
        opacity: 1
      }, {
        yscale: 1,
        time: 700
      }, "decel", "fade");
    }},
  dizzypunch: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("wisp", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0,
        opacity: 1,
        time: 400
      }, {
        x: defender.leftof(-20),
        y: defender.y,
        z: defender.behind(20),
        scale: 3,
        opacity: 0,
        time: 700
      }, "linear");
      scene.showEffect("wisp", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0,
        opacity: 1,
        time: 500
      }, {
        x: defender.leftof(-20),
        y: defender.y,
        z: defender.behind(20),
        scale: 3,
        opacity: 0,
        time: 800
      }, "linear");
      scene.showEffect("fist", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 1,
        opacity: 1,
        time: 400
      }, {
        x: defender.leftof(-20),
        y: defender.y,
        z: defender.behind(20),
        scale: 2,
        opacity: 0,
        time: 800
      }, "linear");
      attacker.anim({
        x: defender.leftof(20),
        y: defender.y,
        z: defender.behind(-20),
        time: 400
      }, "ballistic2Under");
      attacker.anim({
        x: defender.x,
        y: defender.y,
        z: defender.z,
        time: 50
      });
      attacker.anim({
        time: 500
      }, "ballistic2");
      defender.delay(425);
      defender.anim({
        x: defender.leftof(-15),
        y: defender.y,
        z: defender.behind(15),
        time: 50
      }, "swing");
      defender.anim({
        time: 300
      }, "swing");
    }},
  doubleedge: {anim: function anim(scene, [attacker, defender]) {
      scene.backgroundEffect("#000000", 700, 0.2);
      scene.showEffect("impact", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0,
        opacity: 0.4,
        time: 300
      }, {
        scale: 4,
        opacity: 0,
        time: 600
      }, "linear");
      scene.showEffect("impact", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0,
        opacity: 0.4,
        time: 500
      }, {
        scale: 4,
        opacity: 0,
        time: 800
      }, "linear");
      scene.showEffect(attacker.sp, {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        opacity: 0.3,
        time: 50
      }, {
        x: defender.x,
        y: defender.y,
        z: defender.behind(-5),
        time: 350
      }, "accel", "fade");
      scene.showEffect(attacker.sp, {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        opacity: 0.3,
        time: 100
      }, {
        x: defender.x,
        y: defender.y,
        z: defender.behind(-5),
        time: 400
      }, "accel", "fade");
      attacker.anim({
        x: defender.x,
        y: defender.y,
        z: defender.behind(-5),
        time: 300
      }, "accel");
      attacker.anim({
        time: 500
      }, "ballistic2Back");
      defender.delay(280);
      defender.anim({
        z: defender.behind(20),
        time: 100
      }, "swing");
      defender.anim({
        time: 300
      }, "swing");
    }},
  doublekick: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("foot", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 1,
        opacity: 1,
        time: 450
      }, {
        x: defender.leftof(20),
        y: defender.y,
        z: defender.behind(20),
        scale: 2,
        opacity: 0,
        time: 750
      }, "linear");
      scene.showEffect("foot", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 1,
        opacity: 1,
        time: 750
      }, {
        x: defender.leftof(-20),
        y: defender.y,
        z: defender.behind(20),
        scale: 2,
        opacity: 0,
        time: 1050
      }, "linear");
      SD_OUTRAS.xattack.anim(scene, [attacker, defender]);
    }},
  doubleslap: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("rightchop", {
        x: defender.x + 30,
        y: defender.y,
        z: defender.behind(-10),
        scale: 0.6,
        opacity: 1,
        time: 400
      }, {
        x: defender.x - 10,
        y: defender.y - 10,
        xscale: 0,
        opacity: 0.5,
        time: 512.5
      }, "linear", "fade");
      scene.showEffect("leftchop", {
        x: defender.x,
        y: defender.y - 10,
        z: defender.behind(-10),
        scale: 0.6,
        xscale: 0,
        opacity: 1,
        time: 512.5
      }, {
        x: defender.x - 30,
        y: defender.y,
        xscale: 0.6,
        opacity: 0,
        time: 625
      }, "linear", "fade");
      SD_OUTRAS.contactattack.anim(scene, [attacker, defender]);
    }},
  doubleteam: {anim: function anim(scene, [attacker, defender]) {
      SD_OUTRAS.shake.anim(scene, [attacker, defender]);
      scene.showEffect(attacker.sp, {
        x: defender.x,
        y: attacker.y,
        z: attacker.z,
        opacity: 0.3
      }, {
        x: defender.x - 60,
        y: defender.y,
        z: defender.z,
        opacity: 0,
        time: 500
      }, "decel");
      scene.showEffect(attacker.sp, {
        x: defender.x,
        y: attacker.y,
        z: attacker.z,
        opacity: 0.3
      }, {
        x: defender.x + 60,
        y: defender.y,
        z: defender.z,
        opacity: 0,
        time: 500
      }, "decel");
    }},
  dragonbreath: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("purplewisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.1,
        opacity: 0.5
      }, {
        x: defender.x,
        y: defender.y,
        z: defender.behind(40),
        scale: 1,
        opacity: 0.2
      }, "decel");
      scene.showEffect("purplewisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.1,
        opacity: 0.5,
        time: 50
      }, {
        x: defender.x,
        y: defender.y,
        z: defender.behind(40),
        scale: 1,
        opacity: 0.2
      }, "decel");
      scene.showEffect("purplewisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.1,
        opacity: 0.5,
        time: 100
      }, {
        x: defender.x,
        y: defender.y,
        z: defender.behind(40),
        scale: 1,
        opacity: 0.2
      }, "decel");
    }},
  dragonclaw: {anim: function anim(scene, [attacker, defender]) {
      attacker.anim({
        x: defender.leftof(-30),
        y: defender.y + 80,
        z: defender.behind(-30),
        time: 400
      }, "ballistic");
      attacker.anim({
        x: defender.leftof(30),
        y: defender.y + 5,
        z: defender.z,
        time: 100
      });
      attacker.anim({
        x: defender.leftof(30),
        y: defender.y + 80,
        z: defender.behind(-30),
        time: 200
      }, "ballisticUp");
      attacker.anim({
        x: defender.leftof(-30),
        y: defender.y + 5,
        z: defender.z,
        time: 100
      });
      attacker.anim({
        time: 500
      }, "ballistic2Back");
      defender.delay(450);
      defender.anim({
        z: defender.behind(20),
        time: 100
      }, "swing");
      defender.anim({
        time: 200
      }, "swing");
      defender.anim({
        z: defender.behind(20),
        time: 100
      }, "swing");
      defender.anim({
        time: 300
      }, "swing");
      scene.showEffect("leftclaw", {
        x: defender.x - 20,
        y: defender.y + 20,
        z: defender.z,
        scale: 0,
        opacity: 1,
        time: 400
      }, {
        x: defender.x - 20,
        y: defender.y + 20,
        z: defender.z,
        scale: 3,
        opacity: 0,
        time: 700
      }, "linear", "fade");
      scene.showEffect("leftclaw", {
        x: defender.x - 20,
        y: defender.y - 20,
        z: defender.z,
        scale: 0,
        opacity: 1,
        time: 400
      }, {
        x: defender.x - 20,
        y: defender.y - 20,
        z: defender.z,
        scale: 3,
        opacity: 0,
        time: 700
      }, "linear", "fade");
      scene.showEffect("rightclaw", {
        x: defender.x + 20,
        y: defender.y + 20,
        z: defender.z,
        scale: 0,
        opacity: 1,
        time: 700
      }, {
        x: defender.x + 20,
        y: defender.y + 20,
        z: defender.z,
        scale: 3,
        opacity: 0,
        time: 1e3
      }, "linear", "fade");
      scene.showEffect("rightclaw", {
        x: defender.x + 20,
        y: defender.y - 20,
        z: defender.z,
        scale: 0,
        opacity: 1,
        time: 700
      }, {
        x: defender.x + 20,
        y: defender.y - 20,
        z: defender.z,
        scale: 3,
        opacity: 0,
        time: 1e3
      }, "linear", "fade");
    }},
  dragonrage: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("purplewisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.1,
        opacity: 0.5
      }, {
        x: defender.x,
        y: defender.y,
        z: defender.behind(40),
        scale: 1,
        opacity: 0.2
      }, "decel");
      scene.showEffect("purplewisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.1,
        opacity: 0.5,
        time: 50
      }, {
        x: defender.x,
        y: defender.y,
        z: defender.behind(40),
        scale: 1,
        opacity: 0.2
      }, "decel");
      scene.showEffect("purplewisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.1,
        opacity: 0.5,
        time: 100
      }, {
        x: defender.x,
        y: defender.y,
        z: defender.behind(40),
        scale: 1,
        opacity: 0.2
      }, "decel");
    }},
  dreameater: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("mistball", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0.6,
        opacity: 0.6,
        time: 0
      }, {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        time: 500,
        opacity: 0
      }, "ballistic2");
      scene.showEffect("mistball", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0.6,
        opacity: 0.6,
        time: 50
      }, {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        time: 550,
        opacity: 0
      }, "linear");
      scene.showEffect("mistball", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0.6,
        opacity: 0.6,
        time: 100
      }, {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        time: 600,
        opacity: 0
      }, "ballistic2Under");
    }},
  drillpeck: {anim: function anim(scene, [attacker, defender]) {
      attacker.anim({
        x: defender.x,
        y: defender.y + 80,
        z: defender.behind(-30),
        time: 400
      }, "ballistic");
      attacker.anim({
        x: defender.x,
        y: defender.y + 5,
        z: defender.z,
        time: 100
      });
      attacker.anim({
        time: 500
      }, "ballistic2Back");
      defender.delay(450);
      defender.anim({
        z: defender.behind(20),
        time: 100
      }, "swing");
      defender.anim({
        time: 300
      }, "swing");
      scene.wait(500);
    }},
  dynamicpunch: {anim: function anim(scene, [attacker, defender]) {
      scene.backgroundEffect("#000000", 700, 0.3);
      scene.showEffect("fireball", {
        x: defender.x + 40,
        y: defender.y,
        z: defender.z,
        scale: 0,
        opacity: 0.6,
        time: 350
      }, {
        scale: 7,
        opacity: 0
      }, "decel");
      scene.showEffect("fireball", {
        x: defender.x - 40,
        y: defender.y - 20,
        z: defender.z,
        scale: 0,
        opacity: 0.6,
        time: 500
      }, {
        scale: 7,
        opacity: 0
      }, "decel");
      scene.showEffect("fireball", {
        x: defender.x + 10,
        y: defender.y + 20,
        z: defender.z,
        scale: 0,
        opacity: 0.6,
        time: 650
      }, {
        scale: 7,
        opacity: 0
      }, "decel");
      SD_OUTRAS.punchattack.anim(scene, [attacker, defender]);
    }},
  earthquake: {anim: function anim(scene, [attacker, ...defenders]) {
      scene.$bg.animate({
        top: -90,
        bottom: 0
      }, 75).animate({
        top: -100,
        bottom: -10
      }, 100).animate({
        top: -90,
        bottom: 0
      }, 100).animate({
        top: -95,
        bottom: -5
      }, 100).animate({
        top: -90,
        bottom: 0
      }, 100).animate({
        top: -95,
        bottom: -5
      }, 100).animate({
        top: -90,
        bottom: 0
      }, 100).animate({
        top: -92,
        bottom: -2
      }, 100).animate({
        top: -90,
        bottom: 0
      }, 100).animate({
        top: -92,
        bottom: -2
      }, 100).animate({
        top: -90,
        bottom: 0
      }, 100);
      attacker.anim({
        y: attacker.y - 10,
        yscale: 1,
        time: 75
      });
      attacker.anim({
        y: attacker.y + 10,
        yscale: 0.9,
        time: 100
      });
      attacker.anim({
        y: attacker.y - 7,
        yscale: 1,
        time: 100
      });
      attacker.anim({
        y: attacker.y + 7,
        time: 100
      });
      attacker.anim({
        y: attacker.y - 7,
        time: 100
      });
      attacker.anim({
        y: attacker.y + 7,
        time: 100
      });
      attacker.anim({
        y: attacker.y - 7,
        time: 100
      });
      attacker.anim({
        y: attacker.y + 7,
        time: 100
      });
      attacker.anim({
        y: attacker.y - 2,
        time: 100
      });
      attacker.anim({
        y: attacker.y + 2,
        time: 100
      });
      attacker.anim({
        y: attacker.y,
        time: 100
      });
      for (const defender of defenders) {
        defender.anim({
          y: defender.y - 10,
          time: 75
        });
        defender.anim({
          y: defender.y + 10,
          time: 100
        });
        defender.anim({
          y: defender.y - 7,
          time: 100
        });
        defender.anim({
          y: defender.y + 7,
          time: 100
        });
        defender.anim({
          y: defender.y - 7,
          time: 100
        });
        defender.anim({
          y: defender.y + 7,
          time: 100
        });
        defender.anim({
          y: defender.y - 7,
          time: 100
        });
        defender.anim({
          y: defender.y + 7,
          time: 100
        });
        defender.anim({
          y: defender.y - 2,
          time: 100
        });
        defender.anim({
          y: defender.y + 2,
          time: 100
        });
        defender.anim({
          y: defender.y,
          time: 100
        });
        scene.showEffect("rock3", {
          x: defender.x + 5,
          y: defender.y - 35,
          z: defender.z,
          scale: 0.2,
          opacity: 1,
          time: 0
        }, {
          x: defender.x + 30,
          y: defender.y,
          scale: 0.4,
          opacity: 0,
          time: 350
        }, "ballistic");
        scene.showEffect("rock3", {
          x: defender.x - 10,
          y: defender.y - 35,
          z: defender.z,
          scale: 0.2,
          opacity: 1,
          time: 250
        }, {
          x: defender.x - 35,
          y: defender.y,
          scale: 0.3,
          opacity: 0,
          time: 600
        }, "ballistic");
        scene.showEffect("rock3", {
          x: defender.x + 40,
          y: defender.y - 35,
          z: defender.z,
          scale: 0.2,
          opacity: 1,
          time: 400
        }, {
          x: defender.x + 65,
          y: defender.y,
          scale: 0.3,
          opacity: 0,
          time: 750
        }, "ballistic2");
        scene.showEffect("rock3", {
          x: defender.x,
          y: defender.y - 35,
          z: defender.z,
          scale: 0.3,
          opacity: 1,
          time: 500
        }, {
          x: defender.x + 40,
          y: defender.y,
          scale: 0.4,
          opacity: 0,
          time: 750
        }, "ballistic");
      }
    }},
  ember: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("fireball", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 1,
        opacity: 0.7
      }, {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        opacity: 0.6,
        time: 400
      }, "decel", "explode");
      scene.showEffect("fireball", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 1,
        opacity: 0.7,
        time: 100
      }, {
        x: defender.x + 10,
        y: defender.y - 5,
        z: defender.behind(0),
        opacity: 0.6,
        time: 500
      }, "decel", "explode");
      scene.showEffect("fireball", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 1,
        opacity: 0.7,
        time: 200
      }, {
        x: defender.x - 10,
        y: defender.y + 5,
        z: defender.behind(0),
        opacity: 0.6,
        time: 600
      }, "decel", "explode");
      scene.showEffect("fireball", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 1,
        opacity: 0.7,
        time: 300
      }, {
        x: defender.x,
        y: defender.y - 5,
        z: defender.behind(0),
        opacity: 0.6,
        time: 700
      }, "decel", "explode");
    }},
  endure: {anim: function anim(scene, [attacker]) {
      scene.showEffect("wisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 2,
        opacity: 0.2,
        time: 0
      }, {
        scale: 0,
        opacity: 1,
        time: 300
      }, "linear");
      scene.showEffect("wisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 2,
        opacity: 0.2,
        time: 200
      }, {
        scale: 0,
        opacity: 1,
        time: 500
      }, "linear");
    }},
  explosion: {anim: function anim(scene, [attacker]) {
      scene.showEffect("fireball", {
        x: attacker.x + 40,
        y: attacker.y,
        z: attacker.z,
        scale: 0,
        opacity: 0.6
      }, {
        scale: 6,
        opacity: 0
      }, "decel");
      scene.showEffect("fireball", {
        x: attacker.x - 40,
        y: attacker.y - 20,
        z: attacker.z,
        scale: 0,
        opacity: 0.6,
        time: 150
      }, {
        scale: 6,
        opacity: 0
      }, "decel");
      scene.showEffect("fireball", {
        x: attacker.x + 10,
        y: attacker.y + 20,
        z: attacker.z,
        scale: 0,
        opacity: 0.6,
        time: 300
      }, {
        scale: 6,
        opacity: 0
      }, "decel");
      attacker.delay(450).anim({
        scale: 4,
        time: 400,
        opacity: 0
      }, "linear");
    }},
  feintattack: {anim: function anim(scene, [attacker, defender]) {
      attacker.anim({
        x: attacker.leftof(-20),
        y: attacker.y,
        z: attacker.behind(-20),
        opacity: 0,
        time: 200
      }, "linear");
      attacker.anim({
        x: defender.x,
        y: defender.y,
        z: defender.behind(-120),
        opacity: 0,
        time: 1
      }, "linear");
      attacker.anim({
        x: defender.x,
        y: defender.y,
        z: defender.behind(40),
        opacity: 1,
        time: 250
      }, "linear");
      attacker.anim({
        x: defender.x,
        y: defender.y,
        z: defender.behind(-5),
        opacity: 0,
        time: 300
      }, "linear");
      attacker.anim({
        opacity: 0,
        time: 1
      }, "linear");
      attacker.anim({
        time: 300,
        opacity: 1
      }, "linear");
      defender.delay(330);
      defender.anim({
        z: defender.behind(20),
        time: 100
      }, "swing");
      defender.anim({
        time: 300
      }, "swing");
    }},
  fireblast: {anim: function anim(scene, [attacker, defender]) {
      scene.backgroundEffect("#000000", 500, 0.7);
      scene.backgroundEffect("linear-gradient(#390000 30%, #B84038)", 600, 0.4, 500);
      scene.showEffect("fireball", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 1,
        opacity: 0.2
      }, {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 2,
        opacity: 1,
        time: 500
      }, "linear", "fade");
      scene.showEffect("fireball", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 1,
        opacity: 0.2,
        time: 50
      }, {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 2,
        opacity: 1,
        time: 550
      }, "linear", "fade");
      scene.showEffect("fireball", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 2,
        opacity: 1,
        time: 500
      }, {
        x: defender.x,
        y: defender.y + 100,
        scale: 3,
        opacity: 0,
        time: 1100
      }, "linear", "fade");
      scene.showEffect("fireball", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 2,
        opacity: 1,
        time: 500
      }, {
        x: defender.x - 60,
        y: defender.y - 80,
        scale: 3,
        opacity: 0,
        time: 1100
      }, "linear", "fade");
      scene.showEffect("fireball", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 2,
        opacity: 1,
        time: 500
      }, {
        x: defender.x + 60,
        y: defender.y - 80,
        scale: 3,
        opacity: 0,
        time: 1100
      }, "linear", "fade");
      scene.showEffect("fireball", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 2,
        opacity: 1,
        time: 500
      }, {
        x: defender.x - 90,
        y: defender.y + 40,
        scale: 3,
        opacity: 0,
        time: 1100
      }, "linear", "fade");
      scene.showEffect("fireball", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 2,
        opacity: 1,
        time: 500
      }, {
        x: defender.x + 90,
        y: defender.y + 40,
        scale: 3,
        opacity: 0,
        time: 1100
      }, "linear", "fade");
      defender.delay(500);
      defender.anim({
        z: defender.behind(10),
        time: 200
      }, "swing");
      defender.anim({
        time: 300
      }, "swing");
    }},
  firepunch: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("fireball", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0,
        opacity: 1,
        time: 400
      }, {
        x: defender.leftof(-20),
        y: defender.y,
        z: defender.behind(20),
        scale: 3,
        opacity: 0,
        time: 700
      }, "linear");
      scene.showEffect("fireball", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0,
        opacity: 1,
        time: 500
      }, {
        x: defender.leftof(-20),
        y: defender.y,
        z: defender.behind(20),
        scale: 3,
        opacity: 0,
        time: 800
      }, "linear");
      scene.showEffect("fist", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 1,
        opacity: 1,
        time: 400
      }, {
        x: defender.leftof(-20),
        y: defender.y,
        z: defender.behind(20),
        scale: 2,
        opacity: 0,
        time: 800
      }, "linear");
      attacker.anim({
        x: defender.leftof(20),
        y: defender.y,
        z: defender.behind(-20),
        time: 400
      }, "ballistic2Under");
      attacker.anim({
        x: defender.x,
        y: defender.y,
        z: defender.z,
        time: 50
      });
      attacker.anim({
        time: 500
      }, "ballistic2");
      defender.delay(425);
      defender.anim({
        x: defender.leftof(-20),
        y: defender.y,
        z: defender.behind(20),
        time: 50
      }, "swing");
      defender.anim({
        time: 300
      }, "swing");
    }},
  firespin: {anim: function anim(scene, [attacker, defender]) {
      for (let i = 0; i < 4; i++) {
        scene.showEffect("fireball", {
          x: defender.x + 50,
          y: defender.y - 35,
          z: defender.z,
          scale: 0.5,
          opacity: 1,
          time: 200 * i
        }, {
          x: defender.x - 50,
          y: defender.y,
          z: defender.z,
          scale: 1,
          opacity: 0.4,
          time: 200 * i + 200
        }, "linear", "fade");
        scene.showEffect("fireball", {
          x: defender.x - 50,
          y: defender.y + 35,
          z: defender.z,
          scale: 0.5,
          opacity: 1,
          time: 200 * i
        }, {
          x: defender.x + 50,
          y: defender.y,
          z: defender.z,
          scale: 1,
          opacity: 0.4,
          time: 200 * i + 200
        }, "linear", "fade");
        scene.showEffect("fireball", {
          x: defender.x + 50,
          y: defender.y,
          z: defender.z,
          scale: 0.5,
          opacity: 1,
          time: 200 * i
        }, {
          x: defender.x - 50,
          y: defender.y - 35,
          z: defender.z,
          scale: 1,
          opacity: 0.4,
          time: 200 * i + 200
        }, "linear", "fade");
        scene.showEffect("fireball", {
          x: defender.x - 50,
          y: defender.y,
          z: defender.z,
          scale: 0.5,
          opacity: 1,
          time: 200 * i
        }, {
          x: defender.x + 50,
          y: defender.y - 35,
          z: defender.z,
          scale: 1,
          opacity: 0.4,
          time: 200 * i + 200
        }, "linear", "fade");
      }
    }},
  flail: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("wisp", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0,
        opacity: 1,
        time: 400
      }, {
        x: defender.leftof(-20),
        y: defender.y,
        z: defender.behind(20),
        scale: 3,
        opacity: 0,
        time: 700
      }, "linear");
      scene.showEffect("wisp", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0,
        opacity: 1,
        time: 700
      }, {
        x: defender.leftof(-20),
        y: defender.y,
        z: defender.behind(20),
        scale: 3,
        opacity: 0,
        time: 1e3
      }, "linear");
      defender.delay(480);
      defender.anim({
        z: defender.behind(20),
        time: 100
      }, "swing");
      defender.anim({
        time: 200
      }, "swing");
      defender.anim({
        z: defender.behind(20),
        time: 100
      }, "swing");
      defender.anim({
        time: 300
      }, "swing");
      attacker.anim({
        x: defender.leftof(-30),
        y: defender.y + 80,
        z: defender.behind(-30),
        time: 400
      }, "ballistic");
      attacker.anim({
        x: defender.leftof(30),
        y: defender.y + 5,
        z: defender.z,
        time: 100
      });
      attacker.anim({
        x: defender.leftof(30),
        y: defender.y + 80,
        z: defender.behind(-30),
        time: 200
      }, "ballisticUp");
      attacker.anim({
        x: defender.leftof(-30),
        y: defender.y + 5,
        z: defender.z,
        time: 100
      });
      attacker.anim({
        time: 500
      }, "ballistic2Back");
    }},
  flamethrower: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("fireball", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 1,
        opacity: 0.7
      }, {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        opacity: 0.6,
        time: 400
      }, "decel", "explode");
      scene.showEffect("fireball", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 1,
        opacity: 0.7,
        time: 100
      }, {
        x: defender.x + 10,
        y: defender.y - 5,
        z: defender.behind(0),
        opacity: 0.6,
        time: 500
      }, "decel", "explode");
      scene.showEffect("fireball", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 1,
        opacity: 0.7,
        time: 200
      }, {
        x: defender.x - 10,
        y: defender.y + 5,
        z: defender.behind(0),
        opacity: 0.6,
        time: 600
      }, "decel", "explode");
      scene.showEffect("fireball", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 1,
        opacity: 0.7,
        time: 300
      }, {
        x: defender.x,
        y: defender.y - 5,
        z: defender.behind(0),
        opacity: 0.6,
        time: 700
      }, "decel", "explode");
    }},
  flamewheel: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("fireball", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0,
        opacity: 1,
        time: 0
      }, {
        x: attacker.x - 25,
        y: attacker.y - 25,
        scale: 2,
        opacity: 0,
        time: 300
      }, "ballistic");
      scene.showEffect("fireball", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0,
        opacity: 1,
        time: 150
      }, {
        x: attacker.x + 30,
        y: attacker.y - 20,
        scale: 2,
        opacity: 0,
        time: 450
      }, "ballistic");
      scene.showEffect("fireball", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0,
        opacity: 1,
        time: 250
      }, {
        x: attacker.x + 5,
        y: attacker.y - 40,
        scale: 2,
        opacity: 0,
        time: 550
      }, "ballistic");
      scene.showEffect("fireball", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0,
        opacity: 1,
        time: 300
      }, {
        x: attacker.x - 20,
        y: attacker.y - 20,
        scale: 2,
        opacity: 0,
        time: 600
      }, "ballistic");
      scene.showEffect("fireball", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0,
        opacity: 1,
        time: 600
      }, {
        scale: 5,
        opacity: 0,
        time: 900
      }, "linear");
      scene.showEffect("fireball", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0,
        opacity: 1,
        time: 700
      }, {
        scale: 8,
        opacity: 0,
        time: 1e3
      }, "linear");
      attacker.delay(300);
      attacker.anim({
        x: defender.x,
        y: defender.y,
        z: defender.behind(-5),
        time: 300
      }, "accel");
      attacker.anim({
        time: 500
      }, "ballistic2Back");
      defender.delay(580);
      defender.anim({
        z: defender.behind(20),
        time: 100
      }, "swing");
      defender.anim({
        time: 300
      }, "swing");
    }},
  fly: {anim: function anim(scene, [attacker, defender]) {
      attacker.anim({
        x: attacker.leftof(-200),
        y: attacker.y + 80,
        z: attacker.z,
        opacity: 0,
        time: 350
      }, "accel");
      attacker.anim({
        x: defender.leftof(-200),
        y: defender.y + 80,
        z: defender.z,
        time: 1
      }, "linear");
      attacker.anim({
        x: defender.x,
        y: defender.y,
        z: defender.z,
        opacity: 1,
        time: 350
      }, "accel");
      scene.showEffect("wisp", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0,
        opacity: 0.5,
        time: 700
      }, {
        scale: 2,
        opacity: 0,
        time: 900
      }, "linear");
      attacker.anim({
        x: defender.leftof(100),
        y: defender.y - 40,
        z: defender.z,
        opacity: 0,
        time: 175
      });
      attacker.anim({
        x: attacker.x,
        y: attacker.y + 40,
        z: attacker.behind(40),
        time: 1
      });
      attacker.anim({
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        time: 250
      }, "decel");
      defender.delay(700);
      defender.anim({
        z: defender.behind(20),
        time: 100
      }, "swing");
      defender.anim({
        time: 300
      }, "swing");
    }},
  focusenergy: {anim: function anim(scene, [attacker]) {
      scene.showEffect("wisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 2,
        opacity: 0.2,
        time: 0
      }, {
        scale: 0,
        opacity: 1,
        time: 300
      }, "linear");
      scene.showEffect("wisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 2,
        opacity: 0.2,
        time: 200
      }, {
        scale: 0,
        opacity: 1,
        time: 500
      }, "linear");
    }},
  foresight: {anim: function anim(scene, [attacker]) {
      attacker.anim({ x: attacker.x - 10 });
      attacker.anim({ x: attacker.x + 10 });
      attacker.anim({ x: attacker.x });
    }},
  frustration: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("angry", {
        x: attacker.x - 10,
        y: attacker.y + 50,
        z: attacker.z,
        scale: 0.5,
        opacity: 1,
        time: 0
      }, {
        scale: 3,
        opacity: 0,
        time: 300
      }, "ballistic2Under", "fade");
      attacker.delay(300);
      attacker.anim({
        x: defender.leftof(-30),
        y: defender.y + 80,
        z: defender.behind(-30),
        time: 300
      }, "ballistic");
      attacker.anim({
        x: defender.leftof(30),
        y: defender.y + 5,
        z: defender.z,
        time: 100
      });
      attacker.anim({
        x: defender.leftof(30),
        y: defender.y + 80,
        z: defender.behind(-30),
        time: 200
      }, "ballisticUp");
      attacker.anim({
        x: defender.leftof(-30),
        y: defender.y + 5,
        z: defender.z,
        time: 100
      });
      attacker.anim({
        time: 500
      }, "ballistic2Back");
      defender.delay(750);
      defender.anim({
        z: defender.behind(20),
        time: 100
      }, "swing");
      defender.anim({
        time: 200
      }, "swing");
      defender.anim({
        z: defender.behind(15),
        time: 300
      }, "decel");
      defender.anim({
        time: 300
      }, "swing");
      scene.showEffect("foot", {
        x: defender.x - 10,
        y: defender.y + 20,
        z: defender.z,
        scale: 1,
        opacity: 1,
        time: 650
      }, {
        x: defender.x - 15,
        y: defender.y + 10,
        z: defender.behind(15),
        scale: 2,
        opacity: 0,
        time: 950
      }, "linear");
      scene.showEffect("fist", {
        x: defender.x - 5,
        y: defender.y - 5,
        z: defender.z,
        scale: 0.6,
        opacity: 0.6,
        time: 675
      }, {
        x: defender.x - 10,
        y: defender.y - 10,
        z: defender.z,
        scale: 1,
        opacity: 1,
        time: 875
      }, "linear", "explode");
      scene.showEffect("fist", {
        x: defender.x + 10,
        y: defender.y + 10,
        z: defender.z,
        scale: 0.6,
        opacity: 0.6,
        time: 700
      }, {
        x: defender.x + 20,
        y: defender.y + 20,
        z: defender.z,
        scale: 1,
        opacity: 1,
        time: 900
      }, "linear", "explode");
      scene.showEffect("fist", {
        x: defender.x + 20,
        y: defender.y - 30,
        z: defender.z,
        scale: 0.6,
        opacity: 0.6,
        time: 725
      }, {
        x: defender.x + 30,
        y: defender.y - 25,
        z: defender.z,
        scale: 1,
        opacity: 1,
        time: 925
      }, "linear", "explode");
      scene.showEffect("foot", {
        x: defender.x,
        y: defender.y + 20,
        z: defender.z,
        scale: 1,
        opacity: 1,
        time: 1e3
      }, {
        x: defender.x,
        y: defender.y + 10,
        z: defender.behind(15),
        scale: 2,
        opacity: 0,
        time: 1300
      }, "linear");
    }},
  furyattack: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("wisp", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0,
        opacity: 1,
        time: 400
      }, {
        x: defender.leftof(-20),
        y: defender.y,
        z: defender.behind(20),
        scale: 3,
        opacity: 0,
        time: 700
      }, "linear");
      scene.showEffect("wisp", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0,
        opacity: 1,
        time: 700
      }, {
        x: defender.leftof(-20),
        y: defender.y,
        z: defender.behind(20),
        scale: 3,
        opacity: 0,
        time: 1e3
      }, "linear");
      defender.delay(480);
      defender.anim({
        z: defender.behind(20),
        time: 100
      }, "swing");
      defender.anim({
        time: 200
      }, "swing");
      defender.anim({
        z: defender.behind(20),
        time: 100
      }, "swing");
      defender.anim({
        time: 300
      }, "swing");
      attacker.anim({
        x: defender.leftof(-30),
        y: defender.y + 80,
        z: defender.behind(-30),
        time: 400
      }, "ballistic");
      attacker.anim({
        x: defender.leftof(30),
        y: defender.y + 5,
        z: defender.z,
        time: 100
      });
      attacker.anim({
        x: defender.leftof(30),
        y: defender.y + 80,
        z: defender.behind(-30),
        time: 200
      }, "ballisticUp");
      attacker.anim({
        x: defender.leftof(-30),
        y: defender.y + 5,
        z: defender.z,
        time: 100
      });
      attacker.anim({
        time: 500
      }, "ballistic2Back");
    }},
  furycutter: {anim: function anim(scene, [attacker, defender]) {
      attacker.anim({
        x: defender.x,
        y: defender.y + 80,
        z: defender.behind(-30),
        time: 400
      }, "ballistic");
      attacker.anim({
        x: defender.x,
        y: defender.y + 5,
        z: defender.z,
        time: 100
      });
      attacker.anim({
        time: 500
      }, "ballistic2Back");
      defender.delay(450);
      defender.anim({
        z: defender.behind(20),
        time: 100
      }, "swing");
      defender.anim({
        time: 300
      }, "swing");
      scene.showEffect("rightslash", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 1,
        opacity: 1,
        time: 500
      }, {
        scale: 3,
        opacity: 0,
        time: 800
      }, "linear", "fade");
    }},
  furyswipes: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("leftslash", {
        x: defender.x - 20,
        y: defender.y + 20,
        z: defender.z,
        scale: 1,
        opacity: 1,
        time: 400
      }, {
        x: defender.x - 20,
        y: defender.y + 20,
        z: defender.z,
        scale: 1.5,
        opacity: 0,
        time: 700
      }, "linear", "fade");
      scene.showEffect("leftslash", {
        x: defender.x - 20,
        y: defender.y - 20,
        z: defender.z,
        scale: 1,
        opacity: 1,
        time: 400
      }, {
        x: defender.x - 20,
        y: defender.y - 20,
        z: defender.z,
        scale: 1.5,
        opacity: 0,
        time: 700
      }, "linear", "fade");
      scene.showEffect("rightslash", {
        x: defender.x + 20,
        y: defender.y + 20,
        z: defender.z,
        scale: 1,
        opacity: 1,
        time: 700
      }, {
        x: defender.x + 20,
        y: defender.y + 20,
        z: defender.z,
        scale: 1.5,
        opacity: 0,
        time: 1e3
      }, "linear", "fade");
      scene.showEffect("rightslash", {
        x: defender.x + 20,
        y: defender.y - 20,
        z: defender.z,
        scale: 1,
        opacity: 1,
        time: 700
      }, {
        x: defender.x + 20,
        y: defender.y - 20,
        z: defender.z,
        scale: 1.5,
        opacity: 0,
        time: 1e3
      }, "linear", "fade");
      SD_OUTRAS.xattack.anim(scene, [attacker, defender]);
    }},
  gigadrain: {anim: function anim(scene, [attacker, defender]) {
      scene.backgroundEffect("#9AB440", 900, 0.5);
      SD_OUTRAS.drain.anim(scene, [attacker, defender]);
    }},
  glare: {anim: function anim(scene, [attacker, defender]) {
      scene.backgroundEffect("#AA0000", 250, 0.3);
      scene.backgroundEffect("#000000", 250, 0.2, 400);
      scene.showEffect("stare", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 1,
        yscale: 0,
        opacity: 1
      }, {
        yscale: 1,
        time: 700
      }, "decel", "fade");
    }},
  growl: {anim: function anim(scene, [attacker]) {
      scene.showEffect("wisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0,
        opacity: 0.7,
        time: 0
      }, {
        z: attacker.behind(-50),
        scale: 5,
        opacity: 0,
        time: 400
      }, "linear");
      scene.showEffect("wisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0,
        opacity: 0.7,
        time: 150
      }, {
        z: attacker.behind(-50),
        scale: 5,
        opacity: 0,
        time: 600
      }, "linear");
      scene.showEffect("wisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0,
        opacity: 0.7,
        time: 300
      }, {
        z: attacker.behind(-50),
        scale: 5,
        opacity: 0,
        time: 800
      }, "linear");
    }},
  growth: {anim: function anim(scene, [attacker]) {
      scene.showEffect(attacker.sp, {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        opacity: 0.3,
        time: 0
      }, {
        y: attacker.y + 20,
        scale: 2,
        opacity: 0,
        time: 400
      }, "accel");
      scene.showEffect(attacker.sp, {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        opacity: 0.3,
        time: 200
      }, {
        y: attacker.y + 20,
        scale: 2,
        opacity: 0,
        time: 600
      }, "accel");
      attacker.anim({
        scale: 1.25,
        time: 600
      }, "linear");
      attacker.anim({
        time: 300
      }, "accel");
    }},
  guillotine: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("wisp", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0,
        opacity: 1,
        time: 400
      }, {
        x: defender.leftof(-20),
        y: defender.y,
        z: defender.behind(20),
        scale: 3,
        opacity: 0,
        time: 700
      }, "linear");
      scene.showEffect("wisp", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0,
        opacity: 1,
        time: 700
      }, {
        x: defender.leftof(-20),
        y: defender.y,
        z: defender.behind(20),
        scale: 3,
        opacity: 0,
        time: 1e3
      }, "linear");
      defender.delay(480);
      defender.anim({
        z: defender.behind(20),
        time: 100
      }, "swing");
      defender.anim({
        time: 200
      }, "swing");
      defender.anim({
        z: defender.behind(20),
        time: 100
      }, "swing");
      defender.anim({
        time: 300
      }, "swing");
      attacker.anim({
        x: defender.leftof(-30),
        y: defender.y + 80,
        z: defender.behind(-30),
        time: 400
      }, "ballistic");
      attacker.anim({
        x: defender.leftof(30),
        y: defender.y + 5,
        z: defender.z,
        time: 100
      });
      attacker.anim({
        x: defender.leftof(30),
        y: defender.y + 80,
        z: defender.behind(-30),
        time: 200
      }, "ballisticUp");
      attacker.anim({
        x: defender.leftof(-30),
        y: defender.y + 5,
        z: defender.z,
        time: 100
      });
      attacker.anim({
        time: 500
      }, "ballistic2Back");
    }},
  gust: {anim: function anim(scene, [attacker, defender]) {
      for (let i = 0; i < 3; i++) {
        scene.showEffect("wisp", {
          x: defender.x + 30,
          y: defender.y - 35,
          z: defender.behind(i * 40 - 60),
          scale: 0.2,
          opacity: 1,
          time: 200 * i
        }, {
          x: defender.x - 30,
          y: defender.y,
          z: defender.behind(i * 40 - 60),
          scale: 0.4,
          opacity: 0.4,
          time: 200 * i + 200
        }, "linear", "fade");
        scene.showEffect("wisp", {
          x: defender.x - 30,
          y: defender.y + 35,
          z: defender.behind(i * 40 - 60),
          scale: 0.2,
          opacity: 1,
          time: 200 * i
        }, {
          x: defender.x + 30,
          y: defender.y,
          z: defender.behind(i * 40 - 60),
          scale: 0.4,
          opacity: 0.4,
          time: 200 * i + 200
        }, "linear", "fade");
        scene.showEffect("wisp", {
          x: defender.x + 30,
          y: defender.y,
          z: defender.behind(i * 40 - 60),
          scale: 0.2,
          opacity: 1,
          time: 200 * i
        }, {
          x: defender.x - 30,
          y: defender.y - 35,
          z: defender.behind(i * 40 - 60),
          scale: 0.4,
          opacity: 0.4,
          time: 200 * i + 200
        }, "linear", "fade");
        scene.showEffect("wisp", {
          x: defender.x - 30,
          y: defender.y,
          z: defender.behind(i * 40 - 60),
          scale: 0.2,
          opacity: 1,
          time: 200 * i
        }, {
          x: defender.x + 30,
          y: defender.y - 35,
          z: defender.behind(i * 40 - 60),
          scale: 0.4,
          opacity: 0.4,
          time: 200 * i + 200
        }, "linear", "fade");
      }
    }},
  harden: {anim: function anim(scene, [attacker]) {
      scene.showEffect("wisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 2,
        opacity: 0.2,
        time: 0
      }, {
        scale: 0,
        opacity: 1,
        time: 300
      }, "linear");
      scene.showEffect("wisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 2,
        opacity: 0.2,
        time: 200
      }, {
        scale: 0,
        opacity: 1,
        time: 500
      }, "linear");
    }},
  haze: {anim: function anim(scene, [attacker, defender]) {
      let xf = [1, -1, 1, -1];
      let yf = [1, -1, -1, 1];
      let xf2 = [1, 0, -1, 0];
      let yf2 = [0, 1, 0, -1];
      scene.backgroundEffect("#000000", 1e3, 0.3);
      for (let i = 0; i < 4; i++) {
        scene.showEffect("blackwisp", {
          x: attacker.x,
          y: attacker.y,
          z: attacker.z,
          scale: 0.5,
          opacity: 1
        }, {
          x: attacker.x + 120 * xf[i],
          y: attacker.y,
          z: attacker.z + 68 * yf[i],
          scale: 1,
          opacity: 0,
          time: 800
        }, "decel", "fade");
        scene.showEffect("blackwisp", {
          x: attacker.x,
          y: attacker.y,
          z: attacker.z,
          scale: 0.5,
          opacity: 1
        }, {
          x: attacker.x + 113 * xf2[i],
          y: attacker.y,
          z: attacker.z + 97 * yf2[i],
          scale: 1,
          opacity: 0,
          time: 800
        }, "decel", "fade");
        scene.showEffect("blackwisp", {
          x: attacker.x,
          y: attacker.y,
          z: attacker.z,
          scale: 0.5,
          opacity: 1
        }, {
          x: attacker.x + 120 * xf[i],
          y: attacker.y,
          z: attacker.z + 68 * yf[i],
          scale: 1,
          opacity: 0,
          time: 800
        }, "decel", "fade");
        scene.showEffect("blackwisp", {
          x: attacker.x,
          y: attacker.y,
          z: attacker.z,
          scale: 0.5,
          opacity: 1
        }, {
          x: attacker.x + 113 * xf2[i],
          y: attacker.y,
          z: attacker.z + 97 * yf2[i],
          scale: 1,
          opacity: 0,
          time: 800
        }, "decel", "fade");
      }
    }},
  headbutt: {anim: function anim(scene, [attacker, defender]) {
      attacker.anim({
        x: defender.x,
        y: defender.y + 80,
        z: defender.behind(-30),
        time: 400
      }, "ballistic");
      attacker.anim({
        x: defender.x,
        y: defender.y + 5,
        z: defender.z,
        time: 100
      });
      attacker.anim({
        time: 500
      }, "ballistic2Back");
      defender.delay(450);
      defender.anim({
        z: defender.behind(20),
        time: 100
      }, "swing");
      defender.anim({
        time: 300
      }, "swing");
      scene.wait(500);
    }},
  hiddenpower: {anim: function anim(scene, [attacker, defender]) {
      let xf = [1, -1, 1, -1];
      let yf = [1, -1, -1, 1];
      let xf2 = [1, 0, -1, 0];
      let yf2 = [0, 1, 0, -1];
      for (let i = 0; i < 4; i++) {
        scene.showEffect("electroball", {
          x: attacker.x,
          y: attacker.y,
          z: attacker.z,
          scale: 0.5,
          opacity: 1
        }, {
          x: attacker.x + 240 * xf[i],
          y: attacker.y,
          z: attacker.z + 137 * yf[i],
          scale: 1,
          opacity: 0.5,
          time: 800
        }, "accel", "fade");
        scene.showEffect("electroball", {
          x: attacker.x,
          y: attacker.y,
          z: attacker.z,
          scale: 0.5,
          opacity: 1
        }, {
          x: attacker.x + 339 * xf2[i],
          y: attacker.y,
          z: attacker.z + 194 * yf2[i],
          scale: 1,
          opacity: 0.5,
          time: 800
        }, "accel", "fade");
      }
    }},
  highjumpkick: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect(attacker.sp, {
        x: defender.leftof(-10),
        y: attacker.y + 170,
        z: attacker.behind(-35),
        opacity: 0.3,
        time: 25
      }, {
        x: defender.x,
        y: defender.y,
        z: defender.behind(0)
      }, "ballistic", "fade");
      scene.showEffect(attacker.sp, {
        x: defender.leftof(-10),
        y: attacker.y + 170,
        z: attacker.behind(-35),
        opacity: 0.3,
        time: 75
      }, {
        x: defender.x,
        y: defender.y,
        z: defender.behind(0)
      }, "ballistic", "fade");
      scene.showEffect("foot", {
        x: defender.x,
        y: defender.y + 20,
        z: defender.z,
        scale: 1,
        opacity: 1,
        time: 500
      }, {
        x: defender.x,
        y: defender.y + 10,
        z: defender.behind(15),
        scale: 2,
        opacity: 0,
        time: 900
      }, "linear");
      scene.showEffect("shadowball", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0,
        opacity: 0.7,
        time: 500
      }, {
        scale: 3,
        opacity: 0,
        time: 750
      }, "linear", "fade");
      attacker.anim({
        x: defender.x,
        y: defender.y + 170,
        z: defender.behind(-30),
        time: 400
      }, "ballistic");
      attacker.anim({
        x: defender.x,
        y: defender.y + 5,
        z: defender.z,
        time: 200
      });
      attacker.anim({
        time: 500
      }, "ballistic2Back");
      defender.delay(500);
      defender.anim({
        y: defender.y - 5,
        z: defender.behind(40),
        yscale: 0.9,
        time: 300
      }, "swing");
      defender.anim({
        time: 300
      }, "swing");
    }},
  hornattack: {anim: function anim(scene, [attacker, defender]) {
      scene.backgroundEffect("#987058", 400, 0.3);
      scene.showEffect("wisp", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0,
        opacity: 0.5,
        time: 300
      }, {
        scale: 3,
        opacity: 0,
        time: 600
      }, "linear");
      scene.showEffect("wisp", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0,
        opacity: 0.5,
        time: 500
      }, {
        scale: 3,
        opacity: 0,
        time: 800
      }, "linear");
      attacker.anim({
        x: defender.x,
        y: defender.y,
        z: defender.behind(-5),
        time: 300
      }, "accel");
      attacker.anim({
        time: 500
      }, "ballistic2Back");
      defender.delay(280);
      defender.anim({
        z: defender.behind(20),
        time: 100
      }, "swing");
      defender.anim({
        time: 300
      }, "swing");
    }},
  horndrill: {anim: function anim(scene, [attacker, defender]) {
      scene.backgroundEffect("#000000", 700, 0.2);
      scene.showEffect("impact", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0,
        opacity: 0.4,
        time: 300
      }, {
        scale: 4,
        opacity: 0,
        time: 600
      }, "linear");
      scene.showEffect("impact", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0,
        opacity: 0.4,
        time: 500
      }, {
        scale: 4,
        opacity: 0,
        time: 800
      }, "linear");
      scene.showEffect(attacker.sp, {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        opacity: 0.3,
        time: 50
      }, {
        x: defender.x,
        y: defender.y,
        z: defender.behind(-5),
        time: 350
      }, "accel", "fade");
      scene.showEffect(attacker.sp, {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        opacity: 0.3,
        time: 100
      }, {
        x: defender.x,
        y: defender.y,
        z: defender.behind(-5),
        time: 400
      }, "accel", "fade");
      attacker.anim({
        x: defender.x,
        y: defender.y,
        z: defender.behind(-5),
        time: 300
      }, "accel");
      attacker.anim({
        time: 500
      }, "ballistic2Back");
      defender.delay(280);
      defender.anim({
        z: defender.behind(20),
        time: 100
      }, "swing");
      defender.anim({
        time: 300
      }, "swing");
    }},
  hydropump: {anim: function anim(scene, [attacker, defender]) {
      scene.backgroundEffect("#0000DD", 700, 0.2);
      SD_OUTRAS.hydroshot.anim(scene, [attacker, defender]);
      defender.delay(200);
      defender.anim({
        z: defender.behind(20),
        time: 400
      }, "swing");
      defender.anim({
        time: 300
      }, "swing");
    }},
  hyperbeam: {anim: function anim(scene, [attacker, defender]) {
      scene.backgroundEffect("#000000", 700, 0.2);
      scene.showEffect("electroball", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.4,
        opacity: 0.6
      }, {
        x: defender.x + 30,
        y: defender.y + 30,
        z: defender.z,
        scale: 0.6,
        opacity: 0.3,
        time: 200
      }, "linear", "explode");
      scene.showEffect("electroball", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.4,
        opacity: 0.6,
        time: 75
      }, {
        x: defender.x + 20,
        y: defender.y - 30,
        z: defender.z,
        scale: 0.6,
        opacity: 0.3,
        time: 275
      }, "linear", "explode");
      scene.showEffect("electroball", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.4,
        opacity: 0.6,
        time: 150
      }, {
        x: defender.x - 30,
        y: defender.y,
        z: defender.z,
        scale: 0.6,
        opacity: 0.3,
        time: 350
      }, "linear", "explode");
      scene.showEffect("electroball", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.4,
        opacity: 0.6,
        time: 225
      }, {
        x: defender.x - 10,
        y: defender.y + 10,
        z: defender.z,
        scale: 0.6,
        opacity: 0.3,
        time: 425
      }, "linear", "explode");
      scene.showEffect("electroball", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.4,
        opacity: 0.6,
        time: 300
      }, {
        x: defender.x + 10,
        y: defender.y - 10,
        z: defender.z,
        scale: 0.6,
        opacity: 0.3,
        time: 500
      }, "linear", "explode");
      scene.showEffect("electroball", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.4,
        opacity: 0.6,
        time: 375
      }, {
        x: defender.x - 20,
        y: defender.y,
        z: defender.z,
        scale: 0.6,
        opacity: 0.3,
        time: 575
      }, "linear", "explode");
      scene.showEffect("shadowball", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0,
        opacity: 0.5,
        time: 550
      }, {
        scale: 4,
        opacity: 0,
        time: 750
      }, "linear");
      scene.showEffect("shadowball", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0,
        opacity: 0.5,
        time: 600
      }, {
        scale: 4,
        opacity: 0,
        time: 800
      }, "linear");
      defender.delay(125);
      defender.anim({
        z: defender.behind(5),
        time: 75
      }, "swing");
      defender.anim({
        time: 75
      }, "swing");
      defender.anim({
        z: defender.behind(5),
        time: 75
      }, "swing");
      defender.anim({
        time: 75
      }, "swing");
      defender.anim({
        z: defender.behind(5),
        time: 75
      }, "swing");
      defender.anim({
        time: 75
      }, "swing");
      defender.anim({
        z: defender.behind(5),
        time: 75
      }, "swing");
      defender.anim({
        time: 150
      }, "swing");
    }},
  hyperfang: {anim: function anim(scene, [attacker, defender]) {
      SD_OUTRAS.bite.anim(scene, [attacker, defender]);
      SD_OUTRAS.contactattack.anim(scene, [attacker, defender]);
    }},
  hypnosis: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("mistball", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0,
        opacity: 0.8,
        time: 0
      }, {
        scale: 2,
        opacity: 0,
        time: 400
      }, "decel");
      scene.showEffect("mistball", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0,
        opacity: 0.8,
        time: 100
      }, {
        scale: 2,
        opacity: 0,
        time: 500
      }, "decel");
      scene.showEffect("mistball", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0,
        opacity: 0.8,
        time: 200
      }, {
        scale: 2,
        opacity: 0,
        time: 600
      }, "decel");
    }},
  icebeam: {anim: function anim(scene, [attacker, defender]) {
      let xstep = (defender.x - attacker.x) / 5;
      let ystep = (defender.y - attacker.y) / 5;
      let zstep = (defender.z - attacker.z) / 5;
      for (let i = 0; i < 4; i++) {
        scene.showEffect("icicle", {
          x: attacker.x + xstep * (i + 1),
          y: attacker.y + ystep * (i + 1),
          z: attacker.z + zstep * (i + 1),
          scale: 1.5,
          opacity: 0.6,
          time: 40 * i
        }, {
          opacity: 0,
          time: 40 * i + 600
        }, "linear");
      }
      scene.showEffect("iceball", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0,
        opacity: 1,
        time: 100
      }, {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 2,
        opacity: 0,
        time: 400
      }, "linear");
      scene.showEffect("iceball", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0,
        opacity: 1,
        time: 300
      }, {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 2,
        opacity: 0,
        time: 600
      }, "linear");
      scene.showEffect("wisp", {
        x: defender.x - 30,
        y: defender.y,
        z: defender.z,
        scale: 2,
        opacity: 0.5,
        time: 200
      }, {
        scale: 4,
        opacity: 0,
        time: 600
      }, "linear", "fade");
      scene.showEffect("wisp", {
        x: defender.x,
        y: defender.y - 30,
        z: defender.z,
        scale: 2,
        opacity: 0.5,
        time: 300
      }, {
        scale: 4,
        opacity: 0,
        time: 650
      }, "linear", "fade");
      scene.showEffect("wisp", {
        x: defender.x + 15,
        y: defender.y,
        z: defender.z,
        scale: 2,
        opacity: 0.5,
        time: 400
      }, {
        scale: 4,
        opacity: 0,
        time: 700
      }, "linear", "fade");
    }},
  icepunch: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("icicle", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0,
        opacity: 1,
        time: 400
      }, {
        x: defender.leftof(-20),
        y: defender.y,
        z: defender.behind(20),
        scale: 3,
        opacity: 0,
        time: 700
      }, "linear");
      scene.showEffect("icicle", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0,
        opacity: 1,
        time: 500
      }, {
        x: defender.leftof(-20),
        y: defender.y,
        z: defender.behind(20),
        scale: 3,
        opacity: 0,
        time: 800
      }, "linear");
      scene.showEffect("fist", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 1,
        opacity: 1,
        time: 400
      }, {
        x: defender.leftof(-20),
        y: defender.y,
        z: defender.behind(20),
        scale: 2,
        opacity: 0,
        time: 800
      }, "linear");
      attacker.anim({
        x: defender.leftof(20),
        y: defender.y,
        z: defender.behind(-20),
        time: 400
      }, "ballistic2Under");
      attacker.anim({
        x: defender.x,
        y: defender.y,
        z: defender.z,
        time: 50
      });
      attacker.anim({
        time: 500
      }, "ballistic2");
      defender.delay(425);
      defender.anim({
        x: defender.leftof(-20),
        y: defender.y,
        z: defender.behind(20),
        time: 50
      }, "swing");
      defender.anim({
        time: 300
      }, "swing");
    }},
  icywind: {anim: function anim(scene, [attacker, ...defenders]) {
      for (const defender of defenders) {
        scene.showEffect("wisp", {
          x: attacker.x,
          y: attacker.y,
          z: attacker.z,
          scale: 1.7,
          opacity: 0.3
        }, {
          x: defender.x + 10,
          y: defender.y + 5,
          z: defender.behind(30),
          scale: 2.5,
          opacity: 0.4,
          time: 400
        }, "linear", "explode");
        scene.showEffect("wisp", {
          x: attacker.x,
          y: attacker.y,
          z: attacker.z,
          scale: 1.7,
          opacity: 0.3,
          time: 100
        }, {
          x: defender.x - 10,
          y: defender.y - 5,
          z: defender.behind(30),
          scale: 2.5,
          opacity: 0.4,
          time: 500
        }, "linear", "explode");
        scene.showEffect("wisp", {
          x: attacker.x,
          y: attacker.y,
          z: attacker.z,
          scale: 1.7,
          opacity: 0.3,
          time: 200
        }, {
          x: defender.x,
          y: defender.y + 5,
          z: defender.behind(30),
          scale: 2.5,
          opacity: 0.4,
          time: 600
        }, "linear", "explode");
        scene.showEffect("wisp", {
          x: attacker.x,
          y: attacker.y,
          z: attacker.z,
          scale: 1.7,
          opacity: 0.3,
          time: 300
        }, {
          x: defender.x,
          y: defender.y + 5,
          z: defender.behind(30),
          scale: 2.5,
          opacity: 0.4,
          time: 700
        }, "linear", "explode");
        scene.showEffect("icicle", {
          x: attacker.x,
          y: attacker.y,
          z: attacker.z,
          scale: 0.3,
          opacity: 0.2
        }, {
          x: defender.x,
          y: defender.y,
          z: defender.behind(20),
          opacity: 0.6,
          time: 400
        }, "linear", "fade");
        scene.showEffect("icicle", {
          x: attacker.x,
          y: attacker.y,
          z: attacker.z,
          scale: 0.3,
          opacity: 0.2,
          time: 200
        }, {
          x: defender.x - 10,
          y: defender.y + 5,
          z: defender.behind(20),
          opacity: 0.6,
          time: 600
        }, "linear", "fade");
        scene.showEffect("icicle", {
          x: attacker.x,
          y: attacker.y,
          z: attacker.z,
          scale: 0.3,
          opacity: 0.2,
          time: 300
        }, {
          x: defender.x,
          y: defender.y - 5,
          z: defender.behind(20),
          opacity: 0.6,
          time: 700
        }, "linear", "fade");
      }
    }},
  irontail: {anim: function anim(scene, [attacker, defender]) {
      attacker.anim({
        x: defender.x,
        y: defender.y + 80,
        z: defender.behind(-30),
        time: 400
      }, "ballistic");
      attacker.anim({
        x: defender.x,
        y: defender.y + 5,
        z: defender.z,
        time: 100
      });
      attacker.anim({
        time: 500
      }, "ballistic2Back");
      defender.delay(450);
      defender.anim({
        z: defender.behind(20),
        time: 100
      }, "swing");
      defender.anim({
        time: 300
      }, "swing");
      scene.wait(500);
    }},
  jumpkick: {anim: function anim(scene, [attacker, defender]) {
      SD_OUTRAS.kick.anim(scene, [attacker, defender]);
      SD_OUTRAS.contactattack.anim(scene, [attacker, defender]);
    }},
  karatechop: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("rightchop", {
        x: defender.leftof(30),
        y: defender.y + 50,
        z: defender.behind(-10),
        scale: 0.6,
        opacity: 1,
        time: 475
      }, {
        y: defender.y - 20,
        opacity: 0.5,
        time: 550
      }, "linear", "fade");
      SD_OUTRAS.contactattack.anim(scene, [attacker, defender]);
    }},
  leechlife: {anim: function anim(scene, [attacker, defender]) {
      scene.backgroundEffect("#987058", 800, 0.3, 400);
      scene.showEffect("wisp", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0,
        opacity: 1,
        time: 400
      }, {
        x: defender.leftof(-20),
        y: defender.y,
        z: defender.behind(50),
        scale: 3,
        opacity: 0,
        time: 700
      }, "linear");
      scene.showEffect("electroball", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0.6,
        opacity: 1,
        time: 600
      }, {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        time: 900,
        opacity: 0
      }, "ballistic2");
      scene.showEffect("electroball", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0.6,
        opacity: 1,
        time: 650
      }, {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        time: 950,
        opacity: 0
      }, "linear");
      scene.showEffect("electroball", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0.6,
        opacity: 1,
        time: 700
      }, {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        time: 1e3,
        opacity: 0
      }, "ballistic2Under");
      attacker.anim({
        x: defender.leftof(20),
        y: defender.y,
        z: defender.behind(-20),
        time: 400
      }, "ballistic2Under");
      attacker.anim({
        x: defender.x,
        y: defender.y,
        z: defender.z,
        time: 50
      });
      attacker.anim({
        time: 500
      }, "ballistic2");
      defender.delay(425);
      defender.anim({
        x: defender.leftof(-20),
        y: defender.y,
        z: defender.behind(20),
        time: 50
      }, "swing");
      defender.anim({
        time: 300
      }, "swing");
    }},
  leechseed: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("energyball", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.1,
        opacity: 0.5
      }, {
        x: defender.x - 30,
        y: defender.y - 40,
        z: defender.z,
        scale: 0.2,
        opacity: 0.6
      }, "ballistic");
      scene.showEffect("energyball", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.1,
        opacity: 0.5,
        time: 125
      }, {
        x: defender.x + 40,
        y: defender.y - 35,
        z: defender.z,
        scale: 0.2,
        opacity: 0.6
      }, "ballistic");
      scene.showEffect("energyball", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.1,
        opacity: 0.5,
        time: 250
      }, {
        x: defender.x + 20,
        y: defender.y - 25,
        z: defender.z,
        scale: 0.2,
        opacity: 0.6
      }, "ballistic");
    }},
  leer: {anim: function anim(scene, [attacker]) {
      attacker.anim({ x: attacker.x - 10 });
      attacker.anim({ x: attacker.x + 10 });
      attacker.anim({ x: attacker.x });
    }},
  lick: {anim: function anim(scene, [attacker, defender]) {
      attacker.anim({
        x: defender.x,
        y: defender.y + 80,
        z: defender.behind(-30),
        time: 400
      }, "ballistic");
      attacker.anim({
        x: defender.x,
        y: defender.y + 5,
        z: defender.z,
        time: 100
      });
      attacker.anim({
        time: 500
      }, "ballistic2Back");
      defender.delay(450);
      defender.anim({
        z: defender.behind(20),
        time: 100
      }, "swing");
      defender.anim({
        time: 300
      }, "swing");
      scene.wait(500);
    }},
  lightscreen: {anim: function anim() {
    }},
  lovelykiss: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("heart", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.6,
        opacity: 0
      }, {
        x: defender.leftof(40),
        y: defender.y + 15,
        z: defender.z,
        scale: 0.7,
        opacity: 0.7,
        time: 500
      }, "decel", "fade");
      if (defender.isMissedPokemon) return;
      scene.showEffect("heart", {
        x: defender.leftof(40),
        y: defender.y + 15,
        z: defender.z,
        scale: 0.7,
        opacity: 0.7,
        time: 500
      }, {
        x: defender.leftof(-40),
        y: defender.y,
        z: defender.z,
        scale: 0.6,
        opacity: 1,
        time: 700
      }, "swing", "fade");
      scene.showEffect("heart", {
        x: defender.leftof(-40),
        y: defender.y,
        z: defender.z,
        scale: 0.7,
        opacity: 0,
        time: 700
      }, {
        x: defender.leftof(10),
        y: defender.y - 15,
        z: defender.z,
        scale: 1,
        opacity: 1,
        time: 900
      }, "swing", "explode");
    }},
  lowkick: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("foot", {
        x: defender.x,
        y: defender.y - 40,
        z: defender.behind(15),
        scale: 1,
        opacity: 1,
        time: 400
      }, {
        x: defender.x - 50,
        z: defender.behind(20),
        scale: 1.7,
        opacity: 0,
        time: 650
      }, "linear");
      attacker.anim({
        x: defender.leftof(20),
        y: defender.y,
        z: defender.behind(-20),
        time: 400
      }, "ballistic2Under");
      attacker.anim({
        x: defender.x,
        y: defender.y,
        z: defender.z,
        time: 50
      });
      attacker.anim({
        time: 500
      }, "ballistic2");
      defender.delay(425);
      defender.anim({
        x: defender.leftof(-15),
        y: defender.y,
        z: defender.behind(20),
        time: 50
      }, "swing");
      defender.anim({
        time: 300
      }, "swing");
    }},
  meditate: {anim: function anim(scene, [attacker]) {
      scene.showEffect("wisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 2,
        opacity: 0.2,
        time: 0
      }, {
        scale: 0,
        opacity: 1,
        time: 300
      }, "linear");
      scene.showEffect("wisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 2,
        opacity: 0.2,
        time: 200
      }, {
        scale: 0,
        opacity: 1,
        time: 500
      }, "linear");
    }},
  megadrain: {anim: function anim(scene, [attacker, defender]) {
      scene.backgroundEffect("#9AB440", 900, 0.2);
      SD_OUTRAS.drain.anim(scene, [attacker, defender]);
    }},
  megahorn: {anim: function anim(scene, [attacker, defender]) {
      scene.backgroundEffect("#987058", 400, 0.3);
      scene.showEffect("wisp", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0,
        opacity: 0.5,
        time: 300
      }, {
        scale: 3,
        opacity: 0,
        time: 600
      }, "linear");
      scene.showEffect("wisp", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0,
        opacity: 0.5,
        time: 500
      }, {
        scale: 3,
        opacity: 0,
        time: 800
      }, "linear");
      attacker.anim({
        x: defender.x,
        y: defender.y,
        z: defender.behind(-5),
        time: 300
      }, "accel");
      attacker.anim({
        time: 500
      }, "ballistic2Back");
      defender.delay(280);
      defender.anim({
        z: defender.behind(20),
        time: 100
      }, "swing");
      defender.anim({
        time: 300
      }, "swing");
    }},
  megakick: {anim: function anim(scene, [attacker, defender]) {
      SD_OUTRAS.kick.anim(scene, [attacker, defender]);
      SD_OUTRAS.contactattack.anim(scene, [attacker, defender]);
    }},
  megapunch: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("wisp", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0,
        opacity: 1,
        time: 400
      }, {
        x: defender.leftof(-20),
        y: defender.y,
        z: defender.behind(20),
        scale: 3,
        opacity: 0,
        time: 700
      }, "linear");
      scene.showEffect("wisp", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0,
        opacity: 1,
        time: 500
      }, {
        x: defender.leftof(-20),
        y: defender.y,
        z: defender.behind(20),
        scale: 3,
        opacity: 0,
        time: 800
      }, "linear");
      scene.showEffect("fist", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 1,
        opacity: 1,
        time: 400
      }, {
        x: defender.leftof(-20),
        y: defender.y,
        z: defender.behind(20),
        scale: 2,
        opacity: 0,
        time: 800
      }, "linear");
      attacker.anim({
        x: defender.leftof(20),
        y: defender.y,
        z: defender.behind(-20),
        time: 400
      }, "ballistic2Under");
      attacker.anim({
        x: defender.x,
        y: defender.y,
        z: defender.z,
        time: 50
      });
      attacker.anim({
        time: 500
      }, "ballistic2");
      defender.delay(425);
      defender.anim({
        x: defender.leftof(-15),
        y: defender.y,
        z: defender.behind(15),
        time: 50
      }, "swing");
      defender.anim({
        time: 300
      }, "swing");
    }},
  metalclaw: {anim: function anim(scene, [attacker, defender]) {
      attacker.anim({
        x: defender.leftof(-30),
        y: defender.y + 80,
        z: defender.behind(-30),
        time: 400
      }, "ballistic");
      attacker.anim({
        x: defender.leftof(30),
        y: defender.y + 5,
        z: defender.z,
        time: 100
      });
      attacker.anim({
        x: defender.leftof(30),
        y: defender.y + 80,
        z: defender.behind(-30),
        time: 200
      }, "ballisticUp");
      attacker.anim({
        x: defender.leftof(-30),
        y: defender.y + 5,
        z: defender.z,
        time: 100
      });
      attacker.anim({
        time: 500
      }, "ballistic2Back");
      defender.delay(450);
      defender.anim({
        z: defender.behind(20),
        time: 100
      }, "swing");
      defender.anim({
        time: 200
      }, "swing");
      defender.anim({
        z: defender.behind(20),
        time: 100
      }, "swing");
      defender.anim({
        time: 300
      }, "swing");
      scene.showEffect("leftclaw", {
        x: defender.x - 20,
        y: defender.y + 20,
        z: defender.z,
        scale: 0,
        opacity: 1,
        time: 400
      }, {
        x: defender.x - 20,
        y: defender.y + 20,
        z: defender.z,
        scale: 3,
        opacity: 0,
        time: 700
      }, "linear", "fade");
      scene.showEffect("leftclaw", {
        x: defender.x - 20,
        y: defender.y - 20,
        z: defender.z,
        scale: 0,
        opacity: 1,
        time: 400
      }, {
        x: defender.x - 20,
        y: defender.y - 20,
        z: defender.z,
        scale: 3,
        opacity: 0,
        time: 700
      }, "linear", "fade");
      scene.showEffect("rightclaw", {
        x: defender.x + 20,
        y: defender.y + 20,
        z: defender.z,
        scale: 0,
        opacity: 1,
        time: 700
      }, {
        x: defender.x + 20,
        y: defender.y + 20,
        z: defender.z,
        scale: 3,
        opacity: 0,
        time: 1e3
      }, "linear", "fade");
      scene.showEffect("rightclaw", {
        x: defender.x + 20,
        y: defender.y - 20,
        z: defender.z,
        scale: 0,
        opacity: 1,
        time: 700
      }, {
        x: defender.x + 20,
        y: defender.y - 20,
        z: defender.z,
        scale: 3,
        opacity: 0,
        time: 1e3
      }, "linear", "fade");
    }},
  metronome: {anim: function anim(scene, [attacker]) {
      scene.showEffect("pointer", {
        x: attacker.x + 30,
        y: attacker.y + 30,
        z: attacker.z,
        scale: 0.4,
        opacity: 1
      }, {
        x: attacker.x + 40,
        y: attacker.y + 35,
        scale: 0.5,
        xscale: 0.3,
        yscale: 0.6,
        opacity: 1,
        time: 200
      }, "decel", "fade");
      scene.showEffect("pointer", {
        x: attacker.x + 40,
        y: attacker.y + 35,
        z: attacker.z,
        scale: 0.5,
        xscale: 0.3,
        yscale: 0.6,
        opacity: 1,
        time: 200
      }, {
        x: attacker.x + 30,
        y: attacker.y + 30,
        scale: 0.4,
        xscale: 0.4,
        yscale: 0.4,
        opacity: 0,
        time: 400
      }, "decel");
    }},
  minimize: {anim: function anim(scene, [attacker]) {
      scene.showEffect(attacker.sp, {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        opacity: 0.3,
        time: 0
      }, {
        y: attacker.y - 20,
        scale: 0.75,
        opacity: 0,
        time: 400
      }, "accel");
      scene.showEffect(attacker.sp, {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        opacity: 0.3,
        time: 200
      }, {
        y: attacker.y - 25,
        scale: 0.5,
        opacity: 0,
        time: 600
      }, "accel");
      attacker.anim({
        y: attacker.y - 30,
        scale: 0.25,
        time: 600
      }, "linear");
      attacker.anim({
        time: 300
      }, "accel");
    }},
  mirrorcoat: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("wisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.5,
        opacity: 0.2
      }, {
        x: defender.x,
        y: defender.y,
        z: defender.behind(20),
        opacity: 0.6,
        time: 200
      }, "linear", "explode");
      scene.showEffect("waterwisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.5,
        opacity: 0.2,
        time: 50
      }, {
        x: defender.x + 10,
        y: defender.y - 5,
        z: defender.behind(20),
        opacity: 0.6,
        time: 250
      }, "linear", "explode");
      scene.showEffect("waterwisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.5,
        opacity: 0.2,
        time: 100
      }, {
        x: defender.x - 10,
        y: defender.y + 5,
        z: defender.behind(20),
        opacity: 0.6,
        time: 300
      }, "linear", "explode");
      scene.showEffect("wisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.5,
        opacity: 0.2,
        time: 150
      }, {
        x: defender.x,
        y: defender.y - 5,
        z: defender.behind(20),
        opacity: 0.6,
        time: 350
      }, "linear", "explode");
    }},
  mirrormove: {anim: function anim() {
    }},
  mist: {anim: function anim(scene, [attacker, defender]) {
      let xf = [1, -1, 1, -1];
      let yf = [1, -1, -1, 1];
      let xf2 = [1, 0, -1, 0];
      let yf2 = [0, 1, 0, -1];
      for (let i = 0; i < 4; i++) {
        scene.showEffect("waterwisp", {
          x: attacker.x,
          y: attacker.y,
          z: attacker.z,
          scale: 0.5,
          opacity: 0.7
        }, {
          x: attacker.x + 120 * xf[i],
          y: attacker.y,
          z: attacker.z + 68 * yf[i],
          scale: 1,
          opacity: 0,
          time: 800
        }, "decel", "fade");
        scene.showEffect("waterwisp", {
          x: attacker.x,
          y: attacker.y,
          z: attacker.z,
          scale: 0.5,
          opacity: 0.7
        }, {
          x: attacker.x + 113 * xf2[i],
          y: attacker.y,
          z: attacker.z + 97 * yf2[i],
          scale: 1,
          opacity: 0,
          time: 800
        }, "decel", "fade");
        scene.showEffect("wisp", {
          x: attacker.x,
          y: attacker.y,
          z: attacker.z,
          scale: 1,
          opacity: 0.7
        }, {
          x: attacker.x + 120 * xf[i],
          y: attacker.y,
          z: attacker.z + 68 * yf[i],
          scale: 1.5,
          opacity: 0,
          time: 800
        }, "decel", "fade");
        scene.showEffect("wisp", {
          x: attacker.x,
          y: attacker.y,
          z: attacker.z,
          scale: 1,
          opacity: 0.7
        }, {
          x: attacker.x + 113 * xf2[i],
          y: attacker.y,
          z: attacker.z + 97 * yf2[i],
          scale: 1.5,
          opacity: 0,
          time: 800
        }, "decel", "fade");
      }
    }},
  mudslap: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("mudwisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.4,
        opacity: 0.3
      }, {
        x: defender.x + 10,
        y: defender.y + 5,
        z: defender.behind(30),
        scale: 1,
        opacity: 0.6
      }, "decel", "explode");
      scene.showEffect("mudwisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.4,
        opacity: 0.3,
        time: 75
      }, {
        x: defender.x - 10,
        y: defender.y - 5,
        z: defender.behind(30),
        scale: 1,
        opacity: 0.6
      }, "decel", "explode");
      scene.showEffect("mudwisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.4,
        opacity: 0.3,
        time: 150
      }, {
        x: defender.x,
        y: defender.y + 5,
        z: defender.behind(30),
        scale: 1,
        opacity: 0.6
      }, "decel", "explode");
    }},
  nightmare: {anim: function anim(scene, [attacker, defender]) {
      scene.backgroundEffect("#550000", 250, 0.3);
      scene.backgroundEffect("#000000", 250, 0.2, 400);
      scene.showEffect(attacker.sp, {
        x: attacker.x,
        y: attacker.y + 30,
        z: attacker.z,
        scale: 3,
        opacity: 0.3,
        time: 50
      }, {
        x: defender.x,
        y: defender.y + 35,
        z: defender.z,
        scale: 3.5,
        opacity: 0.1,
        time: 600
      }, "accel", "fade");
    }},
  nightshade: {anim: function anim(scene, [attacker, defender]) {
      scene.backgroundEffect("#550000", 250, 0.3);
      scene.backgroundEffect("#000000", 250, 0.2, 400);
      scene.showEffect(attacker.sp, {
        x: attacker.x,
        y: attacker.y + 30,
        z: attacker.z,
        scale: 3,
        opacity: 0.3,
        time: 50
      }, {
        x: defender.x,
        y: defender.y + 35,
        z: defender.z,
        scale: 3.5,
        opacity: 0.1,
        time: 600
      }, "accel", "fade");
    }},
  outrage: {anim: function anim(scene, [attacker, defender]) {
      scene.backgroundEffect("linear-gradient(#390000 30%, #B84038)", 600, 0.6, 400);
      scene.showEffect("angry", {
        x: attacker.x - 10,
        y: attacker.y + 50,
        z: attacker.z,
        scale: 0.5,
        opacity: 1,
        time: 0
      }, {
        scale: 3,
        opacity: 0,
        time: 300
      }, "ballistic2Under", "fade");
      scene.showEffect("purplewisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0,
        opacity: 1,
        time: 0
      }, {
        x: attacker.x - 50,
        y: attacker.y - 50,
        scale: 2,
        opacity: 0,
        time: 300
      }, "ballistic");
      scene.showEffect("purplewisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0,
        opacity: 1,
        time: 150
      }, {
        x: attacker.x + 60,
        y: attacker.y - 50,
        scale: 2,
        opacity: 0,
        time: 450
      }, "ballistic");
      scene.showEffect("purplewisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0,
        opacity: 1,
        time: 300
      }, {
        x: attacker.x + 10,
        y: attacker.y - 60,
        scale: 2,
        opacity: 0,
        time: 600
      }, "ballistic");
      scene.showEffect("flareball", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0,
        opacity: 0.5,
        time: 600
      }, {
        scale: 4,
        opacity: 0,
        time: 900
      }, "linear");
      scene.showEffect("flareball", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0,
        opacity: 0.5,
        time: 800
      }, {
        scale: 4,
        opacity: 0,
        time: 1100
      }, "linear");
      attacker.delay(300);
      attacker.anim({
        x: defender.leftof(20),
        y: defender.y,
        z: defender.behind(-5),
        time: 300
      }, "accel");
      attacker.anim({
        time: 500
      }, "ballistic2Back");
      defender.delay(580);
      defender.anim({
        z: defender.behind(20),
        time: 200
      }, "decel");
      defender.anim({
        time: 300
      }, "swing");
    }},
  payday: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("electroball", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.1,
        opacity: 0.6
      }, {
        x: defender.x + 30,
        y: defender.y + 30,
        z: defender.z,
        scale: 0.3,
        opacity: 0.3,
        time: 200
      }, "linear", "explode");
      scene.showEffect("electroball", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.1,
        opacity: 0.6,
        time: 75
      }, {
        x: defender.x + 20,
        y: defender.y - 30,
        z: defender.z,
        scale: 0.3,
        opacity: 0.3,
        time: 275
      }, "linear", "explode");
      scene.showEffect("electroball", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.1,
        opacity: 0.6,
        time: 150
      }, {
        x: defender.x - 30,
        y: defender.y,
        z: defender.z,
        scale: 0.3,
        opacity: 0.3,
        time: 350
      }, "linear", "explode");
      scene.showEffect("electroball", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.1,
        opacity: 0.6,
        time: 225
      }, {
        x: defender.x - 10,
        y: defender.y + 10,
        z: defender.z,
        scale: 0.3,
        opacity: 0.3,
        time: 425
      }, "linear", "explode");
      scene.showEffect("electroball", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.1,
        opacity: 0.6,
        time: 300
      }, {
        x: defender.x + 10,
        y: defender.y - 10,
        z: defender.z,
        scale: 0.3,
        opacity: 0.3,
        time: 500
      }, "linear", "explode");
      scene.showEffect("electroball", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.1,
        opacity: 0.6,
        time: 375
      }, {
        x: defender.x - 20,
        y: defender.y,
        z: defender.z,
        scale: 0.3,
        opacity: 0.3,
        time: 575
      }, "linear", "explode");
    }},
  peck: {anim: function anim(scene, [attacker, defender]) {
      attacker.anim({
        x: defender.x,
        y: defender.y + 80,
        z: defender.behind(-30),
        time: 400
      }, "ballistic");
      attacker.anim({
        x: defender.x,
        y: defender.y + 5,
        z: defender.z,
        time: 100
      });
      attacker.anim({
        time: 500
      }, "ballistic2Back");
      defender.delay(450);
      defender.anim({
        z: defender.behind(20),
        time: 100
      }, "swing");
      defender.anim({
        time: 300
      }, "swing");
      scene.wait(500);
    }},
  petaldance: {anim: function anim(scene, [attacker, defender]) {
      scene.backgroundEffect("#FF99FF", 1400, 0.5);
      attacker.anim({ x: attacker.x - 10, time: 100 });
      attacker.anim({ x: attacker.x + 10, time: 200 });
      attacker.anim({ x: attacker.x, time: 100 });
      attacker.anim({
        x: defender.x,
        y: defender.y + 50,
        z: defender.behind(-150),
        time: 200
      }, "ballistic2");
      attacker.anim({
        x: defender.x,
        y: defender.y,
        z: defender.behind(-100),
        time: 100
      }, "accel");
      attacker.anim({ z: attacker.z, time: 400 }, "swing");
      scene.showEffect("petal", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0,
        opacity: 1,
        time: 0
      }, {
        x: attacker.x - 45,
        y: attacker.y - 45,
        scale: 2,
        opacity: 0,
        time: 300
      }, "decel");
      scene.showEffect("petal", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0,
        opacity: 1,
        time: 150
      }, {
        x: attacker.x + 50,
        y: attacker.y - 30,
        scale: 2,
        opacity: 0,
        time: 450
      }, "decel");
      scene.showEffect("petal", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0,
        opacity: 1,
        time: 250
      }, {
        x: attacker.x + 25,
        y: attacker.y - 60,
        scale: 2,
        opacity: 0,
        time: 550
      }, "decel");
      scene.showEffect("petal", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0,
        opacity: 1,
        time: 300
      }, {
        x: attacker.x - 40,
        y: attacker.y - 40,
        scale: 2,
        opacity: 0,
        time: 600
      }, "decel");
      scene.showEffect("mistball", {
        x: attacker.x,
        y: attacker.y,
        z: defender.behind(-100),
        scale: 0.6,
        opacity: 1,
        time: 700
      }, {
        x: defender.x + 30,
        y: defender.y + 30,
        z: defender.z,
        scale: 0.8,
        opacity: 0.6,
        time: 900
      }, "ballistic", "explode");
      scene.showEffect("petal", {
        x: attacker.x,
        y: attacker.y,
        z: defender.behind(-100),
        scale: 0.7,
        opacity: 1,
        time: 775
      }, {
        x: defender.x + 20,
        y: defender.y - 30,
        z: defender.z,
        scale: 0.9,
        opacity: 0.6,
        time: 975
      }, "ballistic2Under", "explode");
      scene.showEffect("mistball", {
        x: attacker.x,
        y: attacker.y,
        z: defender.behind(-100),
        scale: 0.5,
        opacity: 0.6,
        time: 850
      }, {
        x: defender.x - 30,
        y: defender.y,
        z: defender.z,
        scale: 0.8,
        opacity: 0.3,
        time: 1050
      }, "ballistic2", "explode");
      scene.showEffect("petal", {
        x: attacker.x,
        y: attacker.y,
        z: defender.behind(-100),
        scale: 0.6,
        opacity: 1,
        time: 925
      }, {
        x: defender.x - 10,
        y: defender.y + 10,
        z: defender.z,
        scale: 0.9,
        opacity: 0.6,
        time: 1125
      }, "ballistic", "explode");
      scene.showEffect("petal", {
        x: attacker.x,
        y: attacker.y,
        z: defender.behind(-100),
        scale: 0.8,
        opacity: 1,
        time: 1e3
      }, {
        x: defender.x + 10,
        y: defender.y - 10,
        z: defender.z,
        scale: 1,
        opacity: 0.6,
        time: 1200
      }, "linear", "explode");
      scene.showEffect("petal", {
        x: attacker.x,
        y: attacker.y,
        z: defender.behind(-100),
        scale: 0.8,
        opacity: 0.6,
        time: 1075
      }, {
        x: defender.x - 20,
        y: defender.y,
        z: defender.z,
        scale: 0.9,
        opacity: 0.3,
        time: 1175
      }, "ballistic2", "explode");
      defender.delay(825);
      defender.anim({
        z: defender.behind(5),
        time: 75
      }, "swing");
      defender.anim({
        time: 75
      }, "swing");
      defender.anim({
        z: defender.behind(5),
        time: 75
      }, "swing");
      defender.anim({
        time: 75
      }, "swing");
      defender.anim({
        z: defender.behind(5),
        time: 75
      }, "swing");
      defender.anim({
        time: 75
      }, "swing");
      defender.anim({
        z: defender.behind(5),
        time: 75
      }, "swing");
      defender.anim({
        time: 150
      }, "swing");
    }},
  pinmissile: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("energyball", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.4,
        opacity: 0.6
      }, {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        opacity: 0.6,
        time: 300
      }, "linear", "explode");
      scene.showEffect("energyball", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.2,
        opacity: 0.6,
        time: 30
      }, {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        opacity: 0.6,
        time: 330
      }, "linear", "fade");
    }},
  poisongas: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("purplewisp", {
        x: defender.x + 10,
        y: defender.y - 35,
        z: defender.z,
        scale: 0.4,
        opacity: 1,
        time: 0
      }, {
        x: defender.x + 10,
        y: defender.y + 20,
        scale: 0.7,
        opacity: 0,
        time: 300
      }, "linear");
      scene.showEffect("purplewisp", {
        x: defender.x - 30,
        y: defender.y - 35,
        z: defender.z,
        scale: 0.4,
        opacity: 1,
        time: 100
      }, {
        x: defender.x - 30,
        y: defender.y + 20,
        scale: 0.7,
        opacity: 0,
        time: 400
      }, "linear");
      scene.showEffect("purplewisp", {
        x: defender.x + 40,
        y: defender.y - 35,
        z: defender.z,
        scale: 0.4,
        opacity: 1,
        time: 200
      }, {
        x: defender.x + 40,
        y: defender.y + 20,
        scale: 0.7,
        opacity: 0,
        time: 500
      }, "linear");
    }},
  poisonpowder: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("purplewisp", {
        x: defender.x + 10,
        y: defender.y + 90,
        z: defender.z,
        opacity: 0,
        scale: 0.4
      }, {
        y: defender.y - 5,
        opacity: 1,
        time: 500
      }, "decel", "fade");
      scene.showEffect("purplewisp", {
        x: defender.x + 30,
        y: defender.y + 90,
        z: defender.z,
        opacity: 0,
        scale: 0.4,
        time: 150
      }, {
        y: defender.y - 5,
        opacity: 1,
        time: 650
      }, "decel", "fade");
      scene.showEffect("purplewisp", {
        x: defender.x - 30,
        y: defender.y + 90,
        z: defender.z,
        opacity: 0,
        scale: 0.4,
        time: 300
      }, {
        y: defender.y - 5,
        opacity: 1,
        time: 800
      }, "decel", "fade");
    }},
  poisonsting: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("purplewisp", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0,
        opacity: 1,
        time: 400
      }, {
        x: defender.leftof(-20),
        y: defender.y,
        z: defender.behind(50),
        scale: 3,
        opacity: 0,
        time: 700
      }, "linear");
      scene.showEffect("purplewisp", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0,
        opacity: 1,
        time: 500
      }, {
        x: defender.leftof(-20),
        y: defender.y,
        z: defender.behind(50),
        scale: 3,
        opacity: 0,
        time: 800
      }, "linear");
      scene.showEffect("purplewisp", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 1,
        opacity: 1,
        time: 400
      }, {
        x: defender.leftof(-20),
        y: defender.y,
        z: defender.behind(50),
        scale: 2,
        opacity: 0,
        time: 800
      }, "linear");
      attacker.anim({
        x: defender.leftof(20),
        y: defender.y,
        z: defender.behind(-20),
        time: 400
      }, "ballistic2Under");
      attacker.anim({
        x: defender.x,
        y: defender.y,
        z: defender.z,
        time: 50
      });
      attacker.anim({
        time: 500
      }, "ballistic2");
      defender.delay(425);
      defender.anim({
        x: defender.leftof(-20),
        y: defender.y,
        z: defender.behind(20),
        time: 50
      }, "swing");
      defender.anim({
        time: 300
      }, "swing");
    }},
  pound: {anim: function anim(scene, [attacker, defender]) {
      attacker.anim({
        x: defender.x,
        y: defender.y + 80,
        z: defender.behind(-30),
        time: 400
      }, "ballistic");
      attacker.anim({
        x: defender.x,
        y: defender.y + 5,
        z: defender.z,
        time: 100
      });
      attacker.anim({
        time: 500
      }, "ballistic2Back");
      defender.delay(450);
      defender.anim({
        z: defender.behind(20),
        time: 100
      }, "swing");
      defender.anim({
        time: 300
      }, "swing");
      scene.wait(500);
    }},
  present: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("iceball", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 1,
        opacity: 0.3
      }, {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 1,
        opacity: 0.6,
        time: 500
      }, "linear", "explode");
    }},
  protect: {anim: function anim(scene, [attacker]) {
      scene.showEffect("wisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 2,
        opacity: 0.2,
        time: 0
      }, {
        scale: 0,
        opacity: 1,
        time: 300
      }, "linear");
      scene.showEffect("wisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 2,
        opacity: 0.2,
        time: 200
      }, {
        scale: 0,
        opacity: 1,
        time: 500
      }, "linear");
    }},
  psybeam: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("mistball", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.5,
        opacity: 0.2
      }, {
        x: defender.x,
        y: defender.y,
        z: defender.behind(20),
        opacity: 0.6,
        time: 200
      }, "linear", "explode");
      scene.showEffect("purplewisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.5,
        opacity: 0.2,
        time: 50
      }, {
        x: defender.x + 10,
        y: defender.y - 5,
        z: defender.behind(20),
        opacity: 0.6,
        time: 250
      }, "linear", "explode");
      scene.showEffect("mistball", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.5,
        opacity: 0.2,
        time: 100
      }, {
        x: defender.x - 10,
        y: defender.y + 5,
        z: defender.behind(20),
        opacity: 0.6,
        time: 300
      }, "linear", "explode");
      scene.showEffect("purplewisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.5,
        opacity: 0.2,
        time: 150
      }, {
        x: defender.x,
        y: defender.y - 5,
        z: defender.behind(20),
        opacity: 0.6,
        time: 350
      }, "linear", "explode");
    }},
  psychic: {anim: function anim(scene, [attacker, defender]) {
      scene.backgroundEffect("#AA44BB", 250, 0.6);
      scene.backgroundEffect("#AA44FF", 250, 0.6, 400);
      defender.anim({
        scale: 1.2,
        time: 100
      });
      defender.anim({
        scale: 1,
        time: 100
      });
      defender.anim({
        scale: 1.4,
        time: 150
      });
      defender.anim({
        scale: 1,
        time: 150
      });
      scene.wait(700);
    }},
  psychup: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("wisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0,
        opacity: 1,
        time: 0
      }, {
        scale: 3,
        opacity: 0,
        time: 300
      }, "linear");
      scene.showEffect("wisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0,
        opacity: 1,
        time: 200
      }, {
        scale: 3,
        opacity: 0,
        time: 500
      }, "linear");
      scene.showEffect("wisp", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0,
        opacity: 1,
        time: 0
      }, {
        scale: 3,
        opacity: 0,
        time: 300
      }, "linear");
      scene.showEffect("wisp", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0,
        opacity: 1,
        time: 200
      }, {
        scale: 3,
        opacity: 0,
        time: 500
      }, "linear");
    }},
  psywave: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("mistball", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.5,
        opacity: 0.2
      }, {
        x: defender.x,
        y: defender.y,
        z: defender.behind(20),
        opacity: 0.6,
        time: 200
      }, "linear", "explode");
      scene.showEffect("purplewisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.5,
        opacity: 0.2,
        time: 50
      }, {
        x: defender.x + 10,
        y: defender.y - 5,
        z: defender.behind(20),
        opacity: 0.6,
        time: 250
      }, "linear", "explode");
      scene.showEffect("mistball", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.5,
        opacity: 0.2,
        time: 100
      }, {
        x: defender.x - 10,
        y: defender.y + 5,
        z: defender.behind(20),
        opacity: 0.6,
        time: 300
      }, "linear", "explode");
      scene.showEffect("purplewisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.5,
        opacity: 0.2,
        time: 150
      }, {
        x: defender.x,
        y: defender.y - 5,
        z: defender.behind(20),
        opacity: 0.6,
        time: 350
      }, "linear", "explode");
    }},
  pursuit: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("shadowball", {
        x: defender.x,
        y: defender.y,
        z: defender.behind(15),
        scale: 0,
        opacity: 0.2,
        time: 600
      }, {
        scale: 1.5,
        opacity: 0,
        time: 1e3
      }, "linear");
      attacker.delay(300);
      attacker.anim({
        x: defender.leftof(20),
        y: defender.y,
        z: defender.behind(-20),
        time: 300
      }, "ballistic2Under");
      attacker.anim({
        x: defender.leftof(5),
        y: defender.y,
        z: defender.behind(15),
        time: 50
      });
      attacker.anim({
        time: 500
      }, "ballistic2");
      defender.anim({
        x: defender.x,
        y: defender.y,
        z: defender.behind(15),
        time: 600
      }, "accel");
      defender.delay(25);
      defender.anim({
        x: defender.x,
        y: defender.y,
        z: defender.behind(30),
        time: 100
      }, "swing");
      defender.anim({
        time: 400
      }, "swing");
    }},
  quickattack: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("wisp", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0,
        opacity: 0.5,
        time: 260
      }, {
        scale: 2,
        opacity: 0,
        time: 560
      }, "linear");
      scene.showEffect("wisp", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0,
        opacity: 0.5,
        time: 310
      }, {
        scale: 2,
        opacity: 0,
        time: 610
      }, "linear");
      scene.showEffect(attacker.sp, {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        opacity: 0.3,
        time: 50
      }, {
        x: defender.x,
        y: defender.y,
        z: defender.behind(70),
        time: 350
      }, "accel", "fade");
      scene.showEffect(attacker.sp, {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        opacity: 0.3,
        time: 100
      }, {
        x: defender.x,
        y: defender.y,
        z: defender.behind(70),
        time: 400
      }, "accel", "fade");
      attacker.anim({
        x: defender.x,
        y: defender.y,
        z: defender.behind(70),
        time: 300,
        opacity: 0.5
      }, "accel");
      attacker.anim({
        x: defender.x,
        y: defender.x,
        z: defender.behind(100),
        opacity: 0,
        time: 100
      }, "linear");
      attacker.anim({
        x: attacker.x,
        y: attacker.y,
        z: attacker.behind(70),
        opacity: 0,
        time: 1
      }, "linear");
      attacker.anim({
        opacity: 1,
        time: 500
      }, "decel");
      defender.delay(260);
      defender.anim({
        z: defender.behind(30),
        time: 100
      }, "swing");
      defender.anim({
        time: 300
      }, "swing");
    }},
  rage: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("angry", {
        x: attacker.x - 10,
        y: attacker.y + 50,
        z: attacker.z,
        scale: 0.5,
        opacity: 1,
        time: 0
      }, {
        scale: 3,
        opacity: 0,
        time: 300
      }, "ballistic2Under", "fade");
      attacker.delay(300);
      attacker.anim({
        x: defender.leftof(-30),
        y: defender.y + 80,
        z: defender.behind(-30),
        time: 300
      }, "ballistic");
      attacker.anim({
        x: defender.leftof(30),
        y: defender.y + 5,
        z: defender.z,
        time: 100
      });
      attacker.anim({
        x: defender.leftof(30),
        y: defender.y + 80,
        z: defender.behind(-30),
        time: 200
      }, "ballisticUp");
      attacker.anim({
        x: defender.leftof(-30),
        y: defender.y + 5,
        z: defender.z,
        time: 100
      });
      attacker.anim({
        time: 500
      }, "ballistic2Back");
      defender.delay(750);
      defender.anim({
        z: defender.behind(20),
        time: 100
      }, "swing");
      defender.anim({
        time: 200
      }, "swing");
      defender.anim({
        z: defender.behind(15),
        time: 300
      }, "decel");
      defender.anim({
        time: 300
      }, "swing");
      scene.showEffect("foot", {
        x: defender.x - 10,
        y: defender.y + 20,
        z: defender.z,
        scale: 1,
        opacity: 1,
        time: 650
      }, {
        x: defender.x - 15,
        y: defender.y + 10,
        z: defender.behind(15),
        scale: 2,
        opacity: 0,
        time: 950
      }, "linear");
      scene.showEffect("fist", {
        x: defender.x - 5,
        y: defender.y - 5,
        z: defender.z,
        scale: 0.6,
        opacity: 0.6,
        time: 675
      }, {
        x: defender.x - 10,
        y: defender.y - 10,
        z: defender.z,
        scale: 1,
        opacity: 1,
        time: 875
      }, "linear", "explode");
      scene.showEffect("fist", {
        x: defender.x + 10,
        y: defender.y + 10,
        z: defender.z,
        scale: 0.6,
        opacity: 0.6,
        time: 700
      }, {
        x: defender.x + 20,
        y: defender.y + 20,
        z: defender.z,
        scale: 1,
        opacity: 1,
        time: 900
      }, "linear", "explode");
      scene.showEffect("fist", {
        x: defender.x + 20,
        y: defender.y - 30,
        z: defender.z,
        scale: 0.6,
        opacity: 0.6,
        time: 725
      }, {
        x: defender.x + 30,
        y: defender.y - 25,
        z: defender.z,
        scale: 1,
        opacity: 1,
        time: 925
      }, "linear", "explode");
      scene.showEffect("foot", {
        x: defender.x,
        y: defender.y + 20,
        z: defender.z,
        scale: 1,
        opacity: 1,
        time: 1e3
      }, {
        x: defender.x,
        y: defender.y + 10,
        z: defender.behind(15),
        scale: 2,
        opacity: 0,
        time: 1300
      }, "linear");
    }},
  raindance: {anim: function anim(scene, [attacker]) {
      attacker.anim({ x: attacker.x - 10 });
      attacker.anim({ x: attacker.x + 10 });
      attacker.anim({ x: attacker.x });
    }},
  rapidspin: {anim: function anim(scene, [attacker, defender]) {
      attacker.anim({
        x: defender.x,
        y: defender.y + 60,
        z: defender.behind(-30),
        time: 400
      }, "ballistic2");
      attacker.anim({
        x: defender.x,
        y: defender.y + 5,
        z: defender.z,
        time: 100
      });
      attacker.anim({
        time: 500
      }, "ballistic2");
      defender.delay(450);
      defender.anim({
        z: defender.behind(20),
        time: 100
      }, "swing");
      defender.anim({
        time: 300
      }, "swing");
      scene.wait(500);
    }},
  razorleaf: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("leaf1", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 1.1,
        opacity: 1
      }, {
        x: defender.x + 30,
        y: defender.y + 30,
        z: defender.z,
        scale: 2,
        opacity: 0.6,
        time: 200
      }, "linear", "explode");
      scene.showEffect("leaf2", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 1.1,
        opacity: 1,
        time: 75
      }, {
        x: defender.x + 20,
        y: defender.y - 30,
        z: defender.z,
        scale: 2,
        opacity: 0.6,
        time: 275
      }, "linear", "explode");
      scene.showEffect("leaf1", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 1.1,
        opacity: 1,
        time: 150
      }, {
        x: defender.x - 30,
        y: defender.y,
        z: defender.z,
        scale: 2,
        opacity: 0.6,
        time: 350
      }, "linear", "explode");
      scene.showEffect("leaf2", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 1.1,
        opacity: 1,
        time: 225
      }, {
        x: defender.x - 10,
        y: defender.y + 10,
        z: defender.z,
        scale: 2,
        opacity: 0.6,
        time: 425
      }, "linear", "explode");
      scene.showEffect("leaf1", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 1.1,
        opacity: 1,
        time: 300
      }, {
        x: defender.x + 10,
        y: defender.y - 10,
        z: defender.z,
        scale: 2,
        opacity: 0.6,
        time: 500
      }, "linear", "explode");
      scene.showEffect("leaf2", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 1.1,
        opacity: 1,
        time: 375
      }, {
        x: defender.x - 20,
        y: defender.y,
        z: defender.z,
        scale: 2,
        opacity: 0.6,
        time: 575
      }, "linear", "explode");
    }},
  recover: {anim: function anim(scene, [attacker]) {
      scene.showEffect("electroball", {
        x: attacker.x - 60,
        y: attacker.y + 40,
        z: attacker.z,
        scale: 0.7,
        opacity: 0.7,
        time: 0
      }, {
        x: attacker.x,
        y: attacker.y,
        scale: 0.2,
        opacity: 0.2,
        time: 300
      }, "linear", "fade");
      scene.showEffect("electroball", {
        x: attacker.x + 60,
        y: attacker.y - 5,
        z: attacker.z,
        scale: 0.7,
        opacity: 0.7,
        time: 100
      }, {
        x: attacker.x,
        y: attacker.y,
        scale: 0.2,
        opacity: 0.2,
        time: 300
      }, "linear", "fade");
      scene.showEffect("electroball", {
        x: attacker.x - 30,
        y: attacker.y + 60,
        z: attacker.z,
        scale: 0.7,
        opacity: 0.7,
        time: 100
      }, {
        x: attacker.x,
        y: attacker.y,
        scale: 0.2,
        opacity: 0.2,
        time: 400
      }, "linear", "fade");
      scene.showEffect("electroball", {
        x: attacker.x + 20,
        y: attacker.y - 50,
        z: attacker.z,
        scale: 0.7,
        opacity: 0.7,
        time: 100
      }, {
        x: attacker.x,
        y: attacker.y,
        scale: 0.2,
        opacity: 0.2,
        time: 400
      }, "linear", "fade");
      scene.showEffect("electroball", {
        x: attacker.x - 70,
        y: attacker.y - 50,
        z: attacker.z,
        scale: 0.7,
        opacity: 0.7,
        time: 200
      }, {
        x: attacker.x,
        y: attacker.y,
        scale: 0.2,
        opacity: 0.2,
        time: 500
      }, "linear", "fade");
    }},
  reflect: {anim: function anim() {
    }},
  rest: {anim: function anim(scene, [attacker]) {
      scene.showEffect("wisp", {
        x: attacker.x,
        y: attacker.y + 20,
        z: attacker.z,
        scale: 0.5,
        opacity: 0.1
      }, {
        x: attacker.x,
        y: attacker.y + 20,
        z: attacker.behind(-50),
        scale: 1.5,
        opacity: 1,
        time: 400
      }, "ballistic2Under", "fade");
      scene.showEffect("wisp", {
        x: attacker.x,
        y: attacker.y + 20,
        z: attacker.z,
        scale: 0.5,
        opacity: 0.1,
        time: 200
      }, {
        x: attacker.x,
        y: attacker.y + 20,
        z: attacker.behind(-50),
        scale: 1.5,
        opacity: 1,
        time: 600
      }, "ballistic2Under", "fade");
    }},
  return: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("heart", {
        x: attacker.x - 10,
        y: attacker.y + 50,
        z: attacker.z,
        scale: 0.5,
        opacity: 1,
        time: 0
      }, {
        scale: 3,
        opacity: 0,
        time: 300
      }, "ballistic2Under", "fade");
      attacker.delay(300);
      attacker.anim({
        x: defender.leftof(-30),
        y: defender.y + 80,
        z: defender.behind(-30),
        time: 300
      }, "ballistic");
      attacker.anim({
        x: defender.leftof(30),
        y: defender.y + 5,
        z: defender.z,
        time: 100
      });
      attacker.anim({
        x: defender.leftof(30),
        y: defender.y + 80,
        z: defender.behind(-30),
        time: 200
      }, "ballisticUp");
      attacker.anim({
        x: defender.leftof(-30),
        y: defender.y + 5,
        z: defender.z,
        time: 100
      });
      attacker.anim({
        time: 500
      }, "ballistic2Back");
      defender.delay(750);
      defender.anim({
        z: defender.behind(20),
        time: 100
      }, "swing");
      defender.anim({
        time: 200
      }, "swing");
      defender.anim({
        z: defender.behind(15),
        time: 300
      }, "decel");
      defender.anim({
        time: 300
      }, "swing");
      scene.showEffect("foot", {
        x: defender.x - 10,
        y: defender.y + 20,
        z: defender.z,
        scale: 1,
        opacity: 1,
        time: 650
      }, {
        x: defender.x - 15,
        y: defender.y + 10,
        z: defender.behind(15),
        scale: 2,
        opacity: 0,
        time: 950
      }, "linear");
      scene.showEffect("fist", {
        x: defender.x - 5,
        y: defender.y - 5,
        z: defender.z,
        scale: 0.6,
        opacity: 0.6,
        time: 675
      }, {
        x: defender.x - 10,
        y: defender.y - 10,
        z: defender.z,
        scale: 1,
        opacity: 1,
        time: 875
      }, "linear", "explode");
      scene.showEffect("fist", {
        x: defender.x + 10,
        y: defender.y + 10,
        z: defender.z,
        scale: 0.6,
        opacity: 0.6,
        time: 700
      }, {
        x: defender.x + 20,
        y: defender.y + 20,
        z: defender.z,
        scale: 1,
        opacity: 1,
        time: 900
      }, "linear", "explode");
      scene.showEffect("fist", {
        x: defender.x + 20,
        y: defender.y - 30,
        z: defender.z,
        scale: 0.6,
        opacity: 0.6,
        time: 725
      }, {
        x: defender.x + 30,
        y: defender.y - 25,
        z: defender.z,
        scale: 1,
        opacity: 1,
        time: 925
      }, "linear", "explode");
      scene.showEffect("foot", {
        x: defender.x,
        y: defender.y + 20,
        z: defender.z,
        scale: 1,
        opacity: 1,
        time: 1e3
      }, {
        x: defender.x,
        y: defender.y + 10,
        z: defender.behind(15),
        scale: 2,
        opacity: 0,
        time: 1300
      }, "linear");
    }},
  roar: {anim: function anim(scene, [attacker]) {
      scene.showEffect("wisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0,
        opacity: 0.7,
        time: 0
      }, {
        z: attacker.behind(-50),
        scale: 5,
        opacity: 0,
        time: 400
      }, "linear");
      scene.showEffect("wisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0,
        opacity: 0.7,
        time: 150
      }, {
        z: attacker.behind(-50),
        scale: 5,
        opacity: 0,
        time: 600
      }, "linear");
      scene.showEffect("wisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0,
        opacity: 0.7,
        time: 300
      }, {
        z: attacker.behind(-50),
        scale: 5,
        opacity: 0,
        time: 800
      }, "linear");
    }},
  rockslide: {anim: function anim(scene, [attacker, ...defenders]) {
      for (const defender of defenders) {
        defender.delay(200);
        defender.anim({
          y: defender.y - 7,
          yscale: 0.9,
          time: 100
        }, "decel");
        defender.anim({
          time: 200
        });
        defender.delay(200);
        defender.anim({
          y: defender.y - 7,
          yscale: 0.9,
          time: 100
        }, "decel");
        defender.anim({
          time: 200
        });
        scene.showEffect("rock1", {
          x: defender.x + 15,
          y: defender.y + 100,
          z: defender.z,
          opacity: 0,
          scale: 0.5
        }, {
          y: defender.y - 30,
          opacity: 1,
          time: 300
        }, "accel", "explode");
        scene.showEffect("rock2", {
          x: defender.x + 30,
          y: defender.y + 100,
          z: defender.z,
          opacity: 0,
          scale: 0.5,
          time: 100
        }, {
          y: defender.y - 30,
          opacity: 1,
          time: 400
        }, "accel", "explode");
        scene.showEffect("rock1", {
          x: defender.x - 30,
          y: defender.y + 100,
          z: defender.z,
          opacity: 0,
          scale: 0.5,
          time: 200
        }, {
          y: defender.y - 30,
          opacity: 1,
          time: 500
        }, "accel", "explode");
        scene.showEffect("rock2", {
          x: defender.x,
          y: defender.y + 100,
          z: defender.z,
          opacity: 0,
          scale: 0.5,
          time: 300
        }, {
          y: defender.y - 30,
          opacity: 1,
          time: 600
        }, "accel", "explode");
        scene.showEffect("rock1", {
          x: defender.x - 15,
          y: defender.y + 100,
          z: defender.z,
          opacity: 0,
          scale: 0.5,
          time: 400
        }, {
          y: defender.y - 30,
          opacity: 1,
          time: 700
        }, "accel", "explode");
        scene.showEffect("mudwisp", {
          x: defender.x + 40,
          y: defender.y - 40,
          z: defender.z,
          scale: 0,
          opacity: 0.4,
          time: 300
        }, {
          scale: 2,
          opacity: 0
        }, "decel");
        scene.showEffect("mudwisp", {
          x: defender.x - 40,
          y: defender.y - 40,
          z: defender.z,
          scale: 0,
          opacity: 0.4,
          time: 450
        }, {
          scale: 2,
          opacity: 0
        }, "decel");
        scene.showEffect("mudwisp", {
          x: defender.x + 10,
          y: defender.y - 40,
          z: defender.z,
          scale: 0,
          opacity: 0.4,
          time: 600
        }, {
          scale: 2,
          opacity: 0
        }, "decel");
      }
    }},
  rocksmash: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("wisp", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0,
        opacity: 1,
        time: 400
      }, {
        x: defender.leftof(-20),
        y: defender.y,
        z: defender.behind(20),
        scale: 3,
        opacity: 0,
        time: 700
      }, "linear");
      scene.showEffect("wisp", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0,
        opacity: 1,
        time: 500
      }, {
        x: defender.leftof(-20),
        y: defender.y,
        z: defender.behind(20),
        scale: 3,
        opacity: 0,
        time: 800
      }, "linear");
      scene.showEffect("fist", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 1,
        opacity: 1,
        time: 400
      }, {
        x: defender.leftof(-20),
        y: defender.y,
        z: defender.behind(20),
        scale: 2,
        opacity: 0,
        time: 800
      }, "linear");
      attacker.anim({
        x: defender.leftof(20),
        y: defender.y,
        z: defender.behind(-20),
        time: 400
      }, "ballistic2Under");
      attacker.anim({
        x: defender.x,
        y: defender.y,
        z: defender.z,
        time: 50
      });
      attacker.anim({
        time: 500
      }, "ballistic2");
      defender.delay(425);
      defender.anim({
        x: defender.leftof(-15),
        y: defender.y,
        z: defender.behind(15),
        time: 50
      }, "swing");
      defender.anim({
        time: 300
      }, "swing");
    }},
  rockthrow: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("rock1", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.3,
        opacity: 0
      }, {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 1,
        opacity: 1,
        time: 400
      }, "ballistic", "explode");
    }},
  rollingkick: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("foot", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 1,
        opacity: 1,
        time: 450
      }, {
        x: defender.leftof(20),
        y: defender.y,
        z: defender.behind(20),
        scale: 2,
        opacity: 0,
        time: 750
      }, "linear");
      scene.showEffect("foot", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 1,
        opacity: 1,
        time: 750
      }, {
        x: defender.leftof(-20),
        y: defender.y,
        z: defender.behind(20),
        scale: 2,
        opacity: 0,
        time: 1050
      }, "linear");
      SD_OUTRAS.xattack.anim(scene, [attacker, defender]);
    }},
  rollout: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("wisp", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0,
        opacity: 0.5,
        time: 260
      }, {
        scale: 2,
        opacity: 0,
        time: 560
      }, "linear");
      scene.showEffect("wisp", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0,
        opacity: 0.5,
        time: 310
      }, {
        scale: 2,
        opacity: 0,
        time: 610
      }, "linear");
      scene.showEffect(attacker.sp, {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        opacity: 0.3,
        time: 50
      }, {
        x: defender.x,
        y: defender.y,
        z: defender.behind(70),
        time: 350
      }, "accel", "fade");
      scene.showEffect(attacker.sp, {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        opacity: 0.3,
        time: 100
      }, {
        x: defender.x,
        y: defender.y,
        z: defender.behind(70),
        time: 400
      }, "accel", "fade");
      attacker.anim({
        x: defender.x,
        y: defender.y,
        z: defender.behind(70),
        time: 300,
        opacity: 0.5
      }, "accel");
      attacker.anim({
        x: defender.x,
        y: defender.x,
        z: defender.behind(100),
        opacity: 0,
        time: 100
      }, "linear");
      attacker.anim({
        x: attacker.x,
        y: attacker.y,
        z: attacker.behind(70),
        opacity: 0,
        time: 1
      }, "linear");
      attacker.anim({
        opacity: 1,
        time: 500
      }, "decel");
      defender.delay(260);
      defender.anim({
        z: defender.behind(30),
        time: 100
      }, "swing");
      defender.anim({
        time: 300
      }, "swing");
    }},
  sacredfire: {anim: function anim(scene, [attacker, defender]) {
      scene.backgroundEffect("#2630A9", 900, 0.6);
      scene.showEffect("bluefireball", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 1,
        opacity: 0.2
      }, {
        x: defender.x,
        y: defender.y - 40,
        z: defender.z,
        scale: 1.5,
        opacity: 1,
        time: 500
      }, "linear", "fade");
      scene.showEffect("bluefireball", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 1,
        opacity: 0.2,
        time: 50
      }, {
        x: defender.x,
        y: defender.y - 40,
        z: defender.z,
        scale: 1.5,
        opacity: 1,
        time: 550
      }, "linear", "fade");
      scene.showEffect("iceball", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        opacity: 0.8,
        scale: 0,
        time: 550
      }, {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 4,
        opacity: 0.3,
        time: 850
      }, "linear", "fade");
      scene.showEffect("iceball", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        opacity: 0.8,
        scale: 0,
        time: 650
      }, {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 4,
        opacity: 0.3,
        time: 950
      }, "linear", "fade");
      scene.showEffect("bluefireball", {
        x: defender.x,
        y: defender.y - 50,
        z: defender.z,
        scale: 0.6,
        opacity: 0.8,
        time: 550
      }, {
        x: defender.x + 60,
        y: defender.y - 20,
        z: defender.z,
        scale: 1.5,
        opacity: 0.5,
        time: 825
      }, "decel", "explode");
      scene.showEffect("bluefireball", {
        x: defender.x,
        y: defender.y - 50,
        z: defender.z,
        scale: 0.6,
        opacity: 0.8,
        time: 575
      }, {
        x: defender.x - 50,
        y: defender.y - 20,
        z: defender.z,
        scale: 1,
        opacity: 0.5,
        time: 850
      }, "decel", "explode");
      scene.showEffect("bluefireball", {
        x: defender.x,
        y: defender.y - 50,
        z: defender.z,
        scale: 0.6,
        opacity: 0.8,
        time: 600
      }, {
        x: defender.x - 60,
        y: defender.y + 20,
        z: defender.z,
        scale: 1.5,
        opacity: 0.5,
        time: 875
      }, "decel", "explode");
      scene.showEffect("bluefireball", {
        x: defender.x,
        y: defender.y - 50,
        z: defender.z,
        scale: 0.6,
        opacity: 0.8,
        time: 625
      }, {
        x: defender.x + 50,
        y: defender.y + 30,
        z: defender.z,
        scale: 1.5,
        opacity: 0.5,
        time: 900
      }, "decel", "explode");
      scene.showEffect("bluefireball", {
        x: defender.x,
        y: defender.y - 50,
        z: defender.z,
        scale: 0.6,
        opacity: 0.8,
        time: 650
      }, {
        x: defender.x - 10,
        y: defender.y + 60,
        z: defender.z,
        scale: 1.5,
        opacity: 0.5,
        time: 925
      }, "decel", "explode");
    }},
  safeguard: {anim: function anim() {
    }},
  sandattack: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("mudwisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.4,
        opacity: 0.3
      }, {
        x: defender.x + 10,
        y: defender.y + 5,
        z: defender.behind(30),
        scale: 1,
        opacity: 0.6
      }, "decel", "explode");
      scene.showEffect("mudwisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.4,
        opacity: 0.3,
        time: 75
      }, {
        x: defender.x - 10,
        y: defender.y - 5,
        z: defender.behind(30),
        scale: 1,
        opacity: 0.6
      }, "decel", "explode");
      scene.showEffect("mudwisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.4,
        opacity: 0.3,
        time: 150
      }, {
        x: defender.x,
        y: defender.y + 5,
        z: defender.behind(30),
        scale: 1,
        opacity: 0.6
      }, "decel", "explode");
    }},
  sandstorm: {anim: function anim(scene, [attacker]) {
      attacker.anim({ x: attacker.x - 10 });
      attacker.anim({ x: attacker.x + 10 });
      attacker.anim({ x: attacker.x });
    }},
  scaryface: {anim: function anim(scene, [attacker, defender]) {
      scene.backgroundEffect("#AA0000", 250, 0.3);
      scene.backgroundEffect("#000000", 250, 0.2, 400);
      scene.showEffect("stare", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 1,
        yscale: 0,
        opacity: 1
      }, {
        yscale: 1,
        time: 700
      }, "decel", "fade");
    }},
  scratch: {anim: function anim(scene, [attacker, defender]) {
      attacker.anim({
        x: defender.x,
        y: defender.y + 80,
        z: defender.behind(-30),
        time: 400
      }, "ballistic");
      attacker.anim({
        x: defender.x,
        y: defender.y + 5,
        z: defender.z,
        time: 100
      });
      attacker.anim({
        time: 500
      }, "ballistic2Back");
      defender.delay(450);
      defender.anim({
        z: defender.behind(20),
        time: 100
      }, "swing");
      defender.anim({
        time: 300
      }, "swing");
      scene.showEffect("rightslash", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 1,
        opacity: 1,
        time: 500
      }, {
        scale: 3,
        opacity: 0,
        time: 800
      }, "linear", "fade");
    }},
  screech: {anim: function anim(scene, [attacker]) {
      scene.showEffect("wisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0,
        opacity: 0.7,
        time: 0
      }, {
        z: attacker.behind(-50),
        scale: 5,
        opacity: 0,
        time: 400
      }, "linear");
      scene.showEffect("wisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0,
        opacity: 0.7,
        time: 150
      }, {
        z: attacker.behind(-50),
        scale: 5,
        opacity: 0,
        time: 600
      }, "linear");
      scene.showEffect("wisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0,
        opacity: 0.7,
        time: 300
      }, {
        z: attacker.behind(-50),
        scale: 5,
        opacity: 0,
        time: 800
      }, "linear");
    }},
  seismictoss: {anim: function anim(scene, [attacker, defender]) {
      scene.backgroundEffect(`url('https://${SD_CONFIG.routes.client}/fx/bg-space.jpg')`, 500, 0.6, 300);
      scene.showEffect("wisp", {
        x: defender.x,
        y: defender.y + 10,
        z: defender.z,
        scale: 0,
        opacity: 0.5,
        time: 400
      }, {
        scale: 3,
        opacity: 0,
        time: 600
      }, "linear");
      attacker.anim({
        x: defender.x,
        y: defender.y,
        z: defender.behind(-5),
        time: 350
      }, "ballistic2Under");
      attacker.anim({
        x: defender.x,
        y: defender.y + 10,
        z: defender.behind(5),
        time: 50
      }, "ballistic2Under");
      attacker.anim({
        time: 500
      }, "ballistic2Back");
      defender.delay(380);
      defender.anim({
        y: defender.y + 100,
        z: defender.behind(5),
        opacity: 0.5,
        time: 300
      }, "decel");
      defender.anim({
        time: 250
      }, "accel");
      defender.anim({
        x: defender.x,
        y: defender.y - 35,
        yscale: 0.25,
        time: 50
      }, "swing");
      defender.anim({
        time: 300
      }, "swing");
      scene.wait(1e3);
    }},
  selfdestruct: {anim: function anim(scene, [attacker]) {
      scene.showEffect("fireball", {
        x: attacker.x + 40,
        y: attacker.y,
        z: attacker.z,
        scale: 0,
        opacity: 0.6
      }, {
        scale: 6,
        opacity: 0
      }, "decel");
      scene.showEffect("fireball", {
        x: attacker.x - 40,
        y: attacker.y - 20,
        z: attacker.z,
        scale: 0,
        opacity: 0.6,
        time: 150
      }, {
        scale: 6,
        opacity: 0
      }, "decel");
      scene.showEffect("fireball", {
        x: attacker.x + 10,
        y: attacker.y + 20,
        z: attacker.z,
        scale: 0,
        opacity: 0.6,
        time: 300
      }, {
        scale: 6,
        opacity: 0
      }, "decel");
      attacker.delay(450).anim({
        scale: 4,
        time: 400,
        opacity: 0
      }, "linear");
    }},
  shadowball: {anim: function anim(scene, [attacker, defender]) {
      scene.backgroundEffect("#000000", 1e3, 0.1);
      scene.showEffect("purplewisp", {
        x: attacker.x,
        y: attacker.y + 100,
        z: attacker.behind(-20),
        scale: 0.5,
        opacity: 0,
        time: 0
      }, {
        x: attacker.x,
        y: attacker.y,
        scale: 1,
        opacity: 0.8,
        time: 200
      }, "decel", "fade");
      scene.showEffect("purplewisp", {
        x: attacker.x - 60,
        y: attacker.y - 80,
        z: attacker.behind(-20),
        scale: 0.5,
        opacity: 0,
        time: 50
      }, {
        x: attacker.x,
        y: attacker.y,
        scale: 1,
        opacity: 0.8,
        time: 300
      }, "decel", "fade");
      scene.showEffect("purplewisp", {
        x: attacker.x + 60,
        y: attacker.y - 80,
        z: attacker.behind(-20),
        scale: 0.5,
        opacity: 0,
        time: 100
      }, {
        x: attacker.x,
        y: attacker.y,
        scale: 1,
        opacity: 0.8,
        time: 400
      }, "decel", "fade");
      scene.showEffect("purplewisp", {
        x: attacker.x - 90,
        y: attacker.y + 40,
        z: attacker.behind(-20),
        scale: 0.5,
        opacity: 0,
        time: 150
      }, {
        x: attacker.x,
        y: attacker.y,
        scale: 1,
        opacity: 0.8,
        time: 500
      }, "decel", "fade");
      scene.showEffect("purplewisp", {
        x: attacker.x + 90,
        y: attacker.y + 40,
        z: attacker.behind(-20),
        scale: 0.5,
        opacity: 0,
        time: 200
      }, {
        x: attacker.x,
        y: attacker.y,
        scale: 1,
        opacity: 0.8,
        time: 600
      }, "decel", "fade");
      scene.showEffect("shadowball", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.behind(-20),
        scale: 0,
        opacity: 0,
        time: 0
      }, {
        scale: 0.8,
        opacity: 0.5,
        time: 600
      }, "decel", "fade");
      scene.showEffect("purplewisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.behind(-20),
        scale: 0,
        opacity: 0,
        time: 0
      }, {
        scale: 1.5,
        opacity: 0.8,
        time: 600
      }, "decel", "fade");
      scene.showEffect("shadowball", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.behind(-20),
        scale: 0.8,
        opacity: 0.8,
        time: 600
      }, {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        time: 900
      }, "accel", "explode");
      scene.showEffect("purplewisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.behind(-20),
        scale: 1.5,
        opacity: 0.8,
        time: 600
      }, {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 2,
        time: 900
      }, "accel", "explode");
      defender.delay(900);
      defender.anim({
        z: defender.behind(10),
        time: 200
      }, "swing");
      defender.anim({
        time: 300
      }, "swing");
    }},
  shadowpunch: {anim: function anim(scene, [attacker, defender]) {
      scene.backgroundEffect("#000000", 700, 0.3);
      scene.showEffect("wisp", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0,
        opacity: 1,
        time: 400
      }, {
        x: defender.leftof(-20),
        y: defender.y,
        z: defender.behind(20),
        scale: 3,
        opacity: 0,
        time: 700
      }, "linear");
      scene.showEffect("wisp", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0,
        opacity: 1,
        time: 500
      }, {
        x: defender.leftof(-20),
        y: defender.y,
        z: defender.behind(20),
        scale: 3,
        opacity: 0,
        time: 800
      }, "linear");
      scene.showEffect("fist", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 1,
        opacity: 1,
        time: 400
      }, {
        x: defender.leftof(-20),
        y: defender.y,
        z: defender.behind(20),
        scale: 2,
        opacity: 0,
        time: 800
      }, "linear");
      attacker.anim({
        x: attacker.leftof(-20),
        y: attacker.y,
        z: attacker.behind(-20),
        opacity: 0,
        time: 200
      }, "linear");
      attacker.anim({
        x: defender.x,
        y: defender.y,
        z: defender.behind(-120),
        opacity: 0,
        time: 1
      }, "linear");
      attacker.anim({
        x: defender.x,
        y: defender.y,
        z: defender.behind(5),
        opacity: 1,
        time: 200
      }, "linear");
      attacker.anim({
        x: defender.x,
        y: defender.y,
        z: defender.behind(-25),
        opacity: 0,
        time: 300
      }, "linear");
      attacker.anim({
        opacity: 0,
        time: 1
      }, "linear");
      attacker.anim({
        time: 300,
        opacity: 1
      }, "linear");
      defender.delay(400);
      defender.anim({
        z: defender.behind(20),
        time: 100
      }, "swing");
      defender.anim({
        time: 300
      }, "swing");
    }},
  sharpen: {anim: function anim(scene, [attacker]) {
      scene.showEffect("wisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 2,
        opacity: 0.2,
        time: 0
      }, {
        scale: 0,
        opacity: 1,
        time: 300
      }, "linear");
      scene.showEffect("wisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 2,
        opacity: 0.2,
        time: 200
      }, {
        scale: 0,
        opacity: 1,
        time: 500
      }, "linear");
    }},
  sing: {anim: function anim(scene, [attacker]) {
      scene.showEffect("wisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0,
        opacity: 0.7,
        time: 0
      }, {
        z: attacker.behind(-50),
        scale: 5,
        opacity: 0,
        time: 400
      }, "linear");
      scene.showEffect("wisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0,
        opacity: 0.7,
        time: 150
      }, {
        z: attacker.behind(-50),
        scale: 5,
        opacity: 0,
        time: 600
      }, "linear");
      scene.showEffect("wisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0,
        opacity: 0.7,
        time: 300
      }, {
        z: attacker.behind(-50),
        scale: 5,
        opacity: 0,
        time: 800
      }, "linear");
    }},
  skullbash: {anim: function anim(scene, [attacker, defender]) {
      attacker.anim({
        x: defender.x,
        y: defender.y + 80,
        z: defender.behind(-30),
        time: 400
      }, "ballistic");
      attacker.anim({
        x: defender.x,
        y: defender.y + 5,
        z: defender.z,
        time: 100
      });
      attacker.anim({
        time: 500
      }, "ballistic2Back");
      defender.delay(450);
      defender.anim({
        z: defender.behind(20),
        time: 100
      }, "swing");
      defender.anim({
        time: 300
      }, "swing");
      scene.wait(500);
    }},
  skyattack: {anim: function anim(scene, [attacker, defender]) {
      attacker.anim({
        x: attacker.leftof(-200),
        y: attacker.y + 80,
        z: attacker.z,
        opacity: 0,
        time: 350
      }, "accel");
      attacker.anim({
        x: defender.leftof(-200),
        y: defender.y + 80,
        z: defender.z,
        time: 1
      }, "linear");
      attacker.anim({
        x: defender.x,
        y: defender.y,
        z: defender.z,
        opacity: 1,
        time: 350
      }, "accel");
      scene.showEffect("wisp", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0,
        opacity: 0.5,
        time: 700
      }, {
        scale: 2,
        opacity: 0,
        time: 900
      }, "linear");
      attacker.anim({
        x: defender.leftof(100),
        y: defender.y - 40,
        z: defender.z,
        opacity: 0,
        time: 175
      });
      attacker.anim({
        x: attacker.x,
        y: attacker.y + 40,
        z: attacker.behind(40),
        time: 1
      });
      attacker.anim({
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        time: 250
      }, "decel");
      defender.delay(700);
      defender.anim({
        z: defender.behind(20),
        time: 100
      }, "swing");
      defender.anim({
        time: 300
      }, "swing");
    }},
  slam: {anim: function anim(scene, [attacker, defender]) {
      attacker.anim({
        x: defender.x,
        y: defender.y + 80,
        z: defender.behind(-30),
        time: 400
      }, "ballistic");
      attacker.anim({
        x: defender.x,
        y: defender.y + 5,
        z: defender.z,
        time: 100
      });
      attacker.anim({
        time: 500
      }, "ballistic2Back");
      defender.delay(450);
      defender.anim({
        z: defender.behind(20),
        time: 100
      }, "swing");
      defender.anim({
        time: 300
      }, "swing");
      scene.wait(500);
    }},
  slash: {anim: function anim(scene, [attacker, defender]) {
      attacker.anim({
        x: defender.x,
        y: defender.y + 80,
        z: defender.behind(-30),
        time: 400
      }, "ballistic");
      attacker.anim({
        x: defender.x,
        y: defender.y + 5,
        z: defender.z,
        time: 100
      });
      attacker.anim({
        time: 500
      }, "ballistic2Back");
      defender.delay(450);
      defender.anim({
        z: defender.behind(20),
        time: 100
      }, "swing");
      defender.anim({
        time: 300
      }, "swing");
      scene.showEffect("rightslash", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 1,
        opacity: 1,
        time: 500
      }, {
        scale: 3,
        opacity: 0,
        time: 800
      }, "linear", "fade");
    }},
  sleeppowder: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("purplewisp", {
        x: defender.x + 10,
        y: defender.y + 90,
        z: defender.z,
        opacity: 0,
        scale: 0.4
      }, {
        y: defender.y - 5,
        opacity: 1,
        time: 500
      }, "decel", "fade");
      scene.showEffect("purplewisp", {
        x: defender.x + 30,
        y: defender.y + 90,
        z: defender.z,
        opacity: 0,
        scale: 0.4,
        time: 150
      }, {
        y: defender.y - 5,
        opacity: 1,
        time: 650
      }, "decel", "fade");
      scene.showEffect("purplewisp", {
        x: defender.x - 30,
        y: defender.y + 90,
        z: defender.z,
        opacity: 0,
        scale: 0.4,
        time: 300
      }, {
        y: defender.y - 5,
        opacity: 1,
        time: 800
      }, "decel", "fade");
    }},
  sleeptalk: {anim: function anim() {
    }},
  sludge: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("purplewisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.1,
        opacity: 0
      }, {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0.7,
        opacity: 1,
        time: 400
      }, "ballistic", "fade");
      scene.showEffect("purplewisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.1,
        opacity: 0,
        time: 100
      }, {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0.7,
        opacity: 1,
        time: 500
      }, "ballistic", "fade");
      scene.showEffect("purplewisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.1,
        opacity: 0,
        time: 200
      }, {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0.7,
        opacity: 1,
        time: 600
      }, "ballistic", "fade");
    }},
  sludgebomb: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("purplewisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.1,
        opacity: 0
      }, {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0.7,
        opacity: 1,
        time: 400
      }, "ballistic", "explode");
      scene.showEffect("purplewisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.1,
        opacity: 0,
        time: 100
      }, {
        x: defender.x + 40,
        y: defender.y - 20,
        z: defender.z,
        scale: 0.7,
        opacity: 1,
        time: 500
      }, "ballistic", "explode");
      scene.showEffect("purplewisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.1,
        opacity: 0,
        time: 200
      }, {
        x: defender.x - 30,
        y: defender.y - 10,
        z: defender.z,
        scale: 0.7,
        opacity: 1,
        time: 600
      }, "ballistic", "explode");
    }},
  smog: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("purplewisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.7,
        opacity: 0.6,
        time: 0
      }, {
        x: defender.x,
        y: defender.y + 10,
        z: defender.behind(10),
        scale: 1,
        opacity: 0.3,
        time: 400
      }, "decel", "explode");
      scene.showEffect("purplewisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.7,
        opacity: 1,
        time: 100
      }, {
        x: defender.x - 20,
        y: defender.y + 5,
        z: defender.behind(10),
        scale: 1,
        opacity: 0.3,
        time: 500
      }, "decel", "explode");
      scene.showEffect("purplewisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.7,
        opacity: 1,
        time: 200
      }, {
        x: defender.x + 25,
        y: defender.y,
        z: defender.behind(10),
        scale: 1,
        opacity: 0.3,
        time: 600
      }, "decel", "explode");
      scene.showEffect("purplewisp", {
        x: defender.x + 30,
        y: defender.y,
        z: defender.z,
        scale: 1,
        opacity: 1,
        time: 400
      }, {
        x: defender.x + 50,
        y: defender.y + 30,
        scale: 1.4,
        opacity: 0.2,
        time: 800
      }, "decel", "fade");
      scene.showEffect("purplewisp", {
        x: defender.x - 30,
        y: defender.y,
        z: defender.z,
        scale: 1,
        opacity: 1,
        time: 500
      }, {
        x: defender.x - 50,
        y: defender.y + 30,
        scale: 1.4,
        opacity: 0.2,
        time: 900
      }, "decel", "fade");
      scene.showEffect("purplewisp", {
        x: defender.x + 15,
        y: defender.y,
        z: defender.z,
        scale: 1,
        opacity: 1,
        time: 600
      }, {
        x: defender.x + 25,
        y: defender.y + 20,
        scale: 1.4,
        opacity: 0.2,
        time: 1e3
      }, "decel", "fade");
    }},
  smokescreen: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("blackwisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.1,
        opacity: 0
      }, {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0.7,
        opacity: 1,
        time: 400
      }, "ballistic", "explode");
      scene.showEffect("blackwisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.1,
        opacity: 0,
        time: 100
      }, {
        x: defender.x + 40,
        y: defender.y - 20,
        z: defender.z,
        scale: 0.7,
        opacity: 1,
        time: 500
      }, "ballistic", "explode");
      scene.showEffect("blackwisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.1,
        opacity: 0,
        time: 200
      }, {
        x: defender.x - 30,
        y: defender.y - 10,
        z: defender.z,
        scale: 0.7,
        opacity: 1,
        time: 600
      }, "ballistic", "explode");
    }},
  snore: {anim: function anim(scene, [attacker]) {
      scene.showEffect("wisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0,
        opacity: 0.7,
        time: 0
      }, {
        z: attacker.behind(-50),
        scale: 5,
        opacity: 0,
        time: 400
      }, "linear");
      scene.showEffect("wisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0,
        opacity: 0.7,
        time: 150
      }, {
        z: attacker.behind(-50),
        scale: 5,
        opacity: 0,
        time: 600
      }, "linear");
      scene.showEffect("wisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0,
        opacity: 0.7,
        time: 300
      }, {
        z: attacker.behind(-50),
        scale: 5,
        opacity: 0,
        time: 800
      }, "linear");
    }},
  softboiled: {anim: function anim(scene, [attacker]) {
      scene.showEffect("iceball", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.75,
        yscale: 1,
        opacity: 0.2,
        time: 0
      }, {
        scale: 0.5,
        yscale: 0.75,
        opacity: 0.5,
        time: 400
      }, "linear", "explode");
      scene.showEffect("wisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 1,
        yscale: 1.5,
        opacity: 0.2,
        time: 0
      }, {
        scale: 0.6,
        yscale: 0.75,
        opacity: 0.8,
        time: 400
      }, "linear", "explode");
    }},
  solarbeam: {anim: function anim(scene, [attacker, defender]) {
      let xstep = (defender.x - attacker.x) / 5;
      let ystep = (defender.x - 200 - attacker.x) / 5;
      let zstep = (defender.z - attacker.z) / 5;
      scene.backgroundEffect(`url('https://${SD_CONFIG.routes.client}/fx/weather-sunnyday.jpg')`, 900, 0.5);
      for (let i = 0; i < 5; i++) {
        scene.showEffect("energyball", {
          x: attacker.x + xstep * (i + 1),
          y: attacker.y + 200 + ystep * (i + 1),
          z: attacker.z + zstep * (i + 1),
          scale: 0.7,
          opacity: 0.6,
          time: 40 * i + 300
        }, {
          opacity: 0,
          time: 100 * i + 500
        }, "linear");
      }
      scene.showEffect("electroball", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.75,
        opacity: 0.6
      }, {
        x: attacker.x,
        y: attacker.y + 200,
        z: attacker.z,
        scale: 1.25,
        opacity: 0,
        time: 200
      }, "decel");
      scene.showEffect("wisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 1,
        opacity: 0.6
      }, {
        x: attacker.x,
        y: attacker.y + 200,
        z: attacker.z,
        scale: 1.5,
        opacity: 0,
        time: 200
      }, "decel");
      scene.showEffect("flareball", {
        x: attacker.x,
        y: attacker.y + 200,
        z: attacker.z,
        scale: 0.4,
        opacity: 0.6,
        time: 300
      }, {
        x: defender.x + 30,
        y: defender.y + 30,
        z: defender.z,
        scale: 0.6,
        opacity: 0.3,
        time: 500
      }, "linear", "explode");
      scene.showEffect("electroball", {
        x: attacker.x,
        y: attacker.y + 200,
        z: attacker.z,
        scale: 0.4,
        opacity: 0.6,
        time: 375
      }, {
        x: defender.x + 20,
        y: defender.y - 30,
        z: defender.z,
        scale: 0.6,
        opacity: 0.3,
        time: 575
      }, "linear", "explode");
      scene.showEffect("electroball", {
        x: attacker.x,
        y: attacker.y + 200,
        z: attacker.z,
        scale: 0.4,
        opacity: 0.6,
        time: 425
      }, {
        x: defender.x - 10,
        y: defender.y + 10,
        z: defender.z,
        scale: 0.6,
        opacity: 0.3,
        time: 625
      }, "linear", "explode");
      scene.showEffect("flareball", {
        x: attacker.x,
        y: attacker.y + 200,
        z: attacker.z,
        scale: 0.4,
        opacity: 0.6,
        time: 450
      }, {
        x: defender.x - 30,
        y: defender.y,
        z: defender.z,
        scale: 0.6,
        opacity: 0.3,
        time: 650
      }, "linear", "explode");
      scene.showEffect("flareball", {
        x: attacker.x,
        y: attacker.y + 200,
        z: attacker.z,
        scale: 0.4,
        opacity: 0.6,
        time: 500
      }, {
        x: defender.x + 10,
        y: defender.y - 10,
        z: defender.z,
        scale: 0.6,
        opacity: 0.3,
        time: 700
      }, "linear", "explode");
      scene.showEffect("electroball", {
        x: attacker.x,
        y: attacker.y + 200,
        z: attacker.z,
        scale: 0.4,
        opacity: 0.6,
        time: 575
      }, {
        x: defender.x - 20,
        y: defender.y,
        z: defender.z,
        scale: 0.6,
        opacity: 0.3,
        time: 775
      }, "linear", "explode");
    }},
  sonicboom: {anim: function anim(scene, [attacker]) {
      scene.showEffect("wisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0,
        opacity: 0.7,
        time: 0
      }, {
        z: attacker.behind(-50),
        scale: 5,
        opacity: 0,
        time: 400
      }, "linear");
      scene.showEffect("wisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0,
        opacity: 0.7,
        time: 150
      }, {
        z: attacker.behind(-50),
        scale: 5,
        opacity: 0,
        time: 600
      }, "linear");
      scene.showEffect("wisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0,
        opacity: 0.7,
        time: 300
      }, {
        z: attacker.behind(-50),
        scale: 5,
        opacity: 0,
        time: 800
      }, "linear");
    }},
  spark: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("electroball", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0,
        opacity: 1,
        time: 450
      }, {
        x: defender.x,
        y: defender.y - 40,
        z: defender.behind(15),
        scale: 3,
        opacity: 0,
        time: 800
      }, "linear");
      SD_OUTRAS.contactattack.anim(scene, [attacker, defender]);
    }},
  spiderweb: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("web", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.1,
        opacity: 0
      }, {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0.5,
        opacity: 1,
        time: 400
      }, "ballistic", "explode");
      scene.showEffect("web", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.1,
        opacity: 0,
        time: 100
      }, {
        x: defender.x + 40,
        y: defender.y - 20,
        z: defender.z,
        scale: 0.5,
        opacity: 1,
        time: 500
      }, "ballistic", "explode");
      scene.showEffect("web", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.1,
        opacity: 0,
        time: 200
      }, {
        x: defender.x - 30,
        y: defender.y - 10,
        z: defender.z,
        scale: 0.5,
        opacity: 1,
        time: 600
      }, "ballistic", "explode");
    }},
  spikecannon: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("electroball", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.4,
        opacity: 0.6
      }, {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        opacity: 0.6,
        time: 300
      }, "linear", "explode");
      scene.showEffect("electroball", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.2,
        opacity: 0.6,
        time: 30
      }, {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        opacity: 0.6,
        time: 330
      }, "linear", "fade");
    }},
  splash: {anim: function anim(scene, [attacker]) {
      scene.showEffect("waterwisp", {
        x: attacker.x + 20,
        y: attacker.y + 20,
        z: attacker.z,
        scale: 0.5,
        opacity: 0.1,
        time: 150
      }, {
        x: attacker.x + 40,
        y: attacker.y + 60,
        z: attacker.z,
        opacity: 0.3
      }, "ballistic", "fade");
      scene.showEffect("waterwisp", {
        x: attacker.x - 20,
        y: attacker.y + 20,
        z: attacker.z,
        scale: 0.5,
        opacity: 0.1,
        time: 300
      }, {
        x: attacker.x - 40,
        y: attacker.y + 60,
        z: attacker.z,
        opacity: 0.3
      }, "ballistic", "fade");
      scene.showEffect("waterwisp", {
        x: attacker.x + 20,
        y: attacker.y + 40,
        z: attacker.z,
        scale: 0.5,
        opacity: 0.1,
        time: 450
      }, {
        x: attacker.x + 60,
        y: attacker.y + 40,
        z: attacker.z,
        opacity: 0.3
      }, "ballistic", "fade");
      attacker.anim({
        y: attacker.y + 15,
        time: 150
      }, "decel");
      attacker.anim({
        time: 150
      }, "accel");
      attacker.anim({
        y: attacker.y + 15,
        time: 150
      }, "decel");
      attacker.anim({
        time: 150
      }, "accel");
      attacker.anim({
        y: attacker.y + 15,
        time: 150
      }, "decel");
      attacker.anim({
        time: 150
      }, "accel");
    }},
  spore: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("purplewisp", {
        x: defender.x + 10,
        y: defender.y + 90,
        z: defender.z,
        opacity: 0,
        scale: 0.4
      }, {
        y: defender.y - 5,
        opacity: 1,
        time: 500
      }, "decel", "fade");
      scene.showEffect("purplewisp", {
        x: defender.x + 30,
        y: defender.y + 90,
        z: defender.z,
        opacity: 0,
        scale: 0.4,
        time: 150
      }, {
        y: defender.y - 5,
        opacity: 1,
        time: 650
      }, "decel", "fade");
      scene.showEffect("purplewisp", {
        x: defender.x - 30,
        y: defender.y + 90,
        z: defender.z,
        opacity: 0,
        scale: 0.4,
        time: 300
      }, {
        y: defender.y - 5,
        opacity: 1,
        time: 800
      }, "decel", "fade");
    }},
  steelwing: {anim: function anim(scene, [attacker, defender]) {
      attacker.anim({
        x: attacker.leftof(-200),
        y: attacker.y + 80,
        z: attacker.z,
        opacity: 0,
        time: 350
      }, "accel");
      attacker.anim({
        x: defender.leftof(-200),
        y: defender.y + 80,
        z: defender.z,
        time: 1
      }, "linear");
      attacker.anim({
        x: defender.x,
        y: defender.y,
        z: defender.z,
        opacity: 1,
        time: 350
      }, "accel");
      scene.showEffect("wisp", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0,
        opacity: 0.5,
        time: 700
      }, {
        scale: 2,
        opacity: 0,
        time: 900
      }, "linear");
      attacker.anim({
        x: defender.leftof(100),
        y: defender.y - 40,
        z: defender.z,
        opacity: 0,
        time: 175
      });
      attacker.anim({
        x: attacker.x,
        y: attacker.y + 40,
        z: attacker.behind(40),
        time: 1
      });
      attacker.anim({
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        time: 250
      }, "decel");
      defender.delay(700);
      defender.anim({
        z: defender.behind(20),
        time: 100
      }, "swing");
      defender.anim({
        time: 300
      }, "swing");
    }},
  stomp: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("foot", {
        x: defender.x,
        y: defender.y + 80,
        z: defender.behind(-15),
        scale: 1.5,
        opacity: 0.8,
        time: 400
      }, {
        y: defender.y - 10,
        z: defender.z,
        scale: 1,
        opacity: 1,
        time: 500
      }, "linear", "explode");
      scene.showEffect("wisp", {
        x: defender.x,
        y: defender.y - 30,
        z: defender.z,
        scale: 1,
        time: 500
      }, {
        x: defender.x + 70,
        scale: 0.8,
        opacity: 0.3,
        time: 800
      }, "linear", "fade");
      scene.showEffect("wisp", {
        x: defender.x,
        y: defender.y - 30,
        z: defender.z,
        scale: 1,
        time: 500
      }, {
        x: defender.x - 70,
        scale: 0.8,
        opacity: 0.3,
        time: 800
      }, "linear", "fade");
      attacker.anim({
        x: defender.x,
        y: defender.y + 80,
        z: defender.behind(-30),
        time: 400
      }, "ballistic");
      attacker.anim({
        x: defender.x,
        y: defender.y + 5,
        z: defender.z,
        time: 100
      });
      attacker.anim({
        time: 600
      }, "ballistic2Back");
      defender.delay(450);
      defender.anim({
        y: defender.y - 30,
        z: defender.behind(20),
        yscale: 0.5,
        time: 200
      }, "swing");
      defender.anim({
        time: 300
      }, "swing");
    }},
  stringshot: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("web", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.1,
        opacity: 0
      }, {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0.5,
        opacity: 1,
        time: 400
      }, "ballistic", "explode");
      scene.showEffect("web", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.1,
        opacity: 0,
        time: 100
      }, {
        x: defender.x + 40,
        y: defender.y - 20,
        z: defender.z,
        scale: 0.5,
        opacity: 1,
        time: 500
      }, "ballistic", "explode");
      scene.showEffect("web", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.1,
        opacity: 0,
        time: 200
      }, {
        x: defender.x - 30,
        y: defender.y - 10,
        z: defender.z,
        scale: 0.5,
        opacity: 1,
        time: 600
      }, "ballistic", "explode");
    }},
  stunspore: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("purplewisp", {
        x: defender.x + 10,
        y: defender.y + 90,
        z: defender.z,
        opacity: 0,
        scale: 0.4
      }, {
        y: defender.y - 5,
        opacity: 1,
        time: 500
      }, "decel", "fade");
      scene.showEffect("purplewisp", {
        x: defender.x + 30,
        y: defender.y + 90,
        z: defender.z,
        opacity: 0,
        scale: 0.4,
        time: 150
      }, {
        y: defender.y - 5,
        opacity: 1,
        time: 650
      }, "decel", "fade");
      scene.showEffect("purplewisp", {
        x: defender.x - 30,
        y: defender.y + 90,
        z: defender.z,
        opacity: 0,
        scale: 0.4,
        time: 300
      }, {
        y: defender.y - 5,
        opacity: 1,
        time: 800
      }, "decel", "fade");
    }},
  submission: {anim: function anim(scene, [attacker, defender]) {
      attacker.anim({
        x: defender.leftof(-30),
        y: defender.y + 80,
        z: defender.behind(-30),
        time: 350
      }, "ballistic");
      attacker.anim({
        x: defender.leftof(30),
        y: defender.y + 5,
        z: defender.z,
        time: 100
      });
      attacker.anim({
        x: defender.leftof(30),
        y: defender.y + 80,
        z: defender.behind(-30),
        time: 150
      }, "ballisticUp");
      attacker.anim({
        x: defender.leftof(-30),
        y: defender.y + 5,
        z: defender.z,
        time: 100
      });
      attacker.anim({
        time: 500
      }, "ballistic2Back");
      defender.delay(450);
      defender.anim({
        z: defender.behind(20),
        time: 100
      }, "swing");
      defender.anim({
        time: 200
      }, "swing");
      defender.anim({
        z: defender.behind(20),
        time: 100
      }, "swing");
      defender.anim({
        time: 300
      }, "swing");
      scene.showEffect("fist", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0.6,
        opacity: 0.6,
        time: 425
      }, {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 1,
        opacity: 1,
        time: 525
      }, "linear", "explode");
      scene.showEffect("fist", {
        x: defender.x - 10,
        y: defender.y + 20,
        z: defender.z,
        scale: 0.6,
        opacity: 0.6,
        time: 450
      }, {
        x: defender.x - 20,
        y: defender.y + 30,
        z: defender.z,
        scale: 1,
        opacity: 1,
        time: 550
      }, "linear", "explode");
      scene.showEffect("fist", {
        x: defender.x + 30,
        y: defender.y - 20,
        z: defender.z,
        scale: 0.6,
        opacity: 0.6,
        time: 475
      }, {
        x: defender.x + 35,
        y: defender.y - 30,
        z: defender.z,
        scale: 1,
        opacity: 1,
        time: 575
      }, "linear", "explode");
      scene.showEffect("fist", {
        x: defender.x - 30,
        y: defender.y - 20,
        z: defender.z,
        scale: 0.6,
        opacity: 0.6,
        time: 575
      }, {
        x: defender.x - 35,
        y: defender.y - 30,
        z: defender.z,
        scale: 1,
        opacity: 1,
        time: 775
      }, "linear", "explode");
      scene.showEffect("fist", {
        x: defender.x,
        y: defender.y - 10,
        z: defender.z,
        scale: 0.6,
        opacity: 0.6,
        time: 600
      }, {
        x: defender.x + 10,
        y: defender.y - 15,
        z: defender.z,
        scale: 1,
        opacity: 1,
        time: 750
      }, "linear", "explode");
      scene.showEffect("fist", {
        x: defender.x,
        y: defender.y + 10,
        z: defender.z,
        scale: 0.6,
        opacity: 0.6,
        time: 650
      }, {
        x: defender.x - 10,
        y: defender.y + 15,
        z: defender.z,
        scale: 1,
        opacity: 1,
        time: 800
      }, "linear", "explode");
      scene.showEffect("impact", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0,
        opacity: 0.4,
        time: 525
      }, {
        scale: 3,
        opacity: 0,
        time: 825
      }, "linear");
      scene.showEffect("impact", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0,
        opacity: 0.4,
        time: 750
      }, {
        scale: 3,
        opacity: 0,
        time: 1050
      }, "linear");
    }},
  substitute: {anim: function anim() {
    }},
  sunnyday: {anim: function anim(scene, [attacker]) {
      attacker.anim({ x: attacker.x - 10 });
      attacker.anim({ x: attacker.x + 10 });
      attacker.anim({ x: attacker.x });
    }},
  superfang: {anim: function anim(scene, [attacker, defender]) {
      SD_OUTRAS.bite.anim(scene, [attacker, defender]);
      SD_OUTRAS.contactattack.anim(scene, [attacker, defender]);
    }},
  supersonic: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("electroball", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0,
        opacity: 0.5,
        time: 0
      }, {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 1,
        opacity: 0,
        time: 200
      }, "linear");
      scene.showEffect("electroball", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0,
        opacity: 0.5,
        time: 150
      }, {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 1,
        opacity: 0,
        time: 350
      }, "linear");
      scene.showEffect("electroball", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0,
        opacity: 0.5,
        time: 300
      }, {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 1,
        opacity: 0,
        time: 500
      }, "linear");
    }},
  surf: {anim: function anim(scene, [attacker, ...defenders]) {
      for (const defender2 of defenders) {
        defender2.delay(125);
        defender2.anim({
          z: defender2.behind(5),
          time: 75
        }, "swing");
        defender2.anim({
          time: 75
        }, "swing");
        defender2.anim({
          z: defender2.behind(5),
          time: 75
        }, "swing");
        defender2.anim({
          time: 75
        }, "swing");
        defender2.anim({
          z: defender2.behind(5),
          time: 75
        }, "swing");
        defender2.anim({
          time: 75
        }, "swing");
      }
      const defender = defenders[1] || defenders[0];
      scene.backgroundEffect("#0000DD", 700, 0.2);
      scene.showEffect("waterwisp", {
        x: attacker.x,
        y: attacker.y - 25,
        z: attacker.z,
        scale: 0.4,
        opacity: 0.3
      }, {
        x: defender.x,
        y: defender.y + 10,
        z: defender.behind(50),
        scale: 1,
        opacity: 0.6
      }, "decel", "explode");
      scene.showEffect("waterwisp", {
        x: attacker.x - 30,
        y: attacker.y - 25,
        z: attacker.z,
        scale: 0.4,
        opacity: 0.3
      }, {
        x: defender.x - 60,
        y: defender.y,
        z: defender.behind(50),
        scale: 1,
        opacity: 0.6
      }, "decel", "explode");
      scene.showEffect("waterwisp", {
        x: attacker.x + 30,
        y: attacker.y - 25,
        z: attacker.z,
        scale: 0.4,
        opacity: 0.3
      }, {
        x: defender.x + 60,
        y: defender.y,
        z: defender.behind(50),
        scale: 1,
        opacity: 0.6
      }, "decel", "explode");
    }},
  swagger: {anim: function anim(scene, [attacker, defender]) {
      SD_OUTRAS.shake.anim(scene, [attacker]);
      scene.showEffect("angry", {
        x: defender.x + 20,
        y: defender.y + 20,
        z: defender.z,
        scale: 0.5,
        opacity: 0.5,
        time: 0
      }, {
        scale: 1,
        opacity: 1,
        time: 300
      }, "ballistic2Under", "fade");
      scene.showEffect("angry", {
        x: defender.x - 20,
        y: defender.y + 10,
        z: defender.z,
        scale: 0.5,
        opacity: 0.5,
        time: 100
      }, {
        scale: 1,
        opacity: 1,
        time: 400
      }, "ballistic2Under", "fade");
      scene.showEffect("angry", {
        x: defender.x,
        y: defender.y + 40,
        z: defender.z,
        scale: 0.5,
        opacity: 0.5,
        time: 200
      }, {
        scale: 1,
        opacity: 1,
        time: 500
      }, "ballistic2Under", "fade");
    }},
  sweetscent: {anim: function anim(scene, [attacker]) {
      scene.backgroundEffect("#FF99FF", 1e3, 0.3);
      SD_OUTRAS.dance.anim(scene, [attacker]);
    }},
  swift: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("wisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.6,
        opacity: 0.6
      }, {
        x: defender.x + 30,
        y: defender.y + 30,
        z: defender.z,
        scale: 1,
        opacity: 0.3,
        time: 200
      }, "linear", "explode");
      scene.showEffect("wisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.6,
        opacity: 0.6,
        time: 75
      }, {
        x: defender.x + 20,
        y: defender.y - 30,
        z: defender.z,
        scale: 1,
        opacity: 0.3,
        time: 275
      }, "linear", "explode");
      scene.showEffect("wisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.6,
        opacity: 0.6,
        time: 150
      }, {
        x: defender.x - 30,
        y: defender.y,
        z: defender.z,
        scale: 1,
        opacity: 0.3,
        time: 350
      }, "linear", "explode");
      scene.showEffect("wisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.6,
        opacity: 0.6,
        time: 225
      }, {
        x: defender.x - 10,
        y: defender.y + 10,
        z: defender.z,
        scale: 1,
        opacity: 0.3,
        time: 425
      }, "linear", "explode");
      scene.showEffect("wisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.6,
        opacity: 0.6,
        time: 300
      }, {
        x: defender.x + 10,
        y: defender.y - 10,
        z: defender.z,
        scale: 1,
        opacity: 0.3,
        time: 500
      }, "linear", "explode");
      scene.showEffect("wisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.6,
        opacity: 0.6,
        time: 375
      }, {
        x: defender.x - 20,
        y: defender.y,
        z: defender.z,
        scale: 1,
        opacity: 0.3,
        time: 575
      }, "linear", "explode");
    }},
  swordsdance: {anim: function anim(scene, [attacker, defender]) {
      SD_OUTRAS.shake.anim(scene, [defender]);
      scene.showEffect("sword", {
        x: defender.x + 50,
        y: defender.y,
        z: defender.z,
        scale: 0.5,
        opacity: 1
      }, {
        x: defender.x - 50,
        scale: 1,
        opacity: 0.4,
        time: 200
      }, "ballistic2", "fade");
      scene.showEffect("sword", {
        x: defender.x - 50,
        y: defender.y,
        z: defender.z,
        scale: 0.5,
        opacity: 1
      }, {
        x: defender.x + 50,
        scale: 1,
        opacity: 0.4,
        time: 200
      }, "ballistic2back", "fade");
      scene.showEffect("sword", {
        x: defender.x + 50,
        y: defender.y,
        z: defender.z,
        scale: 0.5,
        opacity: 1,
        time: 200
      }, {
        x: defender.x - 50,
        scale: 1,
        opacity: 0.4,
        time: 400
      }, "ballistic2", "fade");
      scene.showEffect("sword", {
        x: defender.x - 50,
        y: defender.y,
        z: defender.z,
        scale: 0.5,
        opacity: 1,
        time: 200
      }, {
        x: defender.x + 50,
        scale: 1,
        opacity: 0.4,
        time: 400
      }, "ballistic2back", "fade");
      scene.showEffect("sword", {
        x: defender.x + 50,
        y: defender.y,
        z: defender.z,
        scale: 0.5,
        opacity: 1,
        time: 400
      }, {
        x: defender.x - 50,
        scale: 1,
        opacity: 0.4,
        time: 600
      }, "ballistic2", "fade");
      scene.showEffect("sword", {
        x: defender.x - 50,
        y: defender.y,
        z: defender.z,
        scale: 0.5,
        opacity: 1,
        time: 400
      }, {
        x: defender.x + 50,
        scale: 1,
        opacity: 0.4,
        time: 600
      }, "ballistic2Back", "fade");
    }},
  synthesis: {anim: function anim(scene, [attacker]) {
      scene.showEffect("electroball", {
        x: attacker.x - 60,
        y: attacker.y + 40,
        z: attacker.z,
        scale: 0.7,
        opacity: 0.7,
        time: 0
      }, {
        x: attacker.x,
        y: attacker.y,
        scale: 0.2,
        opacity: 0.2,
        time: 300
      }, "linear", "fade");
      scene.showEffect("electroball", {
        x: attacker.x + 60,
        y: attacker.y - 5,
        z: attacker.z,
        scale: 0.7,
        opacity: 0.7,
        time: 100
      }, {
        x: attacker.x,
        y: attacker.y,
        scale: 0.2,
        opacity: 0.2,
        time: 300
      }, "linear", "fade");
      scene.showEffect("electroball", {
        x: attacker.x - 30,
        y: attacker.y + 60,
        z: attacker.z,
        scale: 0.7,
        opacity: 0.7,
        time: 100
      }, {
        x: attacker.x,
        y: attacker.y,
        scale: 0.2,
        opacity: 0.2,
        time: 400
      }, "linear", "fade");
      scene.showEffect("electroball", {
        x: attacker.x + 20,
        y: attacker.y - 50,
        z: attacker.z,
        scale: 0.7,
        opacity: 0.7,
        time: 100
      }, {
        x: attacker.x,
        y: attacker.y,
        scale: 0.2,
        opacity: 0.2,
        time: 400
      }, "linear", "fade");
      scene.showEffect("electroball", {
        x: attacker.x - 70,
        y: attacker.y - 50,
        z: attacker.z,
        scale: 0.7,
        opacity: 0.7,
        time: 200
      }, {
        x: attacker.x,
        y: attacker.y,
        scale: 0.2,
        opacity: 0.2,
        time: 500
      }, "linear", "fade");
    }},
  tackle: {anim: function anim(scene, [attacker, defender]) {
      attacker.anim({
        x: defender.x,
        y: defender.y + 80,
        z: defender.behind(-30),
        time: 400
      }, "ballistic");
      attacker.anim({
        x: defender.x,
        y: defender.y + 5,
        z: defender.z,
        time: 100
      });
      attacker.anim({
        time: 500
      }, "ballistic2Back");
      defender.delay(450);
      defender.anim({
        z: defender.behind(20),
        time: 100
      }, "swing");
      defender.anim({
        time: 300
      }, "swing");
      scene.wait(500);
    }},
  tailwhip: {anim: function anim(scene, [attacker]) {
      attacker.anim({ x: attacker.x - 10 });
      attacker.anim({ x: attacker.x + 10 });
      attacker.anim({ x: attacker.x });
    }},
  takedown: {anim: function anim(scene, [attacker, defender]) {
      scene.backgroundEffect("#000000", 700, 0.2);
      scene.showEffect("impact", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0,
        opacity: 0.4,
        time: 300
      }, {
        scale: 4,
        opacity: 0,
        time: 600
      }, "linear");
      scene.showEffect("impact", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0,
        opacity: 0.4,
        time: 500
      }, {
        scale: 4,
        opacity: 0,
        time: 800
      }, "linear");
      scene.showEffect(attacker.sp, {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        opacity: 0.3,
        time: 50
      }, {
        x: defender.x,
        y: defender.y,
        z: defender.behind(-5),
        time: 350
      }, "accel", "fade");
      scene.showEffect(attacker.sp, {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        opacity: 0.3,
        time: 100
      }, {
        x: defender.x,
        y: defender.y,
        z: defender.behind(-5),
        time: 400
      }, "accel", "fade");
      attacker.anim({
        x: defender.x,
        y: defender.y,
        z: defender.behind(-5),
        time: 300
      }, "accel");
      attacker.anim({
        time: 500
      }, "ballistic2Back");
      defender.delay(280);
      defender.anim({
        z: defender.behind(20),
        time: 100
      }, "swing");
      defender.anim({
        time: 300
      }, "swing");
    }},
  teleport: {anim: function anim(scene, [attacker]) {
      scene.backgroundEffect("#000000", 1e3, 0.3);
      attacker.anim({
        xscale: 0.3,
        time: 200
      }, "linear");
      attacker.anim({
        y: attacker.y + 200,
        xscale: 0.1,
        yscale: 2,
        opacity: 0.5,
        time: 300
      }, "accel");
      attacker.delay(500);
      attacker.anim({ opacity: 0, time: 0 });
      attacker.anim({ opacity: 1, time: 300 });
    }},
  thief: {anim: function anim(scene, [attacker, defender]) {
      attacker.anim({
        x: attacker.leftof(-20),
        y: attacker.y,
        z: attacker.behind(-20),
        opacity: 0,
        time: 200
      }, "linear");
      attacker.anim({
        x: defender.x,
        y: defender.y,
        z: defender.behind(-120),
        opacity: 0,
        time: 1
      }, "linear");
      attacker.anim({
        x: defender.x,
        y: defender.y,
        z: defender.behind(40),
        opacity: 1,
        time: 250
      }, "linear");
      attacker.anim({
        x: defender.x,
        y: defender.y,
        z: defender.behind(-5),
        opacity: 0,
        time: 300
      }, "linear");
      attacker.anim({
        opacity: 0,
        time: 1
      }, "linear");
      attacker.anim({
        time: 300,
        opacity: 1
      }, "linear");
      defender.delay(330);
      defender.anim({
        z: defender.behind(20),
        time: 100
      }, "swing");
      defender.anim({
        time: 300
      }, "swing");
    }},
  thrash: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("angry", {
        x: attacker.x - 10,
        y: attacker.y + 50,
        z: attacker.z,
        scale: 0.5,
        opacity: 1,
        time: 0
      }, {
        scale: 3,
        opacity: 0,
        time: 300
      }, "ballistic2Under", "fade");
      attacker.delay(300);
      attacker.anim({
        x: defender.leftof(-30),
        y: defender.y + 80,
        z: defender.behind(-30),
        time: 300
      }, "ballistic");
      attacker.anim({
        x: defender.leftof(30),
        y: defender.y + 5,
        z: defender.z,
        time: 100
      });
      attacker.anim({
        x: defender.leftof(30),
        y: defender.y + 80,
        z: defender.behind(-30),
        time: 200
      }, "ballisticUp");
      attacker.anim({
        x: defender.leftof(-30),
        y: defender.y + 5,
        z: defender.z,
        time: 100
      });
      attacker.anim({
        time: 500
      }, "ballistic2Back");
      defender.delay(750);
      defender.anim({
        z: defender.behind(20),
        time: 100
      }, "swing");
      defender.anim({
        time: 200
      }, "swing");
      defender.anim({
        z: defender.behind(15),
        time: 300
      }, "decel");
      defender.anim({
        time: 300
      }, "swing");
      scene.showEffect("foot", {
        x: defender.x - 10,
        y: defender.y + 20,
        z: defender.z,
        scale: 1,
        opacity: 1,
        time: 650
      }, {
        x: defender.x - 15,
        y: defender.y + 10,
        z: defender.behind(15),
        scale: 2,
        opacity: 0,
        time: 950
      }, "linear");
      scene.showEffect("fist", {
        x: defender.x - 5,
        y: defender.y - 5,
        z: defender.z,
        scale: 0.6,
        opacity: 0.6,
        time: 675
      }, {
        x: defender.x - 10,
        y: defender.y - 10,
        z: defender.z,
        scale: 1,
        opacity: 1,
        time: 875
      }, "linear", "explode");
      scene.showEffect("fist", {
        x: defender.x + 10,
        y: defender.y + 10,
        z: defender.z,
        scale: 0.6,
        opacity: 0.6,
        time: 700
      }, {
        x: defender.x + 20,
        y: defender.y + 20,
        z: defender.z,
        scale: 1,
        opacity: 1,
        time: 900
      }, "linear", "explode");
      scene.showEffect("fist", {
        x: defender.x + 20,
        y: defender.y - 30,
        z: defender.z,
        scale: 0.6,
        opacity: 0.6,
        time: 725
      }, {
        x: defender.x + 30,
        y: defender.y - 25,
        z: defender.z,
        scale: 1,
        opacity: 1,
        time: 925
      }, "linear", "explode");
      scene.showEffect("foot", {
        x: defender.x,
        y: defender.y + 20,
        z: defender.z,
        scale: 1,
        opacity: 1,
        time: 1e3
      }, {
        x: defender.x,
        y: defender.y + 10,
        z: defender.behind(15),
        scale: 2,
        opacity: 0,
        time: 1300
      }, "linear");
    }},
  thunder: {anim: function anim(scene, [attacker, defender]) {
      scene.backgroundEffect("#ffffff", 300, 0.7);
      scene.backgroundEffect("#000000", 1e3, 0.7, 100);
      scene.showEffect("lightning", {
        x: defender.x,
        y: defender.y + 150,
        z: defender.z,
        yscale: 0,
        xscale: 2
      }, {
        y: defender.y + 50,
        yscale: 1,
        xscale: 1.5,
        opacity: 0,
        time: 200
      }, "linear");
      scene.showEffect("lightning", {
        x: defender.x,
        y: defender.y + 50,
        z: defender.z,
        yscale: 1,
        xscale: 1.5,
        time: 200
      }, {
        opacity: 0,
        time: 700
      }, "linear");
      scene.showEffect("lightning", {
        x: defender.x,
        y: defender.y + 50,
        z: defender.z,
        yscale: 1,
        xscale: 1.5,
        time: 600
      }, {
        opacity: 0,
        time: 1100
      }, "linear");
      scene.showEffect("electroball", {
        x: defender.x,
        y: defender.y - 60,
        z: defender.z,
        scale: 1,
        xscale: 1.5,
        opacity: 0.5,
        time: 200
      }, {
        scale: 2,
        xscale: 4,
        opacity: 0.1,
        time: 900
      }, "linear", "fade");
      scene.showEffect("electroball", {
        x: defender.x,
        y: defender.y - 30,
        z: defender.z,
        opacity: 0.5,
        scale: 1.5,
        time: 200
      }, {
        scale: 1.8,
        opacity: 0.1,
        time: 900
      }, "linear", "fade");
      defender.delay(200);
      defender.anim({
        x: defender.x - 5,
        time: 75
      }, "swing");
      defender.anim({
        x: defender.x + 5,
        time: 75
      }, "swing");
      defender.anim({
        x: defender.x - 5,
        time: 75
      }, "swing");
      defender.anim({
        x: defender.x + 5,
        time: 75
      }, "swing");
      defender.anim({
        x: defender.x - 5,
        time: 75
      }, "swing");
      defender.anim({
        time: 100
      }, "accel");
    }},
  thunderbolt: {anim: function anim(scene, [attacker, defender]) {
      scene.backgroundEffect("#000000", 600, 0.2);
      scene.showEffect("lightning", {
        x: defender.x,
        y: defender.y + 150,
        z: defender.z,
        yscale: 0,
        xscale: 2
      }, {
        y: defender.y + 50,
        yscale: 1,
        xscale: 1.5,
        opacity: 0.8,
        time: 200
      }, "linear", "fade");
      scene.showEffect("lightning", {
        x: defender.x - 15,
        y: defender.y + 150,
        z: defender.z,
        yscale: 0,
        xscale: 2,
        time: 200
      }, {
        y: defender.y + 50,
        yscale: 1,
        xscale: 1.5,
        opacity: 0.8,
        time: 400
      }, "linear", "fade");
      scene.showEffect("lightning", {
        x: defender.x + 15,
        y: defender.y + 150,
        z: defender.z,
        yscale: 0,
        xscale: 2,
        time: 400
      }, {
        y: defender.y + 50,
        yscale: 1,
        xscale: 1.5,
        opacity: 0.8,
        time: 600
      }, "linear", "fade");
    }},
  thunderpunch: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("electroball", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0,
        opacity: 1,
        time: 400
      }, {
        x: defender.leftof(-20),
        y: defender.y,
        z: defender.behind(20),
        scale: 3,
        opacity: 0,
        time: 700
      }, "linear");
      scene.showEffect("lightning", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0,
        opacity: 1,
        time: 500
      }, {
        x: defender.leftof(-20),
        y: defender.y,
        z: defender.behind(20),
        scale: 3,
        opacity: 0,
        time: 800
      }, "linear");
      scene.showEffect("fist", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 1,
        opacity: 1,
        time: 400
      }, {
        x: defender.leftof(-20),
        y: defender.y,
        z: defender.behind(20),
        scale: 2,
        opacity: 0,
        time: 800
      }, "linear");
      attacker.anim({
        x: defender.leftof(20),
        y: defender.y,
        z: defender.behind(-20),
        time: 400
      }, "ballistic2Under");
      attacker.anim({
        x: defender.x,
        y: defender.y,
        z: defender.z,
        time: 50
      });
      attacker.anim({
        time: 500
      }, "ballistic2");
      defender.delay(425);
      defender.anim({
        x: defender.leftof(-20),
        y: defender.y,
        z: defender.behind(20),
        time: 50
      }, "swing");
      defender.anim({
        time: 300
      }, "swing");
    }},
  thundershock: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("electroball", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 1,
        opacity: 0.3
      }, {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 1,
        opacity: 0.6,
        time: 500
      }, "linear", "explode");
      defender.delay(500);
      defender.anim({
        z: defender.behind(5),
        time: 200
      }, "swing");
      defender.anim({
        time: 300
      }, "swing");
    }},
  thunderwave: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("electroball", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 1,
        opacity: 0.2,
        time: 0
      }, {
        scale: 8,
        opacity: 0.1,
        time: 600
      }, "linear", "fade");
      scene.showEffect("electroball", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 1,
        opacity: 0.2,
        time: 200
      }, {
        scale: 8,
        opacity: 0.1,
        time: 800
      }, "linear", "fade");
      scene.showEffect("electroball", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 1,
        opacity: 0.2,
        time: 500
      }, {
        scale: 4,
        opacity: 0.1,
        time: 800
      }, "linear", "fade");
    }},
  toxic: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("purplewisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.1,
        opacity: 0
      }, {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0.6,
        opacity: 1,
        time: 400
      }, "ballistic", "explode");
    }},
  transform: {anim: function anim() {
    }},
  triattack: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("flareball", {
        x: attacker.x,
        y: attacker.y + 45,
        z: attacker.z,
        scale: 0,
        opacity: 0.2
      }, {
        scale: 0.5,
        opacity: 0.6,
        time: 400
      }, "decel", "fade");
      scene.showEffect("iceball", {
        x: attacker.x - 45,
        y: attacker.y - 20,
        z: attacker.z,
        scale: 0,
        opacity: 0.2,
        time: 100
      }, {
        scale: 0.5,
        opacity: 0.6,
        time: 500
      }, "decel", "fade");
      scene.showEffect("electroball", {
        x: attacker.x + 45,
        y: attacker.y - 20,
        z: attacker.z,
        scale: 0,
        opacity: 0.2,
        time: 200
      }, {
        scale: 0.5,
        opacity: 0.6,
        time: 600
      }, "decel", "fade");
      scene.showEffect("flareball", {
        x: attacker.x,
        y: attacker.y + 45,
        z: attacker.z,
        scale: 0.5,
        opacity: 0.6,
        time: 400
      }, {
        x: defender.x - 10,
        y: defender.y + 5,
        z: defender.behind(5),
        opacity: 0.8,
        time: 700
      }, "accel", "explode");
      scene.showEffect("electroball", {
        x: attacker.x - 45,
        y: attacker.y - 20,
        z: attacker.z,
        scale: 0.5,
        opacity: 0.6,
        time: 500
      }, {
        x: defender.x - 10,
        y: defender.y + 5,
        z: defender.behind(5),
        opacity: 0.8,
        time: 800
      }, "accel", "explode");
      scene.showEffect("iceball", {
        x: attacker.x + 45,
        y: attacker.y - 20,
        z: attacker.z,
        scale: 0.5,
        opacity: 0.6,
        time: 600
      }, {
        x: defender.x - 10,
        y: defender.y + 5,
        z: defender.behind(5),
        opacity: 0.8,
        time: 900
      }, "accel", "explode");
      scene.showEffect("fireball", {
        x: defender.x - 15,
        y: defender.y,
        z: defender.z,
        scale: 0.5,
        opacity: 0.8,
        time: 600
      }, {
        scale: 3,
        opacity: 0,
        time: 900
      }, "linear");
      scene.showEffect("lightning", {
        x: defender.x + 15,
        y: defender.y,
        z: defender.z,
        scale: 0.5,
        opacity: 0.8,
        time: 700
      }, {
        scale: 5,
        opacity: 0,
        time: 1e3
      }, "linear");
      scene.showEffect("icicle", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0.5,
        opacity: 0.8,
        time: 800
      }, {
        scale: 3,
        opacity: 0,
        time: 1100
      }, "linear");
      defender.delay(675);
      defender.anim({
        z: defender.behind(5),
        time: 75
      }, "swing");
      defender.anim({
        time: 75
      }, "swing");
      defender.anim({
        z: defender.behind(5),
        time: 75
      }, "swing");
      defender.anim({
        time: 75
      }, "swing");
      defender.anim({
        z: defender.behind(5),
        time: 75
      }, "swing");
      defender.anim({
        time: 150
      }, "swing");
    }},
  twineedle: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("energyball", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.4,
        opacity: 0.6
      }, {
        x: defender.x - 35,
        y: defender.y + 10,
        z: defender.z,
        opacity: 0.6,
        time: 300
      }, "linear", "explode");
      scene.showEffect("energyball", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.4,
        opacity: 0.6,
        time: 200
      }, {
        x: defender.x + 20,
        y: defender.y - 20,
        z: defender.z,
        opacity: 0.6,
        time: 500
      }, "linear", "explode");
    }},
  vinewhip: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("energyball", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0,
        opacity: 1,
        time: 420
      }, {
        x: defender.leftof(-20),
        y: defender.y,
        z: defender.behind(20),
        scale: 3,
        opacity: 0,
        time: 700
      }, "linear");
      scene.showEffect("energyball", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0,
        opacity: 1,
        time: 520
      }, {
        x: defender.leftof(-20),
        y: defender.y,
        z: defender.behind(20),
        scale: 3,
        opacity: 0,
        time: 800
      }, "linear");
      scene.showEffect("leaf1", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 1,
        opacity: 1,
        time: 500
      }, {
        x: defender.x,
        y: defender.y - 60,
        scale: 1.5,
        opacity: 0,
        time: 1100
      }, "linear", "fade");
      scene.showEffect("leaf2", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 1,
        opacity: 1,
        time: 500
      }, {
        x: defender.x + 60,
        y: defender.y,
        scale: 1.5,
        opacity: 0,
        time: 1100
      }, "linear", "fade");
      scene.showEffect("leaf2", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 1,
        opacity: 1,
        time: 500
      }, {
        x: defender.x,
        y: defender.y + 60,
        scale: 1.5,
        opacity: 0,
        time: 1100
      }, "linear", "fade");
      scene.showEffect("leaf1", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 1,
        opacity: 1,
        time: 500
      }, {
        x: defender.x - 60,
        y: defender.y,
        scale: 1.5,
        opacity: 0,
        time: 1100
      }, "linear", "fade");
      SD_OUTRAS.contactattack.anim(scene, [attacker, defender]);
    }},
  visegrip: {anim: function anim(scene, [attacker, defender]) {
      attacker.anim({
        x: defender.x,
        y: defender.y + 80,
        z: defender.behind(-30),
        time: 400
      }, "ballistic");
      attacker.anim({
        x: defender.x,
        y: defender.y + 5,
        z: defender.z,
        time: 100
      });
      attacker.anim({
        time: 500
      }, "ballistic2Back");
      defender.delay(450);
      defender.anim({
        z: defender.behind(20),
        time: 100
      }, "swing");
      defender.anim({
        time: 300
      }, "swing");
      scene.wait(500);
    }},
  waterfall: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("waterwisp", {
        x: attacker.x + 20,
        y: attacker.y + 30,
        z: defender.z,
        scale: 0,
        opacity: 1
      }, {
        y: attacker.y - 20,
        scale: 4,
        opacity: 0
      }, "decel");
      scene.showEffect("waterwisp", {
        x: Math.floor((attacker.x + defender.x) / 2) - 20,
        y: Math.floor((attacker.y + defender.y) / 2) + 30,
        z: Math.floor((attacker.z + defender.z) / 2),
        scale: 0,
        opacity: 1,
        time: 150
      }, {
        y: Math.floor((attacker.y + defender.y) / 2) - 20,
        scale: 4,
        opacity: 0
      }, "decel");
      scene.showEffect("waterwisp", {
        x: defender.x + 10,
        y: defender.y + 30,
        z: defender.z,
        scale: 0,
        opacity: 1,
        time: 300
      }, {
        y: defender.y - 20,
        scale: 4,
        opacity: 0
      }, "decel");
      scene.showEffect(attacker.sp, {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        opacity: 0.3,
        time: 50
      }, {
        x: defender.x,
        y: defender.y,
        z: defender.behind(70),
        time: 350
      }, "accel", "fade");
      scene.showEffect(attacker.sp, {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        opacity: 0.3,
        time: 100
      }, {
        x: defender.x,
        y: defender.y,
        z: defender.behind(70),
        time: 400
      }, "accel", "fade");
      attacker.anim({
        x: defender.x,
        y: defender.y,
        z: defender.behind(70),
        time: 300,
        opacity: 0.5
      }, "accel");
      attacker.anim({
        x: defender.x,
        y: defender.x,
        z: defender.behind(100),
        opacity: 0,
        time: 100
      }, "linear");
      attacker.anim({
        x: attacker.x,
        y: attacker.y,
        z: attacker.behind(70),
        opacity: 0,
        time: 1
      }, "linear");
      attacker.anim({
        opacity: 1,
        time: 500
      }, "decel");
      defender.delay(260);
      defender.anim({
        z: defender.behind(30),
        time: 100
      }, "swing");
      defender.anim({
        time: 300
      }, "swing");
    }},
  watergun: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("waterwisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.1,
        opacity: 0.6
      }, {
        x: defender.x + 30,
        y: defender.y + 20,
        z: defender.z,
        scale: 1,
        opacity: 0.3
      }, "ballistic", "explode");
      scene.showEffect("waterwisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.1,
        opacity: 0.6,
        time: 75
      }, {
        x: defender.x + 20,
        y: defender.y - 20,
        z: defender.z,
        scale: 1,
        opacity: 0.3
      }, "ballistic", "explode");
      scene.showEffect("waterwisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.1,
        opacity: 0.6,
        time: 150
      }, {
        x: defender.x - 30,
        y: defender.y,
        z: defender.z,
        scale: 1,
        opacity: 0.3
      }, "ballistic", "explode");
      scene.showEffect("waterwisp", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.1,
        opacity: 0.6,
        time: 225
      }, {
        x: defender.x - 10,
        y: defender.y + 5,
        z: defender.z,
        scale: 1,
        opacity: 0.3
      }, "ballistic", "explode");
    }},
  whirlwind: {anim: function anim(scene, [attacker, defender]) {
      for (let i = 0; i < 3; i++) {
        scene.showEffect("wisp", {
          x: defender.x + 30,
          y: defender.y - 35,
          z: defender.behind(i * 40 - 60),
          scale: 0.2,
          opacity: 1,
          time: 200 * i
        }, {
          x: defender.x - 30,
          y: defender.y,
          z: defender.behind(i * 40 - 60),
          scale: 0.4,
          opacity: 0.4,
          time: 200 * i + 200
        }, "linear", "fade");
        scene.showEffect("wisp", {
          x: defender.x - 30,
          y: defender.y + 35,
          z: defender.behind(i * 40 - 60),
          scale: 0.2,
          opacity: 1,
          time: 200 * i
        }, {
          x: defender.x + 30,
          y: defender.y,
          z: defender.behind(i * 40 - 60),
          scale: 0.4,
          opacity: 0.4,
          time: 200 * i + 200
        }, "linear", "fade");
        scene.showEffect("wisp", {
          x: defender.x + 30,
          y: defender.y,
          z: defender.behind(i * 40 - 60),
          scale: 0.2,
          opacity: 1,
          time: 200 * i
        }, {
          x: defender.x - 30,
          y: defender.y - 35,
          z: defender.behind(i * 40 - 60),
          scale: 0.4,
          opacity: 0.4,
          time: 200 * i + 200
        }, "linear", "fade");
        scene.showEffect("wisp", {
          x: defender.x - 30,
          y: defender.y,
          z: defender.behind(i * 40 - 60),
          scale: 0.2,
          opacity: 1,
          time: 200 * i
        }, {
          x: defender.x + 30,
          y: defender.y - 35,
          z: defender.behind(i * 40 - 60),
          scale: 0.4,
          opacity: 0.4,
          time: 200 * i + 200
        }, "linear", "fade");
      }
    }},
  wingattack: {anim: function anim(scene, [attacker, defender]) {
      attacker.anim({
        x: attacker.leftof(-200),
        y: attacker.y + 80,
        z: attacker.z,
        opacity: 0,
        time: 350
      }, "accel");
      attacker.anim({
        x: defender.leftof(-200),
        y: defender.y + 80,
        z: defender.z,
        time: 1
      }, "linear");
      attacker.anim({
        x: defender.x,
        y: defender.y,
        z: defender.z,
        opacity: 1,
        time: 350
      }, "accel");
      scene.showEffect("wisp", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0,
        opacity: 0.5,
        time: 700
      }, {
        scale: 2,
        opacity: 0,
        time: 900
      }, "linear");
      attacker.anim({
        x: defender.leftof(100),
        y: defender.y - 40,
        z: defender.z,
        opacity: 0,
        time: 175
      });
      attacker.anim({
        x: attacker.x,
        y: attacker.y + 40,
        z: attacker.behind(40),
        time: 1
      });
      attacker.anim({
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        time: 250
      }, "decel");
      defender.delay(700);
      defender.anim({
        z: defender.behind(20),
        time: 100
      }, "swing");
      defender.anim({
        time: 300
      }, "swing");
    }},
  withdraw: {anim: function anim(scene, [attacker]) {
      scene.showEffect("shell", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 1,
        opacity: 0.5,
        time: 0
      }, {
        scale: 0.8,
        opacity: 0.8,
        time: 400
      }, "linear", "fade");
      attacker.anim({
        scale: 0.4,
        opacity: 0,
        time: 400
      }, "linear");
      attacker.delay(75);
      attacker.anim({ x: attacker.x, time: 75 });
    }},
  wrap: {anim: function anim(scene, [attacker, defender]) {
      scene.showEffect("iceball", {
        x: defender.x,
        y: defender.y + 15,
        z: defender.z,
        scale: 0.7,
        xscale: 2,
        opacity: 0.3,
        time: 500
      }, {
        scale: 0.4,
        xscale: 1,
        opacity: 0.1,
        time: 1100
      }, "decel", "fade");
      scene.showEffect("iceball", {
        x: defender.x,
        y: defender.y - 5,
        z: defender.z,
        scale: 0.7,
        xscale: 2,
        opacity: 0.3,
        time: 550
      }, {
        scale: 0.4,
        xscale: 1,
        opacity: 0.1,
        time: 1150
      }, "decel", "fade");
      scene.showEffect("iceball", {
        x: defender.x,
        y: defender.y - 20,
        z: defender.z,
        scale: 0.7,
        xscale: 2,
        opacity: 0.3,
        time: 600
      }, {
        scale: 0.4,
        xscale: 1,
        opacity: 0.1,
        time: 1200
      }, "decel", "fade");
      attacker.anim({
        x: defender.leftof(-30),
        y: defender.y + 80,
        z: defender.behind(-30),
        time: 400
      }, "ballistic");
      attacker.anim({
        x: defender.leftof(30),
        y: defender.y + 5,
        z: defender.z,
        time: 100
      });
      attacker.anim({
        x: defender.leftof(30),
        y: defender.y + 80,
        z: defender.behind(-30),
        time: 200
      }, "ballisticUp");
      attacker.anim({
        x: defender.leftof(-30),
        y: defender.y + 5,
        z: defender.z,
        time: 100
      });
      attacker.anim({
        time: 500
      }, "ballistic2Back");
      defender.delay(450);
      defender.anim({
        y: defender.y + 15,
        z: defender.behind(10),
        yscale: 1.3,
        time: 200
      }, "swing");
      defender.anim({
        time: 200
      }, "swing");
      defender.delay(25);
      defender.anim({
        x: defender.leftof(-10),
        y: defender.y + 15,
        z: defender.behind(5),
        yscale: 1.3,
        time: 200
      }, "swing");
      defender.anim({
        time: 200
      }, "swing");
    }},
  zapcannon: {anim: function anim(scene, [attacker, defender]) {
      scene.backgroundEffect("#2630A9", 700, 0.6);
      scene.showEffect("electroball", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.4,
        opacity: 0.6
      }, {
        x: defender.x + 30,
        y: defender.y + 30,
        z: defender.z,
        scale: 0.6,
        opacity: 0.3,
        time: 200
      }, "linear", "explode");
      scene.showEffect("electroball", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.4,
        opacity: 0.6,
        time: 75
      }, {
        x: defender.x + 20,
        y: defender.y - 30,
        z: defender.z,
        scale: 0.6,
        opacity: 0.3,
        time: 275
      }, "linear", "explode");
      scene.showEffect("electroball", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.4,
        opacity: 0.6,
        time: 150
      }, {
        x: defender.x - 30,
        y: defender.y,
        z: defender.z,
        scale: 0.6,
        opacity: 0.3,
        time: 350
      }, "linear", "explode");
      scene.showEffect("electroball", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.4,
        opacity: 0.6,
        time: 225
      }, {
        x: defender.x - 10,
        y: defender.y + 10,
        z: defender.z,
        scale: 0.6,
        opacity: 0.3,
        time: 425
      }, "linear", "explode");
      scene.showEffect("electroball", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.4,
        opacity: 0.6,
        time: 300
      }, {
        x: defender.x + 10,
        y: defender.y - 10,
        z: defender.z,
        scale: 0.6,
        opacity: 0.3,
        time: 500
      }, "linear", "explode");
      scene.showEffect("electroball", {
        x: attacker.x,
        y: attacker.y,
        z: attacker.z,
        scale: 0.4,
        opacity: 0.6,
        time: 375
      }, {
        x: defender.x - 20,
        y: defender.y,
        z: defender.z,
        scale: 0.6,
        opacity: 0.3,
        time: 575
      }, "linear", "explode");
      scene.showEffect("shadowball", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0,
        opacity: 0.5,
        time: 550
      }, {
        scale: 4,
        opacity: 0,
        time: 750
      }, "linear");
      scene.showEffect("shadowball", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0,
        opacity: 0.5,
        time: 600
      }, {
        scale: 4,
        opacity: 0,
        time: 800
      }, "linear");
      scene.showEffect("lightning", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0,
        opacity: 0.5,
        time: 550
      }, {
        scale: 4,
        opacity: 0,
        time: 750
      }, "linear");
      scene.showEffect("lightning", {
        x: defender.x,
        y: defender.y,
        z: defender.z,
        scale: 0,
        opacity: 0.5,
        time: 600
      }, {
        scale: 4,
        opacity: 0,
        time: 800
      }, "linear");
      defender.delay(125);
      defender.anim({
        z: defender.behind(5),
        time: 75
      }, "swing");
      defender.anim({
        time: 75
      }, "swing");
      defender.anim({
        z: defender.behind(5),
        time: 75
      }, "swing");
      defender.anim({
        time: 75
      }, "swing");
      defender.anim({
        z: defender.behind(5),
        time: 75
      }, "swing");
      defender.anim({
        time: 75
      }, "swing");
      defender.anim({
        z: defender.behind(5),
        time: 75
      }, "swing");
      defender.anim({
        time: 150
      }, "swing");
    }}
};
/* golpe do jogo -> id do Showdown */
const SD_ID_DO_GOLPE = {"Tackle":"tackle","Scratch":"scratch","Pound":"pound","Quick Attack":"quickattack","Bite":"bite","Swift":"swift","Headbutt":"headbutt","Mega Punch":"megapunch","Slam":"slam","Hyper Fang":"hyperfang","Body Slam":"bodyslam","Take Down":"takedown","Mega Kick":"megakick","Double-Edge":"doubleedge","Hyper Beam":"hyperbeam","Growl":"growl","Tail Whip":"tailwhip","Leer":"leer","Screech":"screech","Harden":"harden","Swords Dance":"swordsdance","Agility":"agility","Recover":"recover","Rest":"rest","Sing":"sing","Supersonic":"supersonic","Ember":"ember","Fire Punch":"firepunch","Flamethrower":"flamethrower","Fire Blast":"fireblast","Fire Spin":"firespin","Bubble":"bubble","Water Gun":"watergun","Bubble Beam":"bubblebeam","Waterfall":"waterfall","Surf":"surf","Hydro Pump":"hydropump","Thunder Shock":"thundershock","Thunder Wave":"thunderwave","Thunder Punch":"thunderpunch","Thunderbolt":"thunderbolt","Thunder":"thunder","Absorb":"absorb","Vine Whip":"vinewhip","Mega Drain":"megadrain","Razor Leaf":"razorleaf","Sleep Powder":"sleeppowder","Stun Spore":"stunspore","Poison Powder":"poisonpowder","Solar Beam":"solarbeam","Petal Dance":"petaldance","Aurora Beam":"aurorabeam","Ice Punch":"icepunch","Ice Beam":"icebeam","Blizzard":"blizzard","Karate Chop":"karatechop","Double Kick":"doublekick","Low Kick":"lowkick","Seismic Toss":"seismictoss","Submission":"submission","Cross Chop":"crosschop","Poison Sting":"poisonsting","Acid":"acid","Smog":"smog","Sludge":"sludge","Toxic":"toxic","Sand Attack":"sandattack","Bone Club":"boneclub","Dig":"dig","Bonemerang":"bonemerang","Earthquake":"earthquake","Peck":"peck","Gust":"gust","Wing Attack":"wingattack","Drill Peck":"drillpeck","Fly":"fly","Sky Attack":"skyattack","Confusion":"confusion","Hypnosis":"hypnosis","Psybeam":"psybeam","Barrier":"barrier","Amnesia":"amnesia","Psychic":"psychic","Dream Eater":"dreameater","String Shot":"stringshot","Leech Life":"leechlife","Pin Missile":"pinmissile","Twineedle":"twineedle","Rock Throw":"rockthrow","Rock Slide":"rockslide","Lick":"lick","Night Shade":"nightshade","Confuse Ray":"confuseray","Shadow Punch":"shadowpunch","Dragon Rage":"dragonrage","Dragon Claw":"dragonclaw","Outrage":"outrage","Dragon Breath":"dragonbreath","Pursuit":"pursuit","Thief":"thief","Faint Attack":"feintattack","Beat Up":"beatup","Crunch":"crunch","Metal Claw":"metalclaw","Steel Wing":"steelwing","Iron Tail":"irontail","Giga Drain":"gigadrain","Icy Wind":"icywind","Ancient Power":"ancientpower","Shadow Ball":"shadowball","Sludge Bomb":"sludgebomb","Zap Cannon":"zapcannon","Megahorn":"megahorn","Sacred Fire":"sacredfire","Aeroblast":"aeroblast","Comet Punch":"cometpunch","Double Slap":"doubleslap","Fury Attack":"furyattack","Fury Swipes":"furyswipes","Barrage":"barrage","Spike Cannon":"spikecannon","Constrict":"constrict","Vice Grip":"visegrip","Horn Attack":"hornattack","Stomp":"stomp","Rage":"rage","Pay Day":"payday","Dizzy Punch":"dizzypunch","Slash":"slash","Thrash":"thrash","Skull Bash":"skullbash","Tri Attack":"triattack","Wrap":"wrap","Bind":"bind","Self-Destruct":"selfdestruct","Explosion":"explosion","Horn Drill":"horndrill","Guillotine":"guillotine","Super Fang":"superfang","Sonic Boom":"sonicboom","Growth":"growth","Sharpen":"sharpen","Meditate":"meditate","Focus Energy":"focusenergy","Defense Curl":"defensecurl","Withdraw":"withdraw","Minimize":"minimize","Substitute":"substitute","Double Team":"doubleteam","Conversion":"conversion","Light Screen":"lightscreen","Reflect":"reflect","Mist":"mist","Acid Armor":"acidarmor","Haze":"haze","Smokescreen":"smokescreen","Whirlwind":"whirlwind","Roar":"roar","Disable":"disable","Lovely Kiss":"lovelykiss","Metronome":"metronome","Transform":"transform","Teleport":"teleport","Mirror Move":"mirrormove","Splash":"splash","Rolling Kick":"rollingkick","Jump Kick":"jumpkick","High Jump Kick":"highjumpkick","Counter":"counter","Leech Seed":"leechseed","Spore":"spore","Poison Gas":"poisongas","Glare":"glare","Clamp":"clamp","Crabhammer":"crabhammer","Flame Wheel":"flamewheel","Spark":"spark","Rollout":"rollout","Rapid Spin":"rapidspin","Present":"present","Psywave":"psywave","Hidden Power":"hiddenpower","Flail":"flail","Scary Face":"scaryface","Foresight":"foresight","Charm":"charm","Swagger":"swagger","Spider Web":"spiderweb","Cotton Spore":"cottonspore","Synthesis":"synthesis","Softboiled":"softboiled","Safeguard":"safeguard","Mirror Coat":"mirrorcoat","Sandstorm":"sandstorm","Rain Dance":"raindance","Sunny Day":"sunnyday","Protect":"protect","Detect":"detect","Endure":"endure","Curse":"curse","Attract":"attract","Nightmare":"nightmare","Psych Up":"psychup","Sweet Scent":"sweetscent","Sleep Talk":"sleeptalk","Snore":"snore","Return":"return","Frustration":"frustration","Fury Cutter":"furycutter","Rock Smash":"rocksmash","Mud-Slap":"mudslap","Dynamic Punch":"dynamicpunch"};
