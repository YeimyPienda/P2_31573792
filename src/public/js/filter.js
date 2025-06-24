document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('searchInput');
  const container = document.getElementById('contactsContainer');

  input.addEventListener('input', async () => {
    const query = input.value.trim();

    if (query === ''){
      // Si el input está vacío, recargar la página para mostrar los datos originales
      window.location.reload();
      return;
    }
    try {
      const res = await fetch(`/filter?q=${encodeURIComponent(query)}`);
      const data = await res.json();

      if (!data.status || data.filterResult.length === 0) {
  container.innerHTML = `
    <div class="no-payments text-center text-gray-500 my-6">
      <i class="fas fa-inbox text-4xl mb-2"></i>
      <p>No hay registros de contactos disponibles</p>
    </div>
  `;
  return;
}

container.innerHTML = `
  <div class="payments-container">
    <div class="payments-header mb-4">
      <h1 class="payments-title text-2xl font-semibold text-gray-800 flex items-center gap-2">
        <i class="fas fa-address-book"></i> Registros de Contactos
      </h1>
      <div class="payments-count text-sm text-gray-500">Total: ${data.filterResult.length}</div>
    </div>

    <div class="payments-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      ${data.filterResult.map((contact, index) => `
        <div class="payment-card bg-white rounded-xl shadow-md p-4 transition-all duration-300 animate-fade-in" style="animation-delay: ${index * 0.1}s">
          <div class="payment-card-header mb-3 flex justify-between items-center">
            <h3 class="payment-card-title font-bold text-lg text-blue-600">${contact.nombre}</h3>
            <span class="payment-card-type text-sm text-gray-500">
              <i class="fas fa-user-tag mr-1"></i>Contacto
            </span>
          </div>
          <div class="payment-card-body space-y-2">
            <div class="payment-detail">
              <span class="payment-detail-label font-semibold text-gray-700">Correo:</span>
              <span class="payment-detail-value contact-email text-gray-600">${contact.email}</span>
            </div>
            <div class="payment-detail">
              <span class="payment-detail-label font-semibold text-gray-700">Comentario:</span>
              <span class="payment-detail-value text-gray-600">${contact.comentario}</span>
            </div>
            <div class="payment-detail">
              <span class="payment-detail-label font-semibold text-gray-700">País:</span>
              <span class="payment-detail-value text-gray-600">${contact.pais}</span>
            </div>
            <div class="payment-detail">
              <span class="payment-detail-label font-semibold text-gray-700">IP:</span>
              <span class="payment-detail-value contact-ip text-gray-600">${contact.ip}</span>
            </div>
          </div>
          <div class="payment-card-footer mt-4 flex justify-between text-sm text-gray-500">
            <div class="payment-date flex items-center gap-1">
              <i class="far fa-calendar-alt"></i>
              ${new Date(contact.createdAt).toLocaleDateString()}
            </div>
            <div class="payment-time flex items-center gap-1">
              <i class="far fa-clock"></i>
              ${new Date(contact.createdAt).toLocaleTimeString()}
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  </div>
`;

    } catch (err) {
      console.error('Error al filtrar contactos:', err);
      container.innerHTML = `<p>Error al cargar los resultados.</p>`;
    }
  });
});
