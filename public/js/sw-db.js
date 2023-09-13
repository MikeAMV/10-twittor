//PouchDB utils

const db = new PouchDB('messages');

const saveMessage = (message) => {
  message._id = new Date().toISOString();
  db.put(message)
    .then((result) => {
      console.log('Message saved for after post');
    })
    .catch((err) => {
      console.log('Error saving, ', err);
    });
};
