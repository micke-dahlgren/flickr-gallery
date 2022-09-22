import React from "react";
import { Form } from "react-bootstrap";
export default function Switch({ checked, callback }) {
  return (
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
  );
}
