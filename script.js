/**
 * @file script.js
 * @description Script para a funcionalidade de uma lista de compras interativa.
 * Permite adicionar, remover, editar e marcar itens como comprados.
 * Os dados são salvos no localStorage do navegador para persistência.
 */

// --- SELEÇÃO DOS ELEMENTOS DO DOM --- //

// O formulário principal para adicionar novos itens.
const formAdicionar = document.querySelector('#form-adicionar');
// O campo de texto onde o usuário digita o nome do item.
const itemInput = document.querySelector('#item-input');
// A lista (<ul>) onde os itens de compra serão exibidos.
const listaDeItens = document.querySelector('#lista-de-itens');


// --- ÍCONES SVG --- //
// Armazena o código HTML dos ícones em constantes para reutilização e clareza.

const svgIconeEditar = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/><path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/></svg>`;
const svgIconeRemover = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16"><path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/></svg>`;


// --- FUNÇÕES DE LÓGICA DA APLICAÇÃO --- //

/**
 * Cria a estrutura HTML de um item e o adiciona na lista (DOM).
 * @param {object} item - O objeto do item a ser adicionado. Ex: { texto: 'Maçã', comprado: false }
 */
const adicionarItemNaTela = (item) => {
    // Cria o elemento <li> que conterá o item.
    const novoLi = document.createElement('li');
    // Se o item já foi comprado, adiciona a classe CSS para o estilo de riscado.
    if (item.comprado) {
        novoLi.classList.add('comprado');
    }

    // Cria o <span> que exibirá o texto do item.
    const spanTexto = document.createElement('span');
    spanTexto.classList.add('texto-item');
    spanTexto.textContent = item.texto;
    // Adiciona um evento de clique diretamente no texto para marcar/desmarcar como comprado.
    spanTexto.addEventListener('click', () => marcarComoComprado(novoLi));

    // Cria a <div> que agrupará os botões de ação.
    const divBotoes = document.createElement('div');
    divBotoes.classList.add('botoes-item');

    // Cria o botão de editar, adicionando classes e o ícone SVG.
    const botaoEditar = document.createElement('button');
    botaoEditar.classList.add('botao-acao', 'botao-editar');
    botaoEditar.innerHTML = svgIconeEditar;
    
    // Cria o botão de remover, adicionando classes e o ícone SVG.
    const botaoRemover = document.createElement('button');
    botaoRemover.classList.add('botao-acao', 'botao-remover');
    botaoRemover.innerHTML = svgIconeRemover;

    // Adiciona os botões à sua div.
    divBotoes.appendChild(botaoEditar);
    divBotoes.appendChild(botaoRemover);

    // Monta o item da lista: primeiro o texto, depois os botões.
    novoLi.appendChild(spanTexto);
    novoLi.appendChild(divBotoes);

    // Adiciona o item recém-criado à lista principal no HTML.
    listaDeItens.appendChild(novoLi);
};

/**
 * Percorre a lista de itens no DOM, coleta os dados e os salva no localStorage.
 * Esta função é chamada sempre que a lista é modificada (adicionar, remover, editar, marcar).
 */
const salvarDados = () => {
    const itens = [];
    // Seleciona todos os elementos <li> da lista.
    const todosOsLi = listaDeItens.querySelectorAll('li');

    // Itera sobre cada <li> para extrair suas informações.
    todosOsLi.forEach(li => {
        const spanTexto = li.querySelector('.texto-item');
        // Verifica se o item não está em modo de edição (sem o span de texto).
        if (spanTexto) {
            const texto = spanTexto.textContent;
            const comprado = li.classList.contains('comprado');
            itens.push({ texto, comprado });
        }
    });

    // Converte o array de itens para uma string JSON e salva no localStorage.
    localStorage.setItem('minhaListaDeCompras', JSON.stringify(itens));
};

/**
 * Carrega os itens salvos do localStorage assim que a página é aberta.
 */
const carregarDados = () => {
    // Busca a lista de compras salva.
    const dadosSalvos = localStorage.getItem('minhaListaDeCompras');
    // Se houver dados, converte de volta para um array e recria os itens na tela.
    if (dadosSalvos) {
        const itens = JSON.parse(dadosSalvos);
        itens.forEach(adicionarItemNaTela);
    }
};

