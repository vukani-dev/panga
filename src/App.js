import React from 'react';
import logo from './logo.svg';
import './App.css';
const { ipcRenderer, webContents } = window.require('electron');

function App() {
  // this.file= ''

  // function test(e) {
  //   // console.log(e)
  //   ipcRenderer.send('getFiles', '/home/hero')
  //   // console.log(ipcRenderer.sendSync('getFiles', 'hi')) // prints "pong"
  // }


  // ipcRenderer.on('rep', (event, message) => {
  //   console.log(message) // Prints 'whoooooooh!'
  // })


  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit ok<code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>

        <button onClick={test}>Test</button>
        <input directory="" webkitdirectory="" type="file" />

      </header>
    </div>
  );
}

export default App;
