import { useState, useEffect } from 'react'
import Note from './components/Notes'
import noteService from './servives/notes'


const App = () => {
  const [newNote, setnewNote] = useState('')
  const [notes, setNotes] = useState([]);
  
  const tg = (id) => {
    const note = notes.find(n => n.id === id)
    const changenote = {...note, important: !note.important}
    noteService.update(id, changenote).then(response => {
    setNotes(notes.map(note => note.id === id ? response.data : note))
    })
    .catch(error => {
      alert(
        `the note '${note.content}' was already deleted from server`
      )
      setNotes(notes.filter(n => n.id !== id))
    }
    )
  }

  useEffect(() => {
    noteService.getAll().then(response=> {
      console.log('promise fulfilled');
      setNotes(response)
    })
  }, []
)
  console.log('render', notes.length, 'notes')
  const handleChangeNote = (event) => {
    setnewNote(event.target.value);
}


const addNote = (event) => {
  event.preventDefault()
  console.log('button clicked', event.target);
  const noteObject = {
    content: newNote,
    important: Math.random() < 0.5,
    id: String(notes.length +1)
  }
  const check = notes.some(a => a.content === newNote)
  if(check) {
    alert(`${newNote} da ton tai, vui long nhap gia tri khac`)
  } else {
    noteService.create(noteObject).then(response => {
      console.log(response)
      setNotes(notes.concat(noteObject));
      setnewNote('')
    })
  }
}

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map((note) => (
          <Note key={note.id} note={note} toggleImportance={() => tg(note.id)}/>
        ))}
      </ul>
      <form onSubmit={addNote} >
        <input value={newNote} 
          onChange={handleChangeNote}
        />
        <button type = 'submit'>save</button>
      </form>
    </div>
  )
}
export default App