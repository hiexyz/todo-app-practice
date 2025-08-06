// Firebaseの初期化（必ず最初に記載）
  const firebaseConfig = {
    apiKey: "AIzaSyCuJA0nFEKn7xW0JFkDvk6GPxuDUNnykhY",
    authDomain: "todo-app-8e69e.firebaseapp.com",
    projectId: "todo-app-8e69e",
    storageBucket: "todo-app-8e69e.firebasestorage.app",
    messagingSenderId: "633974812240",
    appId: "1:633974812240:web:3d0b09b0ebdeaaba1fab55",
    measurementId: "G-0SLJNW20ZX"
  };

  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  
  document.getElementById('add-btn').addEventListener('click', function() {
    const input = document.getElementById('todo-input');
    const text = input.value.trim();
    if (text !== '') {
      addTodo(text);
      input.value = '';
      input.focus();
    }
  });
  
  function addTodo(text) {
    db.collection("todos").add({ text: text, timestamp: Date.now() })
      .then(() => {
        console.log("データを保存しました");
      })
      .catch((error) => {
        console.error("保存エラー:", error);
      });
  }
  
  db.collection("todos").orderBy("timestamp")
  .onSnapshot((snapshot) => {
    const todoList = document.getElementById('todo-list');
    todoList.innerHTML = '';
    snapshot.forEach((doc) => {
      const data = doc.data();
      const li = document.createElement('li');
      li.textContent = data.text;
  
      // 削除ボタン
      const delBtn = document.createElement('button');
      delBtn.textContent = '削除';
      delBtn.onclick = function() {
        db.collection("todos").doc(doc.id).delete();
      };
  
      li.appendChild(delBtn);
      todoList.appendChild(li);
    });
  });