//PouchDB utils

const db = new PouchDB('messages');

const saveMessage = (message) => {
  message._id = new Date().toISOString();
  return db
    .put(message)
    .then((result) => {
      self.registration.sync.register('new-post');
      const response = {
        ok: true,
        offline: true,
      };
      console.log('Message saved for after post');
      return new Response(JSON.stringify(response));
    })
    .catch((err) => {
      console.log('Error saving, ', err);
      const response = {
        ok: false,
        offline: true,
      };
      return new Response(JSON.stringify(response));
    });
};

function savePostsMessages() {
  const posts = [];
  return db.allDocs({ include_docs: true }).then((docs) => {
    const { rows } = docs;
    for (const row of rows) {
      const { doc } = row;
      const postMessage = fetch('api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(doc),
      })
        .then((res) => {
          return db.remove(doc);
        })
        .catch((err) => console.log('Error, ', err));
      posts.push(postMessage);
    }
    return Promise.all(posts);
  });
}
