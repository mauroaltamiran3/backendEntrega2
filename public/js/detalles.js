document.addEventListener('DOMContentLoaded', () => {
    const cid = getCookie('cid');
  
    function getCookie(name) {
      const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
      return match ? match[2] : null;
    }
  
    // Cambiar imagen principal al hacer clic en una miniatura
    const thumbnails = document.querySelectorAll('.miniatura');
    const mainImage = document.getElementById('imagen-principal');
  
    thumbnails.forEach(thumbnail => {
      thumbnail.addEventListener('click', () => {
        const newSrc = thumbnail.getAttribute('src');
        mainImage.setAttribute('src', newSrc);
      });
    });
  
    // Agregar al carrito
    document.querySelectorAll('.btn-add').forEach(btn => {
        btn.addEventListener('click', async () => {
        if(!cid) {
            alert('Carrito no existente.');
            return;
        }
        
        const pid = btn.getAttribute('data-pid');
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
});
  