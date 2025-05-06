const btn = document.getElementById('btn-finalizarCompra');
const btnText = document.getElementById('btn-text');
const btnSpinner = document.getElementById('btn-spinner');

document.addEventListener('DOMContentLoaded', () => {
    const cid = getCookie('cid');

    function getCookie(name) {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? match[2] : null;
    }

    document.getElementById('btn-finalizarCompra').addEventListener('click', async () => {
        if (!cid) return alert('❌ No se encontró el carrito.');
      
        const confirmar = confirm('¿Estás seguro de finalizar la compra?');
        if (!confirmar) return;

        btn.disabled = true;
        btnText.textContent = 'Procesando...';
        btnSpinner.style.display = 'inline-block';
      
        try {
          const res = await fetch(`/api/tickets/${cid}`, {
            method: 'POST',
            credentials: 'include'
          });
      
          const data = await res.json();
      
          if (res.ok && data.ticketId) {
            window.location.href = `/ticket/${data.ticketId}`;
          } else {
            alert('❌ No se pudo procesar la compra: ' + (data.mensaje || 'Error desconocido'));
          }
      
        } catch (error) {
          console.error('❌ Error al finalizar compra:', error);
          alert('⚠️ Ocurrió un error inesperado.');
        } finally {
          btn.disabled = false;
          btnText.textContent = 'Finalizar Compra';
          btnSpinner.style.display = 'none';
        }
    });      
});