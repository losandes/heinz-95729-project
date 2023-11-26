// here we have the user input component

import React, { useState } from 'react';


interface UserInputProps {
  onSubmit: (input: string) => void;
}

export function UserInput({ onSubmit }: UserInputProps) {
  const [input, setInput] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(input);
    setInput('');
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={input} onChange={e => setInput(e.target.value)} style={{ marginLeft: '20px' }}/>
      <button type="submit" style={{
        backgroundColor: '#4CAF50', /* for example */
        color: 'white',
        padding: '7px 15px',
        textAlign: 'center',
        textDecoration: 'none',
        display: 'inline-block',
        fontSize: '16px',
        margin: '2px 2px',
        cursor: 'pointer',
        borderRadius: '12px',
      }}>Send</button>
    </form>
  );
}
