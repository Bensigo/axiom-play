import React, { useContext } from "react";
type TextArea = {
  value: string;
  onChange: (e: any) => void;
  placeholder: string;
  onSubmit: () => void;
};



const TextArea = ({ value, onChange, placeholder }: TextArea) => {

  return (
    <div className="flex flex-col">
      <textarea
        className={`w-full mt-2 px-2 mb-2 
             bg-slate-900 text-green-700
         rounded-md border-none  focus:outline-none focus:ring-2 focus:border-none focus:border-transparent`}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
};

export default TextArea;
