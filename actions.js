document.addEventListener('DOMContentLoaded', function () {
    if (!localStorage.getItem('userData')) {
        const userData = {
            nombre: 'Ash Ketchum',
            pin: '1234',
            cuenta: '0987654321',
            saldo: 500.00,
            transacciones: []
        };
        localStorage.setItem('userData', JSON.stringify(userData));
    }

    const userData = JSON.parse(localStorage.getItem('userData'));

    const nroCuentaDiv = document.getElementById('nro_cuenta');
    const nombreUsuarioDiv = document.querySelector('.title');
    if (nroCuentaDiv) {
        nroCuentaDiv.textContent = `Número de Cuenta: ${userData.cuenta}`;
    }
    if (nombreUsuarioDiv) {
        nombreUsuarioDiv.textContent = `Bienvenido, ${userData.nombre}`;
    }

    function mostrarMensaje(titulo, texto, icono) {
        Swal.fire({
            title: titulo,
            text: texto,
            icon: icono,
            confirmButtonText: 'Aceptar'
        });
    }

    function descargarComprobante(transaccion) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text('Comprobante de Transacción Pokémon Bank', 20, 20);

        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text(`Tipo de Transacción: ${transaccion.tipo}`, 20, 40);
        doc.text(`Fecha: ${transaccion.fecha}`, 20, 50);
        doc.text(`Monto: ${transaccion.monto}`, 20, 60);
        doc.text(`Detalles: ${transaccion.detalles}`, 20, 70);
        doc.text(`Saldo Actual: $${userData.saldo.toFixed(2)}`, 20, 80);

        doc.setLineWidth(0.5);
        doc.line(20, 85, 190, 85);

        doc.setFontSize(10);
        doc.text("Gracias por usar Pokémon Bank.", 20, 95);
        doc.text("Visítenos de nuevo para más transacciones.", 20, 100);

        const nombreArchivo = `Comprobante_${transaccion.tipo}_${transaccion.fecha.replace(/\//g, '-')}.pdf`;

        doc.save(nombreArchivo);
    }

    const reglasValidacion = {
        monto: {
            presence: true,
            numericality: {
                greaterThan: 0,
                lessThanOrEqualTo: function(value, attributes, attributeName, options, constraints) {
                    if (attributeName === 'monto' && options.context === 'retiro') {
                        return userData.saldo;
                    }
                    return Number.MAX_VALUE;
                }
            }
        },
        servicio: {
            presence: true
        }
    };

    function validarYRegistrar(tipo, monto, detalles, contexto) {
        let validacion = validate({monto: monto, servicio: detalles}, reglasValidacion, {context: contexto});
        if (validacion) {
            mostrarMensaje('Error en la operación', validacion.monto || validacion.servicio, 'error');
        } else {
            registrarTransaccion(tipo, monto, detalles);
            document.getElementById(`modal${contexto.charAt(0).toUpperCase() + contexto.slice(1)}`).style.display = 'none';
        }
    }

    function registrarTransaccion(tipo, monto, detalles) {
        userData.saldo += tipo === 'Depósito' ? monto : -monto;
        const fecha = new Date().toLocaleDateString();
        const transaccion = { tipo, fecha, monto: `$${monto.toFixed(2)}`, detalles };
        userData.transacciones.push(transaccion);
        localStorage.setItem('userData', JSON.stringify(userData));
        descargarComprobante(transaccion);
        mostrarMensaje('Operación exitosa', `Se ha registrado un ${tipo.toLowerCase()} de $${monto.toFixed(2)}.`, 'success');
    }

    document.getElementById('confirmarDeposito').addEventListener('click', function() {
        const monto = parseFloat(document.getElementById('montoDepositar').value);
        validarYRegistrar('Depósito', monto, 'Depósito en efectivo', 'depositar');
        document.getElementById('montoDepositar').value = '';
    });

    document.getElementById('confirmarRetiro').addEventListener('click', function() {
        const monto = parseFloat(document.getElementById('montoRetirar').value);
        validarYRegistrar('Retiro', monto, 'Retiro en cajero', 'retirar');
        document.getElementById('montoRetirar').value = '';
    });

    document.getElementById('confirmarPagoServicio').addEventListener('click', function() {
        const monto = parseFloat(document.getElementById('montoPagoServicio').value);
        const servicio = document.getElementById('selectServicio').value;
        validarYRegistrar('Pago de Servicios', monto, `Pago de ${servicio}`, 'pagarServicios');
        document.getElementById('montoPagoServicio').value = '';
    });

    function actualizarSaldoModal() {
        const saldoModalBody = document.querySelector('#modalSaldo .modal-body-saldo');
        if (saldoModalBody) {
            saldoModalBody.textContent = `Tu saldo es de: $${userData.saldo.toFixed(2)}`;
        }
    }

    document.getElementById('consultarSaldo').addEventListener('click', function () {
        actualizarSaldoModal();
        document.getElementById('modalSaldo').style.display = 'block';
    });

    document.getElementById('closeSaldo').addEventListener('click', function () {
        document.getElementById('modalSaldo').style.display = 'none';
    });

    document.getElementById('depositar').addEventListener('click', function () {
        document.getElementById('modalDepositar').style.display = 'block';
    });

    document.getElementById('closeDepositar').addEventListener('click', function () {
        document.getElementById('modalDepositar').style.display = 'none';
    });

    document.getElementById('retirar').addEventListener('click', function () {
        document.getElementById('modalRetirar').style.display = 'block';
    });

    document.getElementById('closeRetirar').addEventListener('click', function () {
        document.getElementById('modalRetirar').style.display = 'none';
    });

    document.getElementById('pagarServicios').addEventListener('click', function () {
        document.getElementById('modalPagarServicios').style.display = 'block';
    });

    document.getElementById('closePagarServicios').addEventListener('click', function () {
        document.getElementById('modalPagarServicios').style.display = 'none';
    });
});
