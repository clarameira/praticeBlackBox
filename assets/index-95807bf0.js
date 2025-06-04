(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))a(o);new MutationObserver(o=>{for(const i of o)if(i.type==="childList")for(const u of i.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&a(u)}).observe(document,{childList:!0,subtree:!0});function n(o){const i={};return o.integrity&&(i.integrity=o.integrity),o.referrerPolicy&&(i.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?i.credentials="include":o.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function a(o){if(o.ep)return;o.ep=!0;const i=n(o);fetch(o.href,i)}})();document.querySelector("#app").innerHTML=`
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
`;const g={login:"testador",senha:"teste"};let f=["Capitães da Areia","Meu Pé de Laranja Lima","O Sol é Para Todos","O Pequeno Príncipe","Percy Jackson e o Ladrão de Raios"],s=[],d=[],r=[],l="";document.getElementById("btnLogin").onclick=h;document.getElementById("btnLogout").onclick=p;document.getElementById("busca").oninput=c;document.getElementById("btnConfirmarReserva").onclick=y;document.getElementById("toggleTema").onclick=()=>{document.body.classList.toggle("dark"),localStorage.setItem("tema",document.body.classList.contains("dark")?"dark":"light")};window.onload=()=>{localStorage.getItem("tema")==="dark"&&document.body.classList.add("dark")};function h(){const t=document.getElementById("login").value,e=document.getElementById("senha").value,n=document.getElementById("erroLogin");t===g.login&&e===g.senha?(document.getElementById("loginForm").classList.add("hidden"),document.getElementById("sistema").classList.remove("hidden"),document.getElementById("usuarioNome").textContent=t,c(),v(),m()):n.textContent="Login ou senha incorretos."}function p(){document.getElementById("sistema").classList.add("hidden"),document.getElementById("loginForm").classList.remove("hidden"),document.getElementById("login").value="",document.getElementById("senha").value="",document.getElementById("erroLogin").textContent="",l="",s=[],d=[],r=[]}function c(){const t=document.getElementById("busca").value.toLowerCase(),e=document.getElementById("livrosDisponiveis");e.innerHTML="";const n=f.filter(a=>a.toLowerCase().includes(t)&&!s.includes(a));if(n.length===0){e.innerHTML="<p>Nenhum livro disponível encontrado.</p>";return}n.forEach(a=>{const o=document.createElement("div");o.className="livro",o.innerHTML=`
      <strong>${a}</strong><br>
      <button onclick="selecionarLivro('${a}')">Reservar</button>
      <button onclick="adicionarFavorito('${a}')">Favoritar</button>
    `,e.appendChild(o)})}window.selecionarLivro=function(t){l=t,document.getElementById("formReserva").classList.remove("hidden"),document.getElementById("tituloLivro").value=t,document.getElementById("mensagemReserva").textContent=""};function y(){const t=document.getElementById("dataRetirada").value,e=document.getElementById("dataDevolucao").value,n=prompt("Avalie o livro de 1 a 5:");if(!t||!e||!n){alert("Preencha todas as datas e avalie o livro.");return}s.push(l),r.push({titulo:l,retirada:t,devolucao:e,avaliacao:n,devolvido:!1}),m(),document.getElementById("mensagemReserva").innerHTML=`Reserva confirmada para <strong>${l}</strong>!<br>
     Retirada: <strong>${t}</strong><br>
     Devolução: <strong>${e}</strong><br>
     Avaliação: <strong>${n}</strong>`,document.getElementById("formReserva").classList.add("hidden"),c(),b()}window.adicionarFavorito=function(t){d.includes(t)||(d.push(t),v())};window.removerFavorito=function(t){d=d.filter(e=>e!==t),v()};function v(){const t=document.getElementById("listaFavoritos");t.innerHTML="",d.forEach(e=>{const n=document.createElement("div");n.className="favorito",n.innerHTML=`
      ${e}
      <button onclick="removerFavorito('${e}')">Remover</button>
    `,t.appendChild(n)})}function m(){const t=document.getElementById("historicoReservas");t.innerHTML=r.map(e=>e.devolvido?`<p style="text-decoration: line-through; color: gray;">
        ${e.titulo} - Retirada: ${e.retirada} | Devolução: ${e.devolucao} | Avaliação: ${e.avaliacao} (Devolvido)
      </p>`:`<p>
        ${e.titulo} - Retirada: ${e.retirada} | Devolução: ${e.devolucao} | Avaliação: ${e.avaliacao}
        <button onclick="devolverLivro('${e.titulo}')">Devolver</button>
      </p>`).join("")}window.devolverLivro=function(t){s=s.filter(e=>e!==t);for(let e=r.length-1;e>=0;e--)if(r[e].titulo===t&&!r[e].devolvido){r[e].devolvido=!0;break}m(),c(),document.getElementById("mensagemReserva").textContent=`Livro "${t}" devolvido com sucesso!`};function b(){const t=f.filter(n=>!s.includes(n)&&!d.includes(n)),e=t[Math.floor(Math.random()*t.length)];e&&alert(`Sugestão de leitura: ${e}`)}
