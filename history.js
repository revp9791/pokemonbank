 document.addEventListener('DOMContentLoaded', function() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const transacciones = userData.transacciones;

    const tbody = document.querySelector('table tbody');
    transacciones.forEach(trx => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${trx.tipo}</td>
            <td>${trx.fecha}</td>
            <td>${trx.monto}</td>
            <td>${trx.detalles}</td>
        `;
        tbody.appendChild(tr);
    });
});