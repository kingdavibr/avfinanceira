// Inicialização do Supabase
const SUPABASE_URL = '<https://xolulnxuvxjmkkeqcnmf.supabase.co>';
const SUPABASE_ANON_KEY = '<eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvbHVsbnh1dnhqbWtrZXFjbm1mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAwNDI4MzcsImV4cCI6MjA0NTYxODgzN30.YGaC_8YKpEbXV6FEEDAgbZXhCzNcT3YrZRK7bXsOEkI>';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Carregar registros ao iniciar
window.onload = listarRegistros;

async function listarRegistros() {
  const { data, error } = await supabase.from('financeiro').select('*').order('data', { ascending: true });

  if (error) {
    console.error('Erro ao carregar registros:', error);
    return;
  }

  data.forEach(registro => adicionarLinhaTabela(registro));
}

// Adiciona uma nova linha à tabela
function adicionarLinhaTabela(registro) {
  const newRow = document.createElement("tr");
  newRow.innerHTML = `
    <td>${formatarData(registro.data)}</td>
    <td>${registro.cliente}</td>
    <td>${registro.cpfCliente}</td>
    <td>${parseFloat(registro.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
    <td>${registro.formaPagamento}</td>
    <td>${registro.destino}</td>
    <td>${registro.nomePagador}</td>
    <td>${registro.cpfPagador}</td>
    <td>${registro.numeroDocumento}</td>
    <td class="action-buttons">
      <button class="btn btn-warning btn-sm" onclick="editarRegistro(${registro.id})">Editar</button>
      <button class="btn btn-danger btn-sm" onclick="excluirRegistro(${registro.id}, this)">Excluir</button>
    </td>
  `;
  document.getElementById("financeTableBody").appendChild(newRow);
}

document.getElementById("financeForm").addEventListener("submit", async function(event) {
  event.preventDefault();

  const novoRegistro = {
    data: document.getElementById("data").value,
    cliente: document.getElementById("cliente").value,
    cpfCliente: document.getElementById("cpfCliente").value,
    valor: document.getElementById("valor").value,
    formaPagamento: document.getElementById("formaPagamento").value,
    destino: document.getElementById("destino").value,
    nomePagador: document.getElementById("nomePagador").value,
    cpfPagador: document.getElementById("cpfPagador").value,
    numeroDocumento: document.getElementById("numeroDocumento").value
  };

  const { data, error } = await supabase.from('financeiro').insert([novoRegistro]);

  if (error) {
    console.error('Erro ao adicionar registro:', error);
    return;
  }

  adicionarLinhaTabela(data[0]);
  document.getElementById("financeForm").reset();
});

async function excluirRegistro(id, button) {
  const { error } = await supabase.from('financeiro').delete().eq('id', id);

  if (error) {
    console.error('Erro ao excluir registro:', error);
    return;
  }

  button.closest('tr').remove();
}

function formatarData(data) {
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}

// Exportação para Excel
function exportarParaExcel() {
  const table = document.querySelector("table");
  const workbook = XLSX.utils.table_to_book(table, { sheet: "Registros" });
  XLSX.writeFile(workbook, "Registros_Financeiros.xlsx");
}
