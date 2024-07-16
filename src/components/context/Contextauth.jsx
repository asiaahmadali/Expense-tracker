
import { onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
export const ContextAuth = createContext() ;
import { Auth } from "../../config/firebase";


export const ContextAuthProvider=({children})=>{
    const [user, setUser] = useState({}) ;

    // useeffect to handle extrenal effects

     useEffect(()=>{
         const authchange= onAuthStateChanged(Auth,(user)=>{
            setUser(user) ;
            console.log(user) ;
          });

          // to avoid memory issue
          return ()=>{
               authchange() ;
          }
     },[]);

      return <>
          <ContextAuth.Provider value={{user:user}}>
             {children}
         </ContextAuth.Provider>
      </>
   
}