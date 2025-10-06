gsap.registerPlugin(ScrollTrigger);
gsap.ticker.add(syncOverlayToCloud);

// Timeline do Parallax
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".parallax",
    start: "top top",
    end: "+=300%",
    scrub: true,
    pin: true,
  },
});

// Nuvens subindo no scroll
tl.to(
  [
    "#cloudFixed1",
    "#cloudFixed2",
    "#cloud1a",
    "#cloud2a",
    "#cloud3a",
    "#cloud4a",
    "#cloud1b",
    "#cloud2b",
  ],
  {
    yPercent: -75,
    duration: 2,
    ease: "none",
  }
);

tl.to("#layer1", {
  scale: 1.45,
  yPercent: 5,
  duration: 2,
  ease: "none",
});

tl.to(
  "#layer2",
  {
    scale: 1.32,
    duration: 2,
    ease: "none",
  },
  "<"
);

// ====================================
// Animação Yoyo Nuvens
// ====================================
gsap.to("#cloud1a", {
  x: "-=50",
  duration: 4,
  repeat: -1,
  yoyo: true,
  ease: "sine.inOut",
});
gsap.to("#cloud2a", {
  x: "+=40",
  duration: 6,
  repeat: -1,
  yoyo: true,
  ease: "sine.inOut",
});
gsap.to("#cloud3a", {
  x: "-=60",
  duration: 10,
  repeat: -1,
  yoyo: true,
  ease: "sine.inOut",
});
gsap.to("#cloud4a", {
  x: "+=55",
  duration: 5,
  repeat: -1,
  yoyo: true,
  ease: "sine.inOut",
});
gsap.to("#cloud1b", {
  duration: 7,
  repeat: -1,
  opacity: 0,
  scale: 2.4,
  ease: "linear",
});
gsap.to("#cloud2b", {
  duration: 6,
  repeat: -1,
  opacity: 0,
  scale: 1.6,
  ease: "linear",
});

// ====================================
// Efeito máquina de escrever
// ====================================
document.addEventListener("DOMContentLoaded", function () {
  const element = document.getElementById("typewriter");
  element.style.display = "ruby";
  const text = element.innerText;
  element.innerText = "";
  let i = 0;

  let wordDivTag = document.createElement("div");
  wordDivTag.style.width = "fit-content";

  function typeWriter() {
    if (i < text.length) {
      const letter = text.charAt(i);
      let elementLetter = "";
      elementLetter = letter === " " ? "\u00A0" : letter;
      const letterSpanTag = document.createElement("span");
      letterSpanTag.innerText = elementLetter;
      letterSpanTag.className = "letter";
      wordDivTag.appendChild(letterSpanTag);
      element.appendChild(wordDivTag);
      if (letter === " ") {
        element.appendChild(wordDivTag);
        wordDivTag = document.createElement("div");
        wordDivTag.style.width = "fit-content";
      }
      setTimeout(typeWriter, 40);
      i++;
    }
  }

  typeWriter();
});

function syncOverlayToCloud() {
  const cloud = document.querySelector("#cloudFixed1"); // sua imagem
  const overlay = document.querySelector(".overlay"); // seu texto/logo

  if (!cloud || !overlay) return;

  const rect = cloud.getBoundingClientRect();

  // Calcula centro da imagem
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  // Aplica ao overlay
  overlay.style.position = "absolute";
  overlay.style.left = `${centerX}px`;
  overlay.style.top = `${centerY}px`;
  overlay.style.transform = "translate(-50%, -65%)";
}

window.addEventListener("load", syncOverlayToCloud);
window.addEventListener("resize", syncOverlayToCloud);
window.addEventListener("scroll", syncOverlayToCloud);

// ==========================
// OFFSET LAYERS
// ==========================
const layers = [];
const layer1 = document.querySelector("#layer1");
const layer2 = document.querySelector("#layer2");

// Adiciona camadas se existirem
if (layer1) layers.push({ el: layer1, maxOffset: 30 });
if (layer2) layers.push({ el: layer2, maxOffset: 10 });

// Cria os quickTo para suavidade
layers.forEach((layer) => {
  layer.moveX = gsap.quickTo(layer.el, "x", {
    duration: 1.2,
    ease: "power1.out",
  });
  layer.moveY = gsap.quickTo(layer.el, "y", {
    duration: 1.2,
    ease: "power1.out",
  });
});

// Centro da tela
function getCenter() {
  return {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  };
}

function updatePosition(clientX, clientY) {
  const { x: centerX, y: centerY } = getCenter();
  const dx = (clientX - centerX) / centerX;
  const dy = (clientY - centerY) / centerY;

  layers.forEach((layer) => {
    layer.moveX(dx * layer.maxOffset);
    layer.moveY(dy * layer.maxOffset);
  });
}

// Lista de todos os <polygon> e <path> que receberão efeito
let svgTargets = [];
function updateSVGTargets() {
  svgTargets = Array.from(document.querySelectorAll("svg")).reduce(
    (acc, s) => acc.concat(Array.from(s.querySelectorAll("polygon, path"))),
    []
  );
}

function carregarSVG(url, containerId) {
  fetch(url)
    .then((res) => res.text())
    .then((svgText) => {
      document.getElementById(containerId).innerHTML = svgText;
      updateSVGTargets();
    })
    .catch((err) => console.error("Erro ao carregar SVG:", err));
}

// Carregando os SVGs existentes
carregarSVG("img/logo_compacto[black].svg", "svg-container-compacto");

