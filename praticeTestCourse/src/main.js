import './style.css';

document.querySelector('#app').innerHTML = `
  <div class="container">
    <h1>BiblioTest</h1>

    <div id="loginForm">
      <label for="login">Login:</label>
      <input type="text" id="login" placeholder="Digite seu login">
      <label for="senha">Senha:</label>
      <input type="password" id="senha" placeholder="Digite sua senha">
      <button id="btnLogin">Entrar</button>
      <div id="erroLogin"></div>
    </div>

    <div id="sistema" class="hidden">
      <h2>Bem-vindo, <span id="usuarioNome"></span>!</h2>
      <button id="btnLogout">Sair</button>
      <button id="toggleTema">Alternar Tema</button>

      <label for="busca">Buscar livro:</label>
      <input type="text" id="busca" placeholder="Digite o título...">
      <div id="livrosDisponiveis"></div>

      <h3>Favoritos</h3>
      <div id="listaFavoritos"></div>

      <div id="formReserva" class="hidden">
        <h3>Reservar Livro</h3>
        <label>Título:</label>
        <input type="text" id="tituloLivro" readonly>
        <label for="dataRetirada">Data de retirada:</label>
        <input type="date" id="dataRetirada">
        <label for="dataDevolucao">Data de devolução:</label>
        <input type="date" id="dataDevolucao">
        <button id="btnConfirmarReserva">Confirmar Reserva</button>
      </div>

      <div class="reserva" id="mensagemReserva"></div>
      <h3>Histórico de Reservas</h3>
      <div id="historicoReservas" class="historico"></div>
    </div>
  </div>
`;

const usuarioValido = { login: "testador", senha: "teste" };
let livros = [
  "Capitães da Areia", "Meu Pé de Laranja Lima",
  "O Sol é Para Todos", "O Pequeno Príncipe", "Percy Jackson e o Ladrão de Raios"
];
let livrosReservados = [], favoritos = [], historico = [], livroSelecionado = "";

document.getElementById("btnLogin").onclick = fazerLogin;
document.getElementById("btnLogout").onclick = fazerLogout;
document.getElementById("busca").oninput = buscarLivros;
document.getElementById("btnConfirmarReserva").onclick = confirmarReserva;
document.getElementById("toggleTema").onclick = () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("tema", document.body.classList.contains("dark") ? "dark" : "light");
};

window.onload = () => {
  const tema = localStorage.getItem("tema");
  if (tema === "dark") document.body.classList.add("dark");
};

function fazerLogin() {
  const login = document.getElementById("login").value;
  const senha = document.getElementById("senha").value;
  const erro = document.getElementById("erroLogin");

  if (login === usuarioValido.login && senha === usuarioValido.senha) {
    document.getElementById("loginForm").classList.add("hidden");
    document.getElementById("sistema").classList.remove("hidden");
    document.getElementById("usuarioNome").textContent = login;
    buscarLivros();
    renderizarFavoritos();
    renderizarHistorico();
  } else {
    erro.textContent = "Login ou senha incorretos.";
  }
}

function fazerLogout() {
  document.getElementById("sistema").classList.add("hidden");
  document.getElementById("loginForm").classList.remove("hidden");
  document.getElementById("login").value = "";
  document.getElementById("senha").value = "";
  document.getElementById("erroLogin").textContent = "";
  livroSelecionado = "";
  livrosReservados = [];
  favoritos = [];
  historico = [];
}

function buscarLivros() {
  const busca = document.getElementById("busca").value.toLowerCase();
  const divLivros = document.getElementById("livrosDisponiveis");
  divLivros.innerHTML = "";

  const encontrados = livros.filter(livro =>
    livro.toLowerCase().includes(busca) && !livrosReservados.includes(livro)
  );

  if (encontrados.length === 0) {
    divLivros.innerHTML = "<p>Nenhum livro disponível encontrado.</p>";
    return;
  }

  encontrados.forEach(livro => {
    const div = document.createElement("div");
    div.className = "livro";
    div.innerHTML = `
      <strong>${livro}</strong><br>
      <button onclick="selecionarLivro('${livro}')">Reservar</button>
      <button onclick="adicionarFavorito('${livro}')">Favoritar</button>
    `;
    divLivros.appendChild(div);
  });
}

