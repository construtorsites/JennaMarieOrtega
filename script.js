const menuMobile = document.querySelector('.menu-mobile');
const menu = document.querySelector('.menu');

if (menuMobile && menu) {
  menuMobile.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('ativo');
    menuMobile.setAttribute('aria-expanded', String(isOpen));
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menu.classList.remove('ativo');
      menuMobile.setAttribute('aria-expanded', 'false');
    });
  });
}

const botoesFiltro = document.querySelectorAll('#filmes .filtros button');
const cards = document.querySelectorAll('.card-filme');
const pesquisa = document.getElementById('pesquisar');
let filtroAtual = 'todos';

const aplicarFiltros = () => {
  const texto = (pesquisa?.value || '').trim().toLowerCase();
  let visiveis = 0;
  cards.forEach((card) => {
    const titulo = card.querySelector('h3').textContent.toLowerCase();
    const ok = (filtroAtual === 'todos' || card.classList.contains(filtroAtual)) && titulo.includes(texto);
    card.style.display = ok ? 'block' : 'none';
    if (ok) visiveis++;
  });
  document.getElementById('vazio').hidden = visiveis > 0;
};

botoesFiltro.forEach((botao) => botao.addEventListener('click', () => {
  botoesFiltro.forEach((b) => b.classList.remove('ativo'));
  botao.classList.add('ativo');
  filtroAtual = botao.dataset.filter;
  aplicarFiltros();
}));
pesquisa?.addEventListener('input', aplicarFiltros);

document.querySelectorAll('#filtro-premios button').forEach((botao) => botao.addEventListener('click', () => {
  document.querySelectorAll('#filtro-premios button').forEach((b) => b.classList.remove('ativo'));
  botao.classList.add('ativo');
  document.querySelectorAll('.lista-premios li').forEach((li) => {
    li.style.display = botao.dataset.p === 'todos' || li.classList.contains(botao.dataset.p) ? '' : 'none';
  });
}));

const contadores = document.querySelectorAll('.contador');
const secaoEstatisticas = document.querySelector('.estatisticas');

if (contadores.length && secaoEstatisticas) {
  const iniciarContador = () => {
    contadores.forEach((contador) => {
      const alvo = contador.dataset.inicio ? new Date().getFullYear() - Number(contador.dataset.inicio) : Number(contador.dataset.target || 0);
      const sufixo = contador.dataset.sufixo || '';
      let numero = 0;

      const atualizar = () => {
        const incremento = alvo / 70;

        if (numero < alvo) {
          numero += incremento;
          contador.textContent = Math.ceil(numero) + sufixo;
          requestAnimationFrame(atualizar);
        } else {
          contador.textContent = alvo + sufixo;
        }
      };

      atualizar();
    });
  };

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      iniciarContador();
      observer.disconnect();
    }
  });

  observer.observe(secaoEstatisticas);
}

const anoAtual = document.getElementById('ano-atual');
if (anoAtual) {
  anoAtual.textContent = new Date().getFullYear();
}

// Idade
const idade = document.getElementById('idade');
if (idade) {
  const n = new Date(2002, 8, 27), hoje = new Date();
  let anos = hoje.getFullYear() - n.getFullYear();
  if (hoje < new Date(hoje.getFullYear(), 8, 27)) anos--;
  idade.textContent = anos + ' anos';
}

// Contagem regressiva
const contagem = document.getElementById('contagem');
if (contagem) {
  const alvo = new Date(contagem.dataset.data);
  const dias = Math.ceil((alvo - new Date()) / 86400000);
  contagem.textContent = dias > 0 ? `Faltam ${dias} dia${dias > 1 ? 's' : ''}` : 'Já nos cinemas!';
}

// Quiz
const quizBox = document.getElementById('quiz-box');
if (quizBox) {
  let acertos = 0, respondidas = 0;
  const total = quizBox.querySelectorAll('.q').length;
  quizBox.querySelectorAll('.q').forEach((q) => q.querySelectorAll('button').forEach((btn) => btn.addEventListener('click', () => {
    const certo = btn.dataset.ok === '1';
    q.querySelectorAll('button').forEach((b) => { b.disabled = true; if (b.dataset.ok === '1') b.classList.add('certo'); });
    if (!certo) btn.classList.add('errado'); else acertos++;
    if (++respondidas === total) document.getElementById('resultado').textContent = `Você acertou ${acertos} de ${total}!`;
  })));
}

// Progresso, botão de topo e destaque do menu
const barra = document.getElementById('progresso'), topo = document.getElementById('topo');
const links = [...document.querySelectorAll('.menu a')];
window.addEventListener('scroll', () => {
  const max = document.documentElement.scrollHeight - innerHeight;
  barra.style.width = (scrollY / max * 100) + '%';
  topo.hidden = scrollY < 600;
  let atual = '';
  document.querySelectorAll('section[id]').forEach((s) => { if (scrollY >= s.offsetTop - 140) atual = s.id; });
  links.forEach((l) => l.classList.toggle('ativo', l.getAttribute('href') === '#' + atual));
}, { passive: true });
topo.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

// Animação de entrada
const alvos = document.querySelectorAll('.reveal, .card-filme, .destaque, .foto, .lista-premios li');
alvos.forEach((el) => el.classList.add('reveal'));
const obs = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('visivel'); obs.unobserve(e.target); } }), { threshold: 0.12 });
alvos.forEach((el) => obs.observe(el));
