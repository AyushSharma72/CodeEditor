import React, { useEffect, useState } from "react";
import "./CodeEd.css"
import { Editor } from "@monaco-editor/react";
import { BeatLoader } from "react-spinners"
import Select from 'react-select';

function CodeEditor() {
    const [Language, SetLanguage] = useState("python3")
    const [Input, SetInput] = useState("")
    const [Output, SetOutput] = useState("")
    let textarea = document.getElementById("area")
    useEffect(() => {
        if (Language === "python3") {
            SetUserCode('print("hello world from python")');
          
            SetOutput("")
        }
        else if (Language === "cpp") {
            SetUserCode(`
#include <iostream>
 int main() {
 // Write C++ code here
   std::cout << "Hello world! from C++";
   return 0;
            }`);
         
            SetOutput("")
        }
        else {
            SetUserCode(`
 import java.util.*;
   public class Main {
      public static void main(String[] args) {
          System.out.println("Hello, People i am Ayush");
          System.out.println("this language is java");
              }
            }`)
          
            SetOutput("")
        }
    }, [Language])

    const [UserCode, SetUserCode] = useState('')
    const [FontSize, SetFontSize] = useState(22)
    const [DefaultTheme, SetDefaultTheme] = useState("vs-dark")


    const [Loading, Setloading] = useState(false)
    const options = {
        fontSize: FontSize
    }

    const languages = [
        { value: "cpp", label: "C++" }, { value: "python3", label: "Python" }, { value: "java", label: "Java" }
    ];
    const Theme = [
        { value: "vs-dark", label: "DarkMode" },
        { value: "light", label: "LightMode" },
        { value: "hc-black", label: "Contrast" }
    ]


    function ClearOutput() {
        SetOutput("")
    }

    async function Compile() {
        Setloading(true);
        try {
            const response = await fetch('https://online-code-compiler.p.rapidapi.com/v1/',
                {
                    method: "POST",
                    headers: {
                        'content-type': 'application/json',
                        'X-RapidAPI-Key': 'df461d9036mshb4f44340f3538d7p13a8bajsn86cdae799e77',
                        'X-RapidAPI-Host': 'online-code-compiler.p.rapidapi.com'
                    },
                    body: JSON.stringify({
                        language: Language,
                        version: 'latest',
                        code: UserCode,
                        input: Input,
                    }),
                }
            );
            // console.log(response.json().message)
            if (response) {
                Setloading(false)
                let result = await response.json()
                SetOutput(result.output)
            }

        }
        catch (error) {
            console.log(error)
        }
    }



    return (
        <div>
            <div className="Navbar">
                <div className="NavbarPart1">
                    <h1 style={{ fontWeight: "700" }}>Online Code Compiler</h1>
                    <Select options={languages} value={Language} onChange={(e) => { SetLanguage(e.value) }} placeholder={Language} className="Select"></Select>
                    <Select options={Theme} value={DefaultTheme} onChange={(e) => { SetDefaultTheme(e.value) }} placeholder={DefaultTheme} className="Select"></Select>
                    <div className="FontSizeDiv">
                        <label style={{ fontWeight: "700" }}>Font Size</label>
                        <input type="range" min="18" max="30"
                            value={FontSize} step="2" style={{ cursor: "pointer" }}
                            onChange={(e) => { SetFontSize(e.target.value) }} />
                    </div>
                </div>



            </div>
            <div className="ContainersParent">
                <div className="LeftContainer">
                    <button className="Runbutton " onClick={Compile}>Run</button>
                    <Editor   className="Editor"
                        value={UserCode} // to change templete when language  changes update value prop
                        onChange={(value) => SetUserCode(value)}
                        options={options}
                        height="94vh"
                        width="100%"
                        theme={DefaultTheme}
                        language={Language}
                        defaultLanguage="python"
                        defaultValue='print("hello world")'
                        suggestOnTriggerCharacters={true}
                        autoClosingQuotes={true}


                    />
                </div>
                <div className="RightContainer">

                    <button onClick={ClearOutput} className="ClearButton">Clear</button>
                    <div className="InputDivParent">
                        <h5 >Input:</h5>
                        <div className="Input">
                            <textarea className="TextAreaInput" onChange={(e) => { SetInput(e.target.value) }} ></textarea>
                        </div>
                    </div>


                    <div className="OutputParentDiv">
                        {
                            DefaultTheme === "vs-dark" ?
                                <style>
                                    {`.output, .Input,.TextAreaInput{
                                              background-color:black;
                                              color:white;
                                    }
                                    body{
                                        background-color:;
                                    }`}
                                </style>
                                : DefaultTheme === "light" ?
                                    <style>
                                        {`.output,.Input,.TextAreaInput{
                                                background-color: white;
                                                color:black;
                                            }
                                            .Navbar{
                                             background-color:aquamarine;
                                            }
                                         .output{
                                             border-top: 2px solid black;
                                            }
                                            body{
                                                background-color:black;
                                            }
                                            .OutputParentDiv ,.InputDivParent h5{
                                                color:white;
                                            }

                                       `}
                                    </style>
                                    : DefaultTheme === "hc-black" ?
                                        <style>
                                            {`.output,.Input,.TextAreaInput{
                                             background-color:black;
                                              color:white;
                                              
                                       }`}
                                        </style> :
                                        null
                        }

                        <h5 >Output:</h5>

                        <div className="output">
                            {Loading ? <BeatLoader style={{ margin: "auto" }} color="#36D7B7" size={15} /> :
                                <p>{Output}</p>
                            }

                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}
export default CodeEditor;
