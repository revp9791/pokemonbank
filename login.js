
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

    document.getElementById('loginForm').addEventListener('submit', function (event) {
        event.preventDefault();

        const pinInput = document.getElementById('pinInput');
        const pin = pinInput.value;
        const userData = JSON.parse(localStorage.getItem('userData'));

        if (pin === userData.pin) {
            sessionStorage.setItem('isAuthenticated', true);
            Swal.fire({
                title: '¡Acceso concedido!',
                text: 'PIN correcto, serás redirigido.',
                icon: 'success',
                confirmButtonText: 'Continuar'
            }).then(() => {
                window.location.href = 'actions.html';
            });
        } else {
            Swal.fire({
                title: 'Error!',
                text: 'PIN incorrecto',
                icon: 'error',
                confirmButtonText: 'Intentar de nuevo'
            }).then(() => {
                pinInput.value = ''; 
            });
        }
    });

   
});
