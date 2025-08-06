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

// Google認証プロバイダー
const provider = new firebase.auth.GoogleAuthProvider();

let currentUser = null;

// ログイン
document.getElementById('login-btn').addEventListener('click', function() {
    firebase.auth().signInWithPopup(provider)
        .catch((error) => {
            alert("ログイン失敗: " + error.message);
        });
});

// ログアウト
document.getElementById('logout-btn').addEventListener('click', function() {
    firebase.auth().signOut();
});

// ログイン状態監視
firebase.auth().onAuthStateChanged(function(user) {
    currentUser = user;
    if (user) {
        document.getElementById('user-info').textContent = user.displayName + "でログイン中";
        document.getElementById('login-btn').style.display = "none";
        document.getElementById('logout-btn').style.display = "";
        document.getElementById('add-btn').disabled = false;
    } else {
        document.getElementById('user-info').textContent = "";
        document.getElementById('login-btn').style.display = "";
        document.getElementById('logout-btn').style.display = "none";
        document.getElementById('add-btn').disabled = true;
    }
});

// TODO追加（認証済みユーザーのみ）
document.getElementById('add-btn').addEventListener('click', function() {
    if (!currentUser) {
        alert("ログインしてください");
        return;
    }
    const input = document.getElementById('todo-input');
    const text = input.value.trim();
    if (text !== '') {
        addTodo(text);
        input.value = '';
        input.focus();
    }
});

function addTodo(text) {
    // ownerIdを保存（オプション）
    db.collection("todos").add({ 
        text: text, 
        timestamp: Date.now(),
        ownerId: currentUser.uid // 追加
    })
    .then(() => {
        console.log("データを保存しました");
    })
    .catch((error) => {
        console.error("保存エラー:", error);
    });
}

// TODO取得・表示
db.collection("todos").orderBy("timestamp")
.onSnapshot((snapshot) => {
    const todoList = document.getElementById('todo-list');
    todoList.innerHTML = '';
    snapshot.forEach((doc) => {
        const data = doc.data();
        const li = document.createElement('li');
        li.textContent = data.text;

        // 削除ボタン（自分のTODOのみ削除可能にする場合）
        const delBtn = document.createElement('button');
        delBtn.textContent = '削除';
        delBtn.onclick = function() {
            if (!currentUser) {
                alert("ログインしてください");
                return;
            }
            // 自分のTODOのみ削除可
            if (data.ownerId === currentUser.uid) {
                db.collection("todos").doc(doc.id).delete();
            } else {
                alert("自分のTODOのみ削除できます");
            }
        };

        li.appendChild(delBtn);
        todoList.appendChild(li);
    });
});