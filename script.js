const formAdicionar = document.querySelector('#form-adicionar');
const itemInput = document.querySelector('#item-input');
const listaDeItens = document.querySelector('#lista-de-itens');

// --- FUNÇÕES PRINCIPAIS --- //

/**
 * Cria e adiciona um novo item na lista da tela.
 * @param {object} item - O objeto do item a ser adicionado.
 */
const adicionarItemNaTela = (item) => {
    const novoLi = document.createElement('li');
    if (item.comprado) {
        novoLi.classList.add('comprado');
    }

    const spanTexto = document.createElement('span');
    spanTexto.classList.add('texto-item');
    spanTexto.textContent = item.texto;
    spanTexto.addEventListener('click', () => marcarComoComprado(novoLi));


    const divBotoes = document.createElement('div');
    divBotoes.classList.add('botoes-item');

    const botaoEditar = document.createElement('button');
    botaoEditar.classList.add('botao-acao', 'botao-editar');
    botaoEditar.textContent = 'Editar';
    
    const botaoRemover = document.createElement('button');
    botaoRemover.classList.add('botao-acao', 'botao-remover');
    botaoRemover.textContent = 'Excluir';

    divBotoes.appendChild(botaoEditar);
    divBotoes.appendChild(botaoRemover);

    novoLi.appendChild(spanTexto);
    novoLi.appendChild(divBotoes);

    listaDeItens.appendChild(novoLi);
};

/**
 * Salva a lista de itens atual no localStorage.
 */
const salvarDados = () => {
    const itens = [];
    const todosOsLi = listaDeItens.querySelectorAll('li');

    todosOsLi.forEach(li => {
        const texto = li.querySelector('.texto-item').textContent;
        const comprado = li.classList.contains('comprado');
        itens.push({ texto, comprado });
    });

    localStorage.setItem('minhaListaDeCompras', JSON.stringify(itens));
};

/**
 * Carrega os itens salvos do localStorage ao iniciar a página.
 */
const carregarDados = () => {
    const dadosSalvos = localStorage.getItem('minhaListaDeCompras');
    if (dadosSalvos) {
        const itens = JSON.parse(dadosSalvos);
        itens.forEach(adicionarItemNaTela);
    }
};

/**
 * Alterna a classe 'comprado' de um item da lista.
 * @param {HTMLElement} li - O elemento <li> a ser marcado/desmarcado.
 */
const marcarComoComprado = (li) => {
    li.classList.toggle('comprado');
    salvarDados();
};

/**
 * Ativa o modo de edição para um item da lista.
 * @param {HTMLElement} li - O elemento <li> a ser editado.
 */
const ativarModoEdicao = (li) => {
    const spanTexto = li.querySelector('.texto-item');
    const textoAtual = spanTexto.textContent;
    
    const inputEdicao = document.createElement('input');
    inputEdicao.type = 'text';
    inputEdicao.value = textoAtual;
    inputEdicao.classList.add('input-edicao');
    
    // Substitui o span pelo input
    li.replaceChild(inputEdicao, spanTexto);
    inputEdicao.focus();

    // Função para salvar a edição
    const salvarEdicao = () => {
        const novoTexto = inputEdicao.value.trim();
        if (novoTexto) {
            spanTexto.textContent = novoTexto;
        }
        // Retorna o span original
        li.replaceChild(spanTexto, inputEdicao);
        salvarDados();
    };

    // Salva ao pressionar Enter
    inputEdicao.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            salvarEdicao();
        }
    });

    // Salva ao perder o foco (clicar fora)
    inputEdicao.addEventListener('blur', salvarEdicao);
};


// --- EVENT LISTENERS --- //

// Adicionar um novo item
formAdicionar.addEventListener('submit', (event) => {
    event.preventDefault();
    const textoDoItem = itemInput.value.trim();

    if (textoDoItem !== '') {
        const novoItem = { texto: textoDoItem, comprado: false };
        adicionarItemNaTela(novoItem);
        salvarDados();
        itemInput.value = '';
        itemInput.focus();
    }
});

// Lidar com cliques na lista (Remover, Editar)
listaDeItens.addEventListener('click', (event) => {
    const elementoClicado = event.target;

    if (elementoClicado.classList.contains('botao-remover')) {
        const itemParaRemover = elementoClicado.closest('li');
        itemParaRemover.remove();
        salvarDados();
    } else if (elementoClicado.classList.contains('botao-editar')) {
        const itemParaEditar = elementoClicado.closest('li');
        ativarModoEdicao(itemParaEditar);
    }
});

// Carregar dados ao iniciar o script
document.addEventListener('DOMContentLoaded', carregarDados);
