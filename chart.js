document.addEventListener('DOMContentLoaded', function() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const transacciones = userData.transacciones;
    
    let totalDepositos = 0;
    let totalRetiros = 0;
    let totalPagosServicios = 0;

    transacciones.forEach(trx => {
        if (trx.tipo === 'Depósito') {
            totalDepositos += parseFloat(trx.monto.replace('$', ''));
        } else if (trx.tipo === 'Retiro') {
            totalRetiros += parseFloat(trx.monto.replace('$', ''));
        } else if (trx.tipo === 'Pago de Servicios') {
            totalPagosServicios += parseFloat(trx.monto.replace('$', ''));
        }
    });

    var ctx1 = document.getElementById('transactionChart').getContext('2d');
    var myDoughnutChart = new Chart(ctx1, {
        type: 'doughnut',
        data: {
            labels: ['Depósito', 'Pago de Servicios', 'Retiros'],
            datasets: [{
                data: [totalDepositos, totalPagosServicios, totalRetiros],
                backgroundColor: ['#28A745', '#FFC107', '#DC3545']
            }]
        }
    });

    let saldoInicial = userData.saldo;
    transacciones.forEach(trx => {
        saldoInicial -= parseFloat(trx.monto.replace('$', ''));
    });

    let saldosMensuales = {};
    let saldoActual = saldoInicial;
    transacciones.forEach(trx => {
        const fecha = new Date(trx.fecha.split('/').reverse().join('/'));
        const mes = fecha.toLocaleString('default', { month: 'long' });
        const monto = parseFloat(trx.monto.replace('$', ''));
        
        if (trx.tipo === 'Depósito') {
            saldoActual += monto;
        } else {
            saldoActual -= monto;
        }

        saldosMensuales[mes] = saldoActual;
    });

    const meses = Object.keys(saldosMensuales);
    const balances = Object.values(saldosMensuales);

    var ctx2 = document.getElementById('balanceChart').getContext('2d');
    var myLineChart = new Chart(ctx2, {
        type: 'line',
        data: {
            labels: meses,
            datasets: [{
                label: 'Balance $',
                data: balances,
                backgroundColor: 'rgba(0, 123, 255, 0.2)',
                borderColor: '#007BFF',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
});