import React,{useState} from 'react'

export default function Uploadbutton() {
    const[file,setfile]=useState();
    let text;

    let Upload=((event)=>{
        setfile(event.target.files[0]);
        const selectedFile = event.target.files[0];
        if (selectedFile) {
          const fileSizeInBytes = selectedFile.size;
          const fileSizeInKB = fileSizeInBytes / 1024;

          console.log(`File size: ${fileSizeInBytes} bytes`);
        }
    });

    let Check=(async()=>{      
      const filread= new FileReader();
      filread.readAsText(file);
      filread.onload=()=>{
        localStorage.setItem('text',filread.result)
      }
      let response= await fetch('https://serverhost-chi.vercel.app/read',{
        method:"POST",
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({
          file:localStorage.getItem('text')
        })
      });

      let p = document.createElement('p');
      p.innerHTML=await response.json();
      document.getElementsByClassName('container')[0].appendChild(p);
    });
  return (
    <div className='container'>
       <input type="file" name="file" onChange={Upload} />
      <button onClick={Check}>Upload</button>
    </div>
  )
}
