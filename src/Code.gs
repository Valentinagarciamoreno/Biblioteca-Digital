/**
 * Code.gs — el "cerebro" del sitio.
 *
 * Este es el único archivo de lógica (JavaScript de servidor) del proyecto.
 * Los archivos .html son las 6 pantallas y las piezas que se repiten
 * (encabezado, pie de página, estilos).
 *
 * Cómo funciona en general:
 * 1. El usuario entra a la URL de la app, por ejemplo:
 *      https://script.google.com/.../exec?page=lector&id=2
 * 2. Google llama automáticamente a la función doGet(e) de este archivo.
 * 3. doGet mira el parámetro "page" de la URL y decide qué pantalla (.html)
 *    debe mostrar.
 * 4. Le pasa a esa pantalla los datos que necesite (la lista de libros, el
 *    libro que se está leyendo, los resultados de una búsqueda, etc.).
 */

// ---------------------------------------------------------------------------
// DATOS DE EJEMPLO
// ---------------------------------------------------------------------------
// Estos libros son solo para que la interfaz se vea llena y funcione la
// búsqueda. Todavía no vienen de una base de datos real — eso es de una
// evidencia posterior.
//
// Cada libro tiene:
//   id            - número único para identificarlo en la URL (?id=2)
//   titulo, autor - los datos que ya conocíamos
//   colorA, colorB - dos colores para pintar su portada (ver "Portadas"
//                    más abajo): así cada libro se ve distinto sin
//                    necesitar una imagen real (evita problemas de
//                    derechos de autor con portadas de verdad).
//   valoracion    - un número del 1 al 5, a mano (dato editorial de
//                    ejemplo, no viene de reseñas reales todavía).
//   paginas       - el texto de muestra de ESE libro para el Lector.
//                    Son fragmentos reales (principios famosos, de dominio
//                    público), no el libro completo — cada uno tiene solo
//                    2 "páginas" cortas para que se note que sí cambia
//                    según el libro.
var LIBROS = [
  {
    id: 1, titulo: 'Don Quijote de la Mancha', autor: 'Miguel de Cervantes',
    colorA: '#7A4A22', colorB: '#A66F35', valoracion: 5,
    paginas: [
      {
        capitulo: 'Capítulo I',
        parrafos: [
          'En un lugar de la Mancha, de cuyo nombre no quiero acordarme, no ha mucho tiempo que vivía un hidalgo de los de lanza en astillero, adarga antigua, rocín flaco y galgo corredor.',
          'Frisaba la edad de nuestro hidalgo con los cincuenta años; era de complexión recia, seco de carnes, enjuto de rostro, gran madrugador y amigo de la caza.'
        ]
      },
      {
        capitulo: 'Capítulo I (continuación)',
        parrafos: [
          'Es, pues, de saber que este sobredicho hidalgo, los ratos que estaba ocioso, que eran los más del año, se daba a leer libros de caballerías con tanta afición y gusto.',
          'Fin del fragmento de muestra — texto de relleno solo para maquetar el lector.'
        ]
      }
    ]
  },
  {
    id: 2, titulo: 'La Metamorfosis', autor: 'Franz Kafka',
    colorA: '#3B3B3B', colorB: '#5C5C5C', valoracion: 5,
    paginas: [
      {
        capitulo: 'Capítulo I',
        parrafos: [
          'Cuando Gregorio Samsa se despertó una mañana después de un sueño intranquilo, se encontró sobre su cama convertido en un monstruoso insecto.',
          'Estaba tumbado sobre su espalda dura, y en forma de caparazón y, al levantar un poco la cabeza, veía su vientre.',
          'Abombado, oscuro, con curvas endurecidas en las que la colcha apenas podía mantenerse y que estaba a punto de resbalar.'
        ]
      },
      {
        capitulo: 'Capítulo I (continuación)',
        parrafos: [
          'Sus numerosas patas, ridículamente pequeñas en comparación con el resto de su tamaño, le vibraban desamparadas ante sus ojos.',
          '«¿Qué me ha ocurrido?», pensó. No era un sueño.',
          'Fin del fragmento de muestra — texto de relleno solo para maquetar el lector.'
        ]
      }
    ]
  },
  {
    id: 3, titulo: 'Orgullo y prejuicio', autor: 'Jane Austen',
    colorA: '#6B3F52', colorB: '#93607B', valoracion: 5,
    paginas: [
      {
        capitulo: 'Capítulo I',
        parrafos: [
          'Es una verdad universalmente reconocida que un hombre soltero, poseedor de una gran fortuna, necesita una esposa.',
          'Por muy desconocidos que sean sus sentimientos o su forma de pensar al fijar su residencia en una localidad, esta verdad está tan arraigada en las mentes de las familias que le rodean, que le consideran, sin más, como propiedad legítima de alguna de sus hijas.'
        ]
      },
      {
        capitulo: 'Capítulo I (continuación)',
        parrafos: [
          '«Mi querido señor Bennet», dijo un día su esposa, «¿sabes que por fin se ha alquilado Netherfield Park?»',
          'Fin del fragmento de muestra — texto de relleno solo para maquetar el lector.'
        ]
      }
    ]
  },
  {
    id: 4, titulo: 'Frankenstein', autor: 'Mary Shelley',
    colorA: '#2E4034', colorB: '#46614F', valoracion: 4,
    paginas: [
      {
        capitulo: 'Carta I',
        parrafos: [
          'Te alegrará saber que ningún desastre ha acompañado el comienzo de una empresa que tú mirabas con tan malos presagios.',
          'Llegué aquí ayer, y mi primera tarea es asegurar a mi querida hermana que me encuentro bien y que cada vez tengo más confianza en el éxito de mi empresa.'
        ]
      },
      {
        capitulo: 'Capítulo IV',
        parrafos: [
          'Fue durante una lúgubre noche de noviembre cuando contemplé la culminación de mis desvelos.',
          'Fin del fragmento de muestra — texto de relleno solo para maquetar el lector.'
        ]
      }
    ]
  },
  {
    id: 5, titulo: 'Crimen y castigo', autor: 'Fiódor Dostoyevski',
    colorA: '#4A2E2E', colorB: '#6E4444', valoracion: 5,
    paginas: [
      {
        capitulo: 'Primera parte, I',
        parrafos: [
          'A comienzos de julio, y durante una ola de calor extraordinaria, un joven salió al atardecer de la buhardilla donde se alojaba, en la callejuela de S., y se encaminó, lentamente y como indeciso, hacia el puente K.',
          'Había tenido la suerte de librarse de encontrarse en la escalera con su patrona, cuya cocina daba precisamente sobre el rellano de la escalera.'
        ]
      },
      {
        capitulo: 'Primera parte, I (continuación)',
        parrafos: [
          'El joven debía una considerable suma de dinero a su patrona, y por ello temía encontrarse con ella.',
          'Fin del fragmento de muestra — texto de relleno solo para maquetar el lector.'
        ]
      }
    ]
  },
  {
    id: 6, titulo: 'La isla del tesoro', autor: 'Robert Louis Stevenson',
    colorA: '#1F5C63', colorB: '#2E8791', valoracion: 4,
    paginas: [
      {
        capitulo: 'Capítulo I',
        parrafos: [
          'El caballero Trelawney, el doctor Livesey y los demás me han pedido que escriba todo lo relacionado con la Isla del Tesoro, de principio a fin, sin omitir más que la situación de la isla.',
          'Tomo la pluma en el año de gracia de 17... y me remonto a la época en que mi padre tenía la posada del «Almirante Benbow».'
        ]
      },
      {
        capitulo: 'Capítulo I (continuación)',
        parrafos: [
          'Recuerdo, como si fuera ayer, la llegada del viejo marinero a la puerta de la posada, seguido de su cofre de marino en una carretilla de mano.',
          'Fin del fragmento de muestra — texto de relleno solo para maquetar el lector.'
        ]
      }
    ]
  },
  {
    id: 7, titulo: 'El retrato de Dorian Gray', autor: 'Oscar Wilde',
    colorA: '#4B3B63', colorB: '#6E5590', valoracion: 4,
    paginas: [
      {
        capitulo: 'Capítulo I',
        parrafos: [
          'El estudio se llenaba del rico aroma de las rosas, y cuando la ligera brisa del verano agitaba los árboles del jardín, llegaba por la puerta abierta el intenso perfume de las lilas.',
          'Desde el rincón del diván de sacos persas en que se hallaba tendido, fumando, como era su costumbre, innumerables cigarrillos, lord Henry Wotton apenas si podía vislumbrar el resplandor de las flores.'
        ]
      },
      {
        capitulo: 'Capítulo I (continuación)',
        parrafos: [
          'En el centro de la habitación, sujeto a un caballete vertical, estaba el retrato de cuerpo entero de un joven de extraordinaria belleza.',
          'Fin del fragmento de muestra — texto de relleno solo para maquetar el lector.'
        ]
      }
    ]
  },
  {
    id: 8, titulo: 'Cumbres Borrascosas', autor: 'Emily Brontë',
    colorA: '#33465A', colorB: '#4C6478', valoracion: 4,
    paginas: [
      {
        capitulo: 'Capítulo I',
        parrafos: [
          '1801. Acabo de regresar de una visita a mi casero, el único vecino que me molestará por aquí.',
          'Este es, verdaderamente, un hermoso paraje. En toda Inglaterra no creo que hubiera podido encontrar un lugar tan completamente apartado del bullicio de la sociedad.'
        ]
      },
      {
        capitulo: 'Capítulo I (continuación)',
        parrafos: [
          'El señor Heathcliff y yo formamos una pareja adecuada para compartir esta desolación.',
          'Fin del fragmento de muestra — texto de relleno solo para maquetar el lector.'
        ]
      }
    ]
  },
  {
    id: 9, titulo: 'El proceso', autor: 'Franz Kafka',
    colorA: '#4A4238', colorB: '#6B5F4F', valoracion: 4,
    paginas: [
      {
        capitulo: 'Capítulo I',
        parrafos: [
          'Alguien debió de haber calumniado a Josef K., pues sin haber hecho nada malo fue detenido una mañana.',
          'La cocinera de la señora Grubach, su casera, que le traía todos los días la comida a eso de las ocho, no se presentó en aquella ocasión.'
        ]
      },
      {
        capitulo: 'Capítulo I (continuación)',
        parrafos: [
          'Eso no había sucedido nunca. K. esperó un rato más, mirando desde su almohada a la anciana que vivía enfrente.',
          'Fin del fragmento de muestra — texto de relleno solo para maquetar el lector.'
        ]
      }
    ]
  },
  {
    id: 10, titulo: 'El castillo', autor: 'Franz Kafka',
    colorA: '#38424A', colorB: '#55636E', valoracion: 3,
    paginas: [
      {
        capitulo: 'Capítulo I',
        parrafos: [
          'Era ya noche cerrada cuando K. llegó. El pueblo estaba sumido en una espesa nieve.',
          'De la colina del castillo no se veía nada; la niebla y la oscuridad lo rodeaban, y ni el más leve rayo de luz señalaba el gran castillo.'
        ]
      },
      {
        capitulo: 'Capítulo I (continuación)',
        parrafos: [
          'K. permaneció largo rato en el puente de madera que conduce desde la carretera principal hasta la aldea, con la mirada fija en el vacío aparente de lo alto.',
          'Fin del fragmento de muestra — texto de relleno solo para maquetar el lector.'
        ]
      }
    ]
  }
];

