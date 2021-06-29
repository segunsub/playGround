import { Form } from 'react-bootstrap'
function UserOptions(prop: {type: string,value: number|string,setValue: (arg0: string)=> void,id: string|undefined,label: string,message: string}) {
    return (
        
        <div className="form-floating">

             <Form.Control
            required
            type={prop.type}
            id={prop.id}
            placeholder={prop.label}
            value={prop.value}
            onChange={e => prop.setValue(e.target.value)}
          />
          <Form.Control.Feedback type="invalid">
                {prop.message}
            </Form.Control.Feedback>

        </div>
    )
}

export default UserOptions
