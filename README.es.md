[English](README.md) · [简体中文](README.zh-CN.md) · [Español](README.es.md) · [Português (Brasil)](README.pt-BR.md) · [日本語](README.ja.md)

# Haunted FreeCell — Solitario de Halloween y rescates de faroles

🕯️ La mansión está en silencio, los Reyes son calabazas y cuatro torres esperan un poco de paciencia. **Haunted FreeCell** es un solitario completo de 52 cartas con personajes de Halloween, arrastre real y tres finales de Lantern Rescue. Haz espacio, descubre la carta que necesitas y deja entrar la luz.

**[Jugar ahora](https://halloween-freecell.crazy3d.org/)** · [Ver los 12 juegos de Halloween](https://github.com/AshinTop/halloween-games) · [⭐ Dar una estrella en GitHub](https://github.com/AshinTop/halloween-freecell)

El README está disponible en cinco idiomas. La **interfaz del juego solo ofrece inglés y chino simplificado**.

![Haunted FreeCell con ocho columnas, cuatro celdas libres, cuatro bases y cartas de personajes de Halloween](docs/images/gameplay.jpg)

## Qué lo hace especial

- **FreeCell de 52 cartas** con ocho columnas, cuatro celdas de una carta y cuatro bases por palo; respeta la capacidad para mover secuencias.
- Arrastra una carta o una secuencia con ratón o tacto, o selecciona origen y destino. Soltar en un lugar ilegal no altera la partida.
- **Tres finales Lantern Rescue verificados**, repartos Classic con semilla, deshacer durante la sesión y pistas de movimientos legales.
- Jotas felinas, Reinas brujas y Reyes calabaza originales, sonidos opcionales y torres que se iluminan al completar los palos.
- **Recogida automática de un final demostrado**, con Stop y una única acción para deshacer todo el lote.

## Cómo jugar

Construye cada base del **As al Rey del mismo palo**. Las columnas bajan de valor alternando rojo y negro. Una columna vacía admite cualquier carta; cada celda libre guarda una. Para trasladar una secuencia ordenada, la capacidad es `(celdas libres vacías + 1) × 2^(columnas vacías utilizables)`. La columna vacía de destino no cuenta como espacio de trabajo. También puedes devolver cartas desde una base cuando el movimiento sea legal.

Lantern Rescue usa estas reglas en **The West Tower**, **The Moonlight Ball** y **The Last Candle**. Los tres finales tienen soluciones completas comprobadas. Sus objetivos de movimientos son una referencia amistosa, no una afirmación del mínimo matemático.

### Un final automático que puedes detener

Después de una jugada manual válida, una copia de la posición debe demostrar que **todas las cartas restantes llegan a las bases mediante movimientos legales de base solamente**. Una ruta parcial no activa nada. Al existir la ruta completa, las cartas se recogen una a una y cada una cuenta como movimiento. La animación programa hasta 130 ms por carta y acorta los lotes largos a unos cuatro segundos nominales; el modo de movimiento reducido elimina el vuelo.

**Stop** o **Esc** detiene la secuencia. Una acción **Undo** recupera la posición y el contador anteriores a todo el lote, sin arrancarlo de nuevo. **Finish automatically** permite retomarlo; también aparece al cargar una posición lista para terminar. Deshacer en mitad de una partida no desactiva futuros finales. Cambiar de reparto, reiniciar, abrir ayuda, cambiar idioma, redimensionar, ocultar la página o salir de su ventana cancela la recogida activa.

## Controles

| Acción | Cómo hacerlo |
| --- | --- |
| Mover carta o secuencia legal | Arrastrar y soltar, o seleccionar y pulsar el destino |
| Probar una carta expuesta en su base | Doble clic o doble toque |
| Deshacer / pista | **U** / **H**, o los botones |
| Detener recogida / cancelar arrastre | **Esc**; la recogida también tiene Stop |
| Retomar el final demostrado | **Finish automatically** |
| Desplazar columnas largas | Flechas, rueda, deslizar un hueco o carta no movible; el borde desplaza durante un arrastre |

## Un poco de estrategia

Conservar una celda libre ayuda más de lo que parece: también determina cuántas cartas puedes trasladar juntas. Antes de apartar un Rey, mira qué Reina está bloqueando. El final automático espera hasta que ya no hace falta reorganizar columnas; esa parte del razonamiento sigue siendo tuya.

## Progreso y enlaces de desafío

Si se permite, se guardan localmente posición, tiempo, pistas, preferencias y mejores resultados. El historial de deshacer solo dura la sesión; no hay cuentas sincronizadas. Comparte el [reparto 12345](https://halloween-freecell.crazy3d.org/?deal=12345) o el [rescate 1](https://halloween-freecell.crazy3d.org/?puzzle=1); los valores 2 y 3 abren los otros. Compartir usa resultados reales y ofrece texto visible si no puede copiar.

## Capturas y presentación en vídeo

![Mesa compacta de Haunted FreeCell con celdas, bases, columnas desplazables y herramientas](docs/images/mobile.jpg)

Captura real dentro de un iframe compacto. Muestra la distribución en una ventana pequeña, no una prueba en un teléfono físico.

[Reproductor y transcripción](https://halloween-freecell.crazy3d.org/intro.html) · [Descargar el MP4](docs/media/intro.mp4)

La **presentación de 24 segundos, sin sonido**, combina capturas reales y rótulos. Es un recorrido visual, no una partida grabada de forma continua ni una muestra de audio.

## Preguntas frecuentes

### ¿Las pistas garantizan ganar?

No. Proponen una jugada legal inmediata, no una solución completa. Los tres rescates tienen solución verificada; no se promete lo mismo de cualquier reparto Classic.

### ¿Puedo arrastrar cualquier montón a una columna vacía?

No. Debe ser una secuencia descendente de colores alternos y existir suficiente espacio temporal para transferirla.

### ¿Deshacer recupera el tiempo o borra un récord?

No. Recupera posiciones y movimientos, incluido un lote automático completo. No borra tiempo transcurrido, pistas solicitadas ni récords obtenidos.

## Ejecutar en local e insertar el juego

Sirve la raíz del repositorio mediante HTTP:

```sh
python3 -m http.server 4173
```

Abre **http://localhost:4173/**. No requiere compilación ni dependencias. Usa HTTP: `file://` puede bloquear los módulos JavaScript.

Ejecuta las comprobaciones incluidas con Node:

```sh
npm test
```

Las pruebas de Node cubren mazos, capacidad, bases reversibles, soluciones, arrastre y desplazamiento por bordes, gestos cancelados, demostración del final, Stop, Undo por lote, movimiento reducido y callbacks obsoletos. Complementan la revisión del navegador.

```html
<iframe src="https://halloween-freecell.crazy3d.org/?embed=1"
  title="Haunted FreeCell"
  style="display:block;width:100%;height:654px;border:0"
  allow="fullscreen" allowfullscreen></iframe>
```

La referencia de escritorio es **1160×654 píxeles CSS**. En ventanas bajas, las columnas se desplazan internamente mientras celdas, bases y herramientas siguen accesibles. Las flechas y el desplazamiento al arrastrar permiten alcanzar cartas sin reducirlas a tiras diminutas.

Consulta [EMBEDDING.md](EMBEDDING.md) para tamaño, almacenamiento, foco y permisos. Mide la altura restante después de la barra del sitio anfitrión.

## Más pequeñas aventuras de Halloween

- **[Trick-or-Treat TriPeaks](https://halloween-tripeaks.crazy3d.org/)** · [Código](https://github.com/AshinTop/halloween-tripeaks) — Encadena cartas de valores consecutivos en ocho rescates.
- **[Pumpkin Shift](https://halloween-pumpkin-shift.crazy3d.org/)** · [Código](https://github.com/AshinTop/halloween-pumpkin-shift) — Desliza números por 12 habitaciones con movimientos lunares limitados.
- **[Haunted Hearts](https://halloween-love-game.crazy3d.org/)** · [Código](https://github.com/AshinTop/halloween-love-game) — Ayuda a dos fantasmas a compartir puertas, caminos y una linterna.
- **[Pumpkin 2048](https://halloween-2048.crazy3d.org/)** · [Código](https://github.com/AshinTop/halloween-2048) — Combina calabazas numeradas y resuelve pruebas con casillas objetivo.

## Créditos y apoyo

Creado para **AshinTop** y **Midnight Candy Club** con diseño, programación y revisión dirigidos por personas y asistidos por IA. Arte y sonidos sintetizados originales del proyecto. No necesita cuenta remota; el alojamiento puede añadir scripts o registros de solicitudes.

¿Te ha gustado? **[Dale una estrella en GitHub](https://github.com/AshinTop/halloween-freecell)**. Para informar de errores, incluye navegador, tamaño del iframe, enlace y pasos para reproducirlos.