// Historial de lectura de ejemplo para el Perfil: qué libros "leyó" la
// cuenta de muestra y cuándo. Son solo 2, a mano, porque todavía no hay
// cuentas reales. Sirven también para calcular las recomendaciones de
// más abajo.
var HISTORIAL_EJEMPLO = [
  { libroId: 2, fecha: '2026-09-04' }, // La Metamorfosis
  { libroId: 4, fecha: '2026-08-27' }  // Frankenstein
];

// El libro que se promociona en el Perfil como "Destacado de la semana".
// Es una elección editorial fija (a mano); en un sitio real esto podría
// rotar o depender de qué libros son populares.
var ID_LIBRO_DESTACADO = 7; // El retrato de Dorian Gray

// Lista de autores sin repetir, en orden alfabético, para el menú de
// "filtrar por autor". Se calcula una sola vez aquí (no en cada doGet)
// porque LIBROS no cambia mientras la app está corriendo.
var AUTORES = LIBROS
  .map(function (libro) { return libro.autor; })
  .filter(function (autor, indice, lista) { return lista.indexOf(autor) === indice; }) // quita repetidos
  .sort();

// ---------------------------------------------------------------------------
// buscarLibroPorId — encuentra un libro dentro de LIBROS a partir de su id.
// Si no lo encuentra, devuelve null (así el código que lo llama puede
// decidir qué hacer, en vez de que se rompa por sorpresa).
// ---------------------------------------------------------------------------
function buscarLibroPorId(id) {
  var encontrados = LIBROS.filter(function (l) { return l.id === id; });
  return encontrados.length > 0 ? encontrados[0] : null;
}

