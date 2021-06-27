import { Route, BrowserRouter, Switch } from 'react-router-dom'

// Páginas da aplicação
import { Home } from './pages/Home';
import { NewRoom } from './pages/NewRoom';
import { Room } from './pages/Room';
import { AdminRoom } from './pages/AdminRoom';

// Contextos da aplicação
import { AuthContextProvider } from './contexts/AuthContext'
//import { RulesContextProvider } from './contexts/RulesContext'
import { ThemeContextProvider } from './contexts/ThemeContext';

function App() {
  return (
    <BrowserRouter>
        <ThemeContextProvider>
          <AuthContextProvider>
              <Switch>
                <Route path='/' exact component={ Home}/>
                <Route path='/rooms/new' component={ NewRoom }/>
                <Route path='/rooms/:id' component={ Room }></Route>
                <Route path='/admin/rooms/:id' component={ AdminRoom }></Route>
              </Switch>
          </AuthContextProvider>
        </ThemeContextProvider>
    </BrowserRouter>
  );
}

export default App;
