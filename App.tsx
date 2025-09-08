import React from 'react';
import { Provider } from 'react-redux';
import store from './src/store';
import AppInner from './AppInner';

function App() {
  return (
    //useSelector 사용 위해 Provider로 감싼 후 AppInner.tsx로 이동
    <Provider store={store}>
      <AppInner />
    </Provider>
  );
}

export default App;