window.selecionarLivro = function(titulo) {
  livroSelecionado = titulo;
  document.getElementById("formReserva").classList.remove("hidden");
  document.getElementById("tituloLivro").value = titulo;
  document.getElementById("mensagemReserva").textContent = "";
};

function confirmarReserva() {
  const retirada = document.getElementById("dataRetirada").value;
  const devolucao = document.getElementById("dataDevolucao").value;
  const avaliacao = prompt("Avalie o livro de 1 a 5:");

  if (!retirada || !devolucao || !avaliacao) {
    alert("Preencha todas as datas e avalie o livro.");
    return;
  }

  livrosReservados.push(livroSelecionado);
  historico.push({ titulo: livroSelecionado, retirada, devolucao, avaliacao, devolvido: false });
  renderizarHistorico();

  document.getElementById("mensagemReserva").innerHTML =
    `Reserva confirmada para <strong>${livroSelecionado}</strong>!<br>
     Retirada: <strong>${retirada}</strong><br>
     Devolução: <strong>${devolucao}</strong><br>
     Avaliação: <strong>${avaliacao}</strong>`;

  document.getElementById("formReserva").classList.add("hidden");
  buscarLivros();
  sugerirLivro();
}

window.adicionarFavorito = function(titulo) {
  if (!favoritos.includes(titulo)) {
    favoritos.push(titulo);
    renderizarFavoritos();
  }
};

window.removerFavorito = function(titulo) {
  favoritos = favoritos.filter(f => f !== titulo);
  renderizarFavoritos();
};

function renderizarFavoritos() {
  const lista = document.getElementById("listaFavoritos");
  lista.innerHTML = "";
  favoritos.forEach(titulo => {
    const div = document.createElement("div");
    div.className = "favorito";
    div.innerHTML = `
      ${titulo}
      <button onclick="removerFavorito('${titulo}')">Remover</button>
    `;
    lista.appendChild(div);
  });
}

function renderizarHistorico() {
  const historicoDiv = document.getElementById("historicoReservas");
  historicoDiv.innerHTML = historico.map(r => {
    if (!r.devolvido) {
      return `<p>
        ${r.titulo} - Retirada: ${r.retirada} | Devolução: ${r.devolucao} | Avaliação: ${r.avaliacao}
        <button onclick="devolverLivro('${r.titulo}')">Devolver</button>
      </p>`;
    } else {
      return `<p style="text-decoration: line-through; color: gray;">
        ${r.titulo} - Retirada: ${r.retirada} | Devolução: ${r.devolucao} | Avaliação: ${r.avaliacao} (Devolvido)
      </p>`;
    }
  }).join("");
}

window.devolverLivro = function(titulo) {
  // Remove o livro da lista de livros reservados
  livrosReservados = livrosReservados.filter(l => l !== titulo);

  // Marca como devolvido no histórico (atualiza a última reserva ativa)
  for(let i = historico.length - 1; i >= 0; i--) {
    if(historico[i].titulo === titulo && !historico[i].devolvido) {
      historico[i].devolvido = true;
      break;
    }
  }

  renderizarHistorico();
  buscarLivros();
  document.getElementById("mensagemReserva").textContent = `Livro "${titulo}" devolvido com sucesso!`;
};

function sugerirLivro() {
  const sugestoes = livros.filter(l =>
    !livrosReservados.includes(l) && !favoritos.includes(l)
  );
  const sugestao = sugestoes[Math.floor(Math.random() * sugestoes.length)];
  if (sugestao) {
    alert(`Sugestão de leitura: ${sugestao}`);
  }
}