function getTextoTags() {
  const textoTags = document.querySelectorAll(".texto");
  return textoTags;
}

function transformTextInSpansWithLabelClass() {
  const textoTags = getTextoTags();
  console.log(textoTags);
  for (let index = 0; index < textoTags.length; index++) {
    const element = textoTags[index];
    const arrayOfWords = element.innerText.split(" ");
    console.log(arrayOfWords);
    element.innerText = "";
    for (let index = 0; index < arrayOfWords.length; index++) {
      const word = arrayOfWords[index];
      const wordSpanTag = document.createElement("div");
      wordSpanTag.style.width = "fit-content";
      for (let index = 0; index < word.length; index++) {
        const letter = word[index];
        let elementLetter = "";
        elementLetter = letter === " " ? "\u00A0" : letter;
        const letterSpanTag = document.createElement("span");
        letterSpanTag.innerText = elementLetter;
        letterSpanTag.className = "letter";
        wordSpanTag.appendChild(letterSpanTag);
        element.appendChild(wordSpanTag);
      }
      const spaceSpanTag = document.createElement("span");
      spaceSpanTag.innerText = "\u00A0";
      wordSpanTag.appendChild(spaceSpanTag);
    }
  }
}

transformTextInSpansWithLabelClass();

let letters = document.querySelectorAll(".letter");

function redefineAsLetras() {
  setInterval(() => {
    letters = document.querySelectorAll(".letter");
  }, 1000);
}

redefineAsLetras();

// ==========================
// Eventos
// ==========================
// Mapas para timers de fade-out
const fadeTimers = new Map();
const svgTimers = new Map();

// Função para aplicar efeito em qualquer posição (mouse ou touch)
function aplicarEfeito(x, y) {
  // Letras do texto
  letters.forEach((letter) => {
    const rect = letter.getBoundingClientRect();
    const letterX = rect.left + rect.width / 2;
    const letterY = rect.top + rect.height / 2;
    const dist = Math.hypot(x - letterX, y - letterY);

    const maxDist = 250;
    let intensity = Math.max(0, 1 - dist / maxDist);

    if (intensity > 0.05) {
      letter.style.color = `rgba(236, 193, 19, 1)`;

      // reset automático
      if (fadeTimers.has(letter)) clearTimeout(fadeTimers.get(letter));
      const timer = setTimeout(() => {
        letter.style.color = "";
        fadeTimers.delete(letter);
      }, 2000);
      fadeTimers.set(letter, timer);
    }
  });

  // Polygons e paths dos SVGs
  svgTargets.forEach((el) => {
    const rect = el.getBoundingClientRect();
    const elX = rect.left + rect.width / 2;
    const elY = rect.top + rect.height / 2;
    const dist = Math.hypot(x - elX, y - elY);

    const maxDist = 250;
    let intensity = Math.max(0, 1 - dist / maxDist);

    if (intensity > 0.05) {
      el.style.fill = `rgba(236, 193, 19, 1)`;

      // reset automático
      if (svgTimers.has(el)) clearTimeout(svgTimers.get(el));
      const timer = setTimeout(() => {
        el.style.fill = "";
        svgTimers.delete(el);
      }, 2000);
      svgTimers.set(el, timer);
    }
  });
}

// Mouse (desktop)
window.addEventListener("mousemove", (e) => {
  updatePosition(e.clientX, e.clientY);
  aplicarEfeito(e.clientX, e.clientY);
});

// Touch (mobile)
window.addEventListener(
  "touchmove",
  (e) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      updatePosition(touch.clientX, touch.clientY);
    }
    const touch = e.touches[0];
    if (touch) aplicarEfeito(touch.clientX, touch.clientY);
  },
  { passive: true }
);

// Carrega a animação Lottie
let isLocked = false;
const container = document.getElementById("menu-button");
const matrixOverlay = document.getElementById("matrix-overlay");

// Detecta se é dispositivo touch (mobile)
const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;

let animation = lottie.loadAnimation({
  container: container,
  renderer: "svg",
  loop: false,
  autoplay: false,
  path: "json/menu.json",
});

animation.addEventListener("DOMLoaded", () => {
  container.style.cursor = isTouchDevice ? "default" : "pointer";

  // Hover só no desktop
  if (!isTouchDevice) {
    container.addEventListener("mouseenter", () => {
      if (!isLocked) {
        animation.setSpeed(1);
        animation.playSegments([0, 4], true);
      }
    });

    container.addEventListener("mouseleave", () => {
      if (!isLocked) {
        animation.setSpeed(1);
        animation.playSegments([4, 0], true);
      }
    });
  }

  // Clique/touch → alterna trava/destrava
  container.addEventListener("click", () => {
    const startFrame = animation.currentFrame;

    if (!isLocked) {
      // Trava → anima até frame 17
      isLocked = true;
      animation.setSpeed(1);
      animation.playSegments([startFrame, 17], true);

      // Garante que overlay entra junto
      matrixOverlay.classList.add("active");
    } else {
      // Destrava
      isLocked = false;

      // Se não for touch → volta até frame 0, senão até frame 4
      if (!isTouchDevice) {
        animation.setSpeed(1);
        animation.playSegments([startFrame, 4], true);
      } else {
        animation.setSpeed(1);
        animation.playSegments([startFrame, 0], true);
      }

      // Remove overlay
      matrixOverlay.classList.remove("active");
    }
  });
});
