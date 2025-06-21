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
          <div class="no-payments">
            <i class="fas fa-inbox"></i>
            <p>No hay registros de contactos disponibles</p>
          </div>
        `;
        return;
      }

      container.innerHTML = `
        <div class="payments-grid">
          ${data.filterResult.map((contact, index) => `
            <div class="payment-card" style="animation-delay: ${index * 0.1}s">
              <div class="payment-card-header">
                <h3 class="payment-card-title">${contact.nombre}</h3>
                <span class="payment-card-type">
                  <i class="fas fa-user-tag"></i> Contacto
                </span>
              </div>
              <div class="payment-card-body">
                <div class="payment-detail">
                  <span class="payment-detail-label">Correo:</span>
                  <span class="payment-detail-value contact-email">${contact.email}</span>
                </div>
                <div class="payment-detail">
                  <span class="payment-detail-label">Comentario:</span>
                  <span class="payment-detail-value">${contact.comentario}</span>
                </div>
                <div class="payment-detail">
                  <span class="payment-detail-label">Pais:</span>
                  <span class="payment-detail-value">${contact.pais}</span>
                </div>
                <div class="payment-detail">
                  <span class="payment-detail-label">IP:</span>
                  <span class="payment-detail-value contact-ip">${contact.ip}</span>
                </div>
              </div>
              <div class="payment-card-footer">
                <div class="payment-date">
                  <i class="far fa-calendar-alt"></i>
                  ${new Date(contact.createdAt).toLocaleDateString()}
                </div>
                <div>
                  <i class="far fa-clock"></i>
                  ${new Date(contact.createdAt).toLocaleTimeString()}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    } catch (err) {
      console.error('Error al filtrar contactos:', err);
      container.innerHTML = `<p>Error al cargar los resultados.</p>`;
    }
  });
});
