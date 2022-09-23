import React from "react";
import { Form } from "react-bootstrap";
import './PollSwitch.css';

export default function Switch({ checked, callback, countdown }) {
  return (
    <div className="d-flex pb-2">
      <div>
        <Form>
          <Form.Check
            type="switch"
            id="polling-switch"
            label="Poll data continously"
            checked={checked}
            onChange={callback}
          />
        </Form>
      </div>
      {countdown > 0 && (
        <p className="poll-switch__countdown">
          ({countdown})
        </p>
      )}
    </div>
  );
}
