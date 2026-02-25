"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { DropdownMenuContent , DropdownMenuRadioGroup, DropdownMenuRadioItem } from "@/components/ui/dropdown-menu";


export default function Home() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  // for language selection//

  const [language,setLanguage] = useState("");

  async function handleTranslate() {
    setLoading(true);
    setMessage(""); 
    setOutput("");

    // language map for the use to slecect with the language he wants to//
// this will record the given values are string
    const languageMap:Record<string,string>={
      hindi:"Hindi",
      marathi:"Marathi",
      spanish:"Spanish"
    }

    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input ,

          target_language:languageMap[language]

        }),
      });

      //  IMPORTANT: check response status FIRST
      if (!res.ok) {
        throw new Error("API request failed");
      }

      const data = await res.json();
      setOutput(data.result);

    } catch (error) {
      console.error("Translation error:", error);
      setMessage("Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  // Speak Button Logic for speaking//

  // const isHindiText= (output:string) =>{
  //   const hindiRex = /[\u0900-\u097F]/;
  //   return hindiRex.test(output);
  // };

  const speakHindi = (output:string) =>{
    if(!output || output.trim()==="")
      return ;

  //   if (!isHindiText(output)) {
  //   alert("Output is not Hindi text");
  //   return;
  // }

   if (!("speechSynthesis" in window)) {
    alert("Text-to-Speech not supported");
    return;
  }

  const utterance = new SpeechSynthesisUtterance(output);
  utterance.lang = "hi-IN";

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
};





  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-xl">
        <CardContent className="space-y-4 pt-6">
          <h1 className="text-2xl font-bold text-center">
            English → Multi Language Translator 📝  
          </h1>

          <Textarea
            placeholder="Enter English text..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">Language:{language}</Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
              
               <DropdownMenuRadioGroup 
               value={language}
               onValueChange={
                // we have to mention that the radio group should know that which value is selected
                
                (value)=>{
                  setLanguage(value);
                }}
                

               >
                  <DropdownMenuRadioItem value="hindi">Hindi 📃</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="marathi">Marathi 📜</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="spanish">Spanish 📄</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                  
            </DropdownMenuContent>
          </DropdownMenu>


          <Button
            className="w-full"
            onClick={handleTranslate}
            disabled={loading || !input}
          >
            {loading ? "Translating..." : "Translate"}
          </Button>

          {message && (
            <p className="text-red-500 text-sm text-center">
              {message}
            </p>
          )}

          <Textarea
            placeholder="Translation will appear here..."
            value={output}
            readOnly
          />
          <Button variant="ghost" style={{backgroundColor:"black", color:"white"}}onClick={()=>{
              speakHindi(output);
            }}
              disabled={!output}>Speak</Button>
            
          {/* {disabled ={!isHindiText(output)}} put above in speak button */}
        </CardContent>
      </Card>
    </main>
  );
}
