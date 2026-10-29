import { logoutAction, type AuthState} from "@/lib/auth-actions";
import { useActionState } from "react";

import ProduceEdit from "./produce/ProduceEditPage";
import { requestInfo } from "rwsdk/worker";


interface Props {
ctx: {
    user: { id: number; name: string; email: string } | null;
  }; 
}
export default function Profile({ctx}: Props ){
    const user = ctx.user
//  //kanskje gir error
//     function onDelete(id: string){
//     console.log("deleted", id)
// }
const [state, formAction, pending] = useActionState<AuthState, FormData>(
    logoutAction,
    null,
);
return(
    <main>
        <h1>Profile</h1>
        <p>{ctx.user?.name}</p>
    <form action={formAction}>
        <button type="submit">Log out</button>
    </form>
    {/* Her skal jeg sette inn producelist som er lik user.id */}
    <ol>
        <li>
            <article>
                <h2></h2>
                <img/>
                <p></p>
            </article>
        </li>
    </ol>
    <ProduceEdit/>
    {/* Denne skal jeg endre på vi trenger et resultat fil */}
    {state && "error" in state && (<p>{state.error}</p>)}
    </main>
  )
}