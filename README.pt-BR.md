[English](README.md) · [简体中文](README.zh-CN.md) · [Español](README.es.md) · [Português (Brasil)](README.pt-BR.md) · [日本語](README.ja.md)

# Haunted FreeCell — Paciência FreeCell de Halloween e resgates de lanternas

🕯️ A mansão está quieta, os Reis viraram abóboras e quatro torres esperam um pouco de paciência. **Haunted FreeCell** traz um baralho completo de 52 cartas, personagens de Halloween, arrastar e soltar de verdade e três finais Lantern Rescue. Abra espaço, revele a próxima carta e deixe a luz entrar.

**[Jogar agora](https://halloween-freecell.crazy3d.org/)** · [Ver os 12 jogos de Halloween](https://github.com/AshinTop/halloween-games) · [⭐ Dar uma estrela no GitHub](https://github.com/AshinTop/halloween-freecell)

O README está disponível em cinco idiomas. A **interface do jogo oferece apenas inglês e chinês simplificado**.

![Haunted FreeCell com oito colunas, quatro células livres, quatro fundações e cartas de Halloween](docs/images/gameplay.jpg)

## O que torna este jogo especial

- **FreeCell com 52 cartas**: oito colunas, quatro células para uma carta cada, quatro fundações por naipe e limite correto para mover sequências.
- Arraste uma carta ou sequência usando mouse ou toque, ou selecione a origem e o destino. Uma soltura inválida não altera a posição.
- **Três finais Lantern Rescue verificados**, partidas Classic com semente, desfazer durante a sessão e dicas de jogadas legais.
- Valetes-gato, Damas-bruxa e Reis-abóbora originais, sons opcionais e torres que acendem quando os naipes ficam completos.
- **Coleta automática de um final comprovado**, com Stop e uma ação para desfazer o lote inteiro.

## Como jogar

Monte cada fundação do **Ás ao Rei do mesmo naipe**. Nas colunas, organize valores decrescentes alternando vermelho e preto. Qualquer carta pode iniciar uma coluna vazia; cada célula livre guarda apenas uma. A capacidade para mover uma sequência é `(células livres vazias + 1) × 2^(colunas vazias utilizáveis)`. A coluna vazia de destino não entra no espaço de apoio. Cartas das fundações podem voltar quando a jogada for legal.

Lantern Rescue mantém essas regras em **The West Tower**, **The Moonlight Ball** e **The Last Candle**. Os três finais têm soluções completas verificadas. As metas de movimentos são desafios amigáveis, não alegações de mínimo matemático.

### Um final automático que você controla

Após uma jogada manual válida, uma cópia da posição precisa provar que **todas as cartas restantes chegam às fundações usando somente movimentos legais para elas**. Um caminho parcial não inicia a coleta. Com a rota inteira comprovada, as cartas vão uma a uma, cada qual contando como uma jogada. A animação programa até 130 ms por carta e encurta lotes longos para cerca de quatro segundos nominais; movimento reduzido retira o voo.

**Stop** ou **Esc** interrompe na posição atual. Um **Undo** restaura a posição e a contagem de antes de todo o lote automático, sem dispará-lo outra vez. **Finish automatically** retoma quando você quiser; uma posição salva pronta para terminar também mostra o botão. Desfazer no meio da partida não desativa coletas futuras. Trocar de partida, reiniciar, abrir ajuda, mudar idioma, redimensionar, ocultar a página ou sair da janela cancela a sequência ativa.

## Controles

| Ação | Como fazer |
| --- | --- |
| Mover carta ou sequência legal | Arrastar e soltar, ou selecionar e tocar no destino |
| Tentar uma carta exposta na fundação | Clique duplo ou toque duplo |
| Desfazer / dica | **U** / **H**, ou os botões |
| Parar coleta / cancelar arrasto | **Esc**; a coleta também oferece Stop |
| Retomar um final comprovado | **Finish automatically** |
| Rolar colunas longas | Setas, roda do mouse, deslizar um espaço ou carta não movível; arrastar perto da borda também rola |

## Um pouco de estratégia

Tente manter uma célula livre: além de guardar uma carta, ela aumenta a capacidade de transportar sequências. Antes de mover um Rei, veja qual Dama ele pode estar escondendo. A coleta automática espera até não ser mais necessário organizar as colunas; essa parte do planejamento continua nas suas mãos.

## Progresso e links de desafios

Quando permitido, posição, tempo, dicas, preferências e melhores resultados ficam salvos localmente. O histórico de desfazer dura só a sessão; não há conta sincronizada. Compartilhe a [partida 12345](https://halloween-freecell.crazy3d.org/?deal=12345) ou o [resgate 1](https://halloween-freecell.crazy3d.org/?puzzle=1); os valores 2 e 3 abrem os outros. O compartilhamento usa resultados reais e mostra texto copiável se necessário.

## Capturas de tela e vídeo de apresentação

![Mesa compacta de Haunted FreeCell com células, fundações, colunas roláveis e ferramentas](docs/images/mobile.jpg)

Captura real em um iframe compacto. Ela mostra o layout em uma janela pequena, não um teste em celular físico.

[Player de vídeo e transcrição](https://halloween-freecell.crazy3d.org/intro.html) · [Baixar o MP4](docs/media/intro.mp4)

A **apresentação de 24 segundos, sem áudio**, combina capturas reais e legendas. É um passeio visual, não uma partida gravada continuamente nem uma demonstração sonora.

## Perguntas frequentes

### As dicas garantem uma vitória?

Não. Elas sugerem uma jogada legal imediata, não uma solução inteira. Os três resgates têm solução verificada; partidas Classic arbitrárias não recebem essa garantia.

### Posso arrastar qualquer pilha para uma coluna vazia?

Não. A sequência precisa diminuir de valor, alternar cores e contar com espaço temporário suficiente para a transferência.

### Desfazer volta o relógio ou apaga recordes?

Não. Recupera posições e movimentos, inclusive todo um lote automático. Tempo decorrido, dicas solicitadas e recordes já obtidos continuam registrados.

## Executar localmente e incorporar

Inicie um servidor HTTP na raiz do repositório:

```sh
python3 -m http.server 4173
```

Abra **http://localhost:4173/**. Não é preciso compilar nem instalar dependências. Use HTTP: `file://` pode bloquear módulos JavaScript.

Execute as verificações incluídas com Node:

```sh
npm test
```

Os testes de Node cobrem baralhos completos, capacidade, fundações reversíveis, soluções, arrasto e rolagem de borda, gestos cancelados, prova de final, Stop, Undo por lote, movimento reduzido e callbacks antigos. Eles complementam a revisão no navegador.

```html
<iframe src="https://halloween-freecell.crazy3d.org/?embed=1"
  title="Haunted FreeCell"
  style="display:block;width:100%;height:654px;border:0"
  allow="fullscreen" allowfullscreen></iframe>
```

A referência de desktop é **1160×654 pixels CSS**. Em janelas baixas, só as colunas rolam; células, fundações e ferramentas permanecem acessíveis. Setas e rolagem durante o arrasto alcançam cartas longas sem transformar tudo em pequenas faixas.

Veja [EMBEDDING.md](EMBEDDING.md) para tamanho, armazenamento, foco e permissões. Meça a altura disponível após a barra do site principal.

## Mais pequenas aventuras de Halloween

- **[Trick-or-Treat TriPeaks](https://halloween-tripeaks.crazy3d.org/)** · [Código](https://github.com/AshinTop/halloween-tripeaks) — Encadeie cartas de valores consecutivos em oito resgates.
- **[Pumpkin Shift](https://halloween-pumpkin-shift.crazy3d.org/)** · [Código](https://github.com/AshinTop/halloween-pumpkin-shift) — Deslize números por 12 salas com movimentos lunares limitados.
- **[Haunted Hearts](https://halloween-love-game.crazy3d.org/)** · [Código](https://github.com/AshinTop/halloween-love-game) — Ajude dois fantasmas a dividir portas, caminhos e uma lanterna.
- **[Pumpkin 2048](https://halloween-2048.crazy3d.org/)** · [Código](https://github.com/AshinTop/halloween-2048) — Junte abóboras numeradas e resolva desafios com casas-alvo.

## Créditos e apoio

Criado para **AshinTop** e **Midnight Candy Club**, com design, programação e revisão conduzidos por pessoas com auxílio de IA. Arte e sons sintetizados originais do projeto. Dispensa conta remota; a hospedagem pode adicionar scripts ou registros de acesso.

Gostou? **[Deixe uma estrela no GitHub](https://github.com/AshinTop/halloween-freecell)**. Para relatar problemas, inclua navegador, tamanho do iframe, link e passos para reproduzi-los.
