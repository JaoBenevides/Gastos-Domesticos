const CATEGORIAS = [
  { id: "moradia", nome: "Moradia", icone: "🏠", cor: "primary" },
  { id: "alimentacao", nome: "Alimentação", icone: "🍽️", cor: "warning" },
  { id: "transporte", nome: "Transporte", icone: "🚗", cor: "info" },
  { id: "saude", nome: "Saúde", icone: "💊", cor: "danger" },
  { id: "educacao", nome: "Educação", icone: "📚", cor: "success" },
  { id: "lazer", nome: "Lazer", icone: "🎬", cor: "secondary" },
  { id: "outros", nome: "Outros", icone: "🧾", cor: "dark" }
];

const CHAVE_GASTOS = "gestao-gastos:lancamentos";
const CHAVE_ORCAMENTO = "gestao-gastos:orcamento";

let gastos = carregarGastos();
let orcamentoMensal = carregarOrcamento();

function carregarGastos() {
  try {
    const salvos = JSON.parse(localStorage.getItem(CHAVE_GASTOS));
    return Array.isArray(salvos) ? salvos : [];
  } catch {
    return [];
  }
}

function salvarGastos() {
  localStorage.setItem(CHAVE_GASTOS, JSON.stringify(gastos));
}

function carregarOrcamento() {
  const valor = parseFloat(localStorage.getItem(CHAVE_ORCAMENTO));
  return Number.isFinite(valor) ? valor : 0;
}

function salvarOrcamento() {
  localStorage.setItem(CHAVE_ORCAMENTO, String(orcamentoMensal));
}

