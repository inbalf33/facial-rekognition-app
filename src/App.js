import { useState } from 'react';
import './App.css';
const uuid = require('uuid');

function App() {
  const [image, setImage] = useState('');
  const [uploadResultMessage, setUploadResultMessage] = useState('נא להעלות תמונה לאימות');
  const [imgName, setImgName] = useState('placeholder.png');
  const [isAuth, setAuth] = useState(false);

  function sendImage(e) {
    e.preventDefault();
    setImgName(image.name);
    const visitorImageName = uuid.v4();
    fetch(`https://sru0qunh3k.execute-api.us-east-1.amazonaws.com/dev/visitor-image-storage3/${visitorImageName}.jpeg`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'image/jpeg'
      },
      body: image
    }).then(async () => {
      const response = await authenticate(visitorImageName);
      if (response.Message ==='Success') {
        setAuth(true);
        setUploadResultMessage(`היי ${response['firstName']} ${response['lastName']}, ברוך הבא לעבודה. מקווים שיהיה לך יום מעולה!`)
      } else {
        setAuth(false);
        setUploadResultMessage('האימות נכשל, אדם זה אינו עובד החברה')
      }
    }).catch(error => {
      setAuth(false);
      setUploadResultMessage('יש שגיאה במהלך תהליך האימות. בבקשה נסה שוב')
      console.error(error);
    })
  }

  async function authenticate(visitorImageName) {
    const requestUrl = 'https://sru0qunh3k.execute-api.us-east-1.amazonaws.com/dev/employee?' + new URLSearchParams({
      objectKey: `${visitorImageName}.jpeg`
    });
    return await fetch(requestUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(response => response.json())
    .then((data) => {
      return data;
    }).catch(error => console.error(error));
  }

  return (
    <div className="App">
      <h2>מערכת זיהוי עובדים</h2>
      <form onSubmit={sendImage}>
        <input type='file' name='image' onChange={e => setImage(e.target.files[0])}/>
        <button type='submit'> אימות </button>
      </form>
      <div className={isAuth ? 'success' : 'failure'}>{uploadResultMessage}</div>
      <img src={ require(`./visitors/${imgName}`) } alt="Visitor" height={250} width={250}/>
    </div>
  );
}

export default App;
