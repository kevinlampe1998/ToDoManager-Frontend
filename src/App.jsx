import { useEffect, useRef, useState } from "react";

// https://todomanager-backend.onrender.com/

const App = () => {
  const registerForm = useRef();
  const loginForm = useRef();
  const choose = useRef();

  const [toDos, setToDos] = useState([]);

  const [user, setUser] =
    useState({ username: '', _id: '' });

  const [registerUser, setRegisterUser] =
    useState({ username: '', password: '' });

  const [loginUser, setLoginUser] =
    useState({ username: '', password: '' });

  const [newToDo, setNewToDo] =
    useState({ title: '', description: '', completed: false });

  const openRegisterForm = () => 
    registerForm.current.style.display = 'flex';

  const openLoginForm = () => 
    loginForm.current.style.display = 'flex';

  const register = async (event) => {
    event.preventDefault();

    const res = await fetch('https://todomanager-backend.onrender.com/users-register', {
      method: 'POST',
      body: JSON.stringify(registerUser),
      headers: { 'content-type': 'application/json' }
    });
    const data = await res.json();

    console.log(data);

    if (!data.savedUser) {
      alert(data.message);
      return;
    }

    setUser(data.savedUser);

    alert(data.message);

    loginForm.current.style.display = 'none';
    choose.current.style.display = 'none';
  };
  
  const login = async (event) => {
    event.preventDefault();

    const res = await fetch('https://todomanager-backend.onrender.com/users-login', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(loginUser),
      headers: { 'content-type': 'application/json' }
    });
    const data = await res.json();

    if (!data.searchedUser) {
      alert(data.message);
      return;
    };

    setUser(data.searchedUser);

    loginForm.current.style.display = 'none';
    choose.current.style.display = 'none';
  };  
  
  const fetchToDos = async () => {
    const res = await fetch(`https://todomanager-backend.onrender.com/to-dos/${user._id}`);
    const data = await res.json();
    
    setToDos(data.toDos);
  };
  
  useEffect(() => {
    user._id !== '' && fetchToDos();
  }, [user]);
  
  const postToDo = async (event) => {
    event.preventDefault();
    
    const body = JSON.stringify({
      user_id: user._id,
      ...newToDo
    });
    
    const res = await fetch('https://todomanager-backend.onrender.com/to-dos', {
      method: 'POST',
      body: body,
      headers: { 'content-type': 'application/json' }
    });
    
    const data = await res.json();
    
    fetchToDos();
    
    alert(data.message);

    setNewToDo({ title: '', description: ''});
  };
  
  const loginAtStart = async () => {
    try {

      const res = await fetch('https://todomanager-backend.onrender.com/token', {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({ message: 'Hello from loginAtStart!' }),
        headers: { 'content-type': 'application/json' }
      });
      const data = await res.json();
  
      if (!data.searchedUser) {
        console.log(data.message);
        return;
      };
  
      setUser(data.searchedUser);
  
      loginForm.current.style.display = 'none';
      choose.current.style.display = 'none';

    } catch (err) {
      console.log('Error on Token access!');
    }
  };
  
  useEffect(() => {
    loginAtStart();
  }, []);
  
  const changeToDo = async (event) => {
    const titleH3 = event.target.parentElement.parentElement.firstChild.children[1];
    
    const parent = event.target.parentElement.parentElement.firstChild;
    
    const newTitleInput = document.createElement('input');
    newTitleInput.value = titleH3.innerHTML;
    
    parent.replaceChild(newTitleInput, titleH3);
    
    const descriptionDiv = event.target.parentElement.parentElement.firstChild.children[2];
    
    const newDescriptionInput = document.createElement('input');
    newDescriptionInput.value = descriptionDiv.innerHTML;

    parent.replaceChild(newDescriptionInput, descriptionDiv);

    const sendButton = event.target.previousSibling;
    event.target.style.display = 'none';
    sendButton.style.display = 'block';
  };
  
  const updateToDo = async (event) => {
    const toDoId = event.target.parentElement.parentElement.firstChild.firstChild.innerHTML;
    
    const title = event.target.parentElement.parentElement.firstChild.children[1].value;
    
    const description = event.target.parentElement.parentElement.firstChild.children[2].value;
    
    const body = JSON.stringify({ title, description });
    
    const res = await fetch(`https://todomanager-backend.onrender.com/to-dos/${toDoId}`, {
      method: 'PUT', body,
      headers: { 'content-type': 'application/json' }
    });
    const data = await res.json();
    
    fetchToDos();

    location.reload();
  };
  
  const deleteToDo = async (event) => {
    const toDoId = event.target.parentElement.parentElement.firstChild.firstChild.innerHTML;
    console.log(toDoId);
    
    const title = event.target.parentElement.parentElement.firstChild.children[1].innerHTML;
    console.log(title);
    
    const res = await fetch('https://todomanager-backend.onrender.com/to-dos', {
      method: 'DELETE',
      body: JSON.stringify({ toDoId }),
      headers: { 'content-type': 'application/json' }
    });
    const data = await res.json();

    fetchToDos();

    return;
  };  
  const logout = async () => {
    const res = await fetch('https://todomanager-backend.onrender.com/logout', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ message: 'Hello from logout!' }),
      headers: { 'content-type': 'application/json' }
    });
    
    const data = await res.json();
    
    console.log(data);
    
    alert(data.message);
    
    location.reload();
  };
  
  // -----------------------------------------
  const toggleComplete = async (event) => {
    const toDoId = event.target.parentElement.firstChild.innerHTML;

    const toDo = toDos.find(todo => todo._id === toDoId);

    const body =
      JSON.stringify({ completed: !toDo.completed });

    const res = await fetch(`https://todomanager-backend.onrender.com/to-dos/${toDoId}`, {
      method: 'PUT', body,
      headers: { 'content-type': 'application/json' }
    });
    const data = await res.json();

    fetchToDos();

    
  };
  // -----------------------------------------
  
  return (
    <>
      <section className='login-or-register'>

        <div className='choose-login-or-register' ref={choose}>
          <h1>To Do Manager</h1>
          <div>
            <button onClick={openRegisterForm}>Register</button>
            <button onClick={openLoginForm}>Login</button>
          </div>
        </div>

        <form className="register-form" ref={registerForm}>
          <label htmlFor="">User Name</label>
          <input type="text" value={registerUser.username} onChange={(e) => setRegisterUser((data) => ({...data, username: e.target.value}))}/>

          <label htmlFor="">Password</label>
          <input type="text" value={registerUser.password} onChange={(e) => setRegisterUser((data) => ({...data, password: e.target.value}))}/>

          <button onClick={register}>Register</button>
        </form>

        <form className="login-form" ref={loginForm}>
          <label htmlFor="">User Name</label>
          <input type="text" value={loginUser.username} onChange={(e) => setLoginUser((data) => ({...data, username: e.target.value}))}/>

          <label htmlFor="">Password</label>
          <input type="text" value={loginUser.password} onChange={(e) => setLoginUser((data) => ({...data, password: e.target.value}))}/>

          <button onClick={login}>Login</button>
        </form>

      </section>
      <nav className="main-nav">
        <div className='userName'>{user.username}</div>
        <div onClick={logout}>Logout</div>
      </nav>

      <section>
        <form className="todo-form" onSubmit={postToDo}>
          <h2>Add ToDo</h2>

          <label htmlFor="title">Title</label>
          <input type="text" id="title" value={newToDo.title} onChange={(e) => setNewToDo((data) => ({...data, title: e.target.value}))}/>

          <label htmlFor="description">Description</label>
          <input type="text" id="description" value={newToDo.description} onChange={(e) => setNewToDo((data) => ({...data, description: e.target.value}))}/>

          <button type="submit">Add</button>
        </form>
      </section>

      <section className="to-do-container">
        {
          toDos.map((toDo, index) => (
            <div className="to-do" key={index}>
              <div>
                <div className="hidden-to-do-id">{toDo._id}</div>
                <h3>{toDo.title}</h3>
                <div>{toDo.description}</div>
{/* ----------------------------------------- */}
                {toDo.completed ?
                  <div onClick={toggleComplete}>&#10003;</div>
                  : <div onClick={toggleComplete}>&#9711;</div>}
{/* ----------------------------------------- */}
              </div>
              <div>
                <button onClick={updateToDo} className="send-button">Send</button>
                <button onClick={changeToDo}>Change</button>
                <button onClick={deleteToDo}>Delete</button>
              </div>
            </div>
          ))
        }
      </section>

    </>
  );
};

export default App;