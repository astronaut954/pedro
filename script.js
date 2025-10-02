// ====================================
// Carregamento do SVG e inicialização
// ====================================
function loadSVG() {
  fetch("img/parallax_scroll.svg")
    .then((res) => res.text())
    .then((svg) => {
      const mountain = document.getElementById("mountain");
      mountain.innerHTML = svg;

      const svgEl = mountain.querySelector("svg");
      svgEl.setAttribute("preserveAspectRatio", "xMidYMid slice");

      // Wrappers para camadas do SVG
      createWrapper("#layer_1");
      createWrapper("#layer_2");

      // Inicializações principais
      setAnimationScroll();
      setCloudAnimation();
      initCursorEffect();

      // Atualização do overlay sincronizado
      gsap.ticker.add(syncOverlayToCloud);
    });
}

// ====================================
// Criação de wrappers para camadas
// ====================================
function createWrapper(layerId) {
  const layer = document.querySelector(`#mountain svg ${layerId}`);
  if (!layer) return;

  const wrapper = document.createElementNS("http://www.w3.org/2000/svg", "g");
  wrapper.setAttribute("id", `${layerId.slice(1)}_wrapper`);

  layer.parentNode.insertBefore(wrapper, layer);
  wrapper.appendChild(layer);
}

// ====================================
// Animação Yoyo Nuvens
// ====================================
function initCursorEffect() {
  const light = document.getElementById("light");
  const star = document.getElementById("star");
  const isMobile = window.matchMedia("(max-width: 768px)").matches;

  // ==========================
  // PARALLAX EM LAYER WRAPPERS
  // ==========================
  const layer1Wrapper = document.querySelector(
    "#mountain svg #layer_1_wrapper"
  );
  const layer2Wrapper = document.querySelector(
    "#mountain svg #layer_2_wrapper"
  );

  const layers = [];
  if (layer1Wrapper) layers.push({ el: layer1Wrapper, maxOffset: 25 });
  if (layer2Wrapper) layers.push({ el: layer2Wrapper, maxOffset: 12 });

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

  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  function updatePosition(clientX, clientY) {
    const dx = (clientX - centerX) / centerX;
    const dy = (clientY - centerY) / centerY;
    layers.forEach((layer) => {
      layer.moveX(dx * layer.maxOffset);
      layer.moveY(dy * layer.maxOffset);
    });
  }

  // Desktop: star/light + movimento layers
  if (!isMobile) {
    document.addEventListener("mousemove", (e) => {
      // Cursor customizado
      light.style.left = `${e.clientX}px`;
      light.style.top = `${e.clientY}px`;
      star.style.left = `${e.clientX}px`;
      star.style.top = `${e.clientY}px`;

      // Parallax nos wrappers
      updatePosition(e.clientX, e.clientY);
    });

    star.classList.remove("hide-star");
    light.classList.add("show");
  }

  // Mobile: apenas light segue o toque + parallax
  else {
    star.classList.add("hide-star");

    function showLight(x, y) {
      light.style.setProperty("--x", `${x}px`);
      light.style.setProperty("--y", `${y}px`);
      light.classList.add("show");
      light.classList.remove("hide");

      updatePosition(x, y);
    }

    function hideLight() {
      light.classList.remove("show");
      light.classList.add("hide");
    }

    document.addEventListener(
      "touchstart",
      (e) => {
        const touch = e.touches[0];
        if (!touch) return;
        showLight(touch.clientX, touch.clientY);
      },
      { passive: true }
    );

    document.addEventListener(
      "touchmove",
      (e) => {
        const touch = e.touches[0];
        if (!touch) return;
        showLight(touch.clientX, touch.clientY);
      },
      { passive: true }
    );

    document.addEventListener("touchend", () => {
      hideLight();
    });
  }

  // Reset quando sai da janela
  document.addEventListener("mouseleave", () => {
    if (!isMobile) {
      light.classList.remove("show");
      light.classList.add("hide");
      star.style.opacity = 0;

      // Reset parallax
      layers.forEach((layer) => {
        layer.moveX(0);
        layer.moveY(0);
      });
    }
  });
  document.addEventListener("mouseenter", () => {
    if (!isMobile) {
      light.classList.add("show");
      light.classList.remove("hide");
      star.style.opacity = 1;
    }
  });

  window.addEventListener("resize", () => {
    layers.forEach((layer) => {
      layer.moveX(0);
      layer.moveY(0);
    });
  });

  // Efeito hover em links/botões
  if (!isMobile) {
    const links = document.querySelectorAll("a, button, .hover-target");

    links.forEach((link) => {
      link.addEventListener("mouseenter", () => {
        document.body.classList.add("cursor-hover");
      });
      link.addEventListener("mouseleave", () => {
        document.body.classList.add("cursor-exit");
        document.body.classList.remove("cursor-hover");

        setTimeout(() => {
          document.body.classList.remove("cursor-exit");
        }, 500);
      });
    });
  }

  // Desktop: star e light seguem o mouse
  if (!isMobile) {
    document.addEventListener("mousemove", (e) => {
      light.style.left = `${e.clientX}px`;
      light.style.top = `${e.clientY}px`;
      star.style.left = `${e.clientX}px`;
      star.style.top = `${e.clientY}px`;
    });

    star.classList.remove("hide-star");
    light.classList.add("show");
  }

  // Mobile: apenas light, ativado no toque
  else {
    star.classList.add("hide-star");

    function showLight(x, y) {
      light.style.setProperty("--x", `${x}px`);
      light.style.setProperty("--y", `${y}px`);
      light.classList.add("show");
      light.classList.remove("hide");
    }

    function hideLight() {
      light.classList.remove("show");
      light.classList.add("hide");
    }

    document.addEventListener(
      "touchstart",
      (e) => {
        const touch = e.touches[0];
        if (!touch) return;
        showLight(touch.clientX, touch.clientY);
      },
      { passive: true }
    );

    document.addEventListener(
      "touchmove",
      (e) => {
        const touch = e.touches[0];
        if (!touch) return;
        showLight(touch.clientX, touch.clientY);
      },
      { passive: true }
    );

    document.addEventListener("touchend", () => {
      hideLight();
    });
  }

  // Entrada/saída do ponteiro da janela
  document.addEventListener("mouseleave", () => {
    if (!isMobile) {
      light.classList.remove("show");
      light.classList.add("hide");
      star.style.opacity = 0;
    }
  });
  document.addEventListener("mouseenter", () => {
    if (!isMobile) {
      light.classList.add("show");
      light.classList.remove("hide");
      star.style.opacity = 1;
    }
  });
}

