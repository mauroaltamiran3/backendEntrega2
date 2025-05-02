document.addEventListener('DOMContentLoaded', () => {
    const cid = getCookie('cid');
  
    function getCookie(name) {
      const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
      return match ? match[2] : null;
    }
  
    const btnCarrito = document.getElementById('btnIrCarrito');
    if (btnCarrito && cid) {
      btnCarrito.addEventListener('click', () => {
        window.location.href = `/carts/${cid}`;
      });
    }
  
    const btnHome = document.getElementById('btnHome');
    if (btnHome) {
      btnHome.addEventListener('click', () => {
        window.location.href = `/`;
      });
    }
  
    const btnRealTimeProducts = document.getElementById('btnRealTimeProducts');
    if (btnRealTimeProducts) {
      btnRealTimeProducts.addEventListener('click', () => {
        window.location.href = `/realtimeproducts`;
      });
    }
  });
  