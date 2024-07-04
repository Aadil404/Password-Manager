import React, { useState, useEffect, useRef } from 'react'
import { IoMdAdd } from "react-icons/io";

const Body = () => {
    const [form, setform] = useState({ site: "", username: "", password: "", passwordVisibility: false })
    const [passwordArray, setpasswordArray] = useState([])
    const eyeRef = useRef()
    const passwordRef = useRef()

    //get all pasword from mongodb
    const getPasswords=async()=>{
        let res= await fetch("http://localhost:3000/")
        let p= await res.json()
        p.reverse()
        setpasswordArray(p);
    }

    useEffect(() => {
        getPasswords()
    }, [])

    const handleChange = (e) => {
        setform({ ...form, [e.target.name]: e.target.value })
    }

    const savePassword = async () => {
        let res= await fetch("http://localhost:3000/",{
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({...form})
        })
        setpasswordArray([form, ...passwordArray])
        setform({ site: "", username: "", password: "", passwordVisibility: false });
    }


    //show or hide password when click in eye logo in text bar
    const showPassword = () => {
        if (eyeRef.current.src.includes("public/eyeOpen.svg")) {
            eyeRef.current.src = "public/eyeClose.svg"
            passwordRef.current.type = "text";

        }
        else {
            eyeRef.current.src = "public/eyeOpen.svg"
            passwordRef.current.type = "password";
        }
    }

    const copyText = (text) => {
        window
        navigator.clipboard.writeText(text)
    }

    //how or hide password when click in eye logo of saved paswords
    const togglePasswordVisibility = (index) => {
        const newPasswordArray = passwordArray.map((item, idx) => {
            if (idx === index) {
                return { ...item, passwordVisibility: !item.passwordVisibility };
            }
            return item;
        });
        setpasswordArray(newPasswordArray);
    }


    //edit a saved password
    const editPassword = (item,index) => {
        if(!window.confirm('Are you sure you want to edit this password?')) {
            return;
        }
        passwordArray.forEach((item, idx) => {
            if (idx === index) {
                setform({...item})
            }
        });
        deletePassword(item,index,true)
    };


    //delete a password
    const deletePassword = async(item,index,deleteforEdit=false) => {
        if(!deleteforEdit && !window.confirm('Are you sure you want to delete this password?')) {
            return;
          }
        let res= await fetch(`http://localhost:3000/`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({site:item.site,username:item.username,password:item.password})
        })
        let newPasswordArray = passwordArray.filter((item,idx) => {
            return index !== idx;
          })
        setpasswordArray(newPasswordArray);
    }


    return (
        <>
            <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]"><div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)]"></div></div>

            <div className='md:w-[90%] w-full mx-auto mt-4 flex flex-col'>
                <div className='text-center text-xl font-semibold mb-3 text-blue-800'>Add a password</div>
                <div className='flex flex-col items-center gap-6'>

                    <input value={form.site} onChange={handleChange} placeholder='Enter website URL' className='w-[90%] rounded-full p-1 border border-blue-500' type="text" name="site" />
                    <div className='flex gap-6 w-[90%]'>

                        <input value={form.username} onChange={handleChange} placeholder='Enter username' className='w-1/2 rounded-full p-1 border border-blue-500' type="text" name="username" />

                        <div className='w-1/2 relative'>
                            <input ref={passwordRef} value={form.password} onChange={handleChange} placeholder='Enter password' className='w-full rounded-full p-1 border border-blue-500' type="password" name="password" />

                            <img src="public/eyeOpen.svg" ref={eyeRef} onClick={showPassword} className='absolute right-3 top-2 text-gray-600 cursor-pointer' />

                        </div>
                    </div>
                    <button onClick={savePassword} disabled={(form.site.length<=3 || form.username.length<3 || form.password.length<3)} className='bg-blue-700 text-white flex items-center py-2 px-3 rounded-full font-semibold hover:bg-blue-600 disabled:bg-blue-400'> <IoMdAdd />&nbsp;Save Password</button>
                </div>


                <div className="passwords mb-12 w-full">
                    <h2 className='text-2xl text-blue-900 font-bold my-2'>Your passwords</h2>
                    {passwordArray.length === 0 && <div className='text-4xl text-gray-400 font-semibold my-3 text-center'>No Passwords to show</div>}
                    
                    {passwordArray.length !== 0 &&
                        <div className="overflow-x-auto w-full">
                            <table className="text-sm text-left rtl:text-right w-full">
                                <thead className="md:text-md text-sm uppercase bg-blue-400 ">
                                    <tr>
                                        <th scope="col" className="sm:px-4 px-2 py-3 rounded-s-lg">Site URL</th>
                                        <th scope="col" className="sm:px-4 px-2 py-3 ">Username</th>
                                        <th scope="col" className="sm:px-4 px-2 py-3 ">Passowrd</th>
                                        <th scope="col" className="sm:pl-4 px-2 py-3 rounded-e-lg ">Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {passwordArray.map((item, index) => {
                                        return <tr key={index} className="bg-blue-100 w-full">
                                            <th scope="row" className="sm:px-4 px-2 py-4 font-medium md:text-[17px]"><a href={item.site} target='_blank'>{item.site}</a></th>

                                            <td className="sm:px-4 px-2 py-4 ">
                                                <div className='gap-6'>
                                                    <div className='md:text-[16px]'>{item.username}</div>
                                                    <div className='flex gap-1'>
                                                        <img onClick={() => { copyText(item.username) }} className='cursor-pointer' src="public/copy.svg" alt="" />
                                                    </div>
                                                    
                                                </div>
                                            </td>

                                            <td className="sm:px-4 px-2 py-4 ">
                                                <div className='gap-2'>
                                                    {item.passwordVisibility ? <div className='md:text-[15px]'>{item.password}</div> : <div className='md:text-[16px]'>{'*'.repeat(Math.min(item.password.length,20))}</div>}

                                                    <div className='flex gap-4'>
                                                        <img onClick={() => togglePasswordVisibility(index)} className='cursor-pointer' src={item.passwordVisibility ? "public/eyeClose.svg" : "public/eyeOpen.svg"} alt="" />
                                                        <img onClick={() => { copyText(item.password) }} className='cursor-pointer' src="public/copy.svg" alt="" />
                                                    </div>

                                                    
                                                </div>
                                            </td>

                                            <td className='sm:pl-4 pl-2 py-4'>
                                                <div className='flex gap-2' >
                                                    <img className='cursor-pointer' onClick={()=>editPassword(item,index)} src="public/edit.svg" alt="" />
                                                    <img className='cursor-pointer' onClick={()=>deletePassword(item,index)} src="public/delete.svg" alt="" />
                                                </div>
                                            </td>
                                        </tr>
                                    })}
                                </tbody>

                            </table>
                        </div>}

                </div>
            </div>


        </>
    )
}

export default Body