const checkboxes = document.querySelectorAll("input[type=checkbox]");
const cards = document.querySelectorAll(".card");

checkboxes.forEach(cb => {
  cb.addEventListener("change", filtrar);
});

function filtrar() {
  const selecionados = Array.from(checkboxes)
    .filter(cb => cb.checked)
    .map(cb => cb.value);

  cards.forEach(card => {
    const categorias = card.dataset.categoria.split(" ");

    const mostrar =
      selecionados.length === 0 ||
      categorias.some(cat => selecionados.includes(cat));

    card.style.display = mostrar ? "block" : "none";
  });
}

const botoes = document.querySelectorAll(".abrir-modal");
const modal = document.getElementById("modal");
const fechar = document.getElementById("fechar-modal");

if (modal) {
  botoes.forEach(botao => {
    botao.addEventListener("click", () => {
      modal.style.display = "block";
    });
  });

  if (fechar) {
    fechar.addEventListener("click", () => {
      modal.style.display = "none";
    });
  }

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });
}

const form = document.getElementById("form-orcamento");

if (form) {
  form.addEventListener("submit", function(e) {
    e.preventDefault();

    alert("Formulário enviado com sucesso!");
    form.reset();

    if (modal) {
      modal.style.display = "none";
    }
  });
}

const formLogin = document.getElementById("login-form");

if (formLogin) {
  const msg = document.getElementById("mensagem");

  formLogin.addEventListener("submit", function(e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();

    if (email === "admin@horizonte.com" && senha === "123456") {
      msg.textContent = "Login realizado com sucesso";
      msg.style.color = "green";

      setTimeout(() => {
        window.location.href = "index.html";
      }, 1000);
    } else {
      msg.textContent = "E-mail ou senha incorretos";
      msg.style.color = "red";
    }
  });
}

const formCad = document.getElementById("form-cadastro");
const msg = document.getElementById("mensagem");

document.getElementById("cep").addEventListener("blur", buscarCEP);

function buscarCEP() {
  const cep = document.getElementById("cep").value.replace(/\D/g, "");

  if (cep.length !== 8) {
    mostrarErro("erro-cep", "CEP inválido");
    return;
  }

  fetch(`https://viacep.com.br/ws/${cep}/json/`)
    .then(res => res.json())
    .then(dados => {
      if (dados.erro) {
        mostrarErro("erro-cep", "CEP não encontrado");
        return;
      }

      document.getElementById("rua").value = dados.logradouro;
      document.getElementById("bairro").value = dados.bairro;
      document.getElementById("cidade").value = dados.localidade;
      document.getElementById("estado").value = dados.uf;

      limparErro("erro-cep");
    })
    .catch(() => {
      mostrarErro("erro-cep", "Erro ao buscar CEP");
    });
}

formCad.addEventListener("submit", function(e) {
  e.preventDefault();

  let valido = true;

  limparTodosErros();

  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim();
  const cep = document.getElementById("cep").value.trim();
  const rua = document.getElementById("rua").value.trim();
  const bairro = document.getElementById("bairro").value.trim();
  const cidade = document.getElementById("cidade").value.trim();
  const estado = document.getElementById("estado").value.trim();
  const senha = document.getElementById("senha").value.trim();

  if (!nome) {
    mostrarErro("erro-nome", "Nome obrigatório");
    valido = false;
  }

  if (!email) {
    mostrarErro("erro-email", "Email obrigatório");
    valido = false;
  }

  if (!cep) {
    mostrarErro("erro-cep", "CEP obrigatório");
    valido = false;
  }

  if (!senha) {
    mostrarErro("erro-senha", "Senha obrigatória");
    valido = false;
  }

  if (!rua || !bairro || !cidade || !estado) {
    mostrarErro("erro-cep", "Preencha o CEP corretamente");
    valido = false;
  }

  if (valido) {
    const usuario = {
      nome,
      email,
      cep,
      rua,
      bairro,
      cidade,
      estado,
      senha
    };

    console.log(usuario);

    msg.textContent = "Cadastro realizado com sucesso";
    msg.style.color = "green";

    form.reset();
  }
});

function mostrarErro(id, mensagem) {
  document.getElementById(id).textContent = mensagem;
}

function limparErro(id) {
  document.getElementById(id).textContent = "";
}

function limparTodosErros() {
  document.querySelectorAll(".erro").forEach(e => e.textContent = "");
}