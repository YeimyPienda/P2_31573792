  // Actualización en tiempo real de la vista previa de la tarjeta
    document.getElementById('nombreTitular').addEventListener('input', function(e) {
      const preview = document.getElementById('cardNamePreview');
      preview.textContent = e.target.value.toUpperCase() || 'NOMBRE DEL TITULAR';
    });
    
    document.getElementById('cardNumber').addEventListener('input', function(e) {
      const preview = document.getElementById('cardNumberPreview');
      const value = e.target.value.replace(/\s/g, '');
      let formatted = value.replace(/(\d{4})/g, '$1 ').trim();
      if (value.length > 0) {
        formatted = formatted.slice(0, 19);
        // Mostrar solo los últimos 4 dígitos, el resto como ••••
        const visiblePart = value.length > 4 ? '•••• '.repeat(Math.floor((value.length-1)/4)) + value.slice(-4) : value;
        preview.textContent = visiblePart.replace(/(\d{4})/g, '$1 ').trim();
      } else {
        preview.textContent = '•••• •••• •••• ••••';
      }
    });
    
    document.getElementById('expMonth').addEventListener('change', updateExpiry);
    document.getElementById('expYear').addEventListener('change', updateExpiry);
    
    function updateExpiry() {
      const month = document.getElementById('expMonth').value;
      const year = document.getElementById('expYear').value;
      const preview = document.getElementById('cardExpiryPreview');
      
      if (month && year) {
        preview.textContent = `${month}/${year.toString().slice(-2)}`;
      } else {
        preview.textContent = 'MM/AA';
      }
    }