// ---------------------------------------------------------------------------
// textoEstrellas — convierte un número (1 a 5) en algo como "★★★★☆".
// ---------------------------------------------------------------------------
// Se usa en las pantallas así: <?= textoEstrellas(libro.valoracion) ?>
// Para que eso funcione, hay que "pegar" esta función en la plantilla con
// tpl.textoEstrellas = textoEstrellas (se hace en doGet).
function textoEstrellas(valoracion) {
  var llenas = Math.max(0, Math.min(5, valoracion || 0));
  var vacias = 5 - llenas;
  return new Array(llenas + 1).join('★') + new Array(vacias + 1).join('☆');
}

// ---------------------------------------------------------------------------
// resumenLibros — versión "liviana" de una lista de libros.
// ---------------------------------------------------------------------------
// Le quita el arreglo "paginas" (que puede ser largo) y deja solo lo que
// hace falta para pintar una tarjeta: id, título, autor, colores y
// valoración ya convertida a estrellas. Se usa para mandar el catálogo
// completo al navegador en la pantalla de Perfil (para la sección de
// Favoritos, que se arma con JavaScript del lado del navegador — ver
// Favoritos.html) sin mandar también todo el texto de los libros.
function resumenLibros(lista) {
  return lista.map(function (libro) {
    return {
      id: libro.id,
      titulo: libro.titulo,
      autor: libro.autor,
      colorA: libro.colorA,
      colorB: libro.colorB,
      estrellas: textoEstrellas(libro.valoracion)
    };
  });
}

