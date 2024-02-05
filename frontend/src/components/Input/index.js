import {forwardRef} from "react";
import "./input.css"



const Input = forwardRef(({label=null,...props},ref)=>{
    return (
       <div>
        {label && <label>{label}</label>}
        <input  className="form-input" ref={ref} {...props} />
       </div>
    );
});
export default Input;