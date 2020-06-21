import React, { useState, useEffect } from "react";
import Api from './services/api';
import { FaThumbsUp } from 'react-icons/fa'
import { IconContext } from 'react-icons';

import "./styles.css";

const App = () => {
  const [repositories, setRepository] = useState([])

  useEffect(() => {
    Api.get('repositories').then(res => {
      setRepository(res.data)
    })
  }, [])

  async function handleAddRepository() {
    const response = await Api.post('repositories', {
      title: `New Repository ${Date.now()}`,
      url: 'teste',
      techs: [
        'teste1',
        'teste2'
      ]
    });

    const repository = response.data;
    setRepository([...repositories, repository])
  }

  async function handleRemoveRepository(id) {
    await Api.delete(`repositories/${id}`);
    const listRepository = repositories.filter(repo => repo.id !== id);
    setRepository(listRepository);
  }

  async function handleLike(id) {
    const response = await Api.post(`repositories/${id}/like`);
    const list = repositories.map(re => re.id === id ? response.data : re)
    setRepository(list)
  }

  return (
    <div className="container" >
      <ul data-testid="repository-list">
        {repositories.map(rep => (
          <li className="containerCard" key={rep.id}> {rep.title}
            {rep.techs.map(tech => <span className="techs" key={tech}>{tech}</span>)}
            <span className="likes">
              {rep.likes}
              <IconContext.Provider value={{ color: "#4CAF50" }}>
                <FaThumbsUp />
              </IconContext.Provider>
            </span>
            <button className="delete" onClick={() => handleRemoveRepository(rep.id)}>
              Remover
          </button>
            <button className="like" onClick={() => handleLike(rep.id)}>
              Curtir
          </button>
          </li>
        ))}
      </ul>

      <button onClick={handleAddRepository}>Adicionar</button>
    </div>
  );
}

export default App;
