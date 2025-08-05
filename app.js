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
    const li = document.createElement('li');
    li.textContent = text;
    
    // 削除ボタン
    const delBtn = document.createElement('button');
    delBtn.textContent = '削除';
    delBtn.onclick = function() {
      li.remove();
    };
    
    li.appendChild(delBtn);
    document.getElementById('todo-list').appendChild(li);
  }