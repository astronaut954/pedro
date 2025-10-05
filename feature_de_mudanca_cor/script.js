document.addEventListener('DOMContentLoaded', () => {
  const cor2 = document.getElementById('cor2');
  const retangulo = document.getElementById('meuRetangulo');
  const textos = document.querySelectorAll('.meuTexto');

  const corOriginalGradiente = "#2ecc71";
  const corOriginalTexto = "#333";
  const delayAntesDeVoltar = 1000;
  let timeout;

  function setStopColor(color) {
    cor2.setAttribute('stop-color', color);
  }

  function ativarGradiente(corHover) {
    clearTimeout(timeout);
    setStopColor(corHover);
  }

  function restaurarGradiente() {
    timeout = setTimeout(() => {
      setStopColor(corOriginalGradiente);
    }, delayAntesDeVoltar);
  }

  // Retângulo → muda só o gradiente
  retangulo.addEventListener("mouseenter", () => ativarGradiente("#e74c3c"));
  retangulo.addEventListener("mouseleave", restaurarGradiente);

  // Textos → mudam gradiente e também a própria cor de preenchimento
  textos.forEach(el => {
    const corHover = el.dataset.color;

    el.addEventListener("mouseenter", () => {
      ativarGradiente(corHover);
      el.setAttribute("fill", corHover);
    });

    el.addEventListener("mouseleave", () => {
      restaurarGradiente();
      el.setAttribute("fill", corOriginalTexto);
    });
  });
});
