import React, { useState } from "react";
import { Button, InputGroup, Form } from 'react-bootstrap';
import './searchBar.css'
export default function SearchBar({ loading, callback }) {
  const [userInput, setUserInput] = useState('');

  const handleUserInput = (value) => {
    setUserInput(value);
  }

  const spinnerIcon = () => {
    return (
      <svg className="spin" width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M988 548C968.1 548 952 531.9 952 512C952 452.6 940.4 395 917.4 340.7C895.275 288.426 863.255 240.921 823.1 200.8C783.023 160.592 735.507 128.564 683.2 106.5C629 83.6 571.4 72 512 72C492.1 72 476 55.9 476 36C476 16.1 492.1 0 512 0C581.1 0 648.2 13.5 711.3 40.3C772.3 66 827 103 874 150C921 197 957.9 251.8 983.7 312.7C1010.4 375.8 1023.9 442.9 1023.9 512C1024 531.9 1007.9 548 988 548Z" fill="currentColor" />
      </svg>)
  }

  return (
    <>
      <Form onSubmit={(e) => callback(e, userInput)}>
        <InputGroup className="mb-3">
          <Form.Control
            placeholder="Search for images"
            aria-label="image search"
            aria-describedby="basic-addon2"
            value={userInput}
            onChange={e => handleUserInput(e.target.value)}
            type="text"
            
          />
          <Button
            variant="primary"
            className="search-button"
            id="search-button"
            type="submit"
            disabled={loading}
          >
            {loading ? spinnerIcon() : "search"}
          </Button>

        </InputGroup>
      </Form>
    </>
  );
}