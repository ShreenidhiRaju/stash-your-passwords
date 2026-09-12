import Login from "./Login";
import { useState,useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import './App.css'
import Bgbody from './components/Bgbody'
import Navbar from './components/Navbar'
import { Eye, EyeOff } from "lucide-react";
import { MdEdit,MdDelete, MdContentCopy} from "react-icons/md";


function App() {
  const[showpassword,setshowpassword]=useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
const [checkingAuth, setCheckingAuth] = useState(true);
  const [form, setform] = useState({site:"",username:"",password:""})
  const [passwordarray, setpasswordarray] = useState([])
  const [search, setSearch] = useState("");
 

  const toggleye = () => {
    setshowpassword(!showpassword);
};
    

  const getPassswords = async () => {

    const resp = await fetch(
        `${import.meta.env.VITE_API_URL}/`,
        {
            credentials: "include"
        }
    );

    const data = await resp.json();

    if (!resp.ok) {
        toast(data.message || "Failed to fetch passwords");
        return;
    }

    setpasswordarray(data);
};


  const handlechange=(e) => {
    setform({...form,[e.target.name]:e.target.value})
   }

  const savepassword=async() => { 
    if (!form.site || !form.username || !form.password) {
    toast("Please fill all the fields!");
    return;
  }

  if (form._id) {

    let resp = await fetch(
        `${import.meta.env.VITE_API_URL}/`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                id: form._id,
                site: form.site,
                username: form.username,
                password: form.password
            })
        }
    );

    const data = await resp.json();

    if (!resp.ok) {
        toast(data.message || "Failed to update password");
        return;
    }

    await getPassswords();

    toast("Password updated!");
}
else {
    const newpass = { ...form };

    let resp = await fetch(
        `${import.meta.env.VITE_API_URL}/`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(newpass)
        }
    );

    const data = await resp.json();

    if (!resp.ok) {
        toast(data.message || "Failed to save password");
        return;
    }

    await getPassswords();

    toast("Password saved!");
}
  setform({site:"",username:"",password:""})
}

  const deletepassword = async (id) => {

    let c = confirm("Do you really want to delete the password?");

    if (!c) {
        return;
    }

    const resp = await fetch(
        `${import.meta.env.VITE_API_URL}/`,
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({ id })
        }
    );

    const data = await resp.json();

    if (!resp.ok) {
        toast(data.message || "Failed to delete password");
        return;
    }

    // Only update UI AFTER database deletion succeeds
    setpasswordarray(
        passwordarray.filter(item => item._id !== id)
    );

    toast("Password deleted!");
};

  const editpassword = (id) => {
    const password = passwordarray.find(item => item._id === id);
    setform(password);
}

  const copy=(text) => {
    navigator.clipboard.writeText(text)
    toast("Copied to clipboard !")
   }

   const logout = async () => {

    const resp = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/logout`,
        {
            method: "POST",
            credentials: "include"
        }
    );

    if (resp.ok) {
        setIsLoggedIn(false);
        setpasswordarray([]);
        setform({
            site: "",
            username: "",
            password: ""
        });
    }
};
const generatePassword = () => {

    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+";

    const allChars = uppercase + lowercase + numbers + symbols;

    const getRandomChar = (chars) => {
        const random = new Uint32Array(1);
        crypto.getRandomValues(random);

        return chars[random[0] % chars.length];
    };

    let password = "";

    // Guarantee at least one character from each category
    password += getRandomChar(uppercase);
    password += getRandomChar(lowercase);
    password += getRandomChar(numbers);
    password += getRandomChar(symbols);

    // Generate the remaining 12 characters
    for (let i = password.length; i < 16; i++) {
        password += getRandomChar(allChars);
    }

    setform({
        ...form,
        password: password
    });
};

   useEffect(() => {

    const checkAuth = async () => {

        try {

            const resp = await fetch(
                `${import.meta.env.VITE_API_URL}/auth/me`,
                {
                    credentials: "include"
                }
            );

            if (resp.ok) {
                setIsLoggedIn(true);
            }

        } catch (error) {
            console.error("Authentication check failed:", error);

        } finally {
            setCheckingAuth(false);
        }
    };

    checkAuth();

}, []);

  useEffect(() => {

    const checkAuth = async () => {

        try {

            const resp = await fetch(
                `${import.meta.env.VITE_API_URL}/auth/me`,
                {
                    credentials: "include"
                }
            );

            if (resp.ok) {
                setIsLoggedIn(true);
            }

        } catch (error) {
            console.error("Authentication check failed:", error);
        } finally {
            setCheckingAuth(false);
        }
    };

    checkAuth();

}, []);

useEffect(() => {

    if (isLoggedIn) {
        getPassswords();
    }

}, [isLoggedIn]);

if (checkingAuth) {
    return <div>Checking authentication...</div>;
}
  
  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
}
const filteredPasswords = passwordarray.filter((item) =>
    item.site.toLowerCase().includes(search.toLowerCase())
);

  return (
    <>
    <Navbar onLogout={logout} />
    <Bgbody/>
    <ToastContainer />
    <div className='w-[95%] sm:w-[90%] md:w-4/5 lg:w-3/5 mx-auto mt-10 px-2'>
      <div className='text-[#5738aa] font-extrabold text-center'>STASH YOUR PASSWORDS HERE . </div>
      <input type="text" name="site" onChange={handlechange} value={form.site} placeholder='Enter the website URL' className='bg-black text-gray-400 border border-gray-400 mt-5 w-full rounded-3xl h-12 px-5' />
      <div className="flex flex-col md:flex-row gap-1.5 relative">
        <input type="text" name="username" onChange={handlechange} value={form.username} placeholder='Enter Username' className='bg-black text-gray-400 border border-gray-400 mt-5 w-full rounded-3xl h-12 px-5' />
        <div className="relative w-full">
          <input type={showpassword ? "text" : "password"}
    name="password"
    onChange={handlechange}
    value={form.password}
    placeholder="Enter password" className='bg-black text-gray-400 border border-gray-400 mt-5 w-full rounded-3xl h-12 px-5' />
        
        {showpassword ? <EyeOff
    className='absolute right-4 bottom-6.5 -translate-y-1/2 text-gray-400 cursor-pointer' onClick={toggleye}/> : <Eye className='absolute right-4 bottom-6.5 -translate-y-1/2 text-gray-400 cursor-pointer' onClick={toggleye} />}

    <div className="text-center mt-2">
    <button
        type="button"
        onClick={generatePassword}
        className="font-bold text-xs text-[#5738aa] hover:cursor-pointer"
    >
        Generate Password
    </button>
</div>
        </div>
       
      </div>
      <div className='save text-center mt-5'>
        <button className='bg-[#5738aa] border rounded-2xl border-gray-400 font-bold w-20 hover:cursor-pointer' onClick={savepassword}>SAVE</button>
      </div>
      <div className='display mt-6'>

    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-3">
        <div className='text-[#5738aa] font-extrabold'>
            YOUR PASSWORDS
        </div>

        <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search passwords..."
            className="bg-black text-gray-400 border border-gray-400 rounded-3xl h-9 px-4 w-full sm:w-64"
        />
    </div>
        {filteredPasswords.length==0?<div className=' text-gray-400 mt-2'>No passwords to show</div>:
          (<div className="overflow-x-auto rounded-2xl border border-gray-400">
          <table className="min-w-[650px] w-full text-center border-collapse">
            <thead>
              <tr className='text-[#5738aa]'>
            <th>SITE</th>
            <th>USERNAME</th>
            <th>PASSWORD</th>
            <th></th>
          </tr>
            </thead>

            <tbody>
              {filteredPasswords.map((item)=>{
                 return(
                   <tr key={item._id}>
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
                        <MdEdit className='hover:cursor-pointer' onClick={()=>editpassword(item._id)}/>
                        <MdDelete className='hover:cursor-pointer' onClick={()=>deletepassword(item._id)}/>
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
