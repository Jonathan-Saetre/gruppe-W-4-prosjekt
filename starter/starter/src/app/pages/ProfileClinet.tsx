"use client";
import { AuthState, logoutAction } from "@/lib/auth-actions";
import { useActionState, useEffect } from "react";

interface Props {
    user: {
    id: number;
    name: string;
    email: string;
    }
}

export default function ProfileClient({user}: Props){
    const [state, formAction, pending] = useActionState<AuthState, FormData>(
         logoutAction,
         null,
     );
    
      useEffect(() => {
         if (state && "ok" in state && state.ok) {
           window.location.href = "/";
         }
       }, [state]);
    return(
         <section className="flex flex-col gap-5 rounded-xl border border-slate-300 shadow-xl p-5">
            <div className="flex justify-between flex-wrap">
                <h2 className="text-xl font-extrabold tracking-tight text-slate-900">Brukerinformasjon:</h2>
                <nav className="flex items-center gap-4">
                   <a href="/" className="text-lq text-[#6B8E23] hover:underline">← Til Forsiden</a>
                    <form action={formAction}>
                     <button disabled={pending} className="bg-[#C0392B] rounded-md py-1 px-2 text-[#FCF8E8] hover:bg-[#C0392B]/80" type="submit">
                     {pending ? "Logger ut..." : "Logg ut"}</button>
                    </form>
                 </nav>
            </div>
            <p><span className="font-bold">Navn: </span> {user.name}</p>
            <p><span className="font-bold">E-post: </span>{user.email}</p>
            {/* Denne skal jeg endre på vi trenger et resultat fil */}
            {state && "error" in state && (<p>{state.error}</p>)}
        </section>
    )
}