loadSVG();

// ====================================
// Sincronização do overlay com nuvem
// ====================================
function syncOverlayToCloud() {
  const svg = document.querySelector("#mountain svg");
  const cloud10 = svg.querySelector("#cloud10");
  const overlay = document.querySelector(".svg-overlay");

  if (!cloud10 || !overlay) return;

  const bbox = cloud10.getBBox();
  const matrix = cloud10.getScreenCTM();
  if (!matrix) return;

  const point = svg.createSVGPoint();
  point.x = bbox.x + bbox.width / 2;
  point.y = bbox.y + bbox.height / 2;
  const transformed = point.matrixTransform(matrix);

  overlay.style.left = `${transformed.x}px`;
  overlay.style.top = `${transformed.y}px`;
  overlay.style.transform = "translate(-50%, -50%)";
}

// ====================================
// Animação de scroll com GSAP + ScrollTrigger
// ====================================
function setAnimationScroll() {
  gsap.registerPlugin(ScrollTrigger);

  let runAnimation = gsap.timeline({
    scrollTrigger: {
      trigger: ".banner",
      start: "top top",
      end: "+=1000",
      scrub: true,
      pin: true,
    },
  });

  runAnimation
    .add([
      gsap.to("#cloud2b", { y: -1500, duration: 2 }),
      gsap.to("#cloud1b", { y: -1500, duration: 2 }),
      gsap.to("#cloud10", { y: -1500, duration: 2 }),
      gsap.to("#cloud9", { y: -1500, duration: 2 }),
      gsap.to("#cloud8", { y: -1500, duration: 2 }),
      gsap.to("#cloud7", { y: -1500, duration: 2 }),
      gsap.to("#cloud6", { y: -1500, duration: 2 }),
      gsap.to("#cloud5", { y: -1500, duration: 2 }),
      gsap.to("#cloud4", { y: -1500, duration: 2 }),
      gsap.to("#cloud3", { y: -1500, duration: 2 }),
      gsap.to("#cloud2", { y: -1500, duration: 2 }),
      gsap.to("#cloud1", { y: -1500, duration: 2 }),
    ])
    .add([
      gsap.to("#layer_1", {
        scale: 1.4,
        x: -250,
        y: 0,
        transformOrigin: "50% 0%",
        duration: 2,
      }),
      gsap.to("#layer_2", {
        scale: 1.2,
        transformOrigin: "50% 0%",
        duration: 2,
      }),
    ]);
}

// ====================================
// Animação infinita das nuvens
// ====================================
function setCloudAnimation() {
  gsap.to("#cloud1", {
    x: 200,
    duration: 9,
    repeat: -1,
    yoyo: true,
    ease: "linear",
  });
  gsap.to("#cloud3", {
    x: 150,
    duration: 7,
    repeat: -1,
    yoyo: true,
    ease: "linear",
  });
  gsap.to("#cloud5", {
    x: -250,
    duration: 15,
    repeat: -1,
    yoyo: true,
    ease: "linear",
  });
  gsap.to("#cloud6", {
    x: 150,
    duration: 7,
    repeat: -1,
    yoyo: true,
    ease: "linear",
  });
  gsap.to("#cloud8", {
    x: -250,
    duration: 15,
    repeat: -1,
    yoyo: true,
    ease: "linear",
  });
  gsap.to("#cloud9", {
    x: 150,
    duration: 7,
    repeat: -1,
    yoyo: true,
    ease: "linear",
  });
  gsap.to("#cloud1b", {
    duration: 7,
    repeat: -1,
    opacity: 0,
    scale: 3,
    ease: "linear",
  });
  gsap.to("#cloud2b", {
    duration: 7,
    repeat: -1,
    opacity: 0,
    scale: 2.5,
    ease: "linear",
  });
}

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

// ====================================
// Eventos globais para o cursor
// ====================================
window.addEventListener("mouseout", (e) => {
  if (!e.relatedTarget && !e.toElement) {
    gsap.to(cursor, { duration: 0.2, autoAlpha: 0 });
  }
});
window.addEventListener("mouseover", () => {
  gsap.to(cursor, { duration: 0.15, autoAlpha: 1 });
});

/* // Quebra texto em letras individuais
function wrapLetters(element) {
  const words = element.textContent.split(/(\s+)/);
  element.innerHTML = words
    .map((word) => {
      if (word.trim() === "") return word;
      return word
        .split("")
        .map((l) => `<span class="letter">${l}</span>`)
        .join("");
    })
    .join("");
}

wrapLetters(h1); */

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

// Eventos mouse
document.addEventListener("mousemove", (e) => {
  aplicarEfeito(e.clientX, e.clientY);
});

// Eventos touch
document.addEventListener(
  "touchmove",
  (e) => {
    const touch = e.touches[0];
    if (touch) aplicarEfeito(touch.clientX, touch.clientY);
  },
  { passive: true }
);