// ---------------------------------------------------------------------------
// calcularRecomendados — arma la lista de "Recomendado para ti" del Perfil.
// ---------------------------------------------------------------------------
// La idea es simple y fácil de explicar: se recomiendan libros de LOS
// MISMOS AUTORES que ya aparecen en el historial (por ejemplo, si el
// historial tiene un libro de Kafka, se recomiendan otros libros de Kafka),
// sin repetir ninguno que ya esté en el historial ni el libro destacado
// (para no mostrar el mismo libro dos veces en la misma pantalla).
// Si con eso no se llega a "limite" libros, se completa con otros libros
// cualquiera que todavía no se hayan mostrado.
function calcularRecomendados(historialLibros, idDestacado, limite) {
  var idsAEvitar = historialLibros.map(function (l) { return l.id; });
  idsAEvitar.push(idDestacado);

  var autoresLeidos = historialLibros.map(function (l) { return l.autor; });

  var porMismoAutor = LIBROS.filter(function (libro) {
    var yaEvitado = idsAEvitar.indexOf(libro.id) !== -1;
    var esMismoAutor = autoresLeidos.indexOf(libro.autor) !== -1;
    return !yaEvitado && esMismoAutor;
  });

  var recomendados = porMismoAutor.slice(0, limite);

  // Si todavía falta para completar "limite", rellenamos con cualquier
  // otro libro que no se haya usado ya (ni en el historial, ni destacado,
  // ni en lo que llevamos recomendado).
  if (recomendados.length < limite) {
    var idsUsados = idsAEvitar.concat(recomendados.map(function (l) { return l.id; }));
    var relleno = LIBROS.filter(function (libro) {
      return idsUsados.indexOf(libro.id) === -1;
    });
    recomendados = recomendados.concat(relleno.slice(0, limite - recomendados.length));
  }

  return recomendados;
}

