const formAdicionar = document.querySelector('#form-adicionar');
const itemInput = document.querySelector('#item-input');
const listaDeItens = document.querySelector('#lista-de-itens');

const adicionarItemNaTela = (item) => {
    const novoLi = document.createElement('li');
    if (item.comprado) {
        novoLi.classList.add('comprado');
    }

    const spanTexto = document.createElement('span');
    spanTexto.textContent = item.texto;

    const botaoRemover = document.createElement('button');
    botaoRemover.classList.add('botao-remover');
    botaoRemover.textContent = 'X';

    novoLi.appendChild(spanTexto);
    novoLi.appendChild(botaoRemover);

    listaDeItens.appendChild(novoLi);
};

const salvarDados = () => {
    const itens = [];
    const todosOsLi = listaDeItens.querySelectorAll('li');

    todosOsLi.forEach(li => {
        const texto = li.querySelector('span').textContent;
        const comprado = li.classList.contains('comprado');
        itens.push({ texto, comprado });
    });

    localStorage.setItem('minhaListaDeCompras', JSON.stringify(itens));
};

const carregarDados = () => {
    const dadosSalvos = localStorage.getItem('minhaListaDeCompras');
    if (dadosSalvos) {
        const itens = JSON.parse(dadosSalvos);
        itens.forEach(item => {
            adicionarItemNaTela(item);
        });
    }
};

formAdicionar.addEventListener('submit', (event) => {
    event.preventDefault();

    const textoDoItem = itemInput.value.trim();

    if (textoDoItem !== '') {
        const novoItem = {
            texto: textoDoItem,
            comprado: false
        };
        
        adicionarItemNaTela(novoItem);
        salvarDados();
        
        itemInput.value = '';
        itemInput.focus();
    }
});

listaDeItens.addEventListener('click', (event) => {
    const elementoClicado = event.target;

    if (elementoClicado.classList.contains('botao-remover')) {
        const itemParaRemover = elementoClicado.parentElement;
        itemParaRemover.remove();
        salvarDados();
    } 
    else if (elementoClicado.tagName === 'LI' || elementoClicado.tagName === 'SPAN') {
        const itemParaMarcar = elementoClicado.closest('li');
        itemParaMarcar.classList.toggle('comprado');
        salvarDados();
    }
});

document.addEventListener('DOMContentLoaded', carregarDados);