/**
 * Alterna o estado de um item entre 'comprado' e 'a comprar'.
 * @param {HTMLElement} li - O elemento <li> que representa o item.
 */
const marcarComoComprado = (li) => {
    // Adiciona ou remove a classe 'comprado', que aplica/remove o estilo de texto riscado.
    li.classList.toggle('comprado');
    // Salva o novo estado da lista.
    salvarDados();
};

/**
 * Ativa o modo de edição para um item, substituindo o texto por um campo de input.
 * @param {HTMLElement} li - O elemento <li> a ser editado.
 */
const ativarModoEdicao = (li) => {
    const spanTexto = li.querySelector('.texto-item');
    const textoAtual = spanTexto.textContent;
    
    // Cria um campo de input e o preenche com o texto atual do item.
    const inputEdicao = document.createElement('input');
    inputEdicao.type = 'text';
    inputEdicao.value = textoAtual;
    inputEdicao.classList.add('input-edicao');
    
    // Substitui o <span> pelo <input> no DOM.
    li.replaceChild(inputEdicao, spanTexto);
    inputEdicao.focus(); // Coloca o cursor no campo de input automaticamente.

    // Função interna para finalizar e salvar a edição.
    const salvarEdicao = () => {
        const novoTexto = inputEdicao.value.trim();
        // Atualiza o texto do span apenas se o novo texto não for vazio.
        if (novoTexto) {
            spanTexto.textContent = novoTexto;
        }
        // Retorna o <span> para o lugar do <input>.
        li.replaceChild(spanTexto, inputEdicao);
        salvarDados(); // Salva os dados atualizados.
    };

    // Adiciona um evento para salvar a edição ao pressionar a tecla 'Enter'.
    inputEdicao.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            salvarEdicao();
        }
    });

    // Adiciona um evento para salvar a edição quando o campo perde o foco (o usuário clica fora).
    inputEdicao.addEventListener('blur', salvarEdicao);
};


// --- EVENT LISTENERS (OUVINTES DE EVENTOS) --- //

/**
 * Listener para o envio do formulário. Adiciona um novo item à lista.
 */
formAdicionar.addEventListener('submit', (event) => {
    event.preventDefault(); // Impede o comportamento padrão do formulário de recarregar a página.
    const textoDoItem = itemInput.value.trim(); // Pega o texto e remove espaços extras.

    // Garante que o item não seja vazio.
    if (textoDoItem !== '') {
        const novoItem = { texto: textoDoItem, comprado: false };
        adicionarItemNaTela(novoItem);
        salvarDados(); // Salva a lista atualizada.
        itemInput.value = ''; // Limpa o campo de input.
        itemInput.focus(); // Coloca o cursor de volta no campo para fácil adição de novos itens.
    }
});

/**
 * Listener para cliques na lista de itens (<ul>).
 * Utiliza o conceito de "Event Delegation" para gerenciar cliques nos botões
 * de editar e remover, sem precisar adicionar um listener para cada botão individualmente.
 */
listaDeItens.addEventListener('click', (event) => {
    // Encontra o botão de ação mais próximo que foi clicado.
    const elementoClicado = event.target.closest('.botao-acao');

    // Se o clique não foi em um botão de ação, não faz nada.
    if (!elementoClicado) return;

    // Verifica se o botão clicado é o de remover.
    if (elementoClicado.classList.contains('botao-remover')) {
        // Exibe uma caixa de diálogo de confirmação.
        if (confirm('Tem certeza que deseja remover este item?')) {
            const itemParaRemover = elementoClicado.closest('li');
            itemParaRemover.remove();
            salvarDados();
        }
    } 
    // Verifica se o botão clicado é o de editar.
    else if (elementoClicado.classList.contains('botao-editar')) {
        const itemParaEditar = elementoClicado.closest('li');
        ativarModoEdicao(itemParaEditar);
    }
});

/**
 * Listener que é acionado quando o conteúdo HTML da página foi completamente carregado.
 * É o ponto de partida para carregar os dados salvos.
 */
document.addEventListener('DOMContentLoaded', carregarDados);