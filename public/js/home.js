const cid = getCookie('cid');
  
function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
}

document.querySelectorAll('.card-producto').forEach(btn => {
    btn.addEventListener('click', async () => {
        const pid = btn.getAttribute('data-pid');
        window.location.href = `/product/${pid}`;
    })
})

document.querySelectorAll('.btn-add').forEach(btn => {
    btn.addEventListener('click', async (e) => {
    e.stopPropagation();
    const pid = btn.getAttribute('data-pid');
    
    if(!cid) {
        alert('Carrito no existente.');
        return;
    }
    
    await fetch(`/api/carts/${cid}/product/${pid}`, { method: 'POST' });
    Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Producto agregado al carrito',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true
      });
    });
});