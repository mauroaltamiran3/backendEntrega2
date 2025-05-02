document.addEventListener('DOMContentLoaded', () => {
    const cid = getCookie('cid');

    function getCookie(name) {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? match[2] : null;
    }

    document.querySelectorAll('.btn-sumar').forEach(btn => {
        btn.addEventListener('click', async () => {
            console.log('sumar')
            const pid = btn.getAttribute('data-pid');
            await fetch(`/api/carts/${cid}/product/${pid}/increment`, { method: 'PATCH' });
            location.reload();
        });
    });

    document.querySelectorAll('.btn-restar').forEach(btn => {
        btn.addEventListener('click', async () => {
            const pid = btn.getAttribute('data-pid');
            await fetch(`/api/carts/${cid}/product/${pid}/decrement`, { method: 'PATCH' });
            location.reload();
        });
        });

    document.querySelectorAll('.btn-eliminar').forEach(btn => {
        btn.addEventListener('click', async () => {
            const pid = btn.getAttribute('data-pid');
            if (confirm('¿Estás seguro de que querés eliminar el producto?')) {
            await fetch(`/api/carts/${cid}/product/${pid}`, { method: 'DELETE' });
            location.reload();
            }
        });
    });

    function eliminarProducto(cid,pid) {
        document.querySelectorAll('.btn-eliminar').forEach(btn => {
            btn.addEventListener('click', async () => {
            const pid = btn.getAttribute('data-pid');
            await fetch(`/api/carts/${cid}/product/${pid}`, { method: 'DELETE' });
            location.reload();
            });
        });
    }

    document.getElementById('btn-vaciarCarrito').addEventListener('click', async () => {
        if (confirm('¿Estás seguro de que querés vaciar el carrito?')) {
            await fetch(`/api/carts/${cid}`, {
            method: 'DELETE'
            });
            location.reload();
        }
    });

    document.getElementById('btn-comprar').addEventListener('click', async () => {
        const response = await fetch(`/api/carts/${cid}/validate`);
        const resultado = await response.json();
      
        if (!resultado.valido) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: resultado.mensaje
          });
          eliminarProducto(cid,pid)
          return;
        }

        if (confirm('¿Estás seguro de que quieres comprar el carrito?')) {
            window.location.href =`/cart/${cid}/comprar`;
        }
    });
});