function formatarMoeda(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatarData(isoDate) {
  const [ano, mes, dia] = isoDate.split("-");
  return `${dia}/${mes}/${ano}`;
}

function obterCategoria(id) {
  return CATEGORIAS.find(c => c.id === id) || CATEGORIAS[CATEGORIAS.length - 1];
}

function gerarId() {
  return `g_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
}

const elResumoTotal = document.getElementById("resumo-total");
const elResumoOrcamento = document.getElementById("resumo-orcamento");
const elResumoSaldo = document.getElementById("resumo-saldo");
const elResumoQtd = document.getElementById("resumo-qtd");
const elResumoPercentual = document.getElementById("resumo-percentual");
const elBarraGeral = document.getElementById("barra-orcamento-geral");
const elGradeCategorias = document.getElementById("grade-categorias");
const elMensagemCategoriasVazia = document.getElementById("mensagem-categorias-vazia");
const elCorpoTabela = document.getElementById("corpo-tabela-gastos");
const elMensagemVazia = document.getElementById("mensagem-vazia");
const elFiltroCategoria = document.getElementById("filtro-categoria");
const elCampoCategoria = document.getElementById("campo-categoria");
const elFormGasto = document.getElementById("form-gasto");
const elFormOrcamento = document.getElementById("form-orcamento");
const elCampoOrcamento = document.getElementById("campo-orcamento");
const elBtnLimparTudo = document.getElementById("btn-limpar-tudo");

function popularSelectsCategoria() {
  CATEGORIAS.forEach(cat => {
    const opcaoForm = document.createElement("option");
    opcaoForm.value = cat.id;
    opcaoForm.textContent = `${cat.icone} ${cat.nome}`;
    elCampoCategoria.appendChild(opcaoForm);

    const opcaoFiltro = document.createElement("option");
    opcaoFiltro.value = cat.id;
    opcaoFiltro.textContent = `${cat.icone} ${cat.nome}`;
    elFiltroCategoria.appendChild(opcaoFiltro);
  });
}

function renderizarResumo() {
  const total = gastos.reduce((soma, g) => soma + g.valor, 0);
  const saldo = orcamentoMensal - total;
  const percentual = orcamentoMensal > 0 ? Math.min((total / orcamentoMensal) * 100, 100) : 0;

  elResumoTotal.textContent = formatarMoeda(total);
  elResumoOrcamento.textContent = formatarMoeda(orcamentoMensal);
  elResumoQtd.textContent = String(gastos.length);

  elResumoSaldo.textContent = formatarMoeda(saldo);
  elResumoSaldo.classList.toggle("text-success", saldo >= 0);
  elResumoSaldo.classList.toggle("text-danger", saldo < 0);

  elResumoPercentual.textContent = `${percentual.toFixed(0)}%`;
  elBarraGeral.style.width = `${percentual}%`;
  elBarraGeral.setAttribute("aria-valuenow", percentual.toFixed(0));
  elBarraGeral.classList.remove("bg-success", "bg-warning", "bg-danger");
  if (percentual < 70) {
    elBarraGeral.classList.add("bg-success");
  } else if (percentual < 100) {
    elBarraGeral.classList.add("bg-warning");
  } else {
    elBarraGeral.classList.add("bg-danger");
  }
}

function renderizarCategorias() {
  const totalGeral = gastos.reduce((soma, g) => soma + g.valor, 0);

  elGradeCategorias.innerHTML = "";

  const categoriasComGasto = CATEGORIAS.filter(cat =>
    gastos.some(g => g.categoria === cat.id)
  );

  elMensagemCategoriasVazia.classList.toggle("d-none", categoriasComGasto.length > 0);

  categoriasComGasto.forEach(cat => {
    const totalCategoria = gastos
      .filter(g => g.categoria === cat.id)
      .reduce((soma, g) => soma + g.valor, 0);

    const percentualDoTotal = totalGeral > 0 ? (totalCategoria / totalGeral) * 100 : 0;

    const col = document.createElement("div");
    col.className = "col-12 col-sm-6 col-lg-4";
    col.innerHTML = `
      <div class="card card-categoria h-100 border-0 shadow-sm">
        <div class="card-body py-3">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="fw-semibold">${cat.icone} ${cat.nome}</span>
            <span class="badge text-bg-${cat.cor}">${formatarMoeda(totalCategoria)}</span>
          </div>
          <div class="progress" style="height: 0.6rem;">
            <div class="progress-bar bg-${cat.cor}" style="width: ${percentualDoTotal}%"></div>
          </div>
          <p class="text-muted small mt-2 mb-0">${percentualDoTotal.toFixed(1)}% do total gasto</p>
        </div>
      </div>
    `;
    elGradeCategorias.appendChild(col);
  });
}

function renderizarTabela() {
  const filtro = elFiltroCategoria.value;
  const listaFiltrada = filtro === "todas"
    ? [...gastos]
    : gastos.filter(g => g.categoria === filtro);

  listaFiltrada.sort((a, b) => b.data.localeCompare(a.data));

  elCorpoTabela.innerHTML = "";
  elMensagemVazia.classList.toggle("d-none", listaFiltrada.length > 0);

  listaFiltrada.forEach(gasto => {
    const cat = obterCategoria(gasto.categoria);
    const linha = document.createElement("tr");
    linha.innerHTML = `
      <td>${formatarData(gasto.data)}</td>
      <td>${gasto.descricao}</td>
      <td><span class="badge text-bg-${cat.cor}">${cat.icone} ${cat.nome}</span></td>
      <td class="text-end valor-negativo">${formatarMoeda(gasto.valor)}</td>
      <td class="text-center">
        <button class="btn btn-sm btn-outline-danger btn-remover" data-id="${gasto.id}" title="Remover lançamento">
          🗑️
        </button>
      </td>
    `;
    elCorpoTabela.appendChild(linha);
  });

  elCorpoTabela.querySelectorAll(".btn-remover").forEach(botao => {
    botao.addEventListener("click", () => removerGasto(botao.dataset.id));
  });
}

function renderizarTudo() {
  renderizarResumo();
  renderizarCategorias();
  renderizarTabela();
}

function adicionarGasto(evento) {
  evento.preventDefault();

  const descricao = document.getElementById("campo-descricao").value.trim();
  const valor = parseFloat(document.getElementById("campo-valor").value);
  const categoria = document.getElementById("campo-categoria").value;
  const data = document.getElementById("campo-data").value;

  if (!descricao || !categoria || !data || !Number.isFinite(valor) || valor <= 0) {
    return;
  }

  gastos.push({ id: gerarId(), descricao, valor, categoria, data });
  salvarGastos();
  renderizarTudo();
  elFormGasto.reset();

  const modalEl = document.getElementById("modalGasto");
  bootstrap.Modal.getOrCreateInstance(modalEl).hide();

  document.getElementById("campo-data").value = new Date().toISOString().slice(0, 10);
}

function removerGasto(id) {
  gastos = gastos.filter(g => g.id !== id);
  salvarGastos();
  renderizarTudo();
}

function limparTudo() {
  if (gastos.length === 0) return;
  const confirmar = window.confirm("Tem certeza que deseja apagar todos os lançamentos? Essa ação não pode ser desfeita.");
  if (!confirmar) return;
  gastos = [];
  salvarGastos();
  renderizarTudo();
}

function salvarOrcamentoForm(evento) {
  evento.preventDefault();
  const valor = parseFloat(elCampoOrcamento.value);
  if (Number.isFinite(valor) && valor >= 0) {
    orcamentoMensal = valor;
    salvarOrcamento();
    renderizarResumo();
  }
  const modalEl = document.getElementById("modalOrcamento");
  bootstrap.Modal.getOrCreateInstance(modalEl).hide();
}

document.addEventListener("DOMContentLoaded", () => {
  popularSelectsCategoria();

  document.getElementById("campo-data").value = new Date().toISOString().slice(0, 10);
  elCampoOrcamento.value = orcamentoMensal > 0 ? orcamentoMensal : "";

  renderizarTudo();

  elFormGasto.addEventListener("submit", adicionarGasto);
  elFormOrcamento.addEventListener("submit", salvarOrcamentoForm);
  elFiltroCategoria.addEventListener("change", renderizarTabela);
  elBtnLimparTudo.addEventListener("click", limparTudo);
});
