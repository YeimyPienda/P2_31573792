document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('searchInput');
  const estado = document.getElementById('estadoSelect');
  const servicio = document.getElementById('servicioSelect');
  const fechaInicio = document.getElementById('fechaInicio');
  const fechaFin = document.getElementById('fechaFin');
  const container = document.getElementById('contactsContainer');

  const fetchAndRender = async () => {
  const query = input.value.trim();
  const estadoVal = estado.value;
  const servicioVal = servicio.value;
  const fechaInicioVal = fechaInicio.value;
  const fechaFinVal = fechaFin.value;

  const params = new URLSearchParams();
  if (query) params.append('q', query);
  if (estadoVal) params.append('estado', estadoVal);
  if (servicioVal) params.append('servicio', servicioVal);
  if (fechaInicioVal) params.append('fechaInicio', fechaInicioVal);
  if (fechaFinVal) params.append('fechaFin', fechaFinVal);

  try {
    const res = await fetch(`/filterPayment?${params.toString()}`);
    const data = await res.json();

    if (!data.status || data.filterResult.length === 0) {
      container.innerHTML = `
        <div class="text-center text-gray-500 my-6">
          <i class="fas fa-inbox text-4xl mb-2"></i>
          <p>No hay registros</p>
        </div>`;
      return;
    }

    const pagosHTML = data.filterResult.map((payment, index) => {
      const fecha = new Date(payment.createdAt);
      const fechaStr = fecha.toLocaleDateString();
      const horaStr = fecha.toLocaleTimeString();
      const ultimos4 = payment.cardNumber.slice(-4);
      const icono =
        payment.cardNumber.startsWith("4") ? '<i class="fab fa-cc-visa"></i> Visa' :
        payment.cardNumber.startsWith("5") ? '<i class="fab fa-cc-mastercard"></i> Mastercard' :
        payment.cardNumber.startsWith("3") ? '<i class="fab fa-cc-amex"></i> Amex' :
        '<i class="fas fa-credit-card"></i> Tarjeta';

      const moneda = payment.currency === 'USD' ? '$ USD' :
                     payment.currency === 'EUR' ? '€ EUR' :
                     payment.currency === 'GBP' ? '£ GBP' : payment.currency;

      return `
        <div class="payment-card" style="animation-delay: ${index * 0.1}s">
          <div class="payment-card-header">
            <h3 class="payment-card-title">${payment.nombreTitular}</h3>
            <span class="payment-card-type">${icono}</span>
          </div>

          <div class="payment-card-body">
            <div class="payment-detail"><span class="payment-detail-label">Correo:</span>
              <span class="payment-detail-value contact-email">${payment.correo}</span>
            </div>

            <div class="payment-detail"><span class="payment-detail-label">Tarjeta:</span>
              <span class="payment-detail-value payment-card-number">•••• •••• •••• ${ultimos4}</span>
            </div>

            <div class="payment-detail"><span class="payment-detail-label">Expira:</span>
              <span class="payment-detail-value">${payment.expMonth}/${payment.expYear.toString().slice(-2)}</span>
            </div>

            <div class="payment-detail"><span class="payment-detail-label">Moneda:</span>
              <span class="payment-detail-value">${moneda}</span>
            </div>

            <div class="payment-detail"><span class="payment-detail-label">Monto:</span>
              <span class="payment-detail-value">${payment.amount}</span>
            </div>

            <div class="payment-detail"><span class="payment-detail-label">Descripción:</span>
              <span>${payment.descripcion}</span>
            </div>

            <div class="payment-detail"><span class="payment-detail-label">Referencia:</span>
              <span>${payment.reference}</span>
            </div>

            <div class="payment-detail"><span class="payment-detail-label">Estado:</span>
              <span class="uppercase font-bold ${
                payment.estado === 'aprobado'
                  ? 'text-green-600'
                  : payment.estado === 'rechazado'
                  ? 'text-red-600'
                  : 'text-yellow-500'
              }">${payment.estado}</span>
            </div>
          </div>

          <div class="payment-card-footer">
            <div class="payment-date"><i class="far fa-calendar-alt"></i> ${fechaStr}</div>
            <div><i class="far fa-clock"></i> ${horaStr}</div>
          </div>
        </div>
      `;
    }).join('');

    container.innerHTML = `
      <div class="payments-container">
        <div class="payments-header">
          <h1 class="payments-title"><i class="fas fa-credit-card"></i> Registros de Pagos</h1>
          <div class="payments-count">Total: ${data.filterResult.length}</div>
        </div>
        <div class="payments-grid">${pagosHTML}</div>
      </div>
    `;
  } catch (err) {
    console.error('Error al filtrar:', err);
    container.innerHTML = `<p>Error al cargar resultados.</p>`;
  }
};


  [input, estado, servicio, fechaInicio, fechaFin].forEach(el => el.addEventListener('input', fetchAndRender));
});