// ---------------------------------------------------------------------------
// doGet — se ejecuta cada vez que alguien abre la app en el navegador
// ---------------------------------------------------------------------------
// "e" es un objeto que Google arma solo, con la información de la URL.
// e.parameter.page, por ejemplo, es lo que viene después de "?page=" en la URL.
function doGet(e) {
  // Si alguien entra sin parámetros (URL "pelada"), mostramos "inicio" por defecto.
  var params = (e && e.parameter) || {};
  var page = (params.page || 'inicio').toLowerCase();

  // Este diccionario traduce el nombre corto de la URL (?page=login) al
  // nombre real del archivo .html que hay que mostrar (IniciarSesion.html).
  var archivos = {
    inicio: 'Inicio',
    login: 'IniciarSesion',
    registro: 'Registro',
    resultados: 'Resultados',
    lector: 'Lector',
    perfil: 'Perfil'
  };
  // Si escriben una página que no existe, no se rompe: mostramos Inicio.
  var archivo = archivos[page] || 'Inicio';

  // Un "template" es la plantilla HTML antes de rellenarla con datos.
  // A partir de aquí le vamos "pegando" información en propiedades (tpl.algo)
  // que luego el archivo .html puede leer con <?= algo ?>.
  var tpl = HtmlService.createTemplateFromFile(archivo);
  tpl.libros = LIBROS; // la pantalla Inicio la usa para pintar la cuadrícula de libros
  tpl.autores = AUTORES; // para el menú desplegable de "filtrar por autor"
  tpl.textoEstrellas = textoEstrellas; // para poder llamarla desde cualquier pantalla
  tpl.librosResumen = resumenLibros(LIBROS); // el catálogo liviano, para los Favoritos

  // baseUrl = la URL real de esta app (algo como
  // "https://script.google.com/macros/s/.../exec"). TODOS los enlaces del
  // sitio la necesitan por delante (baseUrl + "?page=algo"): un enlace
  // relativo como href="?page=login" NO funciona aquí, porque Apps Script
  // muestra la página dentro de un iframe interno de Google cuya dirección
  // real es otra distinta; un enlace relativo se iría a esa dirección
  // interna en vez de a la app, y por eso la pantalla se queda en blanco.
  tpl.baseUrl = ScriptApp.getService().getUrl();

  // Solo si vamos a mostrar "Resultados de búsqueda" hacemos el filtro:
  if (archivo === 'Resultados') {
    var q = (params.q || '').trim(); // lo que la persona escribió en el buscador
    var qLower = q.toLowerCase();
    var autorFiltro = params.autor || ''; // el autor elegido en el menú desplegable, si hay

    tpl.consulta = q; // para dejarlo escrito de nuevo en la caja de búsqueda
    tpl.autorFiltro = autorFiltro; // para dejar seleccionada la opción correcta en el menú

    // Filtramos la lista de libros: se queda solo con los que tengan la
    // búsqueda dentro del título o del autor (sin importar mayúsculas/minúsculas)
    // Y, si además se eligió un autor en el menú, que sean de ese autor.
    tpl.resultados = LIBROS.filter(function (libro) {
      var estaEnTitulo = libro.titulo.toLowerCase().indexOf(qLower) !== -1;
      var estaEnAutor = libro.autor.toLowerCase().indexOf(qLower) !== -1;
      var coincideTexto = estaEnTitulo || estaEnAutor;
      var coincideAutor = autorFiltro === '' || libro.autor === autorFiltro;
      return coincideTexto && coincideAutor;
    });

    // El título de la pantalla cambia según qué se usó para buscar, para
    // que siempre diga algo que tenga sentido (no "Resultados para «»"
    // cuando solo se filtró por autor, por ejemplo).
    if (q && autorFiltro) {
      tpl.tituloResultados = 'Resultados para «' + q + '» de ' + autorFiltro;
    } else if (q) {
      tpl.tituloResultados = 'Resultados para «' + q + '»';
    } else if (autorFiltro) {
      tpl.tituloResultados = 'Libros de ' + autorFiltro;
    } else {
      tpl.tituloResultados = 'Todos los libros';
    }
  }

  // Solo si vamos a mostrar el "Lector de libro" buscamos cuál libro es:
  if (archivo === 'Lector') {
    // El id viene como texto en la URL (?id=2); lo pasamos a número.
    // Si no viene ninguno, o no existe, usamos el primer libro de la lista.
    var id = parseInt(params.id, 10);
    var libro = buscarLibroPorId(id) || LIBROS[0];

    tpl.libro = libro;
    tpl.paginas = libro.paginas; // el texto de ESE libro, no uno genérico

    // "Libros similares": otros libros del mismo autor, sin contar este
    // mismo. Si el autor solo tiene este libro en el catálogo, la lista
    // sale vacía y Lector.html simplemente no muestra esa sección.
    tpl.similares = LIBROS.filter(function (l) {
      return l.autor === libro.autor && l.id !== libro.id;
    }).slice(0, 3);
  }

  // Solo si vamos a mostrar el "Perfil" armamos el historial y las
  // recomendaciones:
  if (archivo === 'Perfil') {
    // Convertimos el historial (que solo tiene ids) en los libros completos,
    // para que la pantalla tenga el título y el autor listos para mostrar.
    var historial = HISTORIAL_EJEMPLO.map(function (entrada) {
      var libroLeido = buscarLibroPorId(entrada.libroId);
      return { libro: libroLeido, fecha: entrada.fecha };
    });

    var destacado = buscarLibroPorId(ID_LIBRO_DESTACADO);
    var librosDelHistorial = historial.map(function (h) { return h.libro; });

    tpl.historial = historial;
    tpl.destacado = destacado;
    tpl.recomendados = calcularRecomendados(librosDelHistorial, ID_LIBRO_DESTACADO, 3);
  }

  // "evaluate()" convierte la plantilla ya rellena en la página final que
  // ve el usuario. Las tres líneas de abajo son configuración necesaria
  // para que la app web se vea bien y se pueda mostrar dentro de un iframe
  // (así es como Google sirve las apps web de Apps Script).
  return tpl.evaluate()
    .setTitle('Biblioteca Digital')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// ---------------------------------------------------------------------------
// include — pequeño ayudante para "pegar" un archivo .html dentro de otro
// ---------------------------------------------------------------------------
// Apps Script no tiene una forma automática de decir "incluye este pedazo de
// HTML aquí", así que se resuelve con esta función y usándola en los .html
// así: <?!= include('Stylesheet'); ?>  o  <?!= include('HeaderGuest', {baseUrl: baseUrl}); ?>
// Sirve para no repetir el mismo código de encabezado/pie/estilos en cada
// una de las 6 pantallas.
//
// El segundo parámetro ("datos") es opcional y sirve para pasarle variables
// al archivo incluido — por ejemplo, HeaderGuest.html necesita "baseUrl"
// para armar sus enlaces, y ese valor se lo pasamos aquí explícitamente.
// Importante: cada archivo incluido es su propia plantilla independiente,
// así que NO ve automáticamente las variables del archivo que lo incluye
// (por eso hay que pasárselas a mano con este segundo parámetro).
function include(nombreArchivo, datos) {
  var tpl = HtmlService.createTemplateFromFile(nombreArchivo);
  if (datos) {
    for (var clave in datos) {
      tpl[clave] = datos[clave];
    }
  }
  return tpl.evaluate().getContent();
}
