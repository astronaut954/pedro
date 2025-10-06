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
  const text = element.textContent;
  element.textContent = "";
  let i = 0;

  function typeWriter() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(typeWriter, 40);
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

// ==========================
// Eventos
// ==========================

// Mouse (desktop)
window.addEventListener("mousemove", (e) => {
  updatePosition(e.clientX, e.clientY);
});

// Touch (mobile)
window.addEventListener("touchmove", (e) => {
  if (e.touches.length > 0) {
    const touch = e.touches[0];
    updatePosition(touch.clientX, touch.clientY);
  }
});

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
