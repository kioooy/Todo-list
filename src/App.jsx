
import {useState} from 'react'


function App() {

  // react re-render
  // biến những cái biến bình thường thành những cái state
  // đối với reactjs khi cái state bị thay đổi => re-render
  const [count, setCount] = useState(0);

  const handleCount = () => {
    // tăng đếm lên 1 đơn vị
    setCount(count + 1)
  }

  return <div>
    <h1>{count}</h1>
    <button onClick={handleCount}>Button</button>
  </div>
}

export default App;

// Xử lý API
