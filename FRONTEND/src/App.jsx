import { useState,useRef,useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import './App.css'
import Bgbody from './components/Bgbody'
import Navbar from './components/Navbar'
import { Eye, EyeOff } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';
import { MdEdit,MdDelete, MdContentCopy} from "react-icons/md";


function App() {
  const[showpassword,setshowpassword]=useState(false)
  const [form, setform] = useState({site:"",username:"",password:""})
  const [passwordarray, setpasswordarray] = useState([])
  const passwordref=useRef();


  const toggleye=()=>{
    setshowpassword(!showpassword)
    if(passwordref.current.type=="password"){
      passwordref.current.type="text"
    }
    else{
      passwordref.current.type="password"
    }
  }
    

  const getPassswords=async() => { 
     let resp=await fetch(`${import.meta.env.VITE_API_URL}/`)
     let passwords=await resp.json()
     console.log(passwords)
     setpasswordarray(passwords)
   }


  const handlechange=(e) => {
    setform({...form,[e.target.name]:e.target.value})
   }

  const savepassword=async() => { 
    if (!form.site || !form.username || !form.password) {
    toast("Please fill all the fields!");
    return;
  }

  if(form.id){
    let resp=await fetch(`${import.meta.env.VITE_API_URL}/`,{method:"PUT",headers:{"Content-Type":"application/json"}, body:JSON.stringify(form)})
    await getPassswords(); 
    toast("Password updated !")
  }
  else{
    const newpass={...form, id:uuidv4()}
    setpasswordarray([...passwordarray,newpass])
    let resp=await fetch(`${import.meta.env.VITE_API_URL}/`,{method:"POST",headers:{"Content-Type":"application/json"}, body:JSON.stringify(newpass)})
    toast("Password saved !")
  }
  setform({site:"",username:"",password:""})
}

  const deletepassword=async(id)=>{
    let c=confirm("Do you really want to delete the password?")
    if(c){
      setpasswordarray(passwordarray.filter(item=>item.id!==id))
      let resp=await fetch(`${import.meta.env.VITE_API_URL}/`,{method:"DELETE",headers:{"Content-Type":"application/json"}, body:JSON.stringify({id})})
      toast("Password deleted !")
    }
  }

  const editpassword=async(id) =>{ 
    setform(passwordarray.filter(item=>item.id===id)[0])
  }

  const copy=(text) => {
    navigator.clipboard.writeText(text)
    toast("Copied to clipboard !")
   }

  useEffect(() => {
   getPassswords()
  }, [])
  
  
  return (
    <>
    <Navbar/>
    <Bgbody/>
    <ToastContainer />
    <div className='w-3/5 mx-auto mt-10'>
      <div className='text-[#5738aa] font-extrabold text-center'>STASH YOUR PASSWORDS HERE . </div>
      <input type="text" name="site" onChange={handlechange} value={form.site} placeholder='Enter the website URL' className='bg-black text-gray-400 border border-gray-400 mt-5 w-full rounded-3xl h-12 px-5' />
      <div className="userandpass flex gap-1.5 relative">
        <input type="text" name="username" onChange={handlechange} value={form.username} placeholder='Enter Username' className='bg-black text-gray-400 border border-gray-400 mt-5 w-full rounded-3xl h-12 px-5' />

        <input ref={passwordref} type="password" name="password" onChange={handlechange} value={form.password} placeholder='Enter password' className='bg-black text-gray-400 border border-gray-400 mt-5 w-full rounded-3xl h-12 px-5' />
        
        {showpassword ? <EyeOff
    className='absolute right-3 -bottom-2.5 -translate-y-1/2 text-gray-400 cursor-pointer' onClick={toggleye}/> : <Eye className='absolute right-3 -bottom-0.5 -translate-y-1/2 text-gray-400 cursor-pointer' onClick={toggleye} />}
       
      </div>
      <div className='save text-center mt-5'>
        <button className='bg-[#5738aa] border rounded-2xl border-gray-400 font-bold w-20 hover:cursor-pointer' onClick={savepassword}>SAVE</button>
      </div>
      <div className='display mt-6'>
        <div className='text-[#5738aa] font-extrabold mb-2'>YOUR PASSWORDS</div>
        {passwordarray.length==0?<div className=' text-gray-400 mt-2'>No passwords to show</div>:
          (<div className="wrap rounded-2xl overflow-hidden border border-gray-400">
          <table className='text-center w-full border-collapse'>
            <thead>
              <tr className='text-[#5738aa]'>
            <th>SITE</th>
            <th>USERNAME</th>
            <th>PASSWORD</th>
            <th></th>
          </tr>
            </thead>


            <tbody>
              {passwordarray.map((item)=>{
                 return(
                   <tr key={item.id}>
                    <td>
                      <div className="data flex justify-center items-center gap-1.5">
                        <span>{item.site}</span>
                        <MdContentCopy className='hover:cursor-pointer' onClick={()=>copy(item.site)}/>
                      </div>
                    </td>
                    <td>
                      <div className="data flex justify-center items-center gap-1.5">
                        <span>{item.username}</span>
                        <MdContentCopy className='hover:cursor-pointer' onClick={()=>copy(item.username)}/>
                      </div>
                    </td>
                    <td>
                      <div className="data flex justify-center items-center gap-1.5">
                        <span>{item.password}</span>
                        <MdContentCopy className='hover:cursor-pointer' onClick={()=>copy(item.password)}/>
                      </div>
                    </td>
                    <td>
                      <div className="data flex justify-center items-center gap-3">
                        <MdEdit className='hover:cursor-pointer' onClick={()=>editpassword(item.id)}/>
                        <MdDelete className='hover:cursor-pointer' onClick={()=>deletepassword(item.id)}/>
                      </div>
                    </td>
                   </tr>
                  );
                }
              )
              }
            </tbody>
        </table>
       </div>
        )
      }
      </div>
    </div>
    </>
  )
}

export default App
