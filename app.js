document.addEventListener('DOMContentLoaded', function() {
  // Hamburger menu functionality
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('nav ul');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close menu when clicking a link
  document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  // Initialize calendar with updated styling
  const calendarEl = document.getElementById('calendar');
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek'
    },
    locale: 'es',
    selectable: true,
    selectMirror: true,
    buttonText: {
      today: 'Hoy',
      month: 'Mes',
      week: 'Semana'
    },
    select: function(info) {
      const selectedDate = info.start;
      document.getElementById('selected-date').value = selectedDate.toISOString().split('T')[0];
      calendar.unselect();
    }
  });
  calendar.render();

  // Form submission handling with improved feedback
  const bookingForm = document.getElementById('booking-form');
  bookingForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const submitBtn = bookingForm.querySelector('.submit-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';
    
    setTimeout(() => {
      const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        mode: document.getElementById('mode').value,
        date: document.getElementById('selected-date').value,
        message: document.getElementById('message').value
      };

      // Here you would normally send the data to a server
      
      // Show success message
      const successMessage = document.createElement('div');
      successMessage.className = 'success-message';
      successMessage.textContent = '¡Gracias! Tu reserva ha sido registrada. Te contactaremos pronto.';
      successMessage.style.cssText = `
        background-color: #4ecdc4;
        color: white;
        padding: 1rem;
        border-radius: 10px;
        margin-top: 1rem;
        text-align: center;
      `;
      
      bookingForm.appendChild(successMessage);
      bookingForm.reset();
      submitBtn.disabled = false;
      submitBtn.textContent = 'Reservar';
      
      setTimeout(() => {
        successMessage.remove();
      }, 5000);
    }, 1000);
  });

  // Animación suave para los enlaces de navegación
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });
});

// Animación del menú al hacer scroll
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const header = document.querySelector('header');
  const currentScroll = window.pageYOffset;

  if (currentScroll <= 0) {
    header.classList.remove('scroll-up');
    return;
  }
  
  if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
    header.classList.remove('scroll-up');
    header.classList.add('scroll-down');
  } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
    header.classList.remove('scroll-down');
    header.classList.add('scroll-up');
  }
  lastScroll = currentScroll;
});

const bookingForm = document.getElementById('booking-form');

bookingForm.addEventListener('submit', async function(e) {
  e.preventDefault();

  const formData = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    subject: document.getElementById('subject').value,
    mode: document.getElementById('mode').value,
    date: document.getElementById('selected-date').value,
    message: document.getElementById('message').value,
  };

  try {
    const response = await fetch('http://localhost:3000/api/reservas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      alert('¡Reserva registrada exitosamente!');
      bookingForm.reset();
    } else {
      alert('Hubo un problema al registrar tu reserva.');
    }
  } catch (error) {
    console.error('Error al enviar los datos:', error);
  }
});