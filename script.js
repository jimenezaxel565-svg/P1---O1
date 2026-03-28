// script.js
// Este script genera un gráfico interactivo que muestra la aproximación normal
// de la suma de 70 lanzamientos de un dado equilibrado.
// Se destaca el área correspondiente a P(S = 200) usando corrección por continuidad.

// Parámetros de la distribución normal (media y desviación estándar de la suma)
const mu = 245;          // media = n * media_dado = 70 * 3.5
const sigma = 14.2888;   // desviación = sqrt(n * varianza_dado) = sqrt(70 * 2.91667)

// Función para calcular la densidad de probabilidad de la normal estándar
function normalPDF(x, mean, sd) {
    const variance = sd ** 2;
    return (1 / (sd * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * ((x - mean) / sd) ** 2);
}

// Generar puntos para la curva continua de la normal
// Se define un rango desde mu - 4*sigma hasta mu + 4*sigma para abarcar casi toda la distribución
const xMin = mu - 4 * sigma;
const xMax = mu + 4 * sigma;
const step = (xMax - xMin) / 500;   // 500 puntos para suavidad
const xCurve = [];
const yCurve = [];

for (let x = xMin; x <= xMax; x += step) {
    xCurve.push(x);
    yCurve.push(normalPDF(x, mu, sigma));
}

// Generar puntos para el área que representa P(S = 200) con corrección de continuidad
// La probabilidad puntual se aproxima como el área entre 199.5 y 200.5
const xFill = [];
const yFill = [];
for (let x = 199.5; x <= 200.5; x += step) {
    xFill.push(x);
    yFill.push(normalPDF(x, mu, sigma));
}

// Configurar las trazas para Plotly
// Traza 1: curva normal completa
const traceCurve = {
    x: xCurve,
    y: yCurve,
    type: 'scatter',
    mode: 'lines',
    name: 'Distribución normal (aprox.)',
    line: { color: 'blue', width: 2 },
    hoverinfo: 'x+y'
};

// Traza 2: área rellena que representa la probabilidad buscada
const traceFill = {
    x: xFill,
    y: yFill,
    type: 'scatter',
    mode: 'lines',
    name: 'P(S = 200) ≈ 0.00020',
    fill: 'tozeroy',
    fillcolor: 'rgba(255, 0, 0, 0.5)',
    line: { color: 'red', width: 1 },
    hoverinfo: 'x+y'
};

// Líneas verticales destacadas: media y valor S=200
const shapes = [
    {
        type: 'line',
        x0: mu,
        x1: mu,
        y0: 0,
        y1: normalPDF(mu, mu, sigma),
        line: { color: 'gray', width: 2, dash: 'dash' },
        label: { text: 'Media = 245', textposition: 'top center' }
    },
    {
        type: 'line',
        x0: 200,
        x1: 200,
        y0: 0,
        y1: normalPDF(200, mu, sigma),
        line: { color: 'red', width: 2, dash: 'dot' },
        label: { text: 'S = 200', textposition: 'top center' }
    }
];

// Diseño del gráfico (títulos, ejes, leyenda)
const layout = {
    title: 'Suma de 70 dados (aproximación normal)',
    xaxis: {
        title: 'Suma de puntos',
        range: [mu - 4 * sigma, mu + 4 * sigma]  // fijar rango para mejor visualización
    },
    yaxis: {
        title: 'Densidad de probabilidad'
    },
    shapes: shapes,
    legend: {
        x: 0.7,
        y: 0.95,
        bgcolor: 'rgba(255,255,255,0.8)'
    },
    hovermode: 'closest'
};

// Renderizar el gráfico en el div con id 'grafico'
Plotly.newPlot('grafico', [traceCurve, traceFill], layout);