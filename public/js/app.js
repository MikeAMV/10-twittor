var url = window.location.href;
var swLocation = '/twittor/sw.js';
const API = 'api';

if (navigator.serviceWorker) {
  if (url.includes('localhost') || url.includes('127.0.0.1')) {
    swLocation = '/sw.js';
  }
  navigator.serviceWorker.register(swLocation);
}

// Referencias de jQuery

var titulo = $('#titulo');
var nuevoBtn = $('#nuevo-btn');
var salirBtn = $('#salir-btn');
var cancelarBtn = $('#cancel-btn');
var postBtn = $('#post-btn');
var avatarSel = $('#seleccion');
var timeline = $('#timeline');

var modal = $('#modal');
var modalAvatar = $('#modal-avatar');
var avatarBtns = $('.seleccion-avatar');
var txtMensaje = $('#txtMensaje');

// El usuario, contiene el ID del hÃ©roe seleccionado
var usuario;

// ===== Codigo de la aplicaciÃ³n

function crearMensajeHTML(mensaje, personaje) {
  var content = `
    <li class="animated fadeIn fast">
        <div class="avatar">
            <img src="img/avatars/${personaje}.jpg">
        </div>
        <div class="bubble-container">
            <div class="bubble">
                <h3>@${personaje}</h3>
                <br/>
                ${mensaje}
            </div>
            
            <div class="arrow"></div>
        </div>
    </li>
    `;

  timeline.prepend(content);
  cancelarBtn.click();
}

// Globals
function logIn(ingreso) {
  if (ingreso) {
    nuevoBtn.removeClass('oculto');
    salirBtn.removeClass('oculto');
    timeline.removeClass('oculto');
    avatarSel.addClass('oculto');
    modalAvatar.attr('src', 'img/avatars/' + usuario + '.jpg');
  } else {
    nuevoBtn.addClass('oculto');
    salirBtn.addClass('oculto');
    timeline.addClass('oculto');
    avatarSel.removeClass('oculto');

    titulo.text('Seleccione Personaje');
  }
}

// Seleccion de personaje
avatarBtns.on('click', function () {
  usuario = $(this).data('user');

  titulo.text('@' + usuario);

  logIn(true);
});

// Boton de salir
salirBtn.on('click', function () {
  logIn(false);
});

// Boton de nuevo mensaje
nuevoBtn.on('click', function () {
  modal.removeClass('oculto');
  modal.animate(
    {
      marginTop: '-=1000px',
      opacity: 1,
    },
    200
  );
});

// Boton de cancelar mensaje
cancelarBtn.on('click', function () {
  if (!modal.hasClass('oculto')) {
    modal.animate(
      {
        marginTop: '+=1000px',
        opacity: 0,
      },
      200,
      function () {
        modal.addClass('oculto');
        txtMensaje.val('');
      }
    );
  }
});

// Boton de enviar mensaje
postBtn.on('click', function () {
  var mensaje = txtMensaje.val().trim();
  if (mensaje.length === 0) {
    cancelarBtn.click();
    return;
  }
  const payload = {
    message: mensaje,
    user: usuario,
  };
  fetch('api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if (data.ok) {
        crearMensajeHTML(mensaje, usuario);
      }
    })
    .catch((err) => console.log('Error, ', err));
});

function getMessages() {
  fetch('http://localhost:3000/api')
    .then((response) => response.json())
    .then((data) => {
      console.log(data.messages);
      for (const message of data.messages) {
        crearMensajeHTML(message.message, message.user);
      }
    });
}
getMessages();

//Detect network changes
function isOnline() {
  if (navigator.onLine) {
    console.log('We have network');
    mdtoast('OnLine', {
      type: 'success',
      interaction: true,
      interactionTimeout: 1500,
      actionText: 'Aceptar',
    });
  } else {
    console.log('We dont have network');
    mdtoast('OffLine', {
      type: 'info',
      interaction: true,
      actionText: 'Aceptar',
    });
  }
}

window.addEventListener('online', isOnline);
window.addEventListener('offline', isOnline);

//Ask for Notifications
function notify() {
  if (!window.Notification) {
    mdtoast('NotSupportNotification', {
      type: 'warning',
      interaction: true,
      interactionTimeout: 1500,
      actionText: 'Aceptar',
    });
    return;
  }
  if (Notification.permission === 'granted') {
    sendNotification();
  } else if (
    Notification.permission !== 'denied' ||
    Notification.permission === 'default'
  ) {
    Notification.requestPermission((permission) => {
      console.log(permission);
      if (permission === 'granted') {
        new Notification('Permission granted');
      }
    });
  }
}

notify();

function sendNotification(params) {
  const config = {
    body: 'Notification body',
    icon: 'img/icons/icon-72x72.png',
  };
  const n = new Notification('Notification test', config);
  n.onclick = () => {
    console.log('clicked');
  };
}
