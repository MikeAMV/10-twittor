// Guardar  en el cache dinamico
function actualizaCacheDinamico(dynamicCache, req, res) {
  if (res.ok) {
    return caches.open(dynamicCache).then((cache) => {
      cache.put(req, res.clone());
      return res.clone();
    });
  } else {
    return res;
  }
}

// Cache with network update
function actualizaCacheStatico(staticCache, req, APP_SHELL_INMUTABLE) {
  if (APP_SHELL_INMUTABLE.includes(req.url)) {
    // No hace falta actualizar el inmutable
    // console.log('existe en inmutable', req.url );
  } else {
    // console.log('actualizando', req.url );
    return fetch(req).then((res) => {
      return actualizaCacheDinamico(staticCache, req, res);
    });
  }
}

//Network with cache callback / update
function apiMessagesManager(CACHE, req) {
  if (req.clone().method === 'POST') {
    //Tomar los datos del request, y guardarlos en el cache para después utilizarlos (No internet)
    req
      .clone()
      .text()
      .then((body) => {
        const messageParsed = JSON.parse(body);
        saveMessage(messageParsed);
      });
    return fetch(req);
  } else {
    return fetch(req)
      .then((res) => {
        if (res.ok) {
          actualizaCacheDinamico(CACHE, req, res.clone());
          return res.clone();
        } else {
          return caches.match(req);
        }
      })
      .catch((err) => {
        return caches.match(req);
      });
  }
}
