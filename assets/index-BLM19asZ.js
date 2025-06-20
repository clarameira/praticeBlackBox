(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))a(n);new MutationObserver(n=>{for(const i of n)if(i.type==="childList")for(const v of i.addedNodes)v.tagName==="LINK"&&v.rel==="modulepreload"&&a(v)}).observe(document,{childList:!0,subtree:!0});function o(n){const i={};return n.integrity&&(i.integrity=n.integrity),n.referrerPolicy&&(i.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?i.credentials="include":n.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function a(n){if(n.ep)return;n.ep=!0;const i=o(n);fetch(n.href,i)}})();document.querySelector("#app").innerHTML=`
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
`;const g={login:"testador",senha:"teste"};let f=["Capitães da Areia","Meu Pé de Laranja Lima","O Sol é Para Todos","O Pequeno Príncipe","Percy Jackson e o Ladrão de Raios"],d=[],s=[],r=[],l="";document.getElementById("btnLogin").onclick=h;document.getElementById("btnLogout").onclick=p;document.getElementById("busca").oninput=c;document.getElementById("btnConfirmarReserva").onclick=y;document.getElementById("toggleTema").onclick=()=>{document.body.classList.toggle("dark"),localStorage.setItem("tema",document.body.classList.contains("dark")?"dark":"light")};window.onload=()=>{localStorage.getItem("tema")==="dark"&&document.body.classList.add("dark")};function h(){const t=document.getElementById("login").value,e=document.getElementById("senha").value,o=document.getElementById("erroLogin");if(t==""||e==""){o.textContent="",document.getElementById("loginForm").classList.add("hidden"),document.getElementById("sistema").classList.remove("hidden"),document.getElementById("usuarioNome").textContent=t||"Convidado",c(),u(),m();return}t===g.login&&e===g.senha?(o.textContent="",document.getElementById("loginForm").classList.add("hidden"),document.getElementById("sistema").classList.remove("hidden"),document.getElementById("usuarioNome").textContent=t,c(),u(),m()):o.textContent="Login ou senha incorretos."}function p(){document.getElementById("sistema").classList.add("hidden"),document.getElementById("loginForm").classList.remove("hidden"),document.getElementById("login").value="",document.getElementById("senha").value="",document.getElementById("erroLogin").textContent="",l="",d=[],s=[],r=[]}function c(){const t=document.getElementById("busca").value.toLowerCase(),e=document.getElementById("livrosDisponiveis");e.innerHTML="";const o=f.filter(a=>a.toLowerCase().includes(t)&&!d.includes(a));if(o.length===0){e.innerHTML="<p>Nenhum livro disponível encontrado.</p>";return}o.forEach(a=>{const n=document.createElement("div");n.className="livro",n.innerHTML=`
      <strong>${a}</strong><br>
      <button onclick="selecionarLivro('${a}')">Reservar</button>
      <button onclick="adicionarFavorito('${a}')">Favoritar</button>
    `,e.appendChild(n)})}window.selecionarLivro=function(t){l=t,document.getElementById("formReserva").classList.remove("hidden"),document.getElementById("tituloLivro").value=t,document.getElementById("mensagemReserva").textContent=""};function y(){const t=document.getElementById("dataRetirada").value,e=document.getElementById("dataDevolucao").value,o=prompt("Avalie o livro de 1 a 5:");if(!o){alert("Avaliação obrigatória.");return}d.push(l),r.push({titulo:l,retirada:t,devolucao:e,avaliacao:o,devolvido:!1}),m(),document.getElementById("mensagemReserva").innerHTML=`Reserva confirmada para <strong>${l}</strong>!<br>
     Retirada: <strong>${t}</strong><br>
     Devolução: <strong>${e}</strong><br>
     Avaliação: <strong>${o}</strong>`,document.getElementById("formReserva").classList.add("hidden"),c(),b()}window.adicionarFavorito=function(t){s.push(t),u()};window.removerFavorito=function(t){s=s.filter(e=>e!==t),u()};function u(){const t=document.getElementById("listaFavoritos");t.innerHTML="",s.forEach(e=>{const o=document.createElement("div");o.className="favorito",o.innerHTML=`
      ${e}
      <button onclick="removerFavorito('${e}')">Remover</button>
    `,t.appendChild(o)})}function m(){const t=document.getElementById("historicoReservas");t.innerHTML=r.map(e=>e.devolvido?`<p style="text-decoration: line-through; color: gray;">
        ${e.titulo} - Retirada: ${e.retirada} | Devolução: ${e.devolucao} | Avaliação: ${e.avaliacao} (Devolvido)
      </p>`:`<p>
        ${e.titulo} - Retirada: ${e.retirada} | Devolução: ${e.devolucao} | Avaliação: ${e.avaliacao}
        <button onclick="devolverLivro('${e.titulo}')">Devolver</button>
      </p>`).join("")}window.devolverLivro=function(t){d=d.filter(e=>e!==t);for(let e=r.length-1;e>=0;e--)if(r[e].titulo===t&&!r[e].devolvido){r[e].devolvido=!0;break}m(),c(),document.getElementById("mensagemReserva").textContent=`Livro "${t}" devolvido com sucesso!`};function b(){const t=f.filter(o=>!d.includes(o)&&!s.includes(o)),e=t[Math.floor(Math.random()*t.length)];e&&alert(`Sugestão de leitura: ${e}`